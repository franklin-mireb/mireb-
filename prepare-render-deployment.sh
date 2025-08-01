#!/bin/bash

echo "🚀 PRÉPARATION RENDER - VÉRIFICATION FINALE"
echo "==========================================="
echo

# 1. Vérifier la structure du projet
echo "1. 📁 Vérification de la structure..."
ERRORS=0

# Vérifier render.yaml
if [ -f "render.yaml" ]; then
    echo "   ✅ render.yaml présent"
    # Vérifier qu'il n'y a pas de rootDir
    if grep -q "rootDir:" render.yaml; then
        echo "   ⚠️  rootDir trouvé dans render.yaml - suppression..."
        sed -i '/rootDir:/d' render.yaml
        echo "   ✅ rootDir supprimé"
    fi
else
    echo "   ❌ render.yaml manquant"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier package.json
if [ -f "package.json" ]; then
    echo "   ✅ package.json présent"
    START_SCRIPT=$(grep -o '"start":[^,]*' package.json | cut -d'"' -f4)
    echo "   📝 Script start: $START_SCRIPT"
else
    echo "   ❌ package.json manquant"
    ERRORS=$((ERRORS + 1))
fi

# Vérifier le serveur backend
if [ -f "backend/server-unified.js" ]; then
    echo "   ✅ backend/server-unified.js présent"
else
    echo "   ❌ backend/server-unified.js manquant"
    ERRORS=$((ERRORS + 1))
fi

echo

# 2. Vérifier la configuration du port
echo "2. 🔌 Vérification de la configuration du port..."
if grep -q "process.env.PORT" backend/server-unified.js; then
    echo "   ✅ Port dynamique configuré (process.env.PORT)"
else
    echo "   ❌ Port dynamique non configuré"
    ERRORS=$((ERRORS + 1))
fi

echo

# 3. Test des dépendances
echo "3. 📦 Vérification des dépendances..."
if [ -f "package.json" ]; then
    echo "   📋 Dépendances principales :"
    node -e "
    const pkg = require('./package.json');
    const deps = pkg.dependencies || {};
    Object.entries(deps).forEach(([name, version]) => {
        console.log('      - ' + name + ': ' + version);
    });
    " 2>/dev/null || echo "   ⚠️  Impossible de lire les dépendances"
fi

echo

# 4. Test de build local
echo "4. 🔨 Test de build local..."
if npm install > /dev/null 2>&1; then
    echo "   ✅ npm install réussi"
else
    echo "   ❌ npm install échoué"
    ERRORS=$((ERRORS + 1))
fi

echo

# 5. État Git
echo "5. 📡 État de synchronisation Git..."
if git status --porcelain | grep -q .; then
    echo "   ⚠️  Fichiers non committés détectés"
    echo "   📝 Fichiers modifiés :"
    git status --porcelain | head -5
    echo "   💡 Exécuter: git add . && git commit -m 'Ready for Render deployment'"
else
    echo "   ✅ Tous les fichiers sont committés"
fi

# Vérifier si on est à jour avec origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "@{u}" 2>/dev/null)
if [ "$LOCAL" = "$REMOTE" ]; then
    echo "   ✅ Synchronisé avec GitHub"
elif [ -z "$REMOTE" ]; then
    echo "   ⚠️  Pas de branche remote configurée"
else
    echo "   ⚠️  Pas à jour avec GitHub - exécuter: git push"
fi

echo

# 6. Résumé final
echo "🎯 RÉSUMÉ FINAL"
echo "==============="
if [ $ERRORS -eq 0 ]; then
    echo "✅ PROJET PRÊT POUR RENDER !"
    echo
    echo "🚀 Prochaines étapes :"
    echo "   1. Aller sur https://dashboard.render.com"
    echo "   2. Créer un nouveau Web Service"
    echo "   3. Connecter le repository : https://github.com/franklin-mireb/mireb-"
    echo "   4. Utiliser la branche : main"
    echo "   5. Laisser Root Directory vide"
    echo "   6. Build Command: npm install"
    echo "   7. Start Command: npm start"
    echo "   8. Déployer !"
    echo
    echo "📱 Votre app sera accessible à :"
    echo "   https://votre-app.onrender.com/mireb-ai-crm-complete.html"
    echo
    echo "✨ Plus d'erreur 'Failed to fetch' - URL stable et publique !"
else
    echo "❌ $ERRORS ERREUR(S) DÉTECTÉE(S)"
    echo
    echo "🔧 Corrigez les erreurs ci-dessus avant de déployer sur Render."
fi

echo
echo "📖 Guide complet : RENDER_DEPLOYMENT_FINAL_GUIDE.md"
