// ========================================
// ADMIN.JS - Lógica da Página de Administração
// ========================================

// Variáveis globais
let currentExportData = null;
let currentExportType = null;
let officialProducts = [];
let officialKits = [];
let currentEditProductId = null;
let currentEditKitId = null;

// ========================================
// CONFIGURAÇÃO DO PASSCODE (CLIENT-SIDE)
// ========================================
// Observação: proteção apenas no cliente, suficiente para ocultar o painel em sites estáticos.
// Altere o passcode abaixo conforme desejar.
const ADMIN_LOCK_KEY = 'adminUnlocked_v1';
const ADMIN_PASSCODE = 'ciclismo123vida';

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Função que inicializa o painel administrativo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Painel Admin carregado');

    // Inicializa proteção por passcode
    initLockGuard();
    
    // Carregar produtos oficiais (data/products.json)
    loadOfficialProducts();
    // Carregar kits oficiais (data/kits.json)
    loadOfficialKits();
    
    // Carregar e exibir produtos salvos
    displaySavedProducts();
    
    // Carregar e exibir kits salvos
    displaySavedKits();
});

// ========================================
// BLOQUEIO POR PASSCODE
// ========================================

function initLockGuard() {
    const overlay = document.getElementById('lock-overlay');
    const input = document.getElementById('admin-passcode');
    const btn = document.getElementById('unlock-btn');
    const error = document.getElementById('lock-error');

    if (!overlay || !input || !btn) {
        console.warn('⚠️ Overlay de bloqueio não encontrado.');
        return;
    }

    // Se já desbloqueado anteriormente neste navegador, esconde o overlay
    const unlocked = localStorage.getItem(ADMIN_LOCK_KEY) === 'true';
    if (unlocked) {
        hideLockOverlay();
        showBackToolbar();
        return;
    }

    // Foca no input ao carregar
    setTimeout(() => input.focus(), 50);

    // Tenta desbloquear ao clicar
    btn.addEventListener('click', () => attemptUnlock(input, error));

    // Tenta desbloquear com Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            attemptUnlock(input, error);
        }
    });
}

function attemptUnlock(inputEl, errorEl) {
    const value = (inputEl.value || '').trim();
    if (!value) {
        errorEl.textContent = 'Informe o passcode.';
        inputEl.focus();
        return;
    }

    if (value === ADMIN_PASSCODE) {
        localStorage.setItem(ADMIN_LOCK_KEY, 'true');
        hideLockOverlay();
        showBackToolbar();
        console.log('🔓 Admin desbloqueado');
    } else {
        errorEl.textContent = 'Passcode incorreto. Tente novamente.';
        inputEl.select();
    }
}

function hideLockOverlay() {
    const overlay = document.getElementById('lock-overlay');
    if (overlay) overlay.style.display = 'none';
}

function showBackToolbar() {
    const bar = document.getElementById('back-toolbar');
    if (bar) bar.style.display = 'flex';
}

// ========================================
// ADICIONAR PRODUTO
// ========================================

/**
 * Adiciona um novo produto ao LocalStorage
 */
async function addProduct() {
    // Obter valores dos campos
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const imageUrl = document.getElementById('product-image').value.trim();
    const imageFileEl = document.getElementById('product-image-file');
    const shopeeLink = document.getElementById('product-link').value.trim();
    
    // Validação
    if (!name || !description || (!imageUrl && (!imageFileEl || !imageFileEl.files || imageFileEl.files.length === 0)) || !shopeeLink) {
        alert('❌ Por favor, preencha todos os campos do produto!');
        return;
    }
    
    // Validar URL da imagem, se informado
    if (imageUrl && !isValidUrl(imageUrl)) {
        alert('❌ Por favor, insira uma URL válida para a imagem!');
        return;
    }
    
    // Validar URL da Shopee
    if (!isValidUrl(shopeeLink)) {
        alert('❌ Por favor, insira uma URL válida para o link da Shopee!');
        return;
    }
    
    // Obter imagem final: arquivo (prioridade) ou URL
    let finalImage = imageUrl;
    if (imageFileEl && imageFileEl.files && imageFileEl.files.length > 0) {
        try {
            finalImage = await readFileAsDataUrl(imageFileEl.files[0]);
        } catch (e) {
            console.error(e);
            alert('❌ Falha ao ler o arquivo de imagem.');
            return;
        }
    }

    // Criar objeto produto
    const product = {
        id: Date.now(), // Gerar ID único baseado no timestamp
        name: name,
        description: description,
        image: finalImage,
        shopeeLink: shopeeLink
    };
    
    // Obter produtos existentes do LocalStorage
    let products = getLocalStorageProducts();
    
    // Adicionar novo produto
    products.push(product);
    
    // Salvar no LocalStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    console.log('✅ Produto adicionado:', product);
    
    // Limpar formulário
    clearProductForm();
    
    // Atualizar lista de produtos salvos
    displaySavedProducts();
    
    // Feedback visual
    alert(`✅ Produto "${name}" adicionado com sucesso!\n\nID: ${product.id}`);
}

