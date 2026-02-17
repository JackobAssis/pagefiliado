# Escopo dos Itens da Tela Inicial

## Visão Geral
Projeto: **Ciclismo Pro - Catálogo de Produtos**  
Arquivo principal: `public/index.html`  
Stack: HTML5, CSS3, JavaScript (Vanilla)

---

## 1. Header (Cabeçalho)

| Item | Tipo | Descrição |
|------|------|-----------|
| Logo | Texto + Emoji | "🚴 Ciclismo Pro" |
| Link Admin | Hyperlink | Redireciona para `admin.html` |

**Características:**
- Posição: sticky (fixo no topo)
- Fundo: gradiente linear (verde escuro WhatsApp)
- Z-index: 100

---

## 2. Hero Section (Seção Principal)

| Item | Conteúdo |
|------|----------|
| Título | "Equipamentos Premium" |
| Subtítulo | "Os melhores produtos para sua performance" |

**Características:**
- Fundo: gradiente linear
- Alinhamento: centralizado
- Espaçamento: padding XL (3rem)

---

## 3. Products Section (Seção de Produtos)

### 3.1 Elementos de Controle

| Item | Descrição |
|------|-----------|
| Título da Seção | "Nossos Produtos" |
| Loading State | "Carregando produtos..." |
| Error State | "Não foi possível carregar os produtos. Tente novamente mais tarde." |
| Container Grid | Elemento `#products-grid` para renderização dinâmica |

### 3.2 Grid de Produtos

**Layout:**
- Desktop (≥1024px): 2 colunas
- Tablet (768px-1023px): 2 colunas
- Mobile (≤767px): 1 coluna

### 3.3 Card de Produto (whatsapp-card)

Cada produto renderiza um card com os seguintes elementos:

| Elemento | Tag HTML | Descrição |
|----------|----------|-----------|
| Imagem | `<img>` | 400x250px, object-fit: cover |
| Título | `<h3>` | Nome do produto |
| Descrição | `<p>` | Descrição (máx. 3 linhas, truncado com line-clamp) |
| Botão | `<a>` | "🛒 Ver na Shopee" (link afiliado) |

**Estados da Imagem:**
- Normal: exibe imagem do produto
- Erro: exibe placeholder "Erro ao carregar"

### 3.4 Produtos do JSON (Exemplo)

| # | Nome | Descrição Resumida |
|---|------|-------------------|
| 1 | Capacete Aerodinâmico Pro X1 | Design aerodinâmico, ventilação otimizada |
| 2 | Luvas de Ciclismo GripTech | Ergônomicas, anti-vibração, touchscreen |
| 3 | Tênis Ciclismo SpeedMax Carbon | Solado fibra de carbono, sistema de trava dupla |
| 4 | Óculos de Sol Polarizado UV400 | Lentes polarizadas, proteção UV400 |
| 5 | Camisa Ciclismo DryFit Pro | Tecido DryFit, secagem rápida, UV50+ |
| 6 | Bermuda Ciclismo Gel 3D | Forro em gel 3D, tecido compressivo |

---

## 4. Footer (Rodapé)

| Item | Conteúdo |
|------|----------|
| Copyright | "© 2025 Ciclismo Pro - Afiliado Shopee" |
| Nota | "Links de afiliado - Obrigado pelo apoio!" |

**Características:**
- Fundo: secondary-bg (#111b11)
- Borda superior: 1px verde (rgba)

---

## 5. Características Visuais (CSS)

### 5.1 Paleta de Cores (Tema WhatsApp)

| Variável CSS | Valor | Uso |
|--------------|-------|-----|
| `--primary-bg` | #0a0a0a | Fundo principal |
| `--secondary-bg` | #111b11 | Fundo secundário |
| `--card-bg` | #1a2e1a | Fundo dos cards |
| `--whatsapp-green` | #00ff6a | Cor principal (verde) |
| `--whatsapp-dark` | #075e54 | Verde escuro |
| `--text-light` | #ffffff | Texto claro |
| `--text-gray` | #aaaaaa | Texto cinza |

### 5.2 Efeitos

| Efeito | Descrição |
|--------|-----------|
| Card Shadow | `0 2px 12px rgba(0, 255, 106, 0.15)` |
| Hover Shadow | `0 4px 20px rgba(0, 255, 106, 0.3)` |
| Hover Card | Translação Y (-5px) + borda verde |

### 5.3 Responsividade (Breakpoints)

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Desktop | ≥1024px | Grid 2 colunas |
| Tablet | 768px-1023px | Grid 2 colunas, imagens menores |
| Mobile Grande | 480px-767px | Grid 1 coluna |
| Mobile Pequeno | 360px-479px | Grid 1 coluna, fontes reduzidas |
| Extra Pequeno | <360px | Grid 1 coluna, compactado |

---

## 6. Funcionalidades (JavaScript)

### 6.1 Fluxo de Carregamento

```
1. DOMContentLoaded
   ↓
2. loadProducts()
   ├── Busca products.json (via fetch)
   ├── Busca localStorage (admin)
   ├── Mescla arrays (localStorage primeiro)
   └── Remove duplicatas por ID
   ↓
3. renderProducts()
   └── Cria cards para cada produto
```

### 6.2 Fontes de Dados

| Fonte | Prioridade | Descrição |
|-------|------------|-----------|
| localStorage | 1 (primeiro) | Produtos adicionados pelo admin |
| products.json | 2 (segundo) | Produtos oficiais (embutidos) |

### 6.3 Eventos

| Evento | Gatilho | Ação |
|--------|---------|------|
| `storage` | Mudança no localStorage (outras abas) | Recarrega produtos |
| `productsUpdated` | Evento customizado (mesma aba) | Recarrega produtos |

### 6.4 Funções Principais

| Função | Descrição |
|--------|-----------|
| `loadProducts()` | Carrega produtos de JSON + localStorage |
| `renderProducts()` | Renderiza cards no DOM |
| `createProductCard()` | Cria HTML do card individual |
| `escapeHtml()` | Sanitiza HTML para evitar XSS |
| `showError()` | Exibe mensagem de erro |

---

## 7. Estrutura de Arquivos

```
public/
├── index.html          # Página inicial
├── style.css          # Estilos (tema WhatsApp)
├── admin.html         # Painel administrativo
├── data/
│   └── products.json  # Catálogo de produtos
└── scripts/
    ├── app.js         # Lógica da página inicial
    └── admin.js       # Lógica do painel admin
```

---

## 8. Observações Técnicas

- **Sem dependências externas**: JavaScript puro (vanilla)
- **Sem framework CSS**: CSS customizado com variáveis
- **Acessibilidade**: Tags semânticas (header, section, article, footer)
- **Performance**: Imagens com lazy loading nativo
- **Segurança**: Sanitização de HTML (escapeHtml)
- **Affiliacao**: Links direcionados para Shopee

---

*Documento gerado automaticamente em: 2025*

