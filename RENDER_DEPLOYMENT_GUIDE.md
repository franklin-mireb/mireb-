# Guide de Déploiement Render - Mireb CRM

## ✅ Problème Résolu

Le problème "répertoire racine 'mireb' manquant" a été corrigé en ajoutant `rootDir: .` dans le fichier `render.yaml`.

## 🔧 Corrections Appliquées

### 1. Configuration Render (`render.yaml`)
```yaml
services:
  - type: web
    name: mireb-crm
    env: node
    plan: free
    branch: main
    rootDir: .              # ← AJOUTÉ: Spécifie que la racine est le répertoire actuel
    buildCommand: "npm install"
    startCommand: "npm start"
    envVars:
      - key: NODE_VERSION
        value: "18.17.1"
```

### 2. Dépendances (`package.json`)
Ajout des dépendances manquantes :
- `multer`: Pour l'upload de fichiers
- `dotenv`: Pour les variables d'environnement

## 🚀 Étapes de Déploiement

### Méthode 1: Auto-déploiement (Recommandé)
1. **Connecter GitHub à Render** :
   - Aller sur [render.com](https://render.com)
   - Se connecter avec GitHub
   - Cliquer "New +" → "Web Service"
   - Sélectionner le repository `mireb-`

2. **Configuration automatique** :
   - Render détectera automatiquement le fichier `render.yaml`
   - Toutes les configurations seront appliquées automatiquement
   - Le déploiement commencera immédiatement

### Méthode 2: Configuration manuelle
Si l'auto-détection ne fonctionne pas :

1. **Paramètres de base** :
   - **Name**: `mireb-crm`
   - **Environment**: `Node`
   - **Region**: `Frankfurt (EU Central)` ou autre
   - **Branch**: `main`
   - **Root Directory**: `.` (point)

2. **Commandes de build** :
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Variables d'environnement** :
   - `NODE_VERSION`: `18.17.1`
   - `NODE_ENV`: `production` (optionnel)

## 🔍 Vérifications Post-Déploiement

### 1. Logs de déploiement
Vérifier que :
- ✅ Le clonage Git réussit
- ✅ `npm install` s'exécute sans erreur
- ✅ Le serveur démarre sur le port assigné par Render

### 2. Endpoints à tester
Une fois déployé, tester :
- `https://your-app.onrender.com/` - Page d'accueil
- `https://your-app.onrender.com/api/health` - Statut API
- `https://your-app.onrender.com/admin-dashboard.html` - Interface admin

### 3. Performance
⚠️ **Note**: Le plan gratuit de Render a une limitation :
- Les services se mettent en veille après 15 minutes d'inactivité
- Premier accès après veille : 30-60 secondes de démarrage

## 🛠️ Scripts de Diagnostic

Exécuter le diagnostic local :
```bash
./render-diagnostic.sh
```

## 🐛 Résolution de Problèmes Courants

### Erreur "Port déjà utilisé"
```javascript
// Le serveur utilise automatiquement le port fourni par Render
const PORT = process.env.PORT || 8080;
```

### Erreur de modules manquants
```bash
# Vérifier package.json et réinstaller
npm install
```

### Erreur de permission CORS
```javascript
// Configuration CORS déjà incluse dans server-unified.js
app.use(cors());
```

## 📊 Monitoring

### Logs en temps réel
```bash
# Via l'interface Render
Dashboard → Your Service → Logs
```

### Métriques
- CPU usage
- Memory usage
- Response time
- Request count

## 🔄 Redéploiement

### Automatique
- Chaque push sur `main` déclenche un redéploiement
- Temps de déploiement : 2-5 minutes

### Manuel
- Via l'interface Render : "Manual Deploy"
- Ou via webhook personnalisé

## 🎯 Optimisations Production

### 1. Variables d'environnement recommandées
```
NODE_ENV=production
PORT=8080 (automatique)
NODE_VERSION=18.17.1
```

### 2. Optimisations performance
- Activer la compression gzip
- Mettre en cache les assets statiques
- Optimiser les images

### 3. Monitoring avancé
- Intégrer des outils comme New Relic ou DataDog
- Configurer des alertes de santé

## ✨ Prochaines Étapes

1. **Tester le déploiement** avec les nouvelles configurations
2. **Vérifier tous les endpoints** de l'API
3. **Configurer un domaine personnalisé** (optionnel)
4. **Mettre en place la surveillance** et les alertes

---

**Date de mise à jour** : 1er août 2025
**Status** : ✅ Prêt pour déploiement
