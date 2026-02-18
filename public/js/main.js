// ========================================
// MAIN.JS - Arquivo Principal de Inicialização
// ========================================

// Importar módulos do Firebase
import { initFirebase, auth } from './firebase/firebase-config.js';
import { login, logout, onAuthChange } from './firebase/auth-service.js';
import { fetchAllProducts, createNewProduct, editProduct, removeProduct, fetchProduct } from './controllers/product-controller.js';
import { initUIElements, renderProductsGrid, renderProductsList, showLoading, hideLoading, showError, showNotification, clearForm, updatePreview } from './ui/ui-controller.js';

// ========================================
// INICIALIZAÇÃO
// ========================================

let currentProducts = [];
let isEditing = false;
let editingProductId = null;
let authUnsubscribe = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Inicializando aplicacao...');
  
  // Inicializar Firebase
  initFirebase();
  
  // Inicializar elementos de UI
  initUIElements();
  
  // Verificar qual página estamos
  const isAdminPage = document.getElementById('admin-content') !== null;
  
  if (isAdminPage) {
    await initAdminPage();
  } else {
    await initMainPage();
  }
});

// ========================================
// PÁGINA PRINCIPAL (INDEX) - PÚBLICA
// ========================================

async function initMainPage() {
  console.log('Inicializando pagina principal...');
  
  // Carregar produtos
  await loadProducts();
  
  // Configurar listener para atualizações em tempo real
  window.addEventListener('productsUpdated', () => {
    loadProducts();
  });
}

async function loadProducts() {
  showLoading();
  
  const result = await fetchAllProducts();
  
  hideLoading();
  
  if (result.success) {
    currentProducts = result.products;
    renderProductsGrid(currentProducts);
  } else {
    showError('Erro ao carregar produtos. Tente novamente mais tarde.');
  }
}

// ========================================
// AUTENTICAÇÃO FIREBASE
// ========================================

function setupAuthListener() {
  // Configurar listener de autenticação
  authUnsubscribe = onAuthChange((state) => {
    const lockOverlay = document.getElementById('lock-overlay');
    const adminContent = document.getElementById('admin-content');
    const userInfo = document.getElementById('user-info');
    const loginForm = document.getElementById('login-form');
    
    if (state.isAuthenticated) {
      // Usuário logado - mostrar área admin
      console.log('Usuário autenticado, mostrando admin...');
      
      if (lockOverlay) lockOverlay.style.display = 'none';
      if (adminContent) adminContent.style.display = 'block';
      
      // Atualizar info do usuário
      if (userInfo) {
        userInfo.textContent = `Logado como: ${state.user.email}`;
      }
      
      // Ocultar formulário de login
      if (loginForm) loginForm.style.display = 'none';
      
      // Carregar produtos do admin
      loadAdminProducts();
      
    } else {
      // Usuário não logado - mostrar login
      console.log('Usuário não autenticado, mostrando login...');
      
      if (lockOverlay) lockOverlay.style.display = 'flex';
      if (adminContent) adminContent.style.display = 'none';
      
      // Mostrar formulário de login
      if (loginForm) loginForm.style.display = 'block';
    }
  });
}

async function handleLogin(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const errorMsg = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');
  
  if (!emailInput || !passwordInput) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  if (!email || !password) {
    if (errorMsg) {
      errorMsg.textContent = 'Preencha email e senha';
      setTimeout(() => errorMsg.textContent = '', 3000);
    }
    return;
  }
  
  // Desabilitar botão durante login
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';
  }
  
  const result = await login(email, password);
  
  // Reabilitar botão
  if (loginBtn) {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Entrar';
  }
  
  if (result.success) {
    console.log('Login bem-sucedido!');
    // O auth listener会自动处理UI更新
  } else {
    if (errorMsg) {
      errorMsg.textContent = result.message;
      setTimeout(() => errorMsg.textContent = '', 5000);
    }
  }
}

async function handleLogout() {
  if (confirm('Deseja realmente sair?')) {
    const result = await logout();
    if (result.success) {
      showNotification('Logout realizado!');
      // O auth listener会自动处理UI更新
    } else {
      showNotification('Erro ao fazer logout');
    }
  }
}

// ========================================
// PÁGINA ADMIN
// ========================================

async function initAdminPage() {
  console.log('Inicializando pagina admin...');
  
  // Configurar listener de autenticação
  setupAuthEvents();
  setupAuthListener();
  
  // Configurar eventos do formulário
  setupFormEvents();
  
  // Configurar eventos de produtos
  setupProductEvents();
}

