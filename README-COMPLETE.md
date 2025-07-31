# 🚀 Mireb CRM - Application Full Stack avec IA

Application CRM commerciale moderne avec intelligence artificielle, développée pour Mireb Commercial.

## ✨ Fonctionnalités Principales

### 🎯 CRM & Gestion des Leads
- **Gestion complète des prospects** avec pipeline de vente
- **Suivi des interactions** client automatisé
- **Analytics en temps réel** avec tableaux de bord
- **Notifications** push et email automatisées

### 🤖 Intelligence Artificielle
- **Chatbot intelligent** avec OpenAI GPT
- **Recommandations de produits** personnalisées
- **Génération automatique** de descriptions marketing
- **Analyse prédictive** des ventes

### 💬 Communication Temps Réel
- **Chat WebSocket** pour support client instantané
- **Notifications push** en temps réel
- **Système de messagerie** intégré
- **Indicateurs de frappe** et statuts de connexion

### 📱 Application Web Progressive (PWA)
- **Installation sur mobile** et desktop
- **Mode hors-ligne** avec synchronisation automatique
- **Notifications push** natives
- **Cache intelligent** pour performance optimale

## 🏗️ Architecture Technique

### Backend (Node.js + Express)
```
backend/
├── server.js              # Serveur principal Express
├── models/                # Modèles MongoDB (Mongoose)
│   ├── Client.js
│   ├── Lead.js
│   └── Produit.js
├── routes/                # Routes API REST
│   ├── auth.js           # Authentification JWT
│   ├── clients.js        # Gestion clients
│   ├── leads.js          # Gestion leads/prospects
│   ├── produits.js       # Catalogue produits
│   ├── analytics.js      # Données analytiques
│   ├── chat.js           # Messages & chat
│   ├── upload.js         # Upload fichiers Cloudinary
│   └── openai.js         # API OpenAI
├── middleware/           # Middlewares Express
│   ├── auth.js          # Vérification JWT
│   ├── validation.js    # Validation Joi
│   └── errorHandler.js  # Gestion erreurs
├── utils/               # Utilitaires
│   ├── database.js      # Connexion MongoDB
│   ├── cloudinary.js    # Configuration upload
│   └── email.js         # Service email
└── websocket/           # WebSocket temps réel
    └── chatHandler.js   # Gestion chat temps réel
```

### Frontend (React + PWA)
```
frontend/
├── mireb-ai-crm-complete.html  # Application React complète
├── manifest.json               # Configuration PWA
├── sw.js                      # Service Worker
└── assets/                    # Ressources statiques
```

### Base de Données (MongoDB)
```
Collections:
├── clients        # Données clients/prospects
├── leads          # Pipeline de vente
├── produits       # Catalogue produits
├── messages       # Historique chat
├── analytics      # Données d'analyse
└── sessions       # Sessions utilisateurs
```

## 🚀 Installation & Démarrage

### 1. Prérequis
```bash
# Node.js v18+ et npm
node --version  # v18.0.0+
npm --version   # 8.0.0+

# MongoDB (local ou Atlas)
mongod --version  # 6.0+
```

### 2. Installation
```bash
# Cloner le projet
git clone <repository-url>
cd mireb-crm

# Installer les dépendances
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos configurations
```

### 3. Configuration (.env)
```env
# Serveur
NODE_ENV=development
PORT=5000

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/mireb-crm

# MongoDB Atlas (production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mireb-crm

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (Upload images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenAI (IA)
OPENAI_API_KEY=sk-your-openai-key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

### 4. Démarrage Rapide
```bash
# Méthode 1: Script automatique
./start-mireb.sh

# Méthode 2: Manuel
npm run dev          # Mode développement
npm start           # Mode production
```

### 5. Accès à l'Application
```
Backend API:  http://localhost:5000/api
Frontend:     http://localhost:8080 (serveur web)
WebSocket:    ws://localhost:5000
```

## 📊 API Documentation

### Authentification
```bash
# Inscription
POST /api/auth/register
Content-Type: application/json
{
  "nom": "Nom Utilisateur",
  "email": "user@example.com",
  "password": "motdepasse",
  "role": "user"
}

# Connexion
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "motdepasse"
}

# Vérification token
GET /api/auth/verify
Authorization: Bearer <jwt-token>
```

### Gestion Leads
```bash
# Créer un lead
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json
{
  "nom": "Nom Prospect",
  "email": "prospect@example.com",
  "telephone": "+243123456789",
  "entreprise": "Entreprise SA",
  "source": "website",
  "statut": "nouveau"
}

