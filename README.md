# Mireb Commercial - AI & CRM Enhanced

## 🚀 Plateforme E-commerce avec IA et CRM intégré

Mireb Commercial est une plateforme e-commerce moderne intégrant l'Intelligence Artificielle et un système CRM complet pour optimiser les ventes et la gestion client.

## ✨ Fonctionnalités principales

### 🛍️ E-commerce
- Catalogue produits responsive
- Système de catégories
- Recherche intelligente avec IA
- Gestion du stock en temps réel
- Interface mobile-first

### 🤖 Intelligence Artificielle
- Assistant IA conversationnel (OpenAI GPT)
- Recommandations personnalisées
- Génération automatique de descriptions produits
- Analyse prédictive des ventes

### 📊 CRM Intégré
- Gestion des leads automatisée
- Suivi des conversions
- Analytics en temps réel
- Notifications WhatsApp
- Dashboard administrateur complet

### 🌐 Intégrations
- **MongoDB Atlas** : Base de données cloud
- **Cloudinary** : Gestion d'images optimisée
- **OpenAI** : IA conversationnelle
- **WhatsApp Business** : Communication client

## 🔧 Technologies utilisées

- **Frontend** : React 18, Tailwind CSS
- **Backend** : MongoDB Atlas
- **IA** : OpenAI GPT-3.5-turbo
- **Images** : Cloudinary
- **Déploiement** : Vercel

## 🚀 Test de déploiement
Déclenchement du workflow de déploiement pour vérifier la configuration des secrets.

## 📋 Configuration requise

### Variables d'environnement
```
OPENAI_API_KEY=sk-proj-...
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Comptes requis
1. **OpenAI** : Créer un compte sur openai.com
2. **MongoDB Atlas** : Créer un cluster gratuit
3. **Cloudinary** : Créer un compte gratuit
4. **Vercel** : Pour le déploiement

## 🚀 Déploiement sur Vercel

### 1. Préparation
```bash
# Cloner le repository
git clone https://github.com/franklin-mireb/mireb-
cd mireb-

# Installer les dépendances
npm install
```

### 2. Configuration des variables d'environnement sur Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Importer le projet GitHub
3. Ajouter les variables d'environnement dans Settings > Environment Variables

### 3. Configuration MongoDB
1. Créer un cluster sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Créer une base de données `mireb-commercial`
3. Autoriser l'accès depuis toutes les IP (0.0.0.0/0) pour Vercel

### 4. Configuration Cloudinary
1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Créer un "Upload Preset" nommé `mireb-upload`
3. Le configurer en mode "Unsigned"

### 5. Déploiement automatique
```bash
# Pousser vers GitHub
git add .
git commit -m "Configuration pour production"
git push origin main
```

Vercel déploiera automatiquement à chaque push.

## 👥 Comptes par défaut

### Interface Admin
- **Email** : `mirebshop@gmail.com`
- **Mot de passe** : `Fiacre-19`

## 📱 Fonctionnalités mobiles

- Interface responsive optimisée mobile
- Progressive Web App (PWA) ready
- Notifications push
- Mode hors ligne partiel

## 🔒 Sécurité

- ✅ Variables d'environnement sécurisées
- ✅ Validation côté client et serveur
- ✅ Authentification admin
- ✅ Protection CORS
- ✅ Chiffrement des données sensibles

## 📈 Analytics et reporting

- Tableau de bord analytics en temps réel
- Métriques de conversion
- Suivi des performances produits
- Rapports d'activité

## 🆘 Support et maintenance

- Logs centralisés
- Monitoring des erreurs
- Sauvegarde automatique des données
- Mise à jour automatique des dépendances

## 📞 Contact

**Franklin Mireb**  
- Email: mirebshop@gmail.com
- WhatsApp: +237 XXX XXX XXX

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**🎯 Objectif** : Révolutionner l'e-commerce en Afrique avec l'IA et des outils CRM avancés.