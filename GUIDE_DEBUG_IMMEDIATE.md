# 🔧 GUIDE DE DÉBOGAGE MIREB CRM

## Problèmes identifiés et solutions

### ❌ PROBLÈME PRINCIPAL
**Erreur "Failed to fetch" lors de l'ajout de produits**

### 🔍 CAUSES IDENTIFIÉES

1. **Backend non démarré correctement**
2. **Problèmes dans les routes produits**
3. **Configuration MongoDB défaillante**
4. **CORS mal configuré**
5. **Variables d'environnement manquantes**

### ✅ SOLUTIONS IMPLÉMENTÉES

## 1. Serveur de débogage créé

**Fichier:** `backend/server-debug.js`
- Serveur Node.js simplifié
- Base de données en mémoire (pas de MongoDB)
- Toutes les routes nécessaires simulées
- CORS configuré correctement
- Port: 5001

## 2. Routes produits corrigées

**Fichier:** `backend/routes/produits.js`
- Routes POST, GET, PUT, DELETE fonctionnelles
- Validation des données
- Gestion d'erreurs complète
- Logs détaillés

## 3. Script de démarrage

**Fichier:** `start-debug-server.sh`
```bash
./start-debug-server.sh
```

## 📋 INSTRUCTIONS DE DÉBOGAGE

### Étape 1: Démarrer le serveur debug
```bash
cd /workspaces/mireb-
chmod +x start-debug-server.sh
./start-debug-server.sh
```

### Étape 2: Vérifier la connexion
Ouvrir: `http://localhost:5001/api/health`

### Étape 3: Tester l'interface
Ouvrir: `/test-backend.html`

### Étape 4: Tester l'ajout de produits
Ouvrir: `/admin-add-product.html`

## 🚨 POINTS DE VÉRIFICATION

### Backend (Port 5001)
- ✅ Serveur démarré
- ✅ Routes fonctionnelles  
- ✅ CORS configuré
- ✅ JSON parsing
- ✅ Validation données

### Frontend
- ✅ API_BASE mis à jour
- ✅ Gestion d'erreurs
- ✅ Logs détaillés

## 📊 TESTS À EFFECTUER

1. **Test de santé**
   ```
   GET http://localhost:5001/api/health
   ```

2. **Test liste produits**
   ```
   GET http://localhost:5001/api/produits
   ```

3. **Test création produit**
   ```
   POST http://localhost:5001/api/produits
   {
     "nom": "Test Produit",
     "description": "Description test",
     "prix": 100,
     "categorie": "Électronique",
     "stock": 10,
     "ville": "Kinshasa"
   }
   ```

4. **Test upload simulé**
   ```
   POST http://localhost:5001/api/upload/single
   ```

5. **Test IA simulée**
   ```
   POST http://localhost:5001/api/openai/generate-description
   {
     "nom": "iPhone",
     "categorie": "Électronique"
   }
   ```

## 🔄 PROCHAINES ÉTAPES

### Phase 1: Debug Local (Actuel)
- ✅ Serveur simplifié fonctionnel
- ✅ Tests en local
- ✅ Identification des problèmes

### Phase 2: Configuration Production
- 🔄 Configuration MongoDB Atlas
- 🔄 Variables Vercel
- 🔄 Deploy backend correct

### Phase 3: Intégration Complète
- 🔄 Connexion vraie base de données
- 🔄 Upload images réel (Cloudinary)
- 🔄 IA OpenAI réelle

## 🛠️ COMMANDES UTILES

### Démarrer le debug
```bash
./start-debug-server.sh
```

### Vérifier les logs
```bash
curl http://localhost:5001/api/health
```

### Tester création produit
```bash
curl -X POST http://localhost:5001/api/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","description":"Test desc","prix":100,"categorie":"Test","stock":5,"ville":"Kinshasa"}'
```

## 🔗 VARIABLES VERCEL À CONFIGURER

```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production
```

## 📱 FICHIERS MODIFIÉS

1. `backend/server-debug.js` - Nouveau serveur simplifié
2. `backend/routes/produits.js` - Routes corrigées
3. `admin-add-product.html` - API_BASE mis à jour
4. `start-debug-server.sh` - Script de démarrage
5. `test-backend.html` - Interface de test

## ⚡ RÉSOLUTION RAPIDE

**Si l'erreur persiste:**

1. Vérifier que le serveur debug est démarré sur le port 5001
2. Ouvrir la console navigateur (F12) pour voir les erreurs
3. Tester avec `test-backend.html` d'abord
4. Vérifier la configuration CORS

**Commande de diagnostic:**
```bash
curl -v http://localhost:5001/api/health
```

## 📞 AIDE SUPPLÉMENTAIRE

En cas de problème persistant:
1. Vérifier les logs du serveur
2. Tester avec Postman/curl
3. Vérifier la configuration réseau
4. Redémarrer le serveur debug
