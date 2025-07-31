# 🔧 Configuration GitHub Pages - Guide de Dépannage

## ❌ Problème: URL affiche 404

**Symptôme:** https://franklin-mireb.github.io/mireb-/ affiche une erreur 404

## 🛠️ Solutions à essayer

### **1. Vérifier l'activation de GitHub Pages**

1. **Aller sur GitHub.com:**
   - https://github.com/franklin-mireb/mireb-

2. **Onglet Settings:**
   - Cliquer sur "Settings" dans le menu du repository

3. **Section Pages:**
   - Faire défiler jusqu'à "Pages" dans le menu de gauche
   - Vérifier que "Source" est configuré sur "Deploy from a branch"
   - Vérifier que "Branch" est sur "main" ou "main / (root)"

4. **Sauvegarder si nécessaire:**
   - Cliquer "Save" si des modifications sont faites

### **2. Attendre la propagation**

- ⏱️ **Temps habituel:** 5-10 minutes après le push
- 🔄 **Vérification:** https://github.com/franklin-mireb/mireb-/actions
- ✅ **Status:** Vérifier que le workflow "Deploy to GitHub Pages" est vert

### **3. URLs alternatives qui fonctionnent**

Pendant que GitHub Pages se configure, utilisez :

#### **🌟 Netlify (Actif):**
```
https://mireb.netlify.app
```

#### **💻 Local (Développement):**
```bash
cd /workspaces/mireb-
python3 -m http.server 3000
# Puis: http://localhost:3000/mireb-ai-crm-complete.html
```

### **4. Test de l'application locale**

```bash
# Dans le terminal
cd /workspaces/mireb-
python3 -m http.server 8000

# Puis ouvrir:
# http://localhost:8000/
# http://localhost:8000/mireb-ai-crm-complete.html
```

### **5. Vérification des fichiers**

GitHub Pages cherche dans l'ordre :
1. `index.html` ✅ (Existe - redirection automatique)
2. `README.md` ✅ (Existe)
3. Listage des fichiers (si activé)

## 📋 Checklist de vérification

- [ ] Repository est public
- [ ] GitHub Pages activé dans Settings
- [ ] Branch "main" sélectionnée
- [ ] Fichier `index.html` présent
- [ ] Workflow GitHub Actions réussi
- [ ] Attendre 5-10 minutes après activation

## 🎯 URLs définitives

Une fois GitHub Pages configuré :

### **🏠 Page d'accueil (redirection automatique):**
```
https://franklin-mireb.github.io/mireb-/
```

### **📱 Application directe:**
```
https://franklin-mireb.github.io/mireb-/mireb-ai-crm-complete.html
```

### **🧪 Tests:**
```
https://franklin-mireb.github.io/mireb-/test-categories.html
```

## 🆘 Si le problème persiste

1. **Vérifier les paramètres du repository:**
   - Repository doit être public
   - GitHub Pages activé dans Settings > Pages

2. **Forcer un nouveau déploiement:**
   ```bash
   git commit --allow-empty -m "Force redeploy"
   git push origin main
   ```

3. **Utiliser Netlify en attendant:**
   - https://mireb.netlify.app (déjà configuré et fonctionnel)

## ✅ Confirmation de réussite

GitHub Pages fonctionne quand :
- ✅ https://franklin-mireb.github.io/mireb-/ charge sans erreur 404
- ✅ Redirection automatique vers l'application
- ✅ Interface complète accessible

---

**🔗 Liens utiles:**
- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [Actions du repository](https://github.com/franklin-mireb/mireb-/actions)
- [Settings Pages](https://github.com/franklin-mireb/mireb-/settings/pages)
