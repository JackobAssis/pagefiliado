// ========================================
// ADMIN.JS - Painel Administrativo
// ========================================

// Configurações
const ADMIN_PASSCODE = 'ciclismo123vida';
const ADMIN_LOCK_KEY = 'adminUnlocked_v1';

let localProducts = [];   // Produtos do admin (localStorage)
let jsonProducts = [];   // Produtos do JSON oficial
let allProducts = [];    // Todos os produtos (mesclados)

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Panel - Inicializando...');
    initLockGuard();
    loadProducts();
    setupEventListeners();
});

// ========================================
// SISTEMA DE BLOQUEIO
// ========================================

function initLockGuard() {
    const isUnlocked = localStorage.getItem(ADMIN_LOCK_KEY) === 'true';
    const lockOverlay = document.getElementById('lock-overlay');
    const adminContent = document.getElementById('admin-content');
    
    if (isUnlocked) {
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block';
    } else {
        if (lockOverlay) lockOverlay.style.display = 'flex';
        if (adminContent) adminContent.style.display = 'none';
    }
}

function attemptUnlock() {
    const input = document.getElementById('admin-passcode');
    const errorMsg = document.getElementById('lock-error');
    const lockOverlay = document.getElementById('lock-overlay');
    const adminContent = document.getElementById('admin-content');
    
    if (!input) return;
    
    const enteredPasscode = input.value.trim();
    
    if (enteredPasscode === ADMIN_PASSCODE) {
        localStorage.setItem(ADMIN_LOCK_KEY, 'true');
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block';
    } else {
        if (errorMsg) {
            errorMsg.textContent = 'Passcode incorreto!';
            setTimeout(() => errorMsg.textContent = '', 3000);
        }
        input.value = '';
        input.focus();
    }
}

function logoutAdmin() {
    if (confirm('Deseja realmente sair do painel admin?')) {
        localStorage.removeItem(ADMIN_LOCK_KEY);
        location.reload();
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    const unlockBtn = document.getElementById('unlock-btn');
    const passcodeInput = document.getElementById('admin-passcode');
    
    if (unlockBtn) unlockBtn.addEventListener('click', attemptUnlock);
    if (passcodeInput) {
        passcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptUnlock();
        });
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logoutAdmin);
    
    const autoFillBtn = document.getElementById('auto-fill-btn');
    if (autoFillBtn) autoFillBtn.addEventListener('click', autoFillFromShopee);
    
    const imageFile = document.getElementById('product-image-file');
    if (imageFile) imageFile.addEventListener('change', handleImageUpload);
    
    const inputs = ['product-name', 'product-description', 'product-image', 'shopee-link'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', updatePreview);
    });
    
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveProduct);
    
    const clearBtn = document.getElementById('clear-form-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearForm);
    
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportProducts);
}

// ========================================
// AUTO-PREENCHIMENTO
// ========================================

async function autoFillFromShopee() {
    const linkInput = document.getElementById('shopee-link');
    const link = linkInput?.value.trim();
    
    if (!link) {
        alert('Por favor, cole o link da Shopee primeiro!');
        return;
    }
    
    if (!link.includes('shopee')) {
        alert('Link invalido! Use um link da Shopee.');
        return;
    }
    
    alert('Auto-preenchimento ainda nao implementado. Preencha manualmente.');
    document.getElementById('product-name')?.focus();
}

// ========================================
// UPLOAD DE IMAGEM
// ========================================

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Selecione um arquivo de imagem valido!');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
        alert('Imagem muito grande! Tamanho maximo: 2MB');
        return;
    }
    
    try {
        const base64 = await readFileAsBase64(file);
        const imageInput = document.getElementById('product-image');
        if (imageInput) {
            imageInput.value = base64;
            updatePreview();
        }
    } catch (error) {
        alert('Erro ao processar a imagem!');
    }
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ========================================
// PREVIEW
// ========================================

