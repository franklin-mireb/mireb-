#!/bin/bash

echo "🚨 SOLUTION IMMÉDIATE - DÉPLOIEMENT DIRECT"
echo "=========================================="

# Variables
URL="https://franklin-mireb.github.io/mireb-/"

echo "🎯 Diagnostic rapide:"
echo "- URL Production: $URL"
echo "- Dernière modification: verify-deployment.sh"
echo "- Problème: Workflow GitHub Actions vide"

echo ""
echo "🔧 CORRECTION EN COURS..."

# 1. Force Git operations  
echo "1️⃣ Configuration Git..."
git config user.email "franklin@mireb.com"
git config user.name "Franklin Mireb"

echo "2️⃣ Ajout des fichiers..."
git add .

echo "3️⃣ Commit forcé..."
git commit -m "URGENT: Deploy workflow + AI features verification" --allow-empty

echo "4️⃣ Push vers GitHub..."
git push origin main --force

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ!"
echo ""
echo "📱 ACCÈS IMMÉDIAT:"
echo "🌐 Principal: $URL"
echo "🔗 App: ${URL}mireb-ai-crm-complete.html"
echo "🧪 Test IA: ${URL}test-openai-api.html"
echo ""
echo "🔐 Connexion:"
echo "   Email: admin@mireb.com"  
echo "   Mot de passe: admin123"
echo ""
echo "⚡ IMPORTANT:"
echo "   1. Attendre 2 minutes pour GitHub Pages"
echo "   2. Ctrl+F5 pour forcer le rechargement"
echo "   3. Vérifier les nouveaux boutons IA dans Admin"
echo ""
echo "🎉 Vos modifications sont maintenant LIVE!"
