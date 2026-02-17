# Firebase Rules - Regras de Segurança

## 🚨 IMPORTANTE: Estas regras são para DESENVOLVIMENTO apenas!

Para produção, você deve configurar regras mais restritivas com autenticação.

---

## FIRESTORE RULES

Cole estas regras em: **Firestore Database > Regras**

### Para Desenvolvimento (Teste):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos (APENAS PARA TESTE)
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}
```

### Para Produção (Com Autenticação):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Qualquer pessoa pode ler produtos
    match /products/{productId} {
      allow read: if true;
      // Apenas usuários autenticados podem escrever
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

---

## FIREBASE STORAGE RULES

Cole estas regras em: **Storage > Regras**

### Para Desenvolvimento (Teste):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permite upload/download para todos (APENAS PARA TESTE)
    match /products/{productId}/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Para Produção (Com Autenticação):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    match /products/{productId}/{allPaths=**} {

      allow read: if true;

      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && (
                        request.resource.contentType.matches('image/.*')
                      );

    }
  }
}
```

---

## Como aplicar:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. **Para Firestore:**
   - Vá em "Firestore Database" > aba "Regras"
   - Cole as regras acima
   - Clique em "Publicar"

4. **Para Storage:**
   - Vá em "Storage" > aba "Regras"
   - Cole as regras acima
   - Clique em "Publicar"

---

## Recomendação

- Use as regras de **desenvolvimento** para testar
- Quando for colocar em **produção**, use as regras de **produção** com autenticação

