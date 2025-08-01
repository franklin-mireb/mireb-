#!/bin/bash

echo "🔍 DIAGNOSTIC & DÉPLOIEMENT AUTOMATIQUE"
echo "======================================"
echo ""

# Variables
REPO_URL="https://franklin-mireb.github.io/mireb-/"
CURRENT_DIR="/workspaces/mireb-"

echo "📂 Répertoire: $CURRENT_DIR"
echo "🌐 URL Production: $REPO_URL"
echo ""

# 1. Diagnostic des dernières modifications
echo "📊 DIAGNOSTIC DES MODIFICATIONS"
echo "--------------------------------"

# Vérifier les fichiers modifiés
echo "📁 Fichiers modifiés récemment:"
find . -type f -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.md" | head -10

echo ""
echo "📝 Derniers commits:"
git log --oneline -3

echo ""
echo "🔄 État Git:"
git status --porcelain

echo ""

# 2. Préparation du déploiement
echo "🚀 PRÉPARATION DÉPLOIEMENT"
echo "-------------------------"

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers..."
git add .

# Créer commit avec timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Deploy: Mise à jour automatique $TIMESTAMP - Diagnostic et corrections"

echo "💾 Commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Push vers GitHub
echo "🚀 Push vers GitHub..."
git push origin main

echo ""

# 3. Vérification post-déploiement
echo "✅ VÉRIFICATION DÉPLOIEMENT"
echo "---------------------------"

echo "⏰ Attente du déploiement GitHub Pages (30 secondes)..."
sleep 30

echo "🌐 Test de l'URL principale..."
if curl -s -o /dev/null -w "%{http_code}" "$REPO_URL" | grep -q "200"; then
    echo "✅ URL principale accessible"
else
    echo "❌ URL principale non accessible"
fi

echo ""
echo "🧪 Test des fonctionnalités IA..."
TEST_URL="$REPO_URL/test-openai-api.html"
if curl -s "$TEST_URL" | grep -q "OpenAI"; then
    echo "✅ Page test IA détectée"
else
    echo "❌ Page test IA non trouvée"
fi

echo ""
echo "📱 ACCÈS À L'APPLICATION"
echo "========================"
echo "🌐 URL Principal: $REPO_URL"
echo "🔗 Application: ${REPO_URL}mireb-ai-crm-complete.html"
echo "🧪 Test IA: ${REPO_URL}test-openai-api.html"
echo ""
echo "🔐 Identifiants Admin:"
echo "   Email: admin@mireb.com"
echo "   Mot de passe: admin123"
echo ""
echo "💡 Si les nouvelles fonctionnalités ne sont pas visibles:"
echo "   1. Attendre 1-2 minutes pour la propagation"
echo "   2. Faire Ctrl+F5 pour recharger le cache"
echo "   3. Vérifier dans les outils développeur (F12)"
echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ!"
