#!/bin/bash

echo "🔍 VÉRIFICATION DÉPLOIEMENT EN PRODUCTION"
echo "========================================="
echo ""

URL="https://franklin-mireb.github.io/mireb-/"

echo "🌐 Test URL: $URL"
echo ""

echo "📊 Vérification éléments IA..."

# Test 1: Vérifier la présence du bouton IA
if curl -s "$URL" | grep -q "Générer avec IA"; then
    echo "✅ Bouton 'Générer avec IA' détecté"
else
    echo "❌ Bouton 'Générer avec IA' non trouvé"
fi

# Test 2: Vérifier la classe AIService
if curl -s "$URL" | grep -q "class AIService"; then
    echo "✅ Classe AIService détectée"
else
    echo "❌ Classe AIService non trouvée"
fi

# Test 3: Vérifier la page de test
TEST_URL="$URL/test-openai-api.html"
if curl -s "$TEST_URL" | head -1 | grep -q "<!DOCTYPE html"; then
    echo "✅ Page de test IA accessible"
else
    echo "❌ Page de test IA non accessible"
fi

echo ""
echo "💡 Instructions :"
echo "=================="
echo "1. Ouvrir $URL"
echo "2. Se connecter : admin@mireb.com / admin123"
echo "3. Aller dans 'Admin Produits'"
echo "4. Chercher les nouveaux éléments :"
echo "   - Champ 'Caractéristiques'"
echo "   - Sélecteur 'Public cible'"
echo "   - Bouton 'Générer avec IA'"
echo "   - Bouton 'Analyser Image'"
echo ""
echo "🔄 Si pas visible : Ctrl+F5 pour forcer le rechargement du cache"
