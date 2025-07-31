# 🚀 Guide de déploiement Vercel - Mireb Commercial

## 📋 Prérequis avant déploiement

### 1. Comptes requis
- [x] **GitHub** (pour héberger le code)
- [x] **Vercel** (pour le déploiement)
- [ ] **OpenAI** (pour l'IA) - [platform.openai.com](https://platform.openai.com)
- [ ] **Cloudinary** (pour les images) - [cloudinary.com](https://cloudinary.com)  
- [ ] **MongoDB Atlas** (pour la base de données) - [cloud.mongodb.com](https://cloud.mongodb.com)

### 2. Clés API à obtenir
```
✅ Projet préparé
⚠️ OPENAI_API_KEY (à configurer)
⚠️ CLOUDINARY credentials (à configurer)
⚠️ MONGODB_URI (à configurer)
```

## 🚀 Étapes de déploiement

### Étape 1: Pousser le code sur GitHub

Si ce n'est pas déjà fait :
```bash
git remote add origin https://github.com/franklin-mireb/mireb-.git
git branch -M main
git push -u origin main
```

### Étape 2: Déployer sur Vercel

#### Option A: Via l'interface Vercel (Recommandé)

1. **Connectez-vous sur [vercel.com](https://vercel.com)**
2. **Cliquez sur "New Project"**
3. **Importez votre repository GitHub "mireb-"**
4. **Configurez le projet :**
   - Framework Preset: `Other`
   - Build Command: (laisser vide)
   - Output Directory: (laisser vide)
   - Install Command: `npm install`

5. **Ajoutez les variables d'environnement :**

| Variable | Valeur | Description |
|----------|--------|-------------|
| `OPENAI_API_KEY` | `sk-proj-...` | Clé API OpenAI |
| `CLOUDINARY_CLOUD_NAME` | `votre-cloud-name` | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | `votre-api-key` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | `votre-api-secret` | Secret API Cloudinary |
| `MONGODB_URI` | `mongodb+srv://...` | URI de connexion MongoDB |

6. **Cliquez sur "Deploy"**

#### Option B: Via Vercel CLI

```bash
# Installation de Vercel CLI
npm install -g vercel

# Connexion à votre compte
vercel login

# Déploiement
vercel

# Configuration des variables d'environnement
vercel env add OPENAI_API_KEY
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add MONGODB_URI

# Redéploiement avec les nouvelles variables
vercel --prod
```

## ⚙️ Configuration post-déploiement

### 1. MongoDB Atlas

1. **Créez un cluster gratuit sur [cloud.mongodb.com](https://cloud.mongodb.com)**
2. **Créez un utilisateur de base de données**
3. **Ajoutez l'IP de Vercel dans la whitelist :**
   - Allez dans "Network Access"
   - Cliquez "Add IP Address"
   - Sélectionnez "Allow Access from Anywhere" (`0.0.0.0/0`)
4. **Récupérez l'URI de connexion**
5. **Mettez à jour la variable `MONGODB_URI` dans Vercel**

### 2. Cloudinary

1. **Créez un compte sur [cloudinary.com](https://cloudinary.com)**
2. **Dans le dashboard, récupérez :**
   - Cloud Name
   - API Key  
   - API Secret
3. **Créez un Upload Preset :**
   - Allez dans "Settings" > "Upload"
   - Cliquez "Add upload preset"
   - Nom : `mireb-upload`
   - Signing Mode : "Unsigned"
   - Sauvegardez
4. **Mettez à jour les variables Cloudinary dans Vercel**

### 3. OpenAI

1. **Créez un compte sur [platform.openai.com](https://platform.openai.com)**
2. **Ajoutez des crédits de facturation**
3. **Créez une clé API :**
   - Allez dans "API Keys"
   - Cliquez "Create new secret key"
   - Copiez la clé (commence par `sk-proj-`)
4. **Mettez à jour `OPENAI_API_KEY` dans Vercel**

## ✅ Vérification du déploiement

### Tests à effectuer :

1. **🏠 Page d'accueil**
   - [ ] Le site se charge correctement
   - [ ] Les produits s'affichent
   - [ ] La recherche fonctionne

2. **🤖 Assistant IA**
   - [ ] Le chat IA répond aux questions
   - [ ] Les recommandations de produits fonctionnent
   - [ ] Pas d'erreurs dans la console

3. **👤 Interface Admin**
   - [ ] Connexion avec `mirebshop@gmail.com` / `Fiacre-19`
   - [ ] Ajout de produits avec upload d'images
   - [ ] Visualisation des analytics
   - [ ] Gestion des leads CRM

4. **☁️ Intégrations**
   - [ ] Upload d'images vers Cloudinary
   - [ ] Sauvegarde dans MongoDB
   - [ ] Génération de descriptions IA

## 🔧 Dépannage

### Erreurs courantes :

**1. "OpenAI API Error"**
```
Solution: Vérifiez que OPENAI_API_KEY est correcte et que vous avez des crédits
```

**2. "Cloudinary Upload Failed"**
```
Solution: Vérifiez le Upload Preset "mireb-upload" en mode "Unsigned"
```

**3. "MongoDB Connection Error"**
```
Solution: Vérifiez l'URI MongoDB et les autorisations IP
```

**4. "Site not loading"**
```
Solution: Vérifiez les logs Vercel dans le dashboard
```

## 📞 Support

- **Support technique** : Créez une issue sur GitHub
- **WhatsApp Business** : +243842267252
- **Email** : mirebshop@gmail.com

## 🎉 Félicitations !

Votre plateforme Mireb Commercial est maintenant déployée sur Vercel ! 

**URL de production :** `https://mireb-franklin-mirebs-projects.vercel.app`

N'oubliez pas de :
- ⭐ Tester toutes les fonctionnalités
- 🔐 Configurer toutes les API keys
- 📊 Vérifier les analytics
- 🚀 Commencer à utiliser votre CRM IA !

---

**Fait avec ❤️ par l'équipe Mireb Commercial**
