# 🚀 GUIDE SIMPLE VERCEL - 3 ÉTAPES

## 📧 Vos identifiants Vercel
- **Email**: hervinimireb@gmail.com  
- **Mot de passe**: fiacre19

## 🎯 3 COMMANDES SIMPLES

### Étape 1: Connexion
```bash
vercel login
```
*Entrez: hervinimireb@gmail.com puis suivez les instructions*

### Étape 2: Déploiement
```bash
vercel --prod
```
*Répondez "Yes" (y) aux questions*

### Étape 3: Récupérer l'URL
```bash
vercel ls
```
*Affiche l'URL de votre projet*

## 🌐 URLs Attendues

Après déploiement, votre CRM sera accessible sur :
- **Production**: https://mireb-crm-xxxx.vercel.app
- **Interface Admin**: https://mireb-crm-xxxx.vercel.app/admin
- **Test API**: https://mireb-crm-xxxx.vercel.app/test
- **Health Check**: https://mireb-crm-xxxx.vercel.app/api/health

## ⚡ SCRIPT TOUT-EN-UN

```bash
# Copier-coller ces 3 lignes :
vercel login
vercel --prod
vercel ls
```

## 🎉 RÉSULTAT FINAL

Une fois déployé, vous aurez votre CRM sur **2 plateformes** :

1. **GitHub Pages**: https://franklin-mireb.github.io/mireb-/mireb-ai-crm-complete.html
2. **Vercel**: https://mireb-crm-xxxx.vercel.app/admin

### 💡 Avantage Vercel
- ✅ Backend API fonctionnel (pas besoin de serveur local)
- ✅ Ajout de produits sans "Failed to fetch"
- ✅ Base de données persistante
- ✅ URLs courtes (/admin, /test)

## 🏃‍♂️ QUICK START
```bash
vercel login && vercel --prod && vercel ls
```

*C'est tout ! En 2 minutes votre CRM sera en ligne avec backend complet.*
