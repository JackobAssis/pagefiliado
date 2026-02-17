// ========================================
// FIRESTORE SERVICE - Operações de Banco de Dados
// ========================================

import { db } from './firebase-config.js';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Referência para a coleção de produtos
const productsCollection = collection(db, 'products');

// ========================================
// CRIAÇÃO
// ========================================

/**
 * Cria um novo produto no Firestore
 * @param {Object} productData - Dados do produto
 * @returns {Object} Resultado com sucesso e dados do produto criado
 */
export async function createProduct(productData) {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Produto criado com ID:', docRef.id);
    
    return {
      success: true,
      id: docRef.id,
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
// LEITURA
// ========================================

/**
 * Busca todos os produtos do Firestore
 * @returns {Object} Resultado com lista de produtos
 */
export async function getAllProducts() {
  try {
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Produtos fetched:', products.length);
    
    return {
      success: true,
      products: products,
      message: `${products.length} produtos encontrados`
    };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return {
      success: false,
      error: error.message,
      products: [],
      message: 'Erro ao buscar produtos'
    };
  }
}

/**
 * Busca um produto específico pelo ID
 * @param {string} productId - ID do produto
 * @returns {Object} Resultado com dados do produto
 */
export async function getProductById(productId) {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        product: { id: docSnap.id, ...docSnap.data() },
        message: 'Produto encontrado'
      };
    } else {
      return {
        success: false,
        error: 'Produto não encontrado',
        message: 'Produto não existe'
      };
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao buscar produto'
    };
  }
}

// ========================================
// ATUALIZAÇÃO
// ========================================

/**
 * Atualiza um produto existente
 * @param {string} productId - ID do produto
 * @param {Object} productData - Novos dados do produto
 * @returns {Object} Resultado da operação
 */
export async function updateProduct(productId, productData) {
  try {
    const docRef = doc(db, 'products', productId);
    
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Produto atualizado:', productId);
    
    return {
      success: true,
      message: 'Produto atualizado com sucesso'
    };
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
// EXCLUSÃO
// ========================================

/**
 * Exclui um produto do Firestore
 * @param {string} productId - ID do produto
 * @returns {Object} Resultado da operação
 */
export async function deleteProduct(productId) {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    
    console.log('Produto excluído:', productId);
    
    return {
      success: true,
      message: 'Produto excluído com sucesso'
    };
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao excluir produto'
    };
  }
}

