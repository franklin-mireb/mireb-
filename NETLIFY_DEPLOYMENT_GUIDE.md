# 🚀 Guide de Déploiement Automatique Netlify

## Configuration GitHub → Netlify

### 1. Connexion de votre repository

1. **Allez sur [netlify.com](https://netlify.com)**
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur "New site from Git"**
4. **Sélectionnez "GitHub"** comme provider
5. **Choisissez le repository "franklin-mireb/mireb-"**

### 2. Paramètres de déploiement

Utilisez ces paramètres lors de la configuration :

```
Branch to deploy: main
Build command: (laisser vide)
Publish directory: . (point)
```

### 3. Configuration automatique

✅ **Fichiers déjà configurés dans votre repository :**

- `netlify.toml` : Configuration principale avec redirections et headers
- `_redirects` : Redirections de compatibilité
- Tous les fichiers sont optimisés pour Netlify

### 4. URLs d'accès après déploiement

Une fois connecté, votre CRM sera accessible via :

- **URL principale** : `https://votresite.netlify.app/`
- **URL directe CRM** : `https://votresite.netlify.app/mireb-ai-crm-complete.html`
- **URLs courtes** :
  - `https://votresite.netlify.app/app`
  - `https://votresite.netlify.app/crm`
  - `https://votresite.netlify.app/dashboard`

### 5. Fonctionnalités automatiques

🔄 **Déploiement automatique** : Chaque `git push` vers `main` déclenche un redéploiement

🔒 **Sécurité** : Headers de sécurité configurés automatiquement

⚡ **Performance** : Cache optimisé pour les assets statiques

🌐 **CDN Global** : Distribution mondiale automatique

### 6. Commandes pour futures mises à jour

Pour déployer des modifications :

```bash
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
```

Le site se mettra à jour automatiquement en 1-2 minutes.

### 7. Personnalisation du domaine (optionnel)

Dans Netlify, vous pouvez :
- Configurer un nom de domaine personnalisé
- Activer les formulaires Netlify
- Configurer des variables d'environnement
- Mettre en place des fonctions serverless

## 🎯 Résultat

Votre CRM Mireb est maintenant configuré pour un déploiement automatique professionnel avec toutes les optimisations modernes !

---

**Repository** : https://github.com/franklin-mireb/mireb-
**Site actuel** : https://mireb.netlify.app/
**Configuration** : Optimisée et prête pour la production
