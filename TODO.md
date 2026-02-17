# Plano de Implementação - Firebase Backend

## Objetivo
Substituir localStorage por Firebase (Firestore, Storage, Authentication)

---

## Tarefas

### 1. Instalação e Configuração do Firebase SDK
- [x] Criar estrutura de pastas /js/firebase/
- [x] Criar arquivo firebase-config.js com configuração modular

### 2. Criar Firebase Service Layer
- [x] firestore-service.js - operações CRUD
- [x] storage-service.js - upload/delete de arquivos
- [x] auth-service.js - estrutura para auth (preparado)

### 3. Definir Modelo de Dados Firestore
- [x] Collection: products
- [x] Campos: id, name, description, price, category, affiliateLink, media, timestamps

### 4. Criar Estrutura de Storage
- [x] Pattern: /products/{productId}/images/{filename}
- [x] Função uploadFile retornando {url, path}

### 5. Criar Product Controller Layer
- [x] /js/controllers/product-controller.js
- [x] Combinar firestore + storage services

### 6. Remover dependências localStorage
- [x] Atualizar app.js para usar Firestore (substituído por main.js)
- [x] Atualizar admin.js para usar Firestore (substituído por main.js)

### 7. Criar estrutura limpa do projeto
- [x] /js/firebase/ - serviços
- [x] /js/controllers/ - lógica de negócio
- [x] /js/ui/ - controle de interface

### 8. Implementar Error Handling
- [x] Todas as operações Firebase têm try/catch

### 9. Garantir código modular e profissional
- [x] Sem chamadas Firebase inline nos arquivos de UI
- [x] Toda lógica Firebase isolada na service layer
- [x] Toda lógica de negócio isolada na controller layer
- [x] UI layer apenas rendering e eventos

### 10. Preparar para escalabilidade futura
- [x] Arquitetura permite adicionar auth, user-specific products, admin roles

---

## ⚠️ IMPORTANTE: Configuração Necessária

Antes de usar, você precisa:

1. **Criar projeto no Firebase:**
   - Acesse https://console.firebase.google.com/
   - Crie um novo projeto

2. **Habilitar Firestore:**
   - No console Firebase, vá para "Firestore Database"
   - Crie um banco de dados (modo teste para desenvolvimento)

3. **Atualizar firebase-config.js:**
   - Substitua as credenciais em `js/firebase/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "SEU_PROJETO.firebaseapp.com",
     projectId: "SEU_PROJECT_ID",
     storageBucket: "SEU_BUCKET.appspot.com",
     messagingSenderId: "SEU_SENDER_ID",
     appId: "SEU_APP_ID"
   };
   ```

---

## Estrutura Final

```
/js
  /firebase
    firebase-config.js    # Configuração e inicialização
    firestore-service.js  # CRUD de produtos
    storage-service.js    # Upload de arquivos
    auth-service.js       # Autenticação (preparado)
  /controllers
    product-controller.js # Lógica de negócio
  /ui
    ui-controller.js      # Interface do usuário
  main.js                 # Ponto de entrada

/public
  index.html              # Página inicial
  admin.html              # Painel admin
  style.css               # Estilos
```

---

## Status: ✅ CONCLUÍDO

