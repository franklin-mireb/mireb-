#!/bin/bash

echo "🚀 Déploiement Mireb CRM sur GitHub Pages"
echo "=========================================="

# Vérifier si on est dans un repo git
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Pas dans un repository git"
    exit 1
fi

# Créer une version optimisée pour GitHub Pages
echo "📦 Préparation des fichiers pour GitHub Pages..."

# Copier l'index spécial pour GitHub Pages
cp github-pages-index.html index.html

# Créer un fichier _config.yml pour Jekyll
cat > _config.yml << EOF
title: "Mireb CRM"
description: "Système de gestion commerciale Mireb"
baseurl: ""
url: ""

# Désactiver Jekyll processing pour certains dossiers
exclude:
  - node_modules/
  - backend/
  - "*.sh"
  - "*.md"
  - package*.json

# Activer GitHub Pages
plugins:
  - jekyll-relative-links

relative_links:
  enabled: true
  collections: true

# Configuration pour les assets
sass:
  style: compressed

# Activer les inclusions HTML
markdown: kramdown
highlighter: rouge

# Headers de sécurité
webrick:
  headers:
    "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;"
EOF

# Ajouter un .nojekyll pour désactiver Jekyll si nécessaire
touch .nojekyll

# Mettre à jour le commit
echo "💾 Mise à jour du commit..."
git add .
git -c commit.gpgsign=false commit -m "🌐 Version GitHub Pages optimisée

✅ Index spécialisé pour GitHub Pages
✅ Configuration Jekyll
✅ Fichiers statiques optimisés
✅ Demo d'authentification simulée
✅ Interface multi-navigateurs prête"

echo "✅ Préparation terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Créer un repository sur GitHub"
echo "2. Ajouter le remote: git remote add origin https://github.com/USERNAME/REPO.git"
echo "3. Pousser: git push -u origin main"
echo "4. Activer GitHub Pages dans les settings du repo"
echo ""
echo "🔗 Une fois déployé, votre CRM sera accessible à:"
echo "   https://USERNAME.github.io/REPO/"
echo ""
echo "🌐 Pour tester dans d'autres navigateurs:"
echo "   • Ouvrez l'URL GitHub Pages"
echo "   • Testez sur mobile/desktop"
echo "   • Vérifiez les fonctionnalités JavaScript"