function setupAuthEvents() {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

async function loadAdminProducts() {
  showLoading();
  
  const result = await fetchAllProducts();
  
  hideLoading();
  
  if (result.success) {
    currentProducts = result.products;
    renderProductsList(currentProducts);
  } else {
    showError('Erro ao carregar produtos.');
  }
}

function setupFormEvents() {
  // Preview em tempo real
  const inputs = ['product-name', 'product-description', 'product-image', 'shopee-link'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', updatePreview);
    }
  });
  
  // Upload de imagem
  const imageFile = document.getElementById('product-image-file');
  if (imageFile) {
    imageFile.addEventListener('change', handleImageUpload);
  }
  
  // Salvar produto
  const saveBtn = document.getElementById('save-product-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveProduct);
  }
  
  // Limpar formulário
  const clearBtn = document.getElementById('clear-form-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      isEditing = false;
      editingProductId = null;
      clearForm();
    });
  }
  
  // Exportar
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExport);
  }
}

function setupProductEvents() {
  // Editar produto
  window.addEventListener('editProduct', async (e) => {
    const productId = e.detail.productId;
    await loadProductForEdit(productId);
  });
  
  // Excluir produto
  window.addEventListener('deleteProduct', async (e) => {
    const productId = e.detail.productId;
    await handleDeleteProduct(productId);
  });
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validar tipo
  if (!file.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem válido!');
    return;
  }
  
  // Validar tamanho (máx 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('Imagem muito grande! Tamanho máximo: 2MB');
    return;
  }
  
  // Converter para base64 (para preview imediato)
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageInput = document.getElementById('product-image');
    if (imageInput) {
      imageInput.value = e.target.result;
      updatePreview();
    }
  };
  reader.readAsDataURL(file);
}

async function handleSaveProduct() {
  const name = document.getElementById('product-name')?.value.trim();
  const description = document.getElementById('product-description')?.value.trim();
  const image = document.getElementById('product-image')?.value.trim();
  const link = document.getElementById('shopee-link')?.value.trim();
  
  if (!link) {
    alert('Link da Shopee é obrigatório!');
    return;
  }
  
  showLoading();
  
  const productData = {
    name: name || 'Produto sem nome',
    description: description || 'Sem descrição disponível',
    image: image || '',
    shopeeLink: link,
    category: 'geral',
    price: 0
  };
  
  let result;
  
  if (isEditing && editingProductId) {
    // Atualizar produto existente
    result = await editProduct(editingProductId, productData);
  } else {
    // Criar novo produto
    result = await createNewProduct(productData);
  }
  
  hideLoading();
  
  if (result.success) {
    showNotification(isEditing ? 'Produto atualizado!' : 'Produto criado!');
    clearForm();
    isEditing = false;
    editingProductId = null;
    await loadAdminProducts();
  } else if (result.error === 'UNAUTHENTICATED') {
    showNotification('Sessão expirada. Faça login novamente.');
  } else {
    showNotification('Erro: ' + result.message);
  }
}

async function loadProductForEdit(productId) {
  const result = await fetchProduct(productId);
  
  if (result.success) {
    const product = result.product;
    
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('shopee-link').value = product.shopeeLink || '';
    
    isEditing = true;
    editingProductId = productId;
    
    updatePreview();
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('Produto carregado para edição.');
  } else {
    showNotification('Erro ao carregar produto.');
  }
}

async function handleDeleteProduct(productId) {
  const product = currentProducts.find(p => p.id === productId);
  
  if (!product) {
    showNotification('Produto não encontrado.');
    return;
  }
  
  if (confirm(`Excluir "${product.name}"?`)) {
    showLoading();
    
    const result = await removeProduct(productId);
    
    hideLoading();
    
    if (result.success) {
      showNotification('Produto excluído!');
      await loadAdminProducts();
    } else if (result.error === 'UNAUTHENTICATED') {
      showNotification('Sessão expirada. Faça login novamente.');
    } else {
      showNotification('Erro ao excluir produto.');
    }
  }
}

function handleExport() {
  if (currentProducts.length === 0) {
    alert('Nenhum produto para exportar!');
    return;
  }
  
  const json = JSON.stringify(currentProducts, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'products.json';
  link.click();
  
  URL.revokeObjectURL(url);
  
  alert(currentProducts.length + ' produtos exportados!');
}

// ========================================
// EXPORTAR FUNÇÕES ÚTEIS
// ========================================

export { loadProducts, loadAdminProducts };