function updatePreview() {
    const name = document.getElementById('product-name')?.value || '';
    const desc = document.getElementById('product-description')?.value || '';
    const image = document.getElementById('product-image')?.value || '';
    const link = document.getElementById('shopee-link')?.value || '';
    
    const preview = document.getElementById('product-preview');
    const previewImage = document.getElementById('preview-image');
    const previewName = document.getElementById('preview-name');
    const previewDesc = document.getElementById('preview-desc');
    const previewLink = document.getElementById('preview-link');
    
    if (name || desc || image) {
        if (preview) preview.style.display = 'block';
        if (previewName) previewName.textContent = name || '(sem nome)';
        if (previewDesc) previewDesc.textContent = desc || '(sem descricao)';
        if (previewLink) previewLink.href = link || '#';
        
        if (previewImage) {
            if (image) {
                previewImage.src = image;
                previewImage.style.display = 'block';
            } else {
                previewImage.style.display = 'none';
            }
        }
    } else {
        if (preview) preview.style.display = 'none';
    }
}

// ========================================
// SALVAR PRODUTO
// ========================================

function saveProduct() {
    const name = document.getElementById('product-name')?.value.trim();
    const desc = document.getElementById('product-description')?.value.trim();
    const image = document.getElementById('product-image')?.value.trim();
    const link = document.getElementById('shopee-link')?.value.trim();
    
    if (!link) {
        alert('Link da Shopee e obrigatorio!');
        return;
    }
    
    const product = {
        id: Date.now(),
        name: name || 'Produto sem nome',
        description: desc || 'Sem descricao disponivel',
        image: image || 'https://via.placeholder.com/400x250?text=Sem+Imagem',
        shopeeLink: link
    };
    
    localProducts.push(product);
    saveToLocalStorage();
    allProducts = [...localProducts, ...jsonProducts];
    renderProducts();
    clearForm();
    
    alert('Produto salvo com sucesso!');
    console.log('Produto adicionado:', product);
    
    try {
        window.dispatchEvent(new Event('productsUpdated'));
    } catch (e) {
        console.log('Event dispatch nao suportado');
    }
}

// ========================================
// RENDERIZAR PRODUTOS
// ========================================

