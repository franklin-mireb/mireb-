# 🔐 Guide Complet : Configuration Variables GitHub

## 📍 **ACTIONS IMMÉDIATES À EFFECTUER**

### 🚀 **1. Accéder aux Variables GitHub**
```
👉 Aller sur: https://github.com/franklin-mireb/mireb-/settings/secrets/actions
```

### 🔧 **2. Corriger la Variable Existante**
```bash
❌ Variable actuelle: OPENAI
✅ Action requise: Renommer en OPENAI_API_KEY

Étapes:
1. Cliquer sur "OPENAI" dans la liste
2. Cliquer "Update" 
3. Changer le nom: OPENAI → OPENAI_API_KEY
4. Garder la même valeur
5. Cliquer "Update secret"
```

### ➕ **3. Ajouter les Variables Manquantes**

#### 🔑 **JWT_SECRET**
```bash
Nom: JWT_SECRET
Valeur: mireb_jwt_secret_2025_franklin_secure_congo_drc
```

#### 🔥 **FIREBASE_SERVICE_ACCOUNT**
```bash
Nom: FIREBASE_SERVICE_ACCOUNT
Valeur: {
  "type": "service_account",
  "project_id": "mireb-crm-firebase",
  "private_key_id": "votre_key_id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nvotre_private_key\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@mireb-crm-firebase.iam.gserviceaccount.com",
  "client_id": "votre_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}

📝 Note: Vous devez créer un projet Firebase si pas encore fait
```

#### 🪣 **FIREBASE_STORAGE_BUCKET**
```bash
Nom: FIREBASE_STORAGE_BUCKET
Valeur: mireb-crm-firebase.appspot.com
```

## 📋 **Résumé Final des Variables**
```bash
✅ MONGODB_URI (déjà configuré)
✅ OPENAI_API_KEY (renommé depuis OPENAI)
✅ JWT_SECRET (nouveau)
✅ FIREBASE_SERVICE_ACCOUNT (nouveau)
✅ FIREBASE_STORAGE_BUCKET (nouveau)
```

## 🆘 **Si vous n'avez pas Firebase**
```bash
Option temporaire: Laisser vides FIREBASE_SERVICE_ACCOUNT et FIREBASE_STORAGE_BUCKET
Le système utilisera la simulation d'upload en attendant
```

## ✅ **Vérification des Variables**
Après ajout, vous devriez voir 5 variables dans:
`GitHub > Settings > Secrets and variables > Actions > Repository secrets`

## 🚀 **Prochaine Étape : Déploiement Vercel**
Une fois les variables GitHub configurées, nous déploierons le backend Vercel !

---
⚡ **URGENT**: Configurez ces variables MAINTENANT pendant que GitHub Pages se déploie !
