// ========================================
// APP.JS - Lógica da Página Principal
// ========================================

// Variáveis globais para armazenar os dados
let products = [];
let kits = [];

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Função que inicializa a aplicação quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚴 Ciclismo Pro - Carregando dados...');
    loadData();
});

// ========================================
// CARREGAMENTO DE DADOS
// ========================================

/**
 * Carrega os dados dos arquivos JSON
 */
async function loadData() {
    try {
        // Carregar produtos
        await loadProducts();
        
        // Carregar kits
        await loadKits();
        
        console.log('✅ Dados carregados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showError('Erro ao carregar os dados. Por favor, recarregue a página.');
    }
}

/**
 * Carrega os produtos do arquivo JSON
 */
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }
        
        products = await response.json();
        console.log(`📦 ${products.length} produtos carregados`);
        
        // Renderizar produtos na tela
        renderProducts();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Se falhar, tentar carregar do LocalStorage
        loadProductsFromLocalStorage();
    }
}

/**
 * Carrega produtos do LocalStorage como fallback
 */
function loadProductsFromLocalStorage() {
    const localProducts = localStorage.getItem('products');
    if (localProducts) {
        products = JSON.parse(localProducts);
        console.log(`📦 ${products.length} produtos carregados do LocalStorage`);
        renderProducts();
    } else {
        console.warn('⚠️ Nenhum produto encontrado');
    }
}

/**
 * Carrega os kits do arquivo JSON
 */
async function loadKits() {
    try {
        const response = await fetch('data/kits.json');
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar kits: ${response.status}`);
        }
        
        kits = await response.json();
        console.log(`📦 ${kits.length} kits carregados`);
        
        // Renderizar kits na tela
        renderKits();
        
    } catch (error) {
        console.error('Erro ao carregar kits:', error);
        // Se falhar, tentar carregar do LocalStorage
        loadKitsFromLocalStorage();
    }
}

/**
 * Carrega kits do LocalStorage como fallback
 */
function loadKitsFromLocalStorage() {
    const localKits = localStorage.getItem('kits');
    if (localKits) {
        kits = JSON.parse(localKits);
        console.log(`📦 ${kits.length} kits carregados do LocalStorage`);
        renderKits();
    } else {
        console.warn('⚠️ Nenhum kit encontrado');
    }
}

// ========================================
// RENDERIZAÇÃO DE PRODUTOS
// ========================================

/**
 * Renderiza todos os produtos na página
 */
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    // Limpar conteúdo anterior
    productsGrid.innerHTML = '';
    
    // Verificar se existem produtos
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<p class="loading">Nenhum produto disponível no momento.</p>';
        return;
    }
    
    // Criar card para cada produto
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

/**
 * Cria um card de produto
 * @param {Object} product - Objeto do produto
 * @returns {HTMLElement} - Elemento do card
 */
function createProductCard(product) {
    // Criar elementos
    const card = document.createElement('div');
    card.className = 'card';
    
    const image = document.createElement('img');
    image.className = 'card-image';
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = product.name;
    
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = product.description;
    
    const link = document.createElement('a');
    link.className = 'btn btn-shopee';
    link.href = product.shopeeLink;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '🛒 Ver na Shopee';
    
    // Montar o card
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(link);
    
    card.appendChild(image);
    card.appendChild(content);
    
    return card;
}

// ========================================
// RENDERIZAÇÃO DE KITS
// ========================================

/**
 * Renderiza todos os kits na página
 */
function renderKits() {
    const kitsGrid = document.getElementById('kits-grid');
    
    // Limpar conteúdo anterior
    kitsGrid.innerHTML = '';
    
    // Verificar se existem kits
    if (!kits || kits.length === 0) {
        kitsGrid.innerHTML = '<p class="loading">Nenhum kit disponível no momento.</p>';
        return;
    }
    
    // Criar card para cada kit
    kits.forEach(kit => {
        const kitCard = createKitCard(kit);
        kitsGrid.appendChild(kitCard);
    });
}

/**
 * Cria um card de kit
 * @param {Object} kit - Objeto do kit
 * @returns {HTMLElement} - Elemento do card
 */
function createKitCard(kit) {
    // Criar elementos
    const card = document.createElement('div');
    card.className = 'card';
    
    const image = document.createElement('img');
    image.className = 'card-image';
    image.src = kit.image;
    image.alt = kit.name;
    image.loading = 'lazy';
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = kit.name;
    
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = kit.description;
    
    // Buscar produtos do kit
    const productsList = createKitProductsList(kit.productIds);
    
    // Montar o card
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(productsList);
    
    card.appendChild(image);
    card.appendChild(content);
    
    return card;
}

/**
 * Cria a lista de produtos de um kit
 * @param {Array} productIds - Array com IDs dos produtos
 * @returns {HTMLElement} - Elemento da lista
 */
function createKitProductsList(productIds) {
    const container = document.createElement('div');
    container.className = 'card-products-list';
    
    const heading = document.createElement('h4');
    heading.textContent = '📋 Produtos inclusos:';
    
    const list = document.createElement('ul');
    
    // Buscar cada produto pelo ID
    productIds.forEach(productId => {
        const product = products.find(p => p.id === productId);
        
        if (product) {
            const listItem = document.createElement('li');
            listItem.textContent = product.name;
            list.appendChild(listItem);
        }
    });
    
    // Se não encontrar produtos, mostrar mensagem
    if (list.children.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Produtos não encontrados';
        listItem.style.color = 'var(--text-gray)';
        list.appendChild(listItem);
    }
    
    container.appendChild(heading);
    container.appendChild(list);
    
    return container;
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Exibe mensagem de erro na página
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
    const productsGrid = document.getElementById('products-grid');
    const kitsGrid = document.getElementById('kits-grid');
    
    const errorMessage = `<p class="loading" style="color: #ff3333;">${message}</p>`;
    
    if (productsGrid) productsGrid.innerHTML = errorMessage;
    if (kitsGrid) kitsGrid.innerHTML = errorMessage;
}

// ========================================
// TRATAMENTO DE ERROS DE IMAGEM
// ========================================

/**
 * Adiciona listener para erros de carregamento de imagem
 */
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Erro ao carregar imagem:', e.target.src);
        // Imagem placeholder em caso de erro
        e.target.src = 'https://via.placeholder.com/500x500/0f1f0f/00ff66?text=Imagem+Indisponível';
    }
}, true);

console.log('✅ app.js carregado com sucesso');