/**
 * Limpa o formulário de produto
 */
function clearProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-image').value = '';
    const fileEl = document.getElementById('product-image-file');
    if (fileEl) fileEl.value = '';
    const prev = document.getElementById('product-image-preview');
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    document.getElementById('product-link').value = '';
}

// ========================================
// ADICIONAR KIT
// ========================================

/**
 * Adiciona um novo kit ao LocalStorage
 */
async function addKit() {
    // Obter valores dos campos
    const name = document.getElementById('kit-name').value.trim();
    const description = document.getElementById('kit-description').value.trim();
    const imageUrl = document.getElementById('kit-image').value.trim();
    const imageFileEl = document.getElementById('kit-image-file');
    const productIdsString = document.getElementById('kit-products').value.trim();
    
    // Validação
    if (!name || !description || (!imageUrl && (!imageFileEl || !imageFileEl.files || imageFileEl.files.length === 0)) || !productIdsString) {
        alert('❌ Por favor, preencha todos os campos do kit!');
        return;
    }
    
    // Validar URL da imagem se informada
    if (imageUrl && !isValidUrl(imageUrl)) {
        alert('❌ Por favor, insira uma URL válida para a imagem!');
        return;
    }
    
    // Converter string de IDs em array de números
    const productIds = productIdsString
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));
    
    if (productIds.length === 0) {
        alert('❌ Por favor, insira pelo menos um ID de produto válido!');
        return;
    }
    
    // Obter imagem final: arquivo (prioridade) ou URL
    let finalImage = imageUrl;
    if (imageFileEl && imageFileEl.files && imageFileEl.files.length > 0) {
        try {
            finalImage = await readFileAsDataUrl(imageFileEl.files[0]);
        } catch (e) {
            console.error(e);
            alert('❌ Falha ao ler o arquivo de imagem.');
            return;
        }
    }

    // Criar objeto kit
    const kit = {
        id: Date.now(), // Gerar ID único baseado no timestamp
        name: name,
        description: description,
        image: finalImage,
        productIds: productIds
    };
    
    // Obter kits existentes do LocalStorage
    let kits = getLocalStorageKits();
    
    // Adicionar novo kit
    kits.push(kit);
    
    // Salvar no LocalStorage
    localStorage.setItem('kits', JSON.stringify(kits));
    
    console.log('✅ Kit adicionado:', kit);
    
    // Limpar formulário
    clearKitForm();
    
    // Atualizar lista de kits salvos
    displaySavedKits();
    
    // Feedback visual
    alert(`✅ Kit "${name}" adicionado com sucesso!\n\nID: ${kit.id}\nProdutos: ${productIds.length}`);
}

/**
 * Limpa o formulário de kit
 */
function clearKitForm() {
    document.getElementById('kit-name').value = '';
    document.getElementById('kit-description').value = '';
    document.getElementById('kit-image').value = '';
    const fileEl = document.getElementById('kit-image-file');
    if (fileEl) fileEl.value = '';
    const prev = document.getElementById('kit-image-preview');
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    document.getElementById('kit-products').value = '';
}

// ========================================
// EXPORTAR DADOS
// ========================================

/**
 * Exporta produtos do LocalStorage em formato JSON
 */
function exportProducts() {
    const products = getLocalStorageProducts();
    
    if (products.length === 0) {
        alert('⚠️ Nenhum produto para exportar! Adicione produtos primeiro.');
        return;
    }
    
    // Preparar JSON formatado
    const jsonString = JSON.stringify(products, null, 4);
    
    // Armazenar dados para exportação
    currentExportData = jsonString;
    currentExportType = 'products';
    
    // Exibir área de exportação
    showExportArea('Produtos JSON - Copie para data/products.json', jsonString);
    
    console.log('📤 Produtos exportados:', products.length);
}

