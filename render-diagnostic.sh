#!/bin/bash

echo "=== DIAGNOSTIC RENDER POUR MIREB CRM ==="
echo "Date: $(date)"
echo

echo "1. Vérification de la structure du projet..."
echo "✓ Répertoire racine: $(pwd)"
echo "✓ Fichiers principaux:"
ls -la | grep -E "(package\.json|render\.yaml|index\.html)"

echo
echo "2. Vérification du fichier render.yaml..."
if [ -f "render.yaml" ]; then
    echo "✓ render.yaml existe"
    echo "Contenu:"
    cat render.yaml
else
    echo "❌ render.yaml manquant"
fi

echo
echo "3. Vérification du package.json..."
if [ -f "package.json" ]; then
    echo "✓ package.json existe"
    echo "Script de démarrage:"
    grep -A 5 '"scripts"' package.json
    echo
    echo "Dépendances:"
    grep -A 10 '"dependencies"' package.json
else
    echo "❌ package.json manquant"
fi

echo
echo "4. Vérification du serveur backend..."
if [ -f "backend/server-unified.js" ]; then
    echo "✓ backend/server-unified.js existe"
    echo "Port configuré:"
    grep -n "PORT" backend/server-unified.js | head -3
else
    echo "❌ backend/server-unified.js manquant"
fi

echo
echo "5. Vérification des routes..."
if [ -d "backend/routes" ]; then
    echo "✓ Répertoire routes existe"
    echo "Routes disponibles:"
    ls -la backend/routes/ | grep "\.js$"
else
    echo "❌ Répertoire routes manquant"
fi

echo
echo "6. Test de syntaxe Node.js..."
if command -v node &> /dev/null; then
    echo "✓ Node.js disponible: $(node --version)"
    # Test de syntaxe sans exécution
    if [ -f "backend/server-unified.js" ]; then
        node --check backend/server-unified.js 2>/dev/null && echo "✓ Syntaxe server-unified.js valide" || echo "❌ Erreur de syntaxe dans server-unified.js"
    fi
else
    echo "❌ Node.js non disponible"
fi

echo
echo "7. Variables d'environnement recommandées pour Render..."
echo "   PORT=8080 (automatique)"
echo "   NODE_VERSION=18.17.1 (configuré dans render.yaml)"
echo "   NODE_ENV=production (recommandé)"

echo
echo "=== FIN DU DIAGNOSTIC ==="
echo "Si tous les ✓ sont verts, votre projet est prêt pour Render !"