# Lister les leads
GET /api/leads?page=1&limit=10&statut=nouveau

# Mettre à jour statut
PUT /api/leads/:id/status
{
  "statut": "en_cours"
}

# Pipeline des ventes
GET /api/leads/pipeline
```

### Catalogue Produits
```bash
# Lister produits
GET /api/produits?page=1&limit=20&categorie=Électronique

# Ajouter produit
POST /api/produits
Content-Type: application/json
{
  "nom": "Produit",
  "prix": 299.99,
  "categorie": "Électronique",
  "description": "Description",
  "stock": 50,
  "images": ["url1", "url2"]
}

# Recherche
GET /api/produits/search?q=smartphone
```

### Chat & IA
```bash
# Message chatbot
POST /api/chatbot
{
  "message": "Bonjour, j'ai besoin d'aide",
  "sessionId": "session123"
}

# Recommandations IA
POST /api/openai/recommendations
{
  "query": "smartphone pas cher",
  "products": [...]
}
```

## 🔧 Développement

### Structure des Services Frontend
```javascript
// Services principaux
APIService          // Communication API REST
AuthService         // Authentification JWT
ProductService      // Gestion produits
LeadService         // Gestion leads
AnalyticsService    // Données analytiques
ChatbotService      // IA conversationnelle
CloudinaryService   // Upload images
WebSocketService    // Communication temps réel
```

### Composants React
```javascript
// Composants principaux
App                 // Application principale
ProductCatalog      // Catalogue produits
LeadForm           // Formulaire leads
ChatInterface      // Interface chat
Dashboard          // Tableau de bord
AnalyticsDashboard // Analytics CRM
```

### WebSocket Events
```javascript
// Événements temps réel
'connect'          // Connexion établie
'disconnect'       // Déconnexion
'send_message'     // Envoyer message
'new_message'      // Nouveau message reçu
'typing'           // Indicateur de frappe
'notification'     // Notifications push
```

## 📱 Fonctionnalités PWA

### Installation
- **Auto-prompt** d'installation sur mobile/desktop
- **Icônes adaptatives** pour tous les appareils
- **Splash screen** personnalisé

### Mode Hors-ligne
- **Cache intelligent** des ressources
- **Synchronisation automatique** à la reconnexion
- **Stockage local** des données critiques

### Notifications
- **Push notifications** natives
- **Badge de notification** sur l'icône
- **Actions personnalisées** dans les notifications

## 🎨 Interface Utilisateur

### Design System
- **Tailwind CSS** pour le styling moderne
- **Font Awesome** pour les icônes
- **Design responsive** mobile-first
- **Thème orange/rouge** cohérent Mireb

### Écrans Principaux
1. **Accueil** - Catalogue produits avec recherche
2. **Catégories** - Navigation par catégories
3. **Profil** - Dashboard utilisateur/admin
4. **Chat** - Support client temps réel
5. **CRM** - Gestion des leads (admin)

## 🔒 Sécurité

### Authentification
- **JWT tokens** avec expiration
- **Refresh tokens** automatiques
- **Hachage bcrypt** des mots de passe
- **Validation robuste** des données

### Protection API
- **Rate limiting** contre les abus
- **CORS** configuré strictement
- **Helmet.js** pour sécurité HTTP
- **Validation Joi** sur toutes les entrées

## 📈 Analytics & Monitoring

### Métriques CRM
- **Nombre de leads** par statut
- **Taux de conversion** global
- **Performance par source** de trafic
- **Évolution temporelle** des ventes

### Données Temps Réel
- **Dashboard live** avec WebSockets
- **Notifications** d'événements importants
- **Graphiques interactifs** Chart.js

## 🚧 Production

### Déploiement
```bash
# Build production
npm run build

# Variables d'environnement production
NODE_ENV=production
MONGODB_URI=mongodb+srv://...  # Atlas
JWT_SECRET=complex-secret-key
CLOUDINARY_API_KEY=real-key

# SSL/HTTPS requis pour PWA
# Domaine HTTPS pour notifications push
```

### Serveurs Recommandés
- **Heroku** (facile)
- **Vercel** (frontend)
- **DigitalOcean** (complet)
- **AWS/GCP** (scalable)

### Base de Données
- **MongoDB Atlas** (cloud)
- **Backup automatique** quotidien
- **Monitoring** des performances

## 📞 Support & Contact

**Mireb Commercial**
- 📧 Email: contact@mireb.com
- 📱 WhatsApp: +243842267252
- 🌐 Site: https://mireb.com

---

*Développé avec ❤️ pour Mireb Commercial - Solution CRM moderne avec IA*
