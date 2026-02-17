// ========================================
// STORAGE SERVICE - Operações de Arquivos
// ========================================

import { storage } from './firebase-config.js';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

// ========================================
// UPLOAD
// ========================================

/**
 * Faz upload de um arquivo para o Firebase Storage
 * @param {File} file - Arquivo a ser enviado
 * @param {string} productId - ID do produto
 * @param {string} fileType - Tipo: 'images' ou 'videos'
 * @returns {Object} Resultado com URL e path do arquivo
 */
export async function uploadFile(file, productId, fileType = 'images') {
  try {
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Criar referência do arquivo
    const storagePath = `products/${productId}/${fileType}/${fileName}`;
    const storageRef = ref(storage, storagePath);
    
    // Fazer upload
    const snapshot = await uploadBytes(storageRef, file);
    
    // Obter URL de download
    const url = await getDownloadURL(snapshot.ref);
    
    console.log('Arquivo enviado:', storagePath);
    
    return {
      success: true,
      url: url,
      path: storagePath,
      message: 'Arquivo enviado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao enviar arquivo'
    };
  }
}

// ========================================
// DELETE
// ========================================

/**
 * Exclui um arquivo do Firebase Storage
 * @param {string} path - Caminho do arquivo no storage
 * @returns {Object} Resultado da operação
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
    console.log('Arquivo excluído:', path);
    
    return {
      success: true,
      message: 'Arquivo excluído com sucesso'
    };
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao excluir arquivo'
    };
  }
}

// ========================================
// GET URL
// ========================================

/**
 * Obtém a URL de download de um arquivo
 * @param {string} path - Caminho do arquivo no storage
 * @returns {Object} Resultado com URL
 */
export async function getFileURL(path) {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    
    return {
      success: true,
      url: url,
      message: 'URL obtida com sucesso'
    };
  } catch (error) {
    console.error('Erro ao obter URL:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao obter URL do arquivo'
    };
  }
}

// ========================================
// UPLOAD ARRAY OF FILES
// ========================================

/**
 * Faz upload de múltiplos arquivos
 * @param {FileList} files - Lista de arquivos
 * @param {string} productId - ID do produto
 * @param {string} fileType - Tipo: 'images' ou 'videos'
 * @returns {Object} Resultado com array de arquivos enviados
 */
export async function uploadMultipleFiles(files, productId, fileType = 'images') {
  try {
    const uploadedFiles = [];
    
    for (const file of files) {
      const result = await uploadFile(file, productId, fileType);
      if (result.success) {
        uploadedFiles.push({
          type: fileType === 'images' ? 'image' : 'video',
          url: result.url,
          path: result.path
        });
      }
    }
    
    return {
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} arquivos enviados`
    };
  } catch (error) {
    console.error('Erro ao fazer upload múltiplo:', error);
    return {
      success: false,
      error: error.message,
      files: [],
      message: 'Erro ao enviar arquivos'
    };
  }
}

