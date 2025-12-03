// ========================================
// APP.JS - Página Principal (WhatsApp Style)
// ========================================

let products = [];

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚴 Ciclismo Pro - Carregando produtos...');
    loadProducts();
    
    // Detectar mudanças no localStorage (quando admin adiciona produtos)
    window.addEventListener('storage', (e) => {
        if (e.key === 'products') {
            console.log('🔄 Produtos atualizados! Recarregando...');
            loadProducts();
        }
    });
    
    // Detectar evento customizado (mesma aba)
    window.addEventListener('productsUpdated', () => {
        console.log('🔄 Produtos atualizados! Recarregando...');
        loadProducts();
    });
});

// ========================================
// CARREGAMENTO DE PRODUTOS
// ========================================

async function loadProducts() {
    const container = document.getElementById('products-grid');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    
    try {
        // Mostrar loading
        if (loading) loading.style.display = 'block';
        if (errorDiv) errorDiv.style.display = 'none';
        
        // Array para armazenar todos os produtos
        let jsonProducts = [];
        let localProducts = [];
        
        // 1. Tentar carregar produtos do JSON (produtos oficiais)
        try {
            const response = await fetch('data/products.json');
            if (response.ok) {
                jsonProducts = await response.json();
                console.log(`✅ ${jsonProducts.length} produtos do JSON carregados`);
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível carregar products.json:', error);
        }
        
        // 2. Carregar produtos do localStorage (produtos adicionados pelo admin)
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            try {
                localProducts = JSON.parse(savedProducts);
                console.log(`📦 ${localProducts.length} produtos do localStorage carregados`);
            } catch (error) {
                console.warn('⚠️ Erro ao carregar localStorage:', error);
            }
        }
        
        // 3. Mesclar produtos (localStorage tem prioridade e aparece primeiro)
        products = [...localProducts, ...jsonProducts];
        
        // 4. Remover duplicatas por ID
        const uniqueProducts = [];
        const seenIds = new Set();
        
        products.forEach(product => {
            if (!seenIds.has(product.id)) {
                seenIds.add(product.id);
                uniqueProducts.push(product);
            }
        });
        
        products = uniqueProducts;
        console.log(`🎯 Total: ${products.length} produtos únicos`);
        
        // Renderizar produtos
        if (products.length > 0) {
            renderProducts(container);
        } else {
            showError(container, errorDiv, 'Nenhum produto disponível no momento. Adicione produtos pelo painel admin.');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        showError(container, errorDiv, 'Erro ao carregar produtos. Tente recarregar a página.');
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// ========================================
// RENDERIZAÇÃO
// ========================================

function renderProducts(container) {
    if (!container) {
        console.error('Container #products-grid não encontrado');
        return;
    }
    
    // Limpar container
    container.innerHTML = '';
    
    // Verificar se há produtos
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="error">Nenhum produto disponível no momento.</p>';
        return;
    }
    
    // Criar card para cada produto
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
    
    console.log(`✅ ${products.length} produtos renderizados`);
}

// ========================================
// CRIAÇÃO DE CARDS - ESTILO WHATSAPP
// ========================================

function createProductCard(product) {
    // Criar elemento do card
    const card = document.createElement('article');
    card.className = 'whatsapp-card';
    
    // Validar dados do produto
    const name = product.name || 'Produto sem nome';
    const description = product.description || 'Sem descrição disponível.';
    const image = product.image || 'https://via.placeholder.com/400x250?text=Imagem+Indisponivel';
    const shopeeLink = product.shopeeLink || '#';
    
    // HTML do card
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
                href="${escapeHtml(shopeeLink)}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn"
            >
                🛒 Ver na Shopee
            </a>
        </div>
    `;
    
    return card;
}

// ========================================
// UTILITÁRIOS
// ========================================

function showError(container, errorDiv, message) {
    if (container) container.innerHTML = '';
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        console.error(message);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// EXPORTAR PARA ADMIN (se necessário)
// ========================================

window.getProducts = () => products;
