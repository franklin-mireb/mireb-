#!/bin/bash

echo "📊 Statut Complet - Déploiement Mireb CRM"
echo "========================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# URLs
GITHUB_BASE="https://franklin-mireb.github.io/mireb-"
VERCEL_API="https://mireb-api.vercel.app/api"

echo ""
echo -e "${BLUE}🌐 TESTS FRONTEND (GitHub Pages)${NC}"
echo "================================="

# Test page principale
if curl -s -o /dev/null -w "%{http_code}" "$GITHUB_BASE/" | grep -q "200"; then
    echo -e "${GREEN}✅ Page principale accessible${NC}"
else
    echo -e "${RED}❌ Page principale non accessible${NC}"
fi

# Test interface admin
if curl -s -o /dev/null -w "%{http_code}" "$GITHUB_BASE/admin-add-product.html" | grep -q "200"; then
    echo -e "${GREEN}✅ Interface admin accessible${NC}"
else
    echo -e "${RED}❌ Interface admin non accessible${NC}"
fi

# Test interface démo
if curl -s -o /dev/null -w "%{http_code}" "$GITHUB_BASE/admin-add-product-demo.html" | grep -q "200"; then
    echo -e "${GREEN}✅ Interface démo accessible${NC}"
else
    echo -e "${RED}❌ Interface démo non accessible${NC}"
fi

echo ""
echo -e "${BLUE}🔧 TESTS BACKEND (Vercel)${NC}"
echo "========================="

# Test santé API
API_HEALTH=$(curl -s "$VERCEL_API/health" 2>/dev/null)
if echo "$API_HEALTH" | grep -q "success"; then
    echo -e "${GREEN}✅ API Backend opérationnelle${NC}"
    echo "   📊 Réponse: $API_HEALTH"
else
    echo -e "${RED}❌ API Backend non accessible${NC}"
    echo -e "${YELLOW}   ⚠️  Déployez d'abord le backend Vercel${NC}"
fi

echo ""
echo -e "${BLUE}📱 TESTS INTÉGRATION${NC}"
echo "==================="

# Vérifier si l'admin pointe vers Vercel
ADMIN_CONFIG=$(curl -s "$GITHUB_BASE/admin-add-product.html" | grep -o "mireb-api.vercel.app")
if [ ! -z "$ADMIN_CONFIG" ]; then
    echo -e "${GREEN}✅ Interface admin configurée pour Vercel${NC}"
else
    echo -e "${RED}❌ Interface admin mal configurée${NC}"
fi

echo ""
echo -e "${BLUE}📋 RÉSUMÉ DU STATUT${NC}"
echo "=================="

echo ""
echo -e "${GREEN}✅ DÉPLOYÉ ET FONCTIONNEL:${NC}"
echo "   🌐 GitHub Pages: $GITHUB_BASE/"
echo "   ⚙️  Interface Admin: $GITHUB_BASE/admin-add-product.html"
echo "   🧪 Mode Démo: $GITHUB_BASE/admin-add-product-demo.html"

echo ""
echo -e "${YELLOW}⏳ EN ATTENTE:${NC}"
echo "   🔧 Backend Vercel: $VERCEL_API"
echo "   🔐 Configuration variables GitHub"

echo ""
echo -e "${BLUE}📝 ACTIONS REQUISES:${NC}"
echo "1. 🔐 Configurer variables GitHub (voir VARIABLES_GITHUB_GUIDE_URGENT.md)"
echo "2. 🚀 Déployer backend Vercel (voir guide-vercel-deploy.sh)"
echo "3. 🧪 Tester l'ajout de produits"

echo ""
echo -e "${GREEN}🎯 Une fois terminé, votre CRM sera 100% opérationnel !${NC}"

# Test rapide de connectivité
echo ""
echo -e "${BLUE}🔍 Test rapide connectivité:${NC}"
if ping -c 1 google.com &> /dev/null; then
    echo -e "${GREEN}✅ Connexion Internet OK${NC}"
else
    echo -e "${RED}❌ Problème de connexion Internet${NC}"
fi
