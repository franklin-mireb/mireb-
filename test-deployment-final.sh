#!/bin/bash

echo "🧪 Test de Déploiement Mireb CRM"
echo "================================="

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs à tester
GITHUB_PAGES_URL="https://franklin-mireb.github.io/mireb-"
ADMIN_URL="${GITHUB_PAGES_URL}/admin-add-product.html"

echo ""
echo "📡 Test 1: Disponibilité GitHub Pages"
if curl -s --head "$GITHUB_PAGES_URL" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ GitHub Pages accessible${NC}"
else
    echo -e "${RED}❌ GitHub Pages non accessible${NC}"
fi

echo ""
echo "📱 Test 2: Interface Admin"
if curl -s --head "$ADMIN_URL" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Interface admin accessible${NC}"
else
    echo -e "${RED}❌ Interface admin non accessible${NC}"
fi

echo ""
echo "🔍 Test 3: Contenu de la page admin"
ADMIN_CONTENT=$(curl -s "$ADMIN_URL")
if echo "$ADMIN_CONTENT" | grep -q "mireb-api.vercel.app"; then
    echo -e "${GREEN}✅ Configuration Vercel détectée${NC}"
else
    echo -e "${YELLOW}⚠️  Configuration Vercel non trouvée${NC}"
fi

if echo "$ADMIN_CONTENT" | grep -q "Ajouter un nouveau produit"; then
    echo -e "${GREEN}✅ Interface admin correctement chargée${NC}"
else
    echo -e "${RED}❌ Interface admin incorrecte${NC}"
fi

echo ""
echo "📋 Résumé du Déploiement:"
echo "========================="
echo -e "🌐 Site principal: ${GREEN}$GITHUB_PAGES_URL${NC}"
echo -e "⚙️  Interface admin: ${GREEN}$ADMIN_URL${NC}"
echo -e "🔧 Backend prévu: ${YELLOW}https://mireb-api.vercel.app/api${NC}"

echo ""
echo "📝 Prochaines Étapes:"
echo "1. Corriger les variables GitHub (voir GITHUB_VARIABLES_CORRECTION.md)"
echo "2. Déployer le backend sur Vercel (voir GUIDE_DEPLOIEMENT_FINAL.md)"
echo "3. Tester l'ajout de produits en production"

echo ""
echo "🚀 Pour déployer le backend maintenant:"
echo "   npm i -g vercel && vercel --prod"