/**
 * Exporta kits do LocalStorage em formato JSON
 */
function exportKits() {
    const kits = getLocalStorageKits();
    
    if (kits.length === 0) {
        alert('⚠️ Nenhum kit para exportar! Adicione kits primeiro.');
        return;
    }
    
    // Preparar JSON formatado
    const jsonString = JSON.stringify(kits, null, 4);
    
    // Armazenar dados para exportação
    currentExportData = jsonString;
    currentExportType = 'kits';
    
    // Exibir área de exportação
    showExportArea('Kits JSON - Copie para data/kits.json', jsonString);
    
    console.log('📤 Kits exportados:', kits.length);
}

/**
 * Exibe a área de exportação com o JSON
 * @param {string} title - Título da exportação
 * @param {string} jsonString - String JSON formatada
 */
function showExportArea(title, jsonString) {
    const exportArea = document.getElementById('export-area');
    const exportTitle = document.getElementById('export-title');
    const exportOutput = document.getElementById('export-output');
    
    exportTitle.textContent = title;
    exportOutput.value = jsonString;
    exportArea.style.display = 'block';
    
    // Scroll suave até a área de exportação
    exportArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Copia o conteúdo do JSON para a área de transferência
 */
function copyToClipboard() {
    const exportOutput = document.getElementById('export-output');
    
    exportOutput.select();
    exportOutput.setSelectionRange(0, 99999); // Para mobile
    
    try {
        document.execCommand('copy');
        alert('✅ JSON copiado para a área de transferência!\n\nAgora você pode colar no arquivo correspondente em /data/');
    } catch (err) {
        alert('❌ Erro ao copiar. Por favor, selecione e copie manualmente.');
        console.error('Erro ao copiar:', err);
    }
}

/**
 * Força o download do JSON como arquivo
 */
function downloadJSON() {
    if (!currentExportData || !currentExportType) {
        alert('❌ Nenhum dado para download!');
        return;
    }
    
    // Criar blob com o JSON
    const blob = new Blob([currentExportData], { type: 'application/json' });
    
    // Criar URL temporária
    const url = URL.createObjectURL(blob);
    
    // Criar link de download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentExportType}.json`;
    
    // Simular clique
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Download iniciado: ${currentExportType}.json`);
    alert(`✅ Download iniciado!\n\nArquivo: ${currentExportType}.json`);
}

// ========================================
// EXIBIR DADOS SALVOS
// ========================================

/**
 * Exibe a lista de produtos salvos no LocalStorage
 */
function displaySavedProducts() {
    const savedProducts = getLocalStorageProducts();
    const container = document.getElementById('saved-products');
    
    // Limpar conteúdo
    container.innerHTML = '';
    
    if (savedProducts.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray);">Nenhum produto salvo ainda.</p>';
        return;
    }
    
    // Criar item para cada produto
    savedProducts.forEach(product => {
        const item = createSavedProductItem(product);
        container.appendChild(item);
    });
}

/**
 * Cria um elemento visual para produto salvo
 * @param {Object} product - Objeto do produto
 * @returns {HTMLElement} - Elemento HTML
 */
function createSavedProductItem(product) {
    const item = document.createElement('div');
    item.className = 'saved-item';
    
    const info = document.createElement('div');
    info.className = 'saved-item-info';
    
    const title = document.createElement('h4');
    title.textContent = product.name;
    
    const description = document.createElement('p');
    description.textContent = product.description.substring(0, 100) + '...';
    
    const id = document.createElement('small');
    id.textContent = `ID: ${product.id}`;
    
    // Miniatura
    if (product.image) {
        const thumb = document.createElement('img');
        thumb.src = product.image;
        thumb.alt = product.name;
        thumb.style.width = '56px';
        thumb.style.height = '56px';
        thumb.style.objectFit = 'cover';
        thumb.style.marginRight = '12px';
        thumb.style.border = '2px solid var(--neon-green)';
        thumb.style.borderRadius = '6px';
        info.prepend(thumb);
    }

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(id);
    
    // Botão editar
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary';
    editBtn.textContent = 'Editar';
    editBtn.style.marginRight = '8px';
    editBtn.onclick = () => openEditProductModal(product.id);

    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => deleteProduct(product.id);
    
    item.appendChild(info);
    const actions = document.createElement('div');
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(actions);
    
    return item;
}

/**
 * Exibe a lista de kits salvos no LocalStorage
 */
function displaySavedKits() {
    const savedKits = getLocalStorageKits();
    const container = document.getElementById('saved-kits');
    
    // Limpar conteúdo
    container.innerHTML = '';
    
    if (savedKits.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray);">Nenhum kit salvo ainda.</p>';
        return;
    }
    
    // Criar item para cada kit
    savedKits.forEach(kit => {
        const item = createSavedKitItem(kit);
        container.appendChild(item);
    });
}

/**
 * Cria um elemento visual para kit salvo
 * @param {Object} kit - Objeto do kit
 * @returns {HTMLElement} - Elemento HTML
 */
function createSavedKitItem(kit) {
    const item = document.createElement('div');
    item.className = 'saved-item';
    
    const info = document.createElement('div');
    info.className = 'saved-item-info';
    
    const title = document.createElement('h4');
    title.textContent = kit.name;
    
    const description = document.createElement('p');
    description.textContent = kit.description.substring(0, 100) + '...';
    
    const id = document.createElement('small');
    id.textContent = `ID: ${kit.id} | Produtos: ${kit.productIds.length}`;
    
    if (kit.image) {
        const thumb = document.createElement('img');
        thumb.src = kit.image;
        thumb.alt = kit.name;
        thumb.style.width = '56px';
        thumb.style.height = '56px';
        thumb.style.objectFit = 'cover';
        thumb.style.marginRight = '12px';
        thumb.style.border = '2px solid var(--neon-green)';
        thumb.style.borderRadius = '6px';
        info.prepend(thumb);
    }

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(id);
    
    // Botão editar
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary';
    editBtn.textContent = 'Editar';
    editBtn.style.marginRight = '8px';
    editBtn.onclick = () => openEditKitModal(kit.id);

    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => deleteKit(kit.id);
    
    item.appendChild(info);
    const actions = document.createElement('div');
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(actions);
    
    return item;
}

// ========================================
// DELETAR DADOS
// ========================================

/**
 * Deleta um produto do LocalStorage
 * @param {number} productId - ID do produto
 */
function deleteProduct(productId) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    let products = getLocalStorageProducts();
    const targetId = Number(productId);
    products = products.filter(p => Number(p.id) !== targetId);
    
    localStorage.setItem('products', JSON.stringify(products));
    
    console.log('🗑️ Produto deletado:', productId);
    displaySavedProducts();
    // Atualiza visão de oficiais, se existir
    if (document.getElementById('official-products')) {
        try { renderOfficialProducts(); } catch (_) {}
    }
    
    alert('✅ Produto excluído com sucesso!');
}

/**
 * Deleta um kit do LocalStorage
 * @param {number} kitId - ID do kit
 */
function deleteKit(kitId) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este kit?')) {
        return;
    }
    
    let kits = getLocalStorageKits();
    const targetId = Number(kitId);
    kits = kits.filter(k => Number(k.id) !== targetId);
    
    localStorage.setItem('kits', JSON.stringify(kits));
    
    console.log('🗑️ Kit deletado:', kitId);
    displaySavedKits();
    if (document.getElementById('official-kits')) {
        try { renderOfficialKits(); } catch(_) {}
    }
    
    alert('✅ Kit excluído com sucesso!');
}

// ========================================
// OFICIAIS: KITS (data/kits.json)
// ========================================

async function loadOfficialKits() {
    try {
        const resp = await fetch('data/kits.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        officialKits = await resp.json();
        renderOfficialKits();
    } catch (e) {
        console.warn('⚠️ Não foi possível carregar kits oficiais:', e);
        const container = document.getElementById('official-kits');
        if (container) container.innerHTML = '<p style="color: var(--text-gray);">Não foi possível carregar data/kits.json.</p>';
    }
}

function renderOfficialKits() {
    const container = document.getElementById('official-kits');
    if (!container) return;
    container.innerHTML = '';
    if (!officialKits || officialKits.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray);">Nenhum kit oficial.</p>';
        return;
    }
    const locals = getLocalStorageKits();
    officialKits.forEach(k => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        const info = document.createElement('div');
        info.className = 'saved-item-info';
        const title = document.createElement('h4');
        title.textContent = k.name;
        const description = document.createElement('p');
        description.textContent = k.description.substring(0, 100) + '...';
        const id = document.createElement('small');
        id.textContent = `ID: ${k.id} | Produtos: ${k.productIds.length}`;
        if (k.image) {
            const thumb = document.createElement('img');
            thumb.src = k.image;
            thumb.alt = k.name;
            thumb.style.width = '56px';
            thumb.style.height = '56px';
            thumb.style.objectFit = 'cover';
            thumb.style.marginRight = '12px';
            thumb.style.border = '2px solid var(--neon-green)';
            thumb.style.borderRadius = '6px';
            info.prepend(thumb);
        }
        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(id);
        const actions = document.createElement('div');
        const existsLocal = locals.some(lk => lk.id === k.id);
        const importBtn = document.createElement('button');
        importBtn.className = 'btn btn-secondary';
        importBtn.textContent = existsLocal ? 'Editar (local)' : 'Adicionar (local)';
        importBtn.style.marginRight = '8px';
        importBtn.onclick = () => {
            ensureLocalKit(k);
            displaySavedKits();
            openEditKitModal(k.id);
        };
        const deleteLocalBtn = document.createElement('button');
        deleteLocalBtn.className = 'btn btn-delete';
        deleteLocalBtn.textContent = 'Excluir (local)';
        deleteLocalBtn.onclick = () => {
            deleteKit(k.id);
            renderOfficialKits();
        };
        actions.appendChild(importBtn);
        if (existsLocal) actions.appendChild(deleteLocalBtn);
        item.appendChild(info);
        item.appendChild(actions);
        container.appendChild(item);
    });
}

function ensureLocalKit(kit) {
    const locals = getLocalStorageKits();
    const idx = locals.findIndex(lk => lk.id === kit.id);
    if (idx === -1) {
        locals.push({ ...kit });
        localStorage.setItem('kits', JSON.stringify(locals));
    }
}

// ========================================
// EDIÇÃO DE KIT (LOCAL)
// ========================================

function openEditKitModal(kitId) {
    const locals = getLocalStorageKits();
    const targetId = Number(kitId);
    const kit = locals.find(k => Number(k.id) === targetId);
    if (!kit) {
        alert('Kit não encontrado no LocalStorage.');
        return;
    }
    currentEditKitId = targetId;
    document.getElementById('edit-kit-name').value = kit.name || '';
    document.getElementById('edit-kit-description').value = kit.description || '';
    document.getElementById('edit-kit-image').value = (kit.image && kit.image.startsWith('http')) ? kit.image : '';
    const prev = document.getElementById('edit-kit-image-preview');
    if (kit.image) { prev.src = kit.image; prev.style.display = 'block'; } else { prev.src = ''; prev.style.display = 'none'; }
    document.getElementById('edit-kit-products').value = Array.isArray(kit.productIds) ? kit.productIds.join(', ') : '';
    const fileEl = document.getElementById('edit-kit-image-file');
    if (fileEl) fileEl.value = '';
    const modal = document.getElementById('edit-kit-modal');
    if (modal) modal.style.display = 'flex';
}

function closeEditKitModal() {
    const modal = document.getElementById('edit-kit-modal');
    if (modal) modal.style.display = 'none';
}

async function saveEditedKit() {
    if (!currentEditKitId) return;
    const name = document.getElementById('edit-kit-name').value.trim();
    const description = document.getElementById('edit-kit-description').value.trim();
    const imageUrl = document.getElementById('edit-kit-image').value.trim();
    const imageFileEl = document.getElementById('edit-kit-image-file');
    const productsStr = document.getElementById('edit-kit-products').value.trim();
    if (!name || !description || !productsStr) {
        alert('❌ Preencha nome, descrição e IDs dos produtos.');
        return;
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
        alert('❌ URL de imagem inválida.');
        return;
    }
    const productIds = productsStr.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (productIds.length === 0) {
        alert('❌ Informe pelo menos um ID de produto válido.');
        return;
    }
    let locals = getLocalStorageKits();
    const idx = locals.findIndex(k => Number(k.id) === Number(currentEditKitId));
    if (idx === -1) {
        alert('Kit não encontrado.');
        return;
    }
    let finalImage = imageUrl || (locals[idx] && locals[idx].image) || '';
    if (imageFileEl && imageFileEl.files && imageFileEl.files.length > 0) {
        try {
            finalImage = await readFileAsDataUrl(imageFileEl.files[0]);
        } catch (e) {
            console.error(e);
            alert('❌ Falha ao ler arquivo de imagem.');
            return;
        }
    }
    locals[idx] = { ...locals[idx], name, description, image: finalImage, productIds };
    localStorage.setItem('kits', JSON.stringify(locals));
    displaySavedKits();
    closeEditKitModal();
    alert('✅ Kit atualizado com sucesso!');
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Obtém produtos do LocalStorage
 * @returns {Array} - Array de produtos
 */
function getLocalStorageProducts() {
    const productsJson = localStorage.getItem('products');
    return productsJson ? JSON.parse(productsJson) : [];
}

/**
 * Obtém kits do LocalStorage
 * @returns {Array} - Array de kits
 */
function getLocalStorageKits() {
    const kitsJson = localStorage.getItem('kits');
    return kitsJson ? JSON.parse(kitsJson) : [];
}

/**
 * Valida se uma string é uma URL válida
 * @param {string} string - String a ser validada
 * @returns {boolean} - True se for URL válida
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

/**
 * Lê um arquivo como Data URL (base64)
 */
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ========================================
// PRODUTOS OFICIAIS (data/products.json)
// ========================================

async function loadOfficialProducts() {
    try {
        const resp = await fetch('data/products.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        officialProducts = await resp.json();
        renderOfficialProducts();
    } catch (e) {
        console.warn('⚠️ Não foi possível carregar produtos oficiais:', e);
        const container = document.getElementById('official-products');
        if (container) container.innerHTML = '<p style="color: var(--text-gray);">Não foi possível carregar data/products.json.</p>';
    }
}

function renderOfficialProducts() {
    const container = document.getElementById('official-products');
    if (!container) return;
    container.innerHTML = '';
    if (!officialProducts || officialProducts.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray);">Nenhum produto oficial.</p>';
        return;
    }
    const locals = getLocalStorageProducts();
    officialProducts.forEach(p => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        const info = document.createElement('div');
        info.className = 'saved-item-info';
        const title = document.createElement('h4');
        title.textContent = p.name;
        const description = document.createElement('p');
        description.textContent = p.description.substring(0, 100) + '...';
        const id = document.createElement('small');
        id.textContent = `ID: ${p.id}`;
        if (p.image) {
            const thumb = document.createElement('img');
            thumb.src = p.image;
            thumb.alt = p.name;
            thumb.style.width = '56px';
            thumb.style.height = '56px';
            thumb.style.objectFit = 'cover';
            thumb.style.marginRight = '12px';
            thumb.style.border = '2px solid var(--neon-green)';
            thumb.style.borderRadius = '6px';
            info.prepend(thumb);
        }
        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(id);
        const actions = document.createElement('div');
        const existsLocal = locals.some(lp => lp.id === p.id);
        const importBtn = document.createElement('button');
        importBtn.className = 'btn btn-secondary';
        importBtn.textContent = existsLocal ? 'Editar (local)' : 'Adicionar (local)';
        importBtn.style.marginRight = '8px';
        importBtn.onclick = () => {
            ensureLocalProduct(p);
            displaySavedProducts();
            openEditProductModal(p.id);
        };
        const deleteLocalBtn = document.createElement('button');
        deleteLocalBtn.className = 'btn btn-delete';
        deleteLocalBtn.textContent = 'Excluir (local)';
        deleteLocalBtn.onclick = () => {
            deleteProduct(p.id);
            renderOfficialProducts();
        };
        actions.appendChild(importBtn);
        if (existsLocal) actions.appendChild(deleteLocalBtn);
        item.appendChild(info);
        item.appendChild(actions);
        container.appendChild(item);
    });
}

function ensureLocalProduct(product) {
    const locals = getLocalStorageProducts();
    const idx = locals.findIndex(lp => lp.id === product.id);
    if (idx === -1) {
        locals.push({ ...product });
        localStorage.setItem('products', JSON.stringify(locals));
    }
}

// ========================================
// EDIÇÃO DE PRODUTO (LOCAL)
// ========================================

function openEditProductModal(productId) {
    const locals = getLocalStorageProducts();
    const targetId = Number(productId);
    const product = locals.find(p => Number(p.id) === targetId);
    if (!product) {
        alert('Produto não encontrado no LocalStorage.');
        return;
    }
    currentEditProductId = targetId;
    // Preencher campos
    document.getElementById('edit-product-name').value = product.name || '';
    document.getElementById('edit-product-description').value = product.description || '';
    document.getElementById('edit-product-image').value = (product.image && product.image.startsWith('http')) ? product.image : '';
    const prev = document.getElementById('edit-product-image-preview');
    if (product.image) { prev.src = product.image; prev.style.display = 'block'; } else { prev.src = ''; prev.style.display = 'none'; }
    document.getElementById('edit-product-link').value = product.shopeeLink || '';
    const fileEl = document.getElementById('edit-product-image-file');
    if (fileEl) fileEl.value = '';
    // Mostrar modal
    const modal = document.getElementById('edit-modal');
    if (modal) modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.style.display = 'none';
}

async function saveEditedProduct() {
    if (!currentEditProductId) return;
    const name = document.getElementById('edit-product-name').value.trim();
    const description = document.getElementById('edit-product-description').value.trim();
    const imageUrl = document.getElementById('edit-product-image').value.trim();
    const imageFileEl = document.getElementById('edit-product-image-file');
    const shopeeLink = document.getElementById('edit-product-link').value.trim();
    if (!name || !description || !shopeeLink) {
        alert('❌ Por favor, preencha nome, descrição e link.');
        return;
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
        alert('❌ URL de imagem inválida.');
        return;
    }
    if (!isValidUrl(shopeeLink)) {
        alert('❌ URL da Shopee inválida.');
        return;
    }
    // Obter imagem final: arquivo > URL > imagem atual
    let locals = getLocalStorageProducts();
    const idx = locals.findIndex(p => p.id === currentEditProductId);
    if (idx === -1) {
        alert('Produto não encontrado.');
        return;
    }

    let finalImage = imageUrl || (locals[idx] && locals[idx].image) || '';
    if (imageFileEl && imageFileEl.files && imageFileEl.files.length > 0) {
        try {
            finalImage = await readFileAsDataUrl(imageFileEl.files[0]);
        } catch (e) {
            console.error(e);
            alert('❌ Falha ao ler o arquivo de imagem.');
            return;
        }
    }
    locals[idx] = { ...locals[idx], name, description, image: finalImage, shopeeLink };
    localStorage.setItem('products', JSON.stringify(locals));
    displaySavedProducts();
    closeEditModal();
    alert('✅ Produto atualizado com sucesso!');
}

// ========================================
// PREVIEW DE ARQUIVO (ADD/EDIT)
// ========================================

document.addEventListener('change', (e) => {
    const target = e.target;
    if (target && target.id === 'product-image-file' && target.files && target.files[0]) {
        const img = document.getElementById('product-image-preview');
        const file = target.files[0];
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.display = 'block';
    }
    if (target && target.id === 'edit-product-image-file' && target.files && target.files[0]) {
        const img = document.getElementById('edit-product-image-preview');
        const file = target.files[0];
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.display = 'block';
    }
    if (target && target.id === 'kit-image-file' && target.files && target.files[0]) {
        const img = document.getElementById('kit-image-preview');
        const file = target.files[0];
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.display = 'block';
    }
    if (target && target.id === 'edit-kit-image-file' && target.files && target.files[0]) {
        const img = document.getElementById('edit-kit-image-preview');
        const file = target.files[0];
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.display = 'block';
    }
});

// ========================================
// LOGOUT DO ADMIN
// ========================================

function logoutAdmin() {
    try {
        localStorage.removeItem(ADMIN_LOCK_KEY);
    } catch(_) {}
    const overlay = document.getElementById('lock-overlay');
    if (overlay) overlay.style.display = 'flex';
    const bar = document.getElementById('back-toolbar');
    if (bar) bar.style.display = 'none';
}

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================

console.log('✅ admin.js carregado com sucesso');
console.log('📊 Produtos no LocalStorage:', getLocalStorageProducts().length);
console.log('📦 Kits no LocalStorage:', getLocalStorageKits().length);
