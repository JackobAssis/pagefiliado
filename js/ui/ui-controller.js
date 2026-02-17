// ========================================
// UI CONTROLLER - Controle de Interface
// ========================================

// ========================================
// ESTADOS DE UI
// ========================================

// Elementos do DOM
let elements = {};

/**
 * Inicializa os elementos do DOM
 */
export function initUIElements() {
  elements = {
    // Container de produtos
    productsGrid: document.getElementById('products-grid'),
    productsList: document.getElementById('products-list'),
    
    // Estados
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    
    // Formulário admin
    productName: document.getElementById('product-name'),
    productDescription: document.getElementById('product-description'),
    productImage: document.getElementById('product-image'),
    shopeeLink: document.getElementById('shopee-link'),
    productImageFile: document.getElementById('product-image-file'),
    
    // Preview
    productPreview: document.getElementById('product-preview'),
    previewImage: document.getElementById('preview-image'),
    previewName: document.getElementById('preview-name'),
    previewDesc: document.getElementById('preview-desc'),
    previewLink: document.getElementById('preview-link'),
    
    // Botões
    saveBtn: document.getElementById('save-product-btn'),
    clearBtn: document.getElementById('clear-form-btn'),
    exportBtn: document.getElementById('export-btn')
  };
  
  return elements;
}

/**
 * Obtém um elemento do DOM
 */
export function getElement(id) {
  return document.getElementById(id);
}

// ========================================
// RENDERIZAÇÃO DE PRODUTOS (PÁGINA INICIAL)
// ========================================

/**
 * Renderiza os produtos na página inicial
 * @param {Array} products - Lista de produtos
 */
export function renderProductsGrid(products) {
  const container = elements.productsGrid;
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!products || products.length === 0) {
    container.innerHTML = '<p class="error">Nenhum produto disponível.</p>';
    return;
  }
  
  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

/**
 * Cria um card de produto para a página inicial
 * @param {Object} product - Dados do produto
 * @returns {HTMLElement} Elemento do card
 */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'whatsapp-card';
  
  const name = product.name || 'Produto sem nome';
  const description = product.description || 'Sem descrição disponível';
  const image = product.image || product.media?.[0]?.url || 'https://via.placeholder.com/400x250?text=Sem+Imagem';
  const link = product.affiliateLink || product.shopeeLink || '#';
  
  card.innerHTML = `
    <img 
      src="${escapeHtml(image)}" 
      alt="${escapeHtml(name)}"
      class="whatsapp-card-image"
      onerror="this.src='https://via.placeholder.com/400x250?text=Erro+ao+carregar'"
    >
    <div class="whatsapp-card-content">
      <h3 class="whatsapp-card-title">${escapeHtml(name)}</h3>
      <p class="whatsapp-card-description">${escapeHtml(description)}</p>
      <a 
        href="${escapeHtml(link)}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="btn"
      >
        Ver na Shopee
      </a>
    </div>
  `;
  
  return card;
}

// ========================================
// RENDERIZAÇÃO DE PRODUTOS (ADMIN)
// ========================================

/**
 * Renderiza a lista de produtos no admin
 * @param {Array} products - Lista de produtos
 */
export function renderProductsList(products) {
  const container = elements.productsList;
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!products || products.length === 0) {
    container.innerHTML = '<p style="color: var(--text-gray); text-align: center;">Nenhum produto disponível.</p>';
    return;
  }
  
  products.forEach(product => {
    const item = createProductListItem(product);
    container.appendChild(item);
  });
}

/**
 * Cria um item de produto para a lista do admin
 * @param {Object} product - Dados do produto
 * @returns {HTMLElement} Elemento do item
 */
function createProductListItem(product) {
  const item = document.createElement('div');
  item.className = 'product-item';
  
  const image = product.image || product.media?.[0]?.url || 'https://via.placeholder.com/80';
  const name = product.name || 'Produto sem nome';
  const description = product.description || 'Sem descrição';
  
  item.innerHTML = `
    <img 
      src="${escapeHtml(image)}" 
      alt="${escapeHtml(name)}"
      class="product-thumbnail"
      onerror="this.src='https://via.placeholder.com/80'"
    >
    <div class="product-info">
      <h3>${escapeHtml(name)}</h3>
      <p>${escapeHtml(truncate(description, 100))}</p>
    </div>
    <div class="product-actions">
      <button class="btn btn-small btn-edit" data-id="${product.id}" onclick="handleEdit('${product.id}')">Editar</button>
      <button class="btn btn-small btn-delete" data-id="${product.id}" onclick="handleDelete('${product.id}')">Excluir</button>
    </div>
  `;
  
  return item;
}

// ========================================
// ESTADOS DE LOADING
// ========================================

/**
 * Mostra o estado de loading
 */
export function showLoading() {
  if (elements.loading) {
    elements.loading.style.display = 'block';
  }
  if (elements.error) {
    elements.error.style.display = 'none';
  }
}

/**
 * Esconde o estado de loading
 */
export function hideLoading() {
  if (elements.loading) {
    elements.loading.style.display = 'none';
  }
}

/**
 * Mostra mensagem de erro
 * @param {string} message - Mensagem de erro
 */
export function showError(message) {
  if (elements.error) {
    elements.error.textContent = message;
    elements.error.style.display = 'block';
  }
  hideLoading();
}

// ========================================
// PREVIEW
// ========================================

/**
 * Atualiza o preview do produto
 */
export function updatePreview() {
  const name = elements.productName?.value || '';
  const desc = elements.productDescription?.value || '';
  const image = elements.productImage?.value || '';
  const link = elements.shopeeLink?.value || '';
  
  if (!elements.productPreview) return;
  
  if (name || desc || image) {
    elements.productPreview.style.display = 'block';
    
    if (elements.previewName) elements.previewName.textContent = name || '(sem nome)';
    if (elements.previewDesc) elements.previewDesc.textContent = desc || '(sem descrição)';
    if (elements.previewLink) elements.previewLink.href = link || '#';
    
    if (elements.previewImage) {
      if (image) {
        elements.previewImage.src = image;
        elements.previewImage.style.display = 'block';
      } else {
        elements.previewImage.style.display = 'none';
      }
    }
  } else {
    elements.productPreview.style.display = 'none';
  }
}

/**
 * Limpa o formulário
 */
export function clearForm() {
  if (elements.productName) elements.productName.value = '';
  if (elements.productDescription) elements.productDescription.value = '';
  if (elements.productImage) elements.productImage.value = '';
  if (elements.shopeeLink) elements.shopeeLink.value = '';
  if (elements.productImageFile) elements.productImageFile.value = '';
  
  if (elements.productPreview) {
    elements.productPreview.style.display = 'none';
  }
}

// ========================================
// NOTIFICAÇÕES
// ========================================

/**
 * Mostra uma notificação/alert
 * @param {string} message - Mensagem
 * @param {string} type - Tipo: 'success', 'error', 'info'
 */
export function showNotification(message, type = 'info') {
  // Por padrão, usa alert simples
  // Pode ser expandido para toast notifications
  alert(message);
}

// ========================================
// UTILITÁRIOS
// ========================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Exportar funções globais para onclick
window.handleEdit = function(productId) {
  // Emitir evento customizado
  window.dispatchEvent(new CustomEvent('editProduct', { detail: { productId } }));
};

window.handleDelete = function(productId) {
  // Emitir evento customizado
  window.dispatchEvent(new CustomEvent('deleteProduct', { detail: { productId } }));
};

