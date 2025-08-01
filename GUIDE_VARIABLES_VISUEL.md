# 🔐 GUIDE VISUEL - Correction Variables GitHub

## 🎯 **ACTIONS IMMÉDIATES REQUISES**

### 📍 **LIEN DIRECT :**
👉 **https://github.com/franklin-mireb/mireb-/settings/secrets/actions**

---

## 🔧 **ÉTAPE 1 : Renommer Variable Existante**

### ❌ **Problème Identifié :**
```bash
Variable actuelle : OPENAI
Variable requise  : OPENAI_API_KEY
```

### ✅ **Solution :**
1. **Cliquer** sur `OPENAI` dans la liste des secrets
2. **Cliquer** le bouton `Update`
3. **Changer** le nom : `OPENAI` → `OPENAI_API_KEY`
4. **Garder** la même valeur (votre clé OpenAI)
5. **Cliquer** `Update secret`

---

## ➕ **ÉTAPE 2 : Ajouter Variable Manquante**

### 📝 **Nouvelle Variable :**
```bash
Name    : JWT_SECRET
Value   : mireb_jwt_secret_2025_franklin_secure_congo_drc
```

### ✅ **Solution :**
1. **Cliquer** `New repository secret`
2. **Name** : Taper `JWT_SECRET`
3. **Secret** : Taper `mireb_jwt_secret_2025_franklin_secure_congo_drc`
4. **Cliquer** `Add secret`

---

## 📋 **RÉSULTAT ATTENDU**

Après correction, vous devriez voir **3 variables** :

```bash
✅ MONGODB_URI         (déjà existant)
✅ OPENAI_API_KEY      (renommé)
✅ JWT_SECRET          (nouveau)
```

---

## 🧪 **TEST DE VÉRIFICATION**

Une fois terminé :

1. **Faire un petit commit** pour déclencher redéploiement :
   ```bash
   git commit --allow-empty -m "🔧 Variables GitHub corrigées"
   git push origin main
   ```

2. **Attendre 2-3 minutes** pour propagation

3. **Tester interface admin** : https://franklin-mireb.github.io/mireb-/admin-add-product.html

---

## 🆘 **AIDE VISUELLE**

### 🖼 **À quoi ça ressemble sur GitHub :**

```
Repository secrets
==================
🔐 MONGODB_URI         ••••••••••••
🔐 OPENAI_API_KEY      ••••••••••••  ← (renommé depuis OPENAI)
🔐 JWT_SECRET          ••••••••••••  ← (nouveau)

[New repository secret] ← Bouton pour ajouter
```

---

## ⚡ **RÉCAPITULATIF ULTRA-RAPIDE**

1. 🌐 **Aller** : https://github.com/franklin-mireb/mireb-/settings/secrets/actions
2. 🔧 **Renommer** : `OPENAI` → `OPENAI_API_KEY`
3. ➕ **Ajouter** : `JWT_SECRET` = `mireb_jwt_secret_2025_franklin_secure_congo_drc`
4. ✅ **Résultat** : 3 variables configurées

---

## 🎉 **APRÈS CORRECTION**

Votre CRM sera **100% opérationnel** avec :
- ✅ Frontend GitHub Pages
- ✅ Variables d'environnement correctes
- ✅ Prêt pour backend Vercel

**Temps estimé : 2 minutes maximum !**
