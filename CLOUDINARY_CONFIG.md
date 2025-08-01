# ⚡ CONFIGURATION CLOUDINARY POUR RENDER

## 🔧 Variables d'environnement à ajouter sur Render

Dans le dashboard Render → Settings → Environment Variables, ajoutez :

```
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key  
CLOUDINARY_API_SECRET=votre-api-secret
```

## 📝 Instructions :

1. **Récupérer vos identifiants Cloudinary :**
   - Aller sur https://cloudinary.com/console
   - Copier les 3 valeurs (Cloud Name, API Key, API Secret)

2. **Les ajouter sur Render :**
   - Dashboard Render → Votre service "mireb-crm"
   - Environment → Add Environment Variable
   - Ajouter les 3 variables une par une

3. **Redéployer :**
   - Render redéploiera automatiquement
   - Les images seront uploadées vers Cloudinary

## ✅ Résultat attendu :
- Images sauvegardées sur Cloudinary
- URLs permanentes pour les images
- Images visibles sur tous les appareils
- Plus de problème de synchronisation
