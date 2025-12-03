# 🚴 Ciclismo Pro - Site Afiliado

Loja virtual de produtos de ciclismo com painel administrativo integrado.

## 🎨 Design

- **Tema:** WhatsApp dark green (`#00ff6a`)
- **Layout:** Grid 2x2 (desktop) → 1 coluna (mobile)
- **Responsivo:** 360px até 1024px+

## 📁 Estrutura do Projeto

```
pagefiliado/
└── public/
    ├── index.html          # Página principal (catálogo)
    ├── admin.html          # Painel administrativo
    ├── style.css           # Estilos WhatsApp
    ├── scripts/
    │   ├── app.js          # Lógica da página principal
    │   └── admin.js        # Lógica do admin
    └── data/
        └── products.json   # Base de dados de produtos
```

## 🚀 Como Usar

### 1️⃣ Visualizar a Loja

1. Abra `index.html` no navegador
2. Os produtos serão carregados automaticamente
3. Clique em "Ver na Shopee" para acessar os produtos

### 2️⃣ Acessar o Painel Admin

1. Abra `admin.html` no navegador
2. Digite o passcode: `ciclismo123vida`
3. Clique em "Desbloquear"

### 3️⃣ Adicionar Produtos

**✨ NOVO: Os produtos aparecem automaticamente na página inicial!**

**Opção 1: Automática (em breve)**
- Cole o link da Shopee
- Clique em "Tentar Preencher Automaticamente"

**Opção 2: Manual**
1. Cole o link da Shopee
2. Preencha nome, descrição
3. Cole URL da imagem OU faça upload de arquivo
4. Clique em "Salvar Produto"
5. ✅ **O produto aparece IMEDIATAMENTE como card na página inicial!**

### 4️⃣ Como Funciona

**Sistema Híbrido de Produtos:**
- **localStorage**: Produtos adicionados pelo admin (aparecem primeiro)
- **products.json**: Produtos oficiais/fixos do catálogo
- **Resultado**: Ambos aparecem na página inicial, sem duplicatas

**Atualização em Tempo Real:**
- Ao salvar um produto → aparece instantaneamente na loja
- Ao editar um produto → atualização automática
- Ao excluir um produto → remoção imediata da loja

### 5️⃣ Exportar Produtos (Opcional)

Para tornar produtos permanentes (mesmo após limpar navegador):

1. No admin, clique em "Exportar para products.json"
2. Salve o arquivo baixado em `/public/data/products.json`
3. Os produtos agora são permanentes

## 🔐 Segurança

**Passcode padrão:** `ciclismo123vida`

Para alterar, edite em `scripts/admin.js`:
```javascript
const ADMIN_PASSCODE = 'sua_senha_aqui';
```

## 📱 Responsividade

| Resolução | Layout |
|-----------|--------|
| 1024px+ | Grid 2x2 |
| 768px - 1023px | Grid 2x2 |
| 480px - 767px | 1 coluna |
| 360px - 479px | 1 coluna (compacto) |
| < 360px | 1 coluna (mini) |

## 🎨 Classes CSS Principais

```css
.product-grid          /* Grid 2x2 responsivo */
.whatsapp-card         /* Card estilo WhatsApp */
.whatsapp-card-image   /* Imagem do produto */
.whatsapp-card-content /* Conteúdo do card */
.whatsapp-card-title   /* Título do produto */
.btn                   /* Botão WhatsApp style */
.admin-input           /* Input do admin */
```

## 🌐 Deploy

### Vercel
1. Instale o Vercel CLI: `npm i -g vercel`
2. Na pasta do projeto: `vercel`
3. Siga as instruções

### GitHub Pages
1. Crie um repositório no GitHub
2. Faça push do código
3. Vá em Settings → Pages
4. Selecione branch `main` e pasta `/public`

### Netlify
1. Arraste a pasta `/public` para netlify.com/drop

## 🛠️ Tecnologias

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+ (Async/Await, LocalStorage, FileReader)

## 📝 Notas

- Produtos salvos ficam no **localStorage** (temporário)
- Para persistir, exporte o JSON e salve em `/data/`
- Imagens podem ser URLs externas ou Base64 (upload)
- Sem frameworks, sem bundlers, sem backend

## 🎯 Features

- ✅ Grid 2x2 responsivo
- ✅ Cards estilo WhatsApp
- ✅ Admin com passcode
- ✅ Upload de imagens (Base64)
- ✅ Exportar JSON
- ✅ CRUD de produtos
- ✅ **Atualização em tempo real** (produtos aparecem instantaneamente na loja)
- ✅ **Sistema híbrido** (localStorage + JSON)
- ⏳ Auto-fill via link Shopee (em breve)

## 📞 Suporte

Para alterar cores, espaçamentos ou layout, edite as variáveis CSS em `style.css`:

```css
:root {
    --whatsapp-green: #00ff6a;
    --primary-bg: #0a0a0a;
    --spacing-md: 1.5rem;
}
```

---

**Desenvolvido com 💚 e JavaScript puro**
