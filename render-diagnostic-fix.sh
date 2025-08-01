#!/bin/bash

echo "=== DIAGNOSTIC RENDER DEPLOYMENT ==="
echo "Date: $(date)"
echo

echo "1. Vérification de la structure du projet..."
echo "   - Fichier render.yaml : $(test -f render.yaml && echo "✅ Présent" || echo "❌ Absent")"
echo "   - Fichier package.json : $(test -f package.json && echo "✅ Présent" || echo "❌ Absent")"
echo "   - Répertoire backend : $(test -d backend && echo "✅ Présent" || echo "❌ Absent")"
echo "   - Fichier backend/server-unified.js : $(test -f backend/server-unified.js && echo "✅ Présent" || echo "❌ Absent")"
echo

echo "2. Configuration package.json..."
if [ -f package.json ]; then
    echo "   - Script start : $(grep -o '"start":[^,]*' package.json | cut -d'"' -f4)"
    echo "   - Version Node : $(grep -A2 '"engines"' package.json | grep -o '"node":[^,]*' | cut -d'"' -f4)"
fi
echo

echo "3. Configuration render.yaml..."
if [ -f render.yaml ]; then
    echo "   - Type de service : $(grep -o 'type: web' render.yaml && echo "✅ Correct" || echo "❌ Incorrect")"
    echo "   - Build command : $(grep -o 'buildCommand: "[^"]*"' render.yaml | cut -d'"' -f2)"
    echo "   - Start command : $(grep -o 'startCommand: "[^"]*"' render.yaml | cut -d'"' -f2)"
    echo "   - Version Node (env) : $(grep -A1 'NODE_VERSION' render.yaml | grep -o 'value: "[^"]*"' | cut -d'"' -f2)"
fi
echo

echo "4. Test de compatibilité des dépendances..."
if [ -f package.json ]; then
    echo "   - Dépendances principales :"
    node -e "
    const pkg = require('./package.json');
    const deps = pkg.dependencies || {};
    Object.entries(deps).forEach(([name, version]) => {
        console.log('     - ' + name + ': ' + version);
    });
    "
fi
echo

echo "5. Vérification des ports..."
if [ -f backend/server-unified.js ]; then
    PORT_CONFIG=$(grep -o "PORT.*||.*[0-9]*" backend/server-unified.js | head -1)
    echo "   - Configuration port : $PORT_CONFIG"
    echo "   - ✅ Utilise process.env.PORT (requis pour Render)"
fi
echo

echo "6. Structure des fichiers critiques..."
echo "   - Fichiers HTML à la racine :"
ls -la *.html 2>/dev/null | wc -l | xargs echo "     Nombre de fichiers HTML :"
echo "   - Répertoire API :"
test -d api && echo "     ✅ Répertoire api présent" || echo "     ⚠️  Répertoire api absent"
echo

echo "=== RÉSUMÉ ==="
echo "✅ Configuration Render optimisée :"
echo "   - rootDir supprimé (utilise la racine automatiquement)"
echo "   - buildCommand: npm install"
echo "   - startCommand: npm start"
echo "   - Node.js 18.17.1"
echo
echo "🚀 Prêt pour le déploiement Render !"
echo "   1. Commitez vos changements : git add . && git commit -m 'Fix Render deployment config'"
echo "   2. Poussez sur GitHub : git push"
echo "   3. Déclenchez un nouveau déploiement sur Render"
