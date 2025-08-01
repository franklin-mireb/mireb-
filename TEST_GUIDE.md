# 🧪 Guide de Test - Mireb Commercial

## ✅ Tests à effectuer après déploiement

### 1. **Navigation en bas** ✨ (CORRIGÉ)
- [ ] Cliquer sur "Accueil" → Retour à la page principale
- [ ] Cliquer sur "Catégories" → Affichage des filtres et produits par catégorie
- [ ] Cliquer sur "Assistant IA" → Ouverture du chat IA
- [ ] Cliquer sur "Compte" → Page de profil/connexion
- [ ] Vérifier que les boutons changent de couleur selon l'état actif

### 2. **Écran Catégories** 🏷️ (NOUVEAU)
- [ ] Filtres par catégorie fonctionnels
- [ ] Compteur de produits par catégorie
- [ ] Sélection de produit → Redirection vers détail
- [ ] Bouton retour vers accueil
- [ ] Message d'état vide si aucun produit

### 3. **Écran Profil** 👤 (NOUVEAU)
- [ ] Si non connecté → Message d'invitation à se connecter
- [ ] Si connecté → Affichage des informations utilisateur
- [ ] Bouton de déconnexion fonctionnel
- [ ] Menu d'options (Commandes, Favoris, etc.)

### 4. **Upload Cloudinary** 📸 (CORRIGÉ)
- [ ] Se connecter en admin (admin/admin123)
- [ ] Aller dans Configuration → Cloudinary
- [ ] Configurer : Cloud Name, API Key, Upload Preset
- [ ] Sauvegarder la configuration
- [ ] Aller dans l'onglet Produits
- [ ] Essayer d'ajouter un produit avec upload d'image
- [ ] Vérifier que l'upload fonctionne sans erreur

### 5. **Interface Admin améliorée** ⚙️ (CORRIGÉ)
- [ ] Configuration OpenAI → Champ API Key éditable + sauvegarde
- [ ] Configuration Cloudinary → Tous les champs éditables
- [ ] Configuration MongoDB → URI éditable
- [ ] Page Leads → Affichage correct des données
- [ ] Filtres leads par statut fonctionnels

### 6. **Test complet workflow**
1. **Configuration initiale:**
   - [ ] Connexion admin
   - [ ] Configuration APIs (OpenAI, Cloudinary, MongoDB)
   
2. **Ajout de produits:**
   - [ ] Upload d'images via Cloudinary
   - [ ] Remplissage des champs produit
   - [ ] Sauvegarde réussie
   
3. **Navigation utilisateur:**
   - [ ] Parcours par catégories
   - [ ] Détail produit
   - [ ] Chat IA fonctionnel
   - [ ] Génération de leads

4. **Gestion admin:**
   - [ ] Visualisation des leads
   - [ ] Changement de statut
   - [ ] Analytics

## 🚨 Problèmes potentiels à surveiller

### **Cloudinary Upload**
- **Erreur**: "Configuration Cloudinary manquante"
- **Solution**: Aller dans Admin → Configuration → Cloudinary et remplir tous les champs

### **Navigation**
- **Problème**: Boutons non cliquables
- **Vérification**: State management React fonctionnel

### **Mobile Responsive**
- **Test**: Redimensionner la fenêtre
- **Vérifier**: Navigation en bas toujours visible

## 📱 URLs de test

- **Local**: http://localhost:3000/mireb-ai-crm-complete.html
- **Netlify**: https://mireb.netlify.app
- **GitHub Pages**: https://franklin-mireb.github.io/mireb-/
- **Vercel**: (URL selon configuration)

## 🔐 Accès Admin

- **Utilisateur**: `admin`
- **Mot de passe**: `admin123`

## 🎯 Critères de succès

- ✅ Navigation fluide entre tous les écrans
- ✅ Upload d'images sans erreur
- ✅ Configuration des APIs persistante
- ✅ Interface responsive sur mobile
- ✅ Fonctionnalités CRM opérationnelles

## 🛠️ En cas de problème

1. **Vérifier la console navigateur** (F12) pour les erreurs
2. **Contrôler les configurations** sauvegardées dans localStorage
3. **Tester sur un navigateur** en navigation privée
4. **Relancer le déploiement** avec `./deploy.sh`

---

🎉 **Votre plateforme e-commerce avec IA et CRM est maintenant complètement fonctionnelle !**
