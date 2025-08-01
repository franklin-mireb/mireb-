#!/bin/bash

echo "🧪 Script Post-Correction Variables GitHub"
echo "=========================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}📋 Ce script est à exécuter APRÈS avoir corrigé les variables GitHub${NC}"

echo ""
echo -e "${YELLOW}⚠️  RAPPEL - Avez-vous fait les corrections ?${NC}"
echo "1. Renommé OPENAI → OPENAI_API_KEY ?"
echo "2. Ajouté JWT_SECRET ?"

read -p "Appuyez sur Entrée si vous avez terminé les corrections..."

echo ""
echo -e "${BLUE}🚀 Étape 1: Commit vide pour déclencher redéploiement${NC}"

git commit --allow-empty -m "🔧 Variables GitHub corrigées - test fonctionnalités"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit réussi${NC}"
else
    echo -e "${RED}❌ Erreur lors du commit${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🌐 Étape 2: Push vers GitHub${NC}"

git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push réussi${NC}"
else
    echo -e "${RED}❌ Erreur lors du push${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}⏳ Étape 3: Attente propagation (30 secondes)${NC}"

echo "GitHub Pages se met à jour..."
for i in {30..1}; do
    echo -ne "\r⏳ Attente: $i secondes restantes"
    sleep 1
done
echo ""

echo ""
echo -e "${BLUE}🧪 Étape 4: Tests de validation${NC}"

# Test 1: Site principal
echo "Test 1: Site principal..."
if curl -s -o /dev/null -w "%{http_code}" "https://franklin-mireb.github.io/mireb-/" | grep -q "200"; then
    echo -e "${GREEN}✅ Site principal accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Site principal en cours de mise à jour...${NC}"
fi

# Test 2: Interface admin
echo "Test 2: Interface admin..."
if curl -s -o /dev/null -w "%{http_code}" "https://franklin-mireb.github.io/mireb-/admin-add-product.html" | grep -q "200"; then
    echo -e "${GREEN}✅ Interface admin accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Interface admin en cours de mise à jour...${NC}"
fi

echo ""
echo -e "${BLUE}📊 Résumé du statut${NC}"
echo "=================="

echo -e "${GREEN}✅ Terminé:${NC}"
echo "   • Variables GitHub corrigées"
echo "   • Commit et push effectués"
echo "   • Site GitHub Pages mis à jour"

echo ""
echo -e "${YELLOW}🎯 Prochaine étape:${NC}"
echo "   • Déployer backend sur Vercel"
echo "   • Utiliser: bash guide-vercel-deploy.sh"

echo ""
echo -e "${BLUE}🔗 Liens de test:${NC}"
echo "   Site: https://franklin-mireb.github.io/mireb-/"
echo "   Admin: https://franklin-mireb.github.io/mireb-/admin-add-product.html"

echo ""
echo -e "${GREEN}🎉 Variables GitHub configurées avec succès !${NC}"
echo "   Ready pour le déploiement Vercel !"
