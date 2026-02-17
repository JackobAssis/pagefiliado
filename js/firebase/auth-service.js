// ========================================
// AUTH SERVICE - Operações de Autenticação
// ========================================

import { auth } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// ========================================
// REGISTRO
// ========================================

/**
 * Registra um novo usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Object} Resultado da operação
 */
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    console.log('Usuário registrado:', userCredential.user.email);
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Usuário registrado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao registrar usuário'
    };
  }
}

// ========================================
// LOGIN
// ========================================

/**
 * Realiza login de usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Object} Resultado da operação
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log('Usuário logado:', userCredential.user.email);
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Login realizado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro ao fazer login'
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
export async function logoutUser() {
  try {
    await signOut(auth);
    
    console.log('Usuário deslogado');
    
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
// ESTADO DE AUTENTICAÇÃO
// ========================================

/**
 * Observa mudanças no estado de autenticação
 * @param {Function} callback - Função callback que recebe o usuário
 * @returns {Function} Função para cancelar a observação
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuário autenticado:', user.email);
      callback({ isLoggedIn: true, user: user });
    } else {
      console.log('Usuário não autenticado');
      callback({ isLoggedIn: false, user: null });
    }
  });
}

// ========================================
// USUÁRIO ATUAL
// ========================================

/**
 * Obtém o usuário atual
 * @returns {Object|null} Usuário atual ou null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Verifica se há um usuário logado
 * @returns {boolean} True se há usuário logado
 */
export function isAuthenticated() {
  return auth.currentUser !== null;
}

