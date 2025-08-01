# Configuration Variables d'Environnement pour Render

## Variables Obligatoires pour le Déploiement

### Base de Données
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mireb_crm?retryWrites=true&w=majority
```

### Authentification JWT
```
JWT_SECRET=votre_jwt_secret_super_securise_minimum_32_caracteres
JWT_REFRESH_SECRET=votre_refresh_secret_different_du_jwt_secret
```

### Configuration API OpenAI (Optionnel)
```
OPENAI_API_KEY=sk-votre_cle_openai_si_vous_en_avez_une
```

### Configuration Upload (Optionnel)
```
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### Configuration Environnement
```
NODE_ENV=production
PORT=8080
```

## Configuration Render.yaml (Déjà configuré)

Votre fichier `render.yaml` est déjà configuré pour fonctionner sur Render :

```yaml
services:
  - type: web
    name: mireb-crm
    env: node
    plan: free
    branch: main
    rootDir: .
    buildCommand: "npm install"
    startCommand: "./start.sh"
    envVars:
      - key: NODE_VERSION
        value: "18.17.1"
      - key: NODE_ENV
        value: "production"
```

## Étapes de Déploiement sur Render

### 1. Connecter le Repository
- Aller sur render.com
- Connecter votre repository GitHub `mireb-`
- Sélectionner "Web Service"

### 2. Configurer les Variables d'Environnement
Dans l'interface Render, ajouter ces variables :

**Variables Obligatoires** :
- `MONGODB_URI` : Votre URI MongoDB Atlas
- `JWT_SECRET` : Secret pour les tokens JWT
- `NODE_ENV` : `production`

**Variables Optionnelles** :
- `OPENAI_API_KEY` : Pour les fonctionnalités IA
- `CLOUDINARY_*` : Pour l'upload d'images

### 3. Vérifications Avant Déploiement

✅ **Configuration API** : URLs relatives (`/api`)
✅ **Serveur Backend** : Port dynamique (`process.env.PORT`)
✅ **CORS** : Configuré pour production
✅ **Fallback IA** : Fonctionne sans OpenAI
✅ **Upload Simulation** : Fonctionne sans Cloudinary

## Compatibilité Actuelle

### ✅ **Ce qui fonctionne sans configuration**
- Interface d'ajout de produits
- API REST complète
- Stockage en mémoire (temporaire)
- IA avec fallback local
- Upload d'images (simulation)

### ⚙️ **Ce qui nécessite des variables d'environnement**
- Persistance des données (MongoDB)
- Authentification JWT sécurisée
- IA OpenAI réelle
- Upload d'images réel

## Test de Production

Une fois déployé sur Render, vos URLs seront :
- **Application** : `https://mireb-crm.onrender.com`
- **API Health** : `https://mireb-crm.onrender.com/api/health`
- **Admin** : `https://mireb-crm.onrender.com/admin-add-product.html`

## Logs de Debug

Pour surveiller votre application en production :
1. Aller dans Render Dashboard
2. Sélectionner votre service
3. Onglet "Logs" pour voir les erreurs

## Configuration MongoDB Atlas (Recommandé)

1. Créer un cluster gratuit sur mongodb.com
2. Créer un utilisateur de base de données
3. Whitelist les IPs (0.0.0.0/0 pour Render)
4. Copier l'URI de connexion
5. Ajouter comme variable `MONGODB_URI` sur Render

---

**Votre application est maintenant prête pour le déploiement sur Render !**

Les problèmes "Failed to fetch" ont été corrigés avec :
- URLs relatives pour tous environnements
- Gestion d'erreurs améliorée
- Tests de connexion API automatiques
- Messages d'erreur informatifs
