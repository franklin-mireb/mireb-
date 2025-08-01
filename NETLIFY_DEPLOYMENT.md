# 🚀 Guide de déploiement Netlify - Mireb Commercial

## ✅ Modifications terminées

### 🆕 Nouvelles fonctionnalités ajoutées :

1. **Formulaires enrichis avec adresse**
   - Champ "Adresse complète" (obligatoire)
   - Champ "Ville" (obligatoire) 
   - Sauvegarde dans le CRM avec les nouvelles données

2. **Gestion dynamique des catégories**
   - Nouvel onglet "Catégories" dans l'interface admin
   - Ajout/suppression de catégories en temps réel
   - Synchronisation automatique dans tous les formulaires
   - Sauvegarde automatique en localStorage

3. **Interface admin améliorée**
   - Navigation par onglets mise à jour
   - Composant AdminCategories complet
   - Formulaires synchronisés avec les catégories dynamiques

## 🌐 Déploiement sur Netlify

### Option 1: Via l'interface web Netlify (Recommandé)

1. **Connectez-vous sur [netlify.com](https://app.netlify.com/)**

2. **Cliquez sur "New site from Git"**

3. **Connectez votre repository GitHub**
   - Choisissez le repository `mireb-`
   - Branche : `main`

4. **Configuration de build**
   ```
   Build command: (laisser vide)
   Publish directory: .
   ```

5. **Variables d'environnement**
   
   Allez dans Site Settings > Environment Variables et ajoutez :
   
   ```
   OPENAI_API_KEY=sk-proj-votre-clé-openai
   CLOUDINARY_CLOUD_NAME=dwogv9nme
   CLOUDINARY_API_KEY=votre-clé-cloudinary
   CLOUDINARY_API_SECRET=votre-secret-cloudinary
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   ```

6. **Déployez !**
   - Cliquez "Deploy site"
   - Attendez la fin du build
   - Récupérez votre URL Netlify

### Option 2: Via Netlify CLI

```bash
# Installation
npm install -g netlify-cli

# Connexion
netlify login

# Initialisation
netlify init

# Déploiement
netlify deploy --prod
```

## 🔧 Configuration incluse

### Fichier `netlify.toml` (déjà configuré)
```toml
[build]
  publish = "."
  command = "echo 'Static site - no build needed'"

[[redirects]]
  from = "/*"
  to = "/mireb-ai-crm-complete.html"
  status = 200
```

### Fonctionnalités activées :
- ✅ Redirections automatiques vers l'app principale
- ✅ Gestion des routes SPA
- ✅ Headers de sécurité
- ✅ Cache optimisé

## 📋 Post-déploiement

### 1. Configuration des services externes

**MongoDB Atlas**
1. Créez un cluster sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Ajoutez l'IP de Netlify (`0.0.0.0/0` pour simplifier)
3. Mettez à jour `MONGODB_URI` dans Netlify

**Cloudinary**
1. Créez un compte sur [cloudinary.com](https://cloudinary.com)
2. Créez un upload preset "mireb-upload" en mode "Unsigned"
3. Mettez à jour les variables Cloudinary dans Netlify

**OpenAI**
1. Obtenez une clé API sur [platform.openai.com](https://platform.openai.com)
2. Ajoutez des crédits pour l'utilisation
3. Mettez à jour `OPENAI_API_KEY` dans Netlify

### 2. Tests à effectuer

Testez votre site déployé :

1. **Page d'accueil** : Vérifiez le chargement
2. **Formulaires** : Testez avec les nouveaux champs adresse/ville
3. **Interface admin** : 
   - Connexion : `mirebshop@gmail.com` / `Fiacre-19`
   - Testez l'onglet "Catégories"
   - Ajoutez/supprimez des catégories
   - Vérifiez la synchronisation dans les formulaires
4. **Assistant IA** : Testez le chat (si clé OpenAI configurée)

### 3. Vérification avec script

```bash
# Testez votre déploiement
./check-deployment.sh https://votre-site.netlify.app
```

## 🎯 URL finale

Votre site sera accessible sur :
- **URL Netlify** : `https://mireb-commercial-[random].netlify.app`
- **Domaine personnalisé** : Configurable dans Netlify

## 📱 Fonctionnalités disponibles

### Pour les visiteurs :
- 🛍️ Catalogue produits avec catégories dynamiques
- 🤖 Assistant IA (si configuré)
- 📝 Formulaires de contact enrichis (nom, téléphone, adresse, ville, message)
- 📱 Interface mobile responsive
- 💬 Intégration WhatsApp Business

### Pour l'administrateur :
- 👤 Connexion admin sécurisée
- 📦 Gestion produits (CRUD)
- 🏷️ **Gestion catégories dynamique (NOUVEAU)**
- 👥 Gestion leads CRM avec données d'adresse
- 📊 Analytics temps réel
- 🤖 Outils IA
- ☁️ Gestion images Cloudinary
- 💾 Monitoring MongoDB

## 🆘 Support

- **Documentation** : [docs.netlify.com](https://docs.netlify.com)
- **Support Mireb** : WhatsApp +243842267252
- **Email** : mirebshop@gmail.com

---

## ✅ RÉSUMÉ DES MODIFICATIONS

✅ **Formulaires enrichis** : Ajout champs adresse complète + ville  
✅ **Catégories dynamiques** : CRUD complet dans l'admin  
✅ **Synchronisation** : Catégories sync dans tous les formulaires  
✅ **Interface admin** : Nouvel onglet "Catégories"  
✅ **Configuration Netlify** : Prête pour déploiement  

**🚀 Votre plateforme e-commerce Mireb Commercial est maintenant prête pour la production avec toutes les fonctionnalités demandées !**
