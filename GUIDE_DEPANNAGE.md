# 🛠️ GUIDE DE DÉPANNAGE - MIREB CRM

## 🚨 Problème: "Failed to fetch" dans l'interface admin

### ✅ SOLUTION ÉTAPE PAR ÉTAPE

#### 1. Vérifier que le serveur est démarré
```bash
# Dans le terminal VSCode
cd /workspaces/mireb-/backend
node server-unified.js
```

**Attendez ce message :**
```
🚀 MIREB COMMERCIAL - SERVEUR UNIFIÉ
📍 Host: 0.0.0.0
📍 Port: 8080
```

#### 2. Tester l'API localement
```bash
curl http://localhost:8080/api/health
```

**Réponse attendue :**
```json
{"status":"OK","message":"Backend Mireb unifié fonctionne!"}
```

#### 3. Accéder à l'interface
- **Local :** http://localhost:8080/admin-add-product.html
- **GitHub Codespaces :** https://VOTRE-CODESPACE-8080.app.github.dev/admin-add-product.html

#### 4. Utiliser le diagnostic intégré
1. Ouvrir l'interface admin
2. Cliquer sur le bouton "Diagnostic API" 
3. Vérifier les messages dans la console (F12)

### 🔧 SOLUTIONS SELON L'ENVIRONNEMENT

#### Pour GitHub Codespaces :
1. **Vérifier la visibilité du port :**
   - Aller dans l'onglet "Ports" de VSCode
   - Port 8080 doit être "Public" ou "Accessible"

2. **URL correcte :**
   - Remplacer `localhost:8080` par votre URL Codespaces
   - Format: `https://VOTRE-CODESPACE-8080.app.github.dev`

#### Pour Local :
1. **Serveur démarré :** `node server-unified.js`
2. **Port libre :** Aucun autre service sur port 8080
3. **URL correcte :** `http://localhost:8080`

### 📋 CHECKLIST DE DÉPANNAGE

- [ ] ✅ Serveur démarré (message de confirmation visible)
- [ ] ✅ Port 8080 ouvert et accessible  
- [ ] ✅ API Health répond (curl test OK)
- [ ] ✅ URL correcte selon environnement
- [ ] ✅ Console browser sans erreurs CORS
- [ ] ✅ Bouton "Diagnostic API" fonctionne

### 🚀 TESTS DE VALIDATION

#### Test 1: API Health
```bash
curl -s http://localhost:8080/api/health
```

#### Test 2: Création Produit
```bash
curl -X POST http://localhost:8080/api/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prix":99,"categorie":"Test","stock":5,"ville":"Kinshasa"}'
```

#### Test 3: Upload Simulation  
```bash
curl -X POST http://localhost:8080/api/upload/single \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","fileSize":1000}'
```

#### Test 4: IA Description
```bash
curl -X POST http://localhost:8080/api/openai/generate-description \
  -H "Content-Type: application/json" \
  -d '{"nom":"Smartphone","categorie":"Électronique"}'
```

### ⚡ SOLUTIONS RAPIDES

#### Erreur "Failed to fetch" :
1. **Redémarrer le serveur :** `pkill -f server-unified && node server-unified.js`
2. **Vérifier l'URL :** Utiliser le diagnostic intégré
3. **Vider le cache :** Ctrl+F5 ou Cmd+Shift+R

#### Interface blanche :
1. **Ouvrir la console :** F12 → Console
2. **Chercher les erreurs :** Messages en rouge
3. **Recharger :** Ctrl+F5

#### Port occupé :
```bash
# Libérer le port 8080
pkill -f "port.*8080"
lsof -ti:8080 | xargs kill -9
```

### 📞 URLS DE TEST RAPIDE

- **🏠 Accueil :** http://localhost:8080/
- **👨‍💼 Interface Admin :** http://localhost:8080/admin-add-product.html  
- **🧪 Tests Complets :** http://localhost:8080/test-final-complet.html
- **📊 API Health :** http://localhost:8080/api/health
- **📖 API Docs :** http://localhost:8080/api/docs

### 🎯 RÉSOLUTION GARANTIE

**Si tout le reste échoue :**

1. **Arrêter tous les processus :**
```bash
pkill -f node
pkill -f server
```

2. **Redémarrer proprement :**
```bash
cd /workspaces/mireb-/backend
node server-unified.js
```

3. **Attendre le message de confirmation**

4. **Tester avec curl :** `curl http://localhost:8080/api/health`

5. **Ouvrir l'interface :** http://localhost:8080/admin-add-product.html

6. **Utiliser le diagnostic intégré**

---

## ✅ CONFIRMATION DE FONCTIONNEMENT

**Votre système fonctionne si :**
- ✅ Serveur démarre sans erreur
- ✅ API Health répond JSON valide  
- ✅ Interface admin se charge
- ✅ Diagnostic API passe tous les tests
- ✅ Création de produit réussit
- ✅ Upload d'images fonctionne
- ✅ Outils IA répondent

**🟢 Si tous ces points sont OK, votre Mireb CRM est entièrement fonctionnel !**
