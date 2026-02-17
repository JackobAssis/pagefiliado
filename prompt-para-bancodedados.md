Prepare and configure this project to use Firebase as the backend service, including Firestore Database, Firebase Storage, and Authentication, with a clean, modular, and scalable architecture.

PROJECT CONTEXT:
This is a web-based product management system (affiliate/product platform) built using HTML, CSS, and Vanilla JavaScript. Products contain structured data (name, description, price, category, affiliate link) and media files (images and videos). The system must support creating, editing, deleting, and retrieving products, with persistent storage and media hosting using Firebase.

GOALS:
- Replace localStorage persistence with Firebase Firestore.
- Store images and videos using Firebase Storage.
- Maintain a clean separation between UI, business logic, and Firebase communication.
- Ensure scalability, maintainability, and professional structure.

REQUIRED TASKS:

1. INSTALL AND CONFIGURE FIREBASE SDK
- Install Firebase using npm if Node environment exists:
  npm install firebase

- If the project is pure frontend, configure using Firebase CDN modular SDK.

- Create a dedicated Firebase configuration file:
  /js/firebase/firebase-config.js

This file must:
- Initialize Firebase using initializeApp
- Export initialized services:
  - Firestore database
  - Firebase Storage
  - Authentication (prepare even if not yet used)

Example structure:
  export const app
  export const db
  export const storage
  export const auth

DO NOT hardcode logic outside modular functions.

---

2. CREATE FIREBASE SERVICE LAYER

Create folder:
  /js/firebase/

Create files:

  firebase-config.js
  firestore-service.js
  storage-service.js
  auth-service.js

Each file must have clear responsibilities:

firestore-service.js:
- createProduct(productData)
- getAllProducts()
- getProductById(productId)
- updateProduct(productId, productData)
- deleteProduct(productId)

storage-service.js:
- uploadFile(file, path)
- deleteFile(path)
- getFileURL(path)

auth-service.js:
- prepare structure for:
  - registerUser
  - loginUser
  - logoutUser
  - getCurrentUser

All functions must:
- use async/await
- include proper error handling
- return structured responses

---

3. DEFINE FIRESTORE DATA MODEL

Create collection:
  products

Each document must contain:

  id: string
  name: string
  description: string
  price: number
  category: string
  affiliateLink: string
  media: array of objects:
    [
      {
        type: "image" | "video",
        url: string,
        path: string
      }
    ]
  createdAt: timestamp
  updatedAt: timestamp

Ensure timestamps are generated automatically.

---

4. CREATE STORAGE STRUCTURE

Define storage folder pattern:

  /products/{productId}/images/{filename}
  /products/{productId}/videos/{filename}

Ensure uploadFile returns:

  {
    url,
    path
  }

---

5. CREATE PRODUCT CONTROLLER LAYER

Create folder:
  /js/controllers/

Create file:
  product-controller.js

This layer must:

- Combine firestore-service and storage-service
- Handle full product lifecycle:
  - upload media
  - create Firestore document
  - update media
  - delete media and product

This layer represents the business logic.

---

6. REMOVE localStorage DEPENDENCIES

- Identify and remove all localStorage product persistence logic.
- Replace with Firestore-based persistence.
- Keep localStorage only for temporary UI state if needed.

---

7. CREATE CLEAN PROJECT STRUCTURE

Ensure final structure:

/js
  /firebase
    firebase-config.js
    firestore-service.js
    storage-service.js
    auth-service.js

  /controllers
    product-controller.js

  /ui
    ui-controller.js

  main.js

---

8. IMPLEMENT ERROR HANDLING

All Firebase operations must:

- Use try/catch
- Return structured error objects
- Avoid silent failures

---

9. ENSURE MODULAR AND PROFESSIONAL CODE QUALITY

Requirements:

- No inline Firebase calls in UI files
- All Firebase logic isolated in service layer
- All business logic isolated in controller layer
- UI layer only handles rendering and events

---

10. PREPARE FOR FUTURE SCALABILITY

Structure must allow easy addition of:

- User authentication
- User-specific products
- Admin roles
- Product visibility control

Do not implement these yet, only prepare architecture.

---

FINAL RESULT:

The project must be fully prepared to:

- Persist products in Firestore
- Upload and retrieve images/videos from Firebase Storage
- Maintain clean and scalable architecture
- Be production-ready and maintainable
