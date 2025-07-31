#!/bin/bash

# 🔍 Script de vérification post-déploiement Mireb Commercial
# Usage: ./check-deployment.sh [URL_DU_SITE]

echo "🚀 Vérification du déploiement Mireb Commercial"
echo "================================================"

URL=${1:-"https://mireb-commercial.vercel.app"}
echo "🌐 URL à vérifier: $URL"
echo ""

# Fonction pour vérifier HTTP status
check_http() {
    local url=$1
    local name=$2
    local status=$(curl -o /dev/null -s -w "%{http_code}" "$url")
    
    if [ "$status" -eq 200 ]; then
        echo "✅ $name: OK (HTTP $status)"
    else
        echo "❌ $name: ERREUR (HTTP $status)"
    fi
}

# Fonction pour vérifier le contenu
check_content() {
    local url=$1
    local search=$2
    local name=$3
    
    if curl -s "$url" | grep -q "$search"; then
        echo "✅ $name: Contenu trouvé"
    else
        echo "❌ $name: Contenu manquant"
    fi
}

echo "📄 Tests des pages principales:"
echo "--------------------------------"

# Test page d'accueil
check_http "$URL" "Page d'accueil"
check_content "$URL" "Mireb Commercial" "Titre du site"
check_content "$URL" "React" "Framework React"

# Test page principale
check_http "$URL/mireb-ai-crm-complete.html" "Application principale"
check_content "$URL/mireb-ai-crm-complete.html" "Assistant IA" "Assistant IA"
check_content "$URL/mireb-ai-crm-complete.html" "CRM" "Fonctionnalités CRM"

echo ""
echo "🔧 Tests des fonctionnalités:"
echo "------------------------------"

# Vérifier les dépendances JavaScript
check_content "$URL/mireb-ai-crm-complete.html" "react.development.js" "React JS"
check_content "$URL/mireb-ai-crm-complete.html" "tailwindcss.com" "Tailwind CSS"
check_content "$URL/mireb-ai-crm-complete.html" "font-awesome" "Font Awesome"

# Vérifier les composants principaux
check_content "$URL/mireb-ai-crm-complete.html" "OpenAIService" "Service OpenAI"
check_content "$URL/mireb-ai-crm-complete.html" "CloudinaryService" "Service Cloudinary"
check_content "$URL/mireb-ai-crm-complete.html" "MongoDBService" "Service MongoDB"
check_content "$URL/mireb-ai-crm-complete.html" "CRMService" "Service CRM"

echo ""
echo "⚙️ Vérification des configurations:"
echo "------------------------------------"

# Vérifier que les API keys ne sont pas exposées
if curl -s "$URL/mireb-ai-crm-complete.html" | grep -q "sk-proj-"; then
    echo "⚠️  ATTENTION: Clé OpenAI potentiellement exposée"
else
    echo "✅ Sécurité: Pas de clé API exposée"
fi

if curl -s "$URL/mireb-ai-crm-complete.html" | grep -q "mongodb+srv://.*:.*@"; then
    echo "⚠️  ATTENTION: URI MongoDB potentiellement exposée"
else
    echo "✅ Sécurité: URI MongoDB sécurisée"
fi

echo ""
echo "📱 Tests responsive:"
echo "--------------------"

# Tester différentes tailles d'écran (simulation)
check_content "$URL/mireb-ai-crm-complete.html" "md:grid-cols" "Classes responsive"
check_content "$URL/mireb-ai-crm-complete.html" "mobile-first" "Design mobile-first"

echo ""
echo "🎯 Tests des métadonnées:"
echo "--------------------------"

check_content "$URL" "<title>" "Balise title"
check_content "$URL" "description" "Meta description"
check_content "$URL" "viewport" "Meta viewport"

echo ""
echo "📊 Résumé des tests"
echo "===================="

# Compter les succès/échecs
success_count=$(check_http "$URL" "Test" 2>/dev/null | grep -c "✅" || echo "0")
total_tests=15

echo "Tests réussis: $success_count/$total_tests"

if [ "$success_count" -ge 12 ]; then
    echo "🎉 DÉPLOIEMENT RÉUSSI ! Votre site est opérationnel."
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Configurez vos API keys dans Vercel"
    echo "2. Testez l'assistant IA"
    echo "3. Vérifiez l'interface admin"
    echo "4. Configurez MongoDB et Cloudinary"
elif [ "$success_count" -ge 8 ]; then
    echo "⚠️  DÉPLOIEMENT PARTIEL. Quelques problèmes à corriger."
else
    echo "❌ PROBLÈMES DÉTECTÉS. Vérifiez la configuration."
fi

echo ""
echo "🔗 Liens utiles:"
echo "• Site principal: $URL"
echo "• Interface admin: $URL/mireb-ai-crm-complete.html"
echo "• Dashboard Vercel: https://vercel.com/dashboard"
echo "• Support: WhatsApp +243842267252"
echo ""
echo "Fait avec ❤️  par l'équipe Mireb Commercial"
