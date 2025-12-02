// ========================================
// ADMIN.JS - Painel Administrativo Simplificado
// ========================================

// Configurações
const ADMIN_PASSCODE = 'ciclismo123vida';
const ADMIN_LOCK_KEY = 'adminUnlocked_v1';

let products = [];

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔒 Admin Panel - Inicializando...');
    
    // Verificar se já está desbloqueado
    initLockGuard();
    
    // Carregar produtos salvos
    loadProducts();
    
    // Event Listeners
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
        console.log('✅ Admin já desbloqueado');
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
        // Desbloqueado!
        localStorage.setItem(ADMIN_LOCK_KEY, 'true');
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block';
        console.log('✅ Admin desbloqueado');
    } else {
        // Senha incorreta
        if (errorMsg) {
            errorMsg.textContent = '❌ Passcode incorreto!';
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
    // Unlock
    const unlockBtn = document.getElementById('unlock-btn');
    const passcodeInput = document.getElementById('admin-passcode');
    
    if (unlockBtn) unlockBtn.addEventListener('click', attemptUnlock);
    if (passcodeInput) {
        passcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptUnlock();
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logoutAdmin);
    
    // Auto-fill via link Shopee
    const autoFillBtn = document.getElementById('auto-fill-btn');
    if (autoFillBtn) autoFillBtn.addEventListener('click', autoFillFromShopee);
    
    // Upload de imagem
    const imageFile = document.getElementById('product-image-file');
    if (imageFile) imageFile.addEventListener('change', handleImageUpload);
    
    // Preview em tempo real
    const inputs = ['product-name', 'product-description', 'product-image', 'shopee-link'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', updatePreview);
    });
    
    // Salvar produto
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveProduct);
    
    // Limpar formulário
    const clearBtn = document.getElementById('clear-form-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearForm);
    
    // Exportar JSON
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportProducts);
}

// ========================================
// AUTO-PREENCHIMENTO VIA LINK SHOPEE
// ========================================

async function autoFillFromShopee() {
    const linkInput = document.getElementById('shopee-link');
    const link = linkInput?.value.trim();
    
    if (!link) {
        alert('❌ Por favor, cole o link da Shopee primeiro!');
        return;
    }
    
    // Validar se é um link válido
    if (!link.includes('shopee')) {
        alert('❌ Link inválido! Use um link da Shopee.');
        return;
    }
    
    alert('⚠️ Auto-preenchimento ainda não implementado.\n\nPor enquanto, preencha manualmente os campos abaixo.\n\nEm breve: extração automática de título, imagem e descrição!');
    
    // TODO: Implementar web scraping ou API da Shopee
    // Por enquanto, deixar usuário preencher manualmente
    
    document.getElementById('product-name')?.focus();
}

// ========================================
// UPLOAD DE IMAGEM
// ========================================

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
        alert('❌ Por favor, selecione um arquivo de imagem válido!');
        return;
    }
    
    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ Imagem muito grande! Tamanho máximo: 2MB');
        return;
    }
    
    try {
        const base64 = await readFileAsBase64(file);
        const imageInput = document.getElementById('product-image');
        if (imageInput) {
            imageInput.value = base64;
            updatePreview();
        }
        console.log('✅ Imagem carregada como base64');
    } catch (error) {
        console.error('Erro ao ler imagem:', error);
        alert('❌ Erro ao processar a imagem!');
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
// PREVIEW DO PRODUTO
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
    
    // Mostrar preview se houver dados
    if (name || desc || image) {
        if (preview) preview.style.display = 'block';
        if (previewName) previewName.textContent = name || '(sem nome)';
        if (previewDesc) previewDesc.textContent = desc || '(sem descrição)';
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
    
    // Validação
    if (!name) {
        alert('❌ Nome do produto é obrigatório!');
        return;
    }
    
    if (!link) {
        alert('❌ Link da Shopee é obrigatório!');
        return;
    }
    
    if (!image) {
        alert('❌ Imagem é obrigatória! Cole uma URL ou faça upload.');
        return;
    }
    
    // Criar produto
    const product = {
        id: Date.now(),
        name: name,
        description: desc || 'Sem descrição',
        image: image,
        shopeeLink: link
    };
    
    // Adicionar à lista
    products.push(product);
    
    // Salvar no localStorage
    saveToLocalStorage();
    
    // Atualizar lista visual
    renderProducts();
    
    // Limpar formulário
    clearForm();
    
    alert('✅ Produto salvo com sucesso!');
    console.log('✅ Produto adicionado:', product);
}

// ========================================
// RENDERIZAR PRODUTOS SALVOS
// ========================================

function renderProducts() {
    const container = document.getElementById('products-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); text-align: center;">Nenhum produto salvo ainda.</p>';
        return;
    }
    
    products.forEach((product, index) => {
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
            </div>
            <div class="product-actions">
                <button class="btn btn-small btn-edit" onclick="editProduct(${index})">✏️ Editar</button>
                <button class="btn btn-small btn-delete" onclick="deleteProduct(${index})">🗑️ Excluir</button>
            </div>
        `;
        
        container.appendChild(item);
    });
    
    console.log(`✅ ${products.length} produtos renderizados`);
}

// ========================================
// EDITAR E EXCLUIR PRODUTOS
// ========================================

function editProduct(index) {
    const product = products[index];
    if (!product) return;
    
    // Preencher formulário
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('shopee-link').value = product.shopeeLink;
    
    // Remover produto antigo
    products.splice(index, 1);
    
    // Atualizar lista
    renderProducts();
    saveToLocalStorage();
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    updatePreview();
}

function deleteProduct(index) {
    const product = products[index];
    if (!product) return;
    
    if (confirm(`Excluir "${product.name}"?`)) {
        products.splice(index, 1);
        renderProducts();
        saveToLocalStorage();
        alert('✅ Produto excluído!');
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
// CARREGAR E SALVAR NO LOCALSTORAGE
// ========================================

function loadProducts() {
    const saved = localStorage.getItem('products');
    if (saved) {
        try {
            products = JSON.parse(saved);
            console.log(`📦 ${products.length} produtos carregados do localStorage`);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            products = [];
        }
    }
    renderProducts();
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        console.log('💾 Produtos salvos no localStorage');
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        alert('❌ Erro ao salvar! localStorage pode estar cheio.');
    }
}

// ========================================
// EXPORTAR JSON
// ========================================

function exportProducts() {
    if (products.length === 0) {
        alert('❌ Não há produtos para exportar!');
        return;
    }
    
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert(`✅ ${products.length} produtos exportados!\n\nSalve o arquivo em: /public/data/products.json`);
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
