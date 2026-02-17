// ========================================
// FIREBASE CONFIG - Configuração Modular
// ========================================

// Import Firebase SDK (usando CDN modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// ========================================
// CONFIGURAÇÃO FIREBASE
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyBq95jvvEwELH65nAe0aqSDUqwMJ6zD3kM",
  authDomain: "pageafiliado-fefc0.firebaseapp.com",
  projectId: "pageafiliado-fefc0",
  storageBucket: "pageafiliado-fefc0.firebasestorage.app",
  messagingSenderId: "371847200965",
  appId: "1:371847200965:web:173f7c5c2b9d40aa95f0ac"
};

// ========================================
// INICIALIZAÇÃO
// ========================================

// Inicializar Firebase apenas uma vez
let app;
let db;
let storage;
let auth;

function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log('Firebase inicializado com sucesso');
  }
  return { app, db, storage, auth };
}

// Inicializar automaticamente ao importar
initFirebase();

// ========================================
// EXPORTS
// ========================================

export { app, db, storage, auth, firebaseConfig };

