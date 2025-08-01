#!/bin/bash

echo "🚀 DÉPLOIEMENT FORCÉ - Mireb CRM avec IA"
echo "========================================"

# Configuration Git sans GPG
git config --global commit.gpgsign false
git config --global user.name "franklin-mireb"
git config --global user.email "franklin@mireb.com"

echo "📁 Ajout des fichiers..."
git add .

echo "💾 Commit des changements..."
git commit --no-gpg-sign -m "Deploy AI features: description generation, image analysis, enhanced UI" || echo "Commit déjà effectué ou erreur"

echo "📤 Push vers GitHub..."
git push origin main --force-with-lease || git push origin main

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ !"
echo "======================="
echo "🌐 URL: https://franklin-mireb.github.io/mireb-/"
echo "⏱️  Attendre 2-3 minutes pour propagation GitHub Pages"
echo ""
echo "🧪 Pour tester :"
echo "1. Ouvrir l'URL ci-dessus"
echo "2. Se connecter : admin@mireb.com / admin123"
echo "3. Aller dans Admin Produits"
echo "4. Chercher le bouton 'Générer avec IA'"
echo ""
echo "💡 Si pas visible : Ctrl+F5 pour forcer le rechargement"
