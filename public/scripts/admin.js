// ========================================
// ADMIN.JS - Lógica da Página de Administração
// ========================================

// Variáveis globais
let currentExportData = null;
let currentExportType = null;

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Função que inicializa o painel administrativo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Painel Admin carregado');
    
    // Carregar e exibir produtos salvos
    displaySavedProducts();
    
    // Carregar e exibir kits salvos
    displaySavedKits();
});

// ========================================
// ADICIONAR PRODUTO
// ========================================

/**
 * Adiciona um novo produto ao LocalStorage
 */
function addProduct() {
    // Obter valores dos campos
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const shopeeLink = document.getElementById('product-link').value.trim();
    
    // Validação
    if (!name || !description || !image || !shopeeLink) {
        alert('❌ Por favor, preencha todos os campos do produto!');
        return;
    }
    
    // Validar URL da imagem
    if (!isValidUrl(image)) {
        alert('❌ Por favor, insira uma URL válida para a imagem!');
        return;
    }
    
    // Validar URL da Shopee
    if (!isValidUrl(shopeeLink)) {
        alert('❌ Por favor, insira uma URL válida para o link da Shopee!');
        return;
    }
    
    // Criar objeto produto
    const product = {
        id: Date.now(), // Gerar ID único baseado no timestamp
        name: name,
        description: description,
        image: image,
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
    document.getElementById('product-link').value = '';
}

// ========================================
// ADICIONAR KIT
// ========================================

/**
 * Adiciona um novo kit ao LocalStorage
 */
function addKit() {
    // Obter valores dos campos
    const name = document.getElementById('kit-name').value.trim();
    const description = document.getElementById('kit-description').value.trim();
    const image = document.getElementById('kit-image').value.trim();
    const productIdsString = document.getElementById('kit-products').value.trim();
    
    // Validação
    if (!name || !description || !image || !productIdsString) {
        alert('❌ Por favor, preencha todos os campos do kit!');
        return;
    }
    
    // Validar URL da imagem
    if (!isValidUrl(image)) {
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
    
    // Criar objeto kit
    const kit = {
        id: Date.now(), // Gerar ID único baseado no timestamp
        name: name,
        description: description,
        image: image,
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
    
    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(id);
    
    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => deleteProduct(product.id);
    
    item.appendChild(info);
    item.appendChild(deleteBtn);
    
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
    
    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(id);
    
    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => deleteKit(kit.id);
    
    item.appendChild(info);
    item.appendChild(deleteBtn);
    
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
    products = products.filter(p => p.id !== productId);
    
    localStorage.setItem('products', JSON.stringify(products));
    
    console.log('🗑️ Produto deletado:', productId);
    displaySavedProducts();
    
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
    kits = kits.filter(k => k.id !== kitId);
    
    localStorage.setItem('kits', JSON.stringify(kits));
    
    console.log('🗑️ Kit deletado:', kitId);
    displaySavedKits();
    
    alert('✅ Kit excluído com sucesso!');
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

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================

console.log('✅ admin.js carregado com sucesso');
console.log('📊 Produtos no LocalStorage:', getLocalStorageProducts().length);
console.log('📦 Kits no LocalStorage:', getLocalStorageKits().length);
