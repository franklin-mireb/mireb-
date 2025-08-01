# 🚀 Guide de Déploiement Complet - Mireb CRM

## 📋 Étapes à Suivre

### 1️⃣ Corriger les Variables GitHub
```bash
# Dans GitHub: Settings > Secrets and variables > Actions > Repository secrets

# ❌ Renommer
OPENAI → OPENAI_API_KEY

# ✅ Ajouter ces nouvelles variables
JWT_SECRET=mireb_jwt_secret_2025_secure_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"votre-projet",...}
FIREBASE_STORAGE_BUCKET=votre-bucket.appspot.com
```

### 2️⃣ Déployer le Backend sur Vercel (GRATUIT)
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Déployer depuis le dossier du projet
vercel --prod

# 4. Configurer les variables d'environnement sur Vercel
# Dashboard Vercel > Votre Projet > Settings > Environment Variables
MONGODB_URI=votre_connection_string_mongodb
OPENAI_API_KEY=votre_clé_openai
JWT_SECRET=mireb_jwt_secret_2025_secure_key
```

### 3️⃣ Mettre à Jour le Frontend
✅ **Déjà fait automatiquement !**
- Interface admin mise à jour pour pointer vers Vercel
- Détection d'environnement automatique
- URLs dynamiques selon localhost ou production

### 4️⃣ Tester le Déploiement
1. **Commit et Push** les changements
2. **Attendre le déploiement** GitHub Pages
3. **Tester l'interface** sur franklin-mireb.github.io/mireb-/
4. **Vérifier les API** en ajoutant un produit

## 🔧 Configuration Technique

### Frontend (GitHub Pages)
- **URL**: https://franklin-mireb.github.io/mireb-/
- **Détection auto**: localhost vs production
- **API Base**: Dynamique selon environnement

### Backend (Vercel)
- **URL**: https://mireb-api.vercel.app/api
- **Base de données**: MongoDB Atlas (gratuit)
- **IA**: OpenAI API
- **Images**: Simulation (à remplacer par Cloudinary)

## 📊 Endpoints API
```bash
GET  /api/health           # Statut du serveur
GET  /api/produits         # Liste des produits
POST /api/produits         # Créer un produit
POST /api/upload/single    # Upload d'image (simulé)
POST /api/openai/generate-description  # Génération IA
POST /api/openai/optimize-tags        # Tags IA
```

## 🎯 Résultat Final
✅ Frontend déployé sur GitHub Pages  
✅ Backend déployé sur Vercel (gratuit)  
✅ Base de données MongoDB Atlas (gratuit)  
✅ Fonctionnalités IA opérationnelles  
✅ Interface admin complètement fonctionnelle  

## ⚡ Commandes de Déploiement Rapide
```bash
# 1. Commit des changements
git add .
git commit -m "🚀 Configuration production avec backend Vercel"
git push origin main

# 2. Déploiement backend Vercel
vercel --prod

# 3. Test de l'application
# Ouvrir: https://franklin-mireb.github.io/mireb-/admin-add-product.html
```

## 🆘 Dépannage
Si problème de CORS:
- Vérifier que l'URL GitHub Pages est dans la config CORS
- Attendre 5-10 minutes pour la propagation DNS
- Vider le cache du navigateur

## 💡 Améliorations Futures
- Remplacer simulation upload par Cloudinary/Firebase
- Ajouter authentification JWT complète
- Implémenter WebSocket pour notifications temps réel
- Ajouter système de cache Redis
