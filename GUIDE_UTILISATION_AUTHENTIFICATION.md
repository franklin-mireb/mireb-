# 🔐 Guide d'Utilisation - Mireb CRM Authentifié

## ✅ SYSTÈME OPÉRATIONNEL

Votre Mireb CRM est maintenant **entièrement fonctionnel** avec authentification !

### 🚀 Démarrage Rapide

1. **Lancer le serveur** :
   ```bash
   cd /workspaces/mireb-
   node backend/server-unified.js
   ```

2. **Accéder au système** :
   - Page d'accueil : http://localhost:8080
   - Page de connexion : http://localhost:8080/login.html
   - Interface admin : http://localhost:8080/admin-add-product.html

### 🔑 Identifiants d'Administration

- **Email** : `mirebshop@gmail.com`
- **Mot de passe** : `Fiacre-19`

### 📋 Fonctionnalités Disponibles

#### ✅ Authentification Sécurisée
- Connexion avec identifiants
- Vérification de token automatique
- Déconnexion sécurisée
- Redirection automatique si non authentifié

#### ✅ Gestion des Produits
- Ajout de nouveaux produits
- Upload d'images
- Génération automatique de descriptions avec IA
- Optimisation des tags avec IA
- Gestion des stocks et prix

#### ✅ API Complète
- Authentification : `/api/auth/login`, `/api/auth/verify`, `/api/auth/logout`
- Produits : `/api/produits` (GET, POST)
- Upload : `/api/upload/single`
- IA : `/api/openai/generate-description`, `/api/openai/optimize-tags`

### 🔄 Flux d'Utilisation

1. **Première visite** → Page d'accueil (index.html)
2. **Clic sur "Accès Admin"** → Redirection vers login.html
3. **Saisie des identifiants** → Connexion automatique
4. **Accès à l'interface admin** → Gestion complète des produits

### 🛡️ Sécurité

- Tokens d'authentification uniques
- Vérification automatique sur chaque page
- Déconnexion automatique en cas de token invalide
- Sessions gérées côté serveur

### 📊 Statut du Système

✅ Backend unifié opérationnel sur port 8080
✅ Frontend avec authentification complète
✅ API d'authentification fonctionnelle
✅ Interface admin sécurisée
✅ Gestion des produits avec IA
✅ Upload d'images fonctionnel

### 🎯 Version Actuelle : PRODUCTION

Le système est maintenant **prêt pour utilisation réelle** avec :
- Authentification complète
- Interface utilisateur polie
- Fonctionnalités IA intégrées
- Gestion sécurisée des données

**La demo est devenue votre système réel !** 🚀
