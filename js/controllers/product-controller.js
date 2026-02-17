// ========================================
// PRODUCT CONTROLLER - Lógica de Negócio
// ========================================

import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../firebase/firestore-service.js';

import { 
  uploadFile, 
  deleteFile, 
  uploadMultipleFiles 
} from '../firebase/storage-service.js';

// ========================================
// CRIAÇÃO DE PRODUTO
// ========================================

/**
 * Cria um novo produto com upload de mídia
 * @param {Object} productData - Dados do produto
 * @param {FileList} imageFiles - Arquivos de imagem (opcional)
 * @param {FileList} videoFiles - Arquivos de vídeo (opcional)
 * @returns {Object} Resultado da operação
 */
export async function createNewProduct(productData, imageFiles = null, videoFiles = null) {
  try {
    // 1. Primeiro criar o produto no Firestore para obter o ID
    const productResult = await createProduct(productData);
    
    if (!productResult.success) {
      return productResult;
    }
    
    const productId = productResult.id;
    const media = [];
    
    // 2. Fazer upload das imagens
    if (imageFiles && imageFiles.length > 0) {
      const imageResult = await uploadMultipleFiles(imageFiles, productId, 'images');
      if (imageResult.success) {
        media.push(...imageResult.files);
      }
    }
    
    // 3. Fazer upload dos vídeos
    if (videoFiles && videoFiles.length > 0) {
      const videoResult = await uploadMultipleFiles(videoFiles, productId, 'videos');
      if (videoResult.success) {
        media.push(...videoResult.files);
      }
    }
    
    // 4. Atualizar o produto com as URLs de mídia
    if (media.length > 0) {
      await updateProduct(productId, { media: media });
    }
    
    console.log('Produto criado com sucesso:', productId);
    
    return {
      success: true,
      id: productId,
      media: media,
      message: 'Produto criado com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao criar produto'
    };
  }
}

// ========================================
// BUSCAR PRODUTOS
// ========================================

/**
 * Busca todos os produtos
 * @returns {Object} Resultado com lista de produtos
 */
export async function fetchAllProducts() {
  return await getAllProducts();
}

/**
 * Busca um produto pelo ID
 * @param {string} productId - ID do produto
 * @returns {Object} Resultado com dados do produto
 */
export async function fetchProduct(productId) {
  return await getProductById(productId);
}

// ========================================
// ATUALIZAÇÃO DE PRODUTO
// ========================================

/**
 * Atualiza um produto existente
 * @param {string} productId - ID do produto
 * @param {Object} productData - Novos dados do produto
 * @param {FileList} newImageFiles - Novas imagens (opcional)
 * @param {FileList} newVideoFiles - Novos vídeos (opcional)
 * @returns {Object} Resultado da operação
 */
export async function editProduct(productId, productData, newImageFiles = null, newVideoFiles = null) {
  try {
    // 1. Buscar produto atual para obter mídia existente
    const currentProduct = await getProductById(productId);
    
    if (!currentProduct.success) {
      return currentProduct;
    }
    
    let media = currentProduct.product.media || [];
    
    // 2. Fazer upload de novas imagens
    if (newImageFiles && newImageFiles.length > 0) {
      const imageResult = await uploadMultipleFiles(newImageFiles, productId, 'images');
      if (imageResult.success) {
        media.push(...imageResult.files);
      }
    }
    
    // 3. Fazer upload de novos vídeos
    if (newVideoFiles && newVideoFiles.length > 0) {
      const videoResult = await uploadMultipleFiles(newVideoFiles, productId, 'videos');
      if (videoResult.success) {
        media.push(...videoResult.files);
      }
    }
    
    // 4. Adicionar mídia aos dados do produto
    const updatedData = {
      ...productData,
      media: media
    };
    
    // 5. Atualizar no Firestore
    const updateResult = await updateProduct(productId, updatedData);
    
    return updateResult;
    
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao atualizar produto'
    };
  }
}

// ========================================
// EXCLUSÃO DE PRODUTO
// ========================================

/**
 * Exclui um produto e toda sua mídia associada
 * @param {string} productId - ID do produto
 * @returns {Object} Resultado da operação
 */
export async function removeProduct(productId) {
  try {
    // 1. Buscar produto para obter mídia
    const productResult = await getProductById(productId);
    
    if (!productResult.success) {
      return productResult;
    }
    
    const media = productResult.product.media || [];
    
    // 2. Excluir todos os arquivos de mídia
    for (const item of media) {
      if (item.path) {
        await deleteFile(item.path);
      }
    }
    
    // 3. Excluir o documento do Firestore
    const deleteResult = await deleteProduct(productId);
    
    return deleteResult;
    
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao excluir produto'
    };
  }
}

// ========================================
// GERENCIAR ÍNDICE
// ========================================

/**
 * Remove um arquivo de mídia específico do produto
 * @param {string} productId - ID do produto
 * @param {string} filePath - Caminho do arquivo no storage
 * @returns {Object} Resultado da operação
 */
export async function removeMediaFile(productId, filePath) {
  try {
    // 1. Excluir arquivo do Storage
    const deleteResult = await deleteFile(filePath);
    
    if (!deleteResult.success) {
      return deleteResult;
    }
    
    // 2. Atualizar produto removendo a mídia
    const productResult = await getProductById(productId);
    
    if (!productResult.success) {
      return productResult;
    }
    
    const media = productResult.product.media || [];
    const updatedMedia = media.filter(item => item.path !== filePath);
    
    // 3. Atualizar Firestore
    await updateProduct(productId, { media: updatedMedia });
    
    return {
      success: true,
      message: 'Arquivo de mídia removido'
    };
    
  } catch (error) {
    console.error('Erro ao remover mídia:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao remover arquivo de mídia'
    };
  }
}

