# GUIDE DÉPLOIEMENT RENDER - SOLUTION FIXÉE

## 🎯 PROBLÈME RÉSOLU

**Erreur précédente :** `Le répertoire racine du service « /opt/render/project/src/mireb- » est manquant.`

**Solution appliquée :** Suppression de `rootDir: .` du fichier `render.yaml`

## 📁 CONFIGURATION RENDER OPTIMISÉE

### render.yaml (corrigé)
```yaml
services:
  - type: web
    name: mireb-crm
    env: node
    plan: free
    branch: main
    buildCommand: "npm install"
    startCommand: "npm start"
    envVars:
      - key: NODE_VERSION
        value: "18.17.1"
```

### ✅ Points clés de la correction :
- **rootDir supprimé** : Render utilise automatiquement la racine du repository
- **buildCommand** : `npm install` - installe les dépendances
- **startCommand** : `npm start` - lance `node backend/server-unified.js`
- **Node.js** : Version 18.17.1 spécifiée

## 🚀 ÉTAPES DE DÉPLOIEMENT

### 1. Commiter les changements
```bash
git add render.yaml
git commit -m "Fix Render deployment: remove problematic rootDir config"
```

### 2. Pousser sur GitHub
```bash
git push origin main
```

### 3. Déclencher le déploiement sur Render
1. Aller sur votre dashboard Render
2. Sélectionner votre service `mireb-crm`
3. Cliquer sur "Manual Deploy" ou attendre le déploiement automatique

## 🔍 VÉRIFICATIONS POST-DÉPLOIEMENT

### URLs à tester après déploiement :
- **Frontend** : `https://votre-app.onrender.com/`
- **API Status** : `https://votre-app.onrender.com/api/status`
- **API Produits** : `https://votre-app.onrender.com/api/produits`
- **Admin Dashboard** : `https://votre-app.onrender.com/admin-dashboard.html`

### Commandes de test :
```bash
# Test de santé de l'API
curl https://votre-app.onrender.com/api/status

# Test de l'endpoint produits
curl https://votre-app.onrender.com/api/produits
```

## 📋 STRUCTURE DU PROJET

```
mireb-/
├── render.yaml          ← Configuration corrigée
├── package.json         ← Scripts et dépendances
├── backend/
│   ├── server-unified.js ← Serveur principal
│   └── routes/
├── api/                 ← Endpoints API
├── *.html              ← Pages frontend
└── public/             ← Assets statiques
```

## 🔧 CONFIGURATION TECHNIQUE

### Variables d'environnement Render :
- `NODE_VERSION=18.17.1`
- `PORT` (automatique par Render)

### Ports et serveur :
- **Port** : Utilise `process.env.PORT` (requis par Render)
- **Fallback** : Port 8080 en développement
- **Serveur** : Express.js avec CORS activé

## 🚨 DÉPANNAGE

### Si le déploiement échoue encore :
1. **Vérifier les logs Render** : Dashboard → Service → Logs
2. **Vérifier package.json** : S'assurer que `"start": "node backend/server-unified.js"`
3. **Vérifier les dépendances** : Toutes listées dans `package.json`

### Logs utiles à surveiller :
```
==> Cloning from https://github.com/franklin-mireb/mireb-
==> Using Node version 18.17.1
==> Running build command 'npm install'
==> Running start command 'npm start'
Server running on port XXXX
```

## 📞 SUPPORT

Si vous rencontrez encore des problèmes :
1. Vérifiez que le commit est bien poussé sur GitHub
2. Consultez les logs détaillés sur le dashboard Render
3. Assurez-vous que la branche `main` est bien sélectionnée

**✅ DÉPLOIEMENT PRÊT - Configuration optimisée pour Render !**
