// ========================================
// FIRESTORE SERVICE - Operações de Banco de Dados
// ========================================

import { db, auth } from './firebase-config.js';
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
// VERIFICAÇÃO DE AUTENTICAÇÃO
// ========================================

/**
 * Verifica se o usuário está autenticado
 * @returns {Object} Resultado da verificação
 */
function requireAuth() {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      error: 'UNAUTHENTICATED',
      message: 'Você precisa estar logado para realizar esta operação'
    };
  }
  return { success: true, user: user };
}

// ========================================
// CRIAÇÃO (PROTEGIDA)
// ========================================

/**
 * Cria um novo produto no Firestore (requer autenticação)
 * @param {Object} productData - Dados do produto
 * @returns {Object} Resultado com sucesso e dados do produto criado
 */
export async function createProduct(productData) {
  // Verificar autenticação
  const authCheck = requireAuth();
  if (!authCheck.success) {
    return authCheck;
  }
  
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdBy: authCheck.user.uid,
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
// LEITURA (PÚBLICA)
// ========================================

/**
 * Busca todos os produtos do Firestore (público)
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
 * Busca um produto específico pelo ID (público)
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
// ATUALIZAÇÃO (PROTEGIDA)
// ========================================

/**
 * Atualiza um produto existente (requer autenticação)
 * @param {string} productId - ID do produto
 * @param {Object} productData - Novos dados do produto
 * @returns {Object} Resultado da operação
 */
export async function updateProduct(productId, productData) {
  // Verificar autenticação
  const authCheck = requireAuth();
  if (!authCheck.success) {
    return authCheck;
  }
  
  try {
    const docRef = doc(db, 'products', productId);
    
    await updateDoc(docRef, {
      ...productData,
      updatedBy: authCheck.user.uid,
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
// EXCLUSÃO (PROTEGIDA)
// ========================================

/**
 * Exclui um produto do Firestore (requer autenticação)
 * @param {string} productId - ID do produto
 * @returns {Object} Resultado da operação
 */
export async function deleteProduct(productId) {
  // Verificar autenticação
  const authCheck = requireAuth();
  if (!authCheck.success) {
    return authCheck;
  }
  
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

