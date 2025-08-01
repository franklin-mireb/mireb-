#!/bin/bash

echo "🎯 ÉTAPES POUR CRÉER VOTRE REPOSITORY GITHUB"
echo "==========================================="
echo ""

echo "📋 1. CRÉER LE REPOSITORY SUR GITHUB WEB"
echo "   🌐 Allez sur : https://github.com/new"
echo "   📝 Nom du repository : mireb-crm"
echo "   📖 Description : CRM Mireb - Système de gestion commerciale avec authentification"
echo "   🔓 Visibilité : Public (pour GitHub Pages gratuit)"
echo "   ❌ NE PAS cocher 'Initialize with README'"
echo "   ✅ Cliquez sur 'Create repository'"
echo ""

echo "📋 2. COMMANDS À EXÉCUTER APRÈS CRÉATION"
echo "   📂 Dans ce terminal, copiez-collez ces commandes :"
echo ""
echo "   # Supprimer l'ancien remote si nécessaire"
echo "   git remote remove origin"
echo ""
echo "   # Ajouter le nouveau remote"
echo "   git remote add origin https://github.com/franklin-mireb/mireb-crm.git"
echo ""
echo "   # Pousser le code"
echo "   git push -u origin main"
echo ""

echo "📋 3. ACTIVER GITHUB PAGES"
echo "   🌐 Allez dans votre repository sur GitHub"
echo "   ⚙️  Cliquez sur 'Settings' (onglet en haut)"
echo "   📄 Dans le menu gauche, cliquez sur 'Pages'"
echo "   🌳 Source : 'Deploy from a branch'"
echo "   🌿 Branch : 'main' + '/ (root)'"
echo "   💾 Cliquez 'Save'"
echo ""

echo "📋 4. ACCÈS À VOTRE SITE"
echo "   ⏱️  Attendez 2-5 minutes"
echo "   🌐 Votre site sera disponible à :"
echo "   https://franklin-mireb.github.io/mireb-crm/"
echo ""

echo "🎉 RÉSULTAT FINAL"
echo "   ✅ CRM accessible en ligne"
echo "   ✅ Tests multi-navigateurs possibles"
echo "   ✅ Demo avec authentification fonctionnelle"
echo "   ✅ Interface complète et responsive"
echo ""

echo "📞 En cas de problème :"
echo "   📧 Vérifiez les permissions du repository"
echo "   🔄 Attendez quelques minutes pour l'activation"
echo "   🛠️  Consultez GitHub Pages dans Settings"

# Créer un fichier avec les commandes pour copier-coller facilement
cat > /tmp/github-commands.txt << 'EOF'
# Commandes à exécuter après création du repository GitHub

# Supprimer l'ancien remote
git remote remove origin

# Ajouter le nouveau remote
git remote add origin https://github.com/franklin-mireb/mireb-crm.git

# Pousser le code
git push -u origin main
EOF

echo ""
echo "💡 Les commandes ont été sauvées dans /tmp/github-commands.txt"
echo "   Vous pouvez les copier depuis ce fichier"