function renderProducts() {
    const container = document.getElementById('products-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (allProducts.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); text-align: center;">Nenhum produto disponivel.</p>';
        return;
    }
    
    // Criar um mapeamento de IDs para índices no localProducts
    const localProductIds = new Set(localProducts.map(p => p.id));
    
    allProducts.forEach((product) => {
        const localIndex = localProducts.findIndex(p => p.id === product.id);
        const isFromAdmin = localIndex !== -1;
        
        const item = document.createElement('div');
        item.className = 'product-item';
        
        item.innerHTML = `
            <img 
                src="${escapeHtml(product.image)}" 
                alt="${escapeHtml(product.name)}"
                class="product-thumbnail"
                onerror="this.src='https://via.placeholder.com/80'"
            >
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p>${escapeHtml(truncate(product.description, 100))}</p>
                ${isFromAdmin ? '<span style="color: var(--whatsapp-green); font-size: 0.8rem;">Admin</span>' : '<span style="color: var(--text-gray); font-size: 0.8rem;">JSON</span>'}
            </div>
            <div class="product-actions">
                <button class="btn btn-small btn-edit" onclick="editProduct(${localIndex}, ${product.id})">Editar</button>
                <button class="btn btn-small btn-delete" onclick="deleteProduct(${localIndex}, ${product.id})">Excluir</button>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// ========================================
// EDITAR PRODUTO
// ========================================

function editProduct(localIndex, productId) {
    let product;
    
    // Se o índice for -1, o produto é do JSON e precisamos copiá-lo para o localStorage
    if (localIndex === -1) {
        // Encontrar o produto no JSON
        product = jsonProducts.find(p => p.id === productId);
        if (!product) {
            alert('Produto nao encontrado!');
            return;
        }
        
        // Criar uma cópia para o localStorage
        const productCopy = { ...product };
        localProducts.push(productCopy);
        
        // Atualizar o índice para o último item adicionado
        localIndex = localProducts.length - 1;
        
        alert('Produto copiado do JSON para edicao. Agora voce pode modificar e salvar.');
    } else {
        product = localProducts[localIndex];
    }
    
    if (!product) return;
    
    // Preencher formulário
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('shopee-link').value = product.shopeeLink;
    
    // Remover produto antigo (para permitir re-salvar como novo)
    localProducts.splice(localIndex, 1);
    
    // Atualizar lista completa
    allProducts = [...localProducts, ...jsonProducts];
    renderProducts();
    saveToLocalStorage();
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    updatePreview();
    
    alert('Produto carregado para edicao. Apos salvar, a mudanca aparecera na pagina inicial.');
}

// ========================================
// EXCLUIR PRODUTO
// ========================================

function deleteProduct(localIndex, productId) {
    let product;
    
    // Se o índice for -1, o produto é do JSON
    if (localIndex === -1) {
        // Encontrar o produto no JSON
        product = jsonProducts.find(p => p.id === productId);
        if (!product) {
            alert('Produto nao encontrado!');
            return;
        }
        
        if (confirm(`Excluir "${product.name}"?\n\nEste produto e do arquivo JSON original. Para remove-lo, primeiro EDITE este produto (isso ira copia-lo para o localStorage) e entao EXCLUA.\n\nDeseja editar agora?`)) {
            // Chamar editProduct para copiar para o localStorage
            editProduct(-1, productId);
        }
        return;
    }
    
    product = localProducts[localIndex];
    if (!product) return;
    
    if (confirm(`Excluir "${product.name}"?\n\nEste produto sera removido da pagina inicial.`)) {
        localProducts.splice(localIndex, 1);
        allProducts = [...localProducts, ...jsonProducts];
        renderProducts();
        saveToLocalStorage();
        alert('Produto excluido! A mudanca ja esta visivel na pagina inicial.');
        
        try {
            window.dispatchEvent(new Event('productsUpdated'));
        } catch (e) {
            console.log('Event dispatch nao suportado');
        }
    }
}

// ========================================
// LIMPAR FORMULÁRIO
// ========================================

function clearForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('shopee-link').value = '';
    document.getElementById('product-image-file').value = '';
    
    const preview = document.getElementById('product-preview');
    if (preview) preview.style.display = 'none';
}

// ========================================
// CARREGAR PRODUTOS
// ========================================

async function loadProducts() {
    console.log('Carregando produtos...');
    
    // 1. Carregar produtos do localStorage
    const saved = localStorage.getItem('products');
    if (saved) {
        try {
            localProducts = JSON.parse(saved);
        } catch (error) {
            localProducts = [];
        }
    }
    
    // 2. Carregar produtos do JSON
    try {
        const response = await fetch('data/products.json');
        if (response.ok) {
            jsonProducts = await response.json();
        }
    } catch (error) {
        jsonProducts = [];
    }
    
    // 3. Mesclar produtos
    allProducts = [...localProducts, ...jsonProducts];
    
    // 4. Remover duplicatas por ID
    const uniqueProducts = [];
    const seenIds = new Set();
    
    allProducts.forEach(product => {
        if (!seenIds.has(product.id)) {
            seenIds.add(product.id);
            uniqueProducts.push(product);
        }
    });
    
    allProducts = uniqueProducts;
    
    renderProducts();
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('products', JSON.stringify(localProducts));
    } catch (error) {
        alert('Erro ao salvar! localStorage pode estar cheio.');
    }
}

// ========================================
// EXPORTAR JSON
// ========================================

function exportProducts() {
    if (allProducts.length === 0) {
        alert('Nao ha produtos para exportar!');
        return;
    }
    
    const json = JSON.stringify(allProducts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert(allProducts.length + ' produtos exportados!');
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
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

