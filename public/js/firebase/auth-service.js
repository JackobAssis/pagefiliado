// ========================================
// AUTH SERVICE - Firebase Authentication
// ========================================

import { auth } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// ========================================
// LOGIN
// ========================================

/**
 * Realiza login com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Object} Resultado da operação
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login realizado:', userCredential.user.email);
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Login realizado com sucesso!'
    };
  } catch (error) {
    console.error('Erro no login:', error);
    
    let errorMessage = 'Erro ao fazer login';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Senha incorreta';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Credenciais inválidas';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: error.code,
      message: errorMessage
    };
  }
}

// ========================================
// LOGOUT
// ========================================

/**
 * Realiza logout do usuário
 * @returns {Object} Resultado da operação
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('Logout realizado');
    
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao fazer logout'
    };
  }
}

// ========================================
// AUTH STATE LISTENER
// ========================================

/**
 * Observa mudanças no estado de autenticação
 * @param {Function} callback - Função chamada quando o estado muda
 * @returns {Function} Função para remover o listener
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuário autenticado:', user.email, 'UID:', user.uid);
      callback({ isAuthenticated: true, user: user });
    } else {
      console.log('Usuário não autenticado');
      callback({ isAuthenticated: false, user: null });
    }
  });
}

// ========================================
// GET CURRENT USER
// ========================================

/**
 * Obtém o usuário atual
 * @returns {Object|null} Usuário atual ou null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

// ========================================
// CHECK AUTH STATE
// ========================================

/**
 * Verifica se há usuário autenticado
 * @returns {boolean} True se autenticado
 */
export function isAuthenticated() {
  return auth.currentUser !== null;
}

