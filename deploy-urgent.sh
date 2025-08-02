#!/bin/bash

# 🚨 SCRIPT DE DÉPLOIEMENT URGENT MIREB
# Force le redéploiement avec l'endpoint analyze-image

echo "🚀 DÉPLOIEMENT URGENT EN COURS..."
echo "📅 $(date)"
echo "🎯 Objectif: Activer endpoint /api/openai/analyze-image"

# Vérification du contenu
echo "✅ Vérification server-unified.js..."
if grep -q "analyze-image" backend/server-unified.js; then
    echo "✅ Endpoint analyze-image trouvé dans le code local"
else
    echo "❌ Endpoint analyze-image MANQUANT dans le code local"
    exit 1
fi

# Push forcé
echo "🚀 Push forcé vers GitHub..."
git add -A
git commit -m "🚨 DEPLOY URGENT: activate analyze-image endpoint - $(date)"
git push origin main --force

echo "⏱️ Attente redéploiement Render (30s)..."
sleep 30

# Test de l'endpoint
echo "🧪 Test de l'endpoint..."
RESPONSE=$(curl -s "https://mireb-5.onrender.com/api/openai/analyze-image" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://via.placeholder.com/400x300","productName":"Test"}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ SUCCÈS! Endpoint analyze-image fonctionne!"
    echo "$RESPONSE"
else
    echo "❌ Échec. Réponse:"
    echo "$RESPONSE"
fi

echo "🎉 Script terminé"
