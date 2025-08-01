#!/bin/bash

echo "🔍 Vérification Variables GitHub - Mireb CRM"
echo "==========================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}📋 LISTE DES VARIABLES REQUISES${NC}"
echo "==============================="

echo ""
echo -e "${YELLOW}Variables GitHub Actions requises:${NC}"
echo "1. ✅ MONGODB_URI (déjà configuré selon vos infos)"
echo "2. ❌ OPENAI_API_KEY (actuellement nommé 'OPENAI')"
echo "3. ❌ JWT_SECRET (manquant)"
echo "4. ❌ FIREBASE_SERVICE_ACCOUNT (optionnel)"
echo "5. ❌ FIREBASE_STORAGE_BUCKET (optionnel)"

echo ""
echo -e "${BLUE}🔗 LIENS DIRECTS${NC}"
echo "==============="
echo "📍 Variables GitHub: https://github.com/franklin-mireb/mireb-/settings/secrets/actions"
echo "📍 Variables Actions: https://github.com/franklin-mireb/mireb-/settings/variables/actions"

echo ""
echo -e "${BLUE}⚠️  PROBLÈMES IDENTIFIÉS${NC}"
echo "======================="

echo ""
echo -e "${RED}❌ Variable mal nommée:${NC}"
echo "   Actuel: OPENAI"
echo "   Requis: OPENAI_API_KEY"
echo -e "${YELLOW}   Action: Renommer la variable existante${NC}"

echo ""
echo -e "${RED}❌ Variables manquantes:${NC}"
echo "   JWT_SECRET"
echo -e "${YELLOW}   Action: Ajouter cette variable${NC}"

echo ""
echo -e "${BLUE}✅ ACTIONS CORRECTIVES${NC}"
echo "===================="

echo ""
echo -e "${GREEN}🔧 Étape 1: Renommer OPENAI${NC}"
echo "1. Aller sur: https://github.com/franklin-mireb/mireb-/settings/secrets/actions"
echo "2. Cliquer sur 'OPENAI' dans la liste"
echo "3. Cliquer 'Update'"
echo "4. Changer le nom: OPENAI → OPENAI_API_KEY"
echo "5. Cliquer 'Update secret'"

echo ""
echo -e "${GREEN}➕ Étape 2: Ajouter JWT_SECRET${NC}"
echo "1. Sur la même page, cliquer 'New repository secret'"
echo "2. Name: JWT_SECRET"
echo "3. Secret: mireb_jwt_secret_2025_franklin_secure_congo_drc"
echo "4. Cliquer 'Add secret'"

echo ""
echo -e "${BLUE}🔍 VÉRIFICATION POST-CORRECTION${NC}"
echo "============================="

echo ""
echo "Après correction, vous devriez avoir:"
echo -e "${GREEN}✅ MONGODB_URI${NC}"
echo -e "${GREEN}✅ OPENAI_API_KEY${NC} (renommé depuis OPENAI)"
echo -e "${GREEN}✅ JWT_SECRET${NC} (nouveau)"

echo ""
echo -e "${YELLOW}📝 Variables optionnelles (pour plus tard):${NC}"
echo "• FIREBASE_SERVICE_ACCOUNT"
echo "• FIREBASE_STORAGE_BUCKET"

echo ""
echo -e "${BLUE}🧪 TEST APRÈS CORRECTION${NC}"
echo "======================="

echo "Une fois les variables corrigées:"
echo "1. Commit un petit changement pour déclencher un redéploiement"
echo "2. Attendre 2-3 minutes"
echo "3. Tester l'interface admin"

echo ""
echo -e "${GREEN}🎯 OBJECTIF: 5 variables total (3 essentielles + 2 optionnelles)${NC}"

echo ""
echo "▶️  Prêt ? Ouvrez le lien GitHub et suivez les étapes !"
echo "   🔗 https://github.com/franklin-mireb/mireb-/settings/secrets/actions"

# Test si on peut accéder aux informations du repo (limité dans ce contexte)
echo ""
echo -e "${BLUE}🔍 Vérification automatique...${NC}"

# Simuler une vérification (dans un vrai environnement GitHub Actions, on pourrait checker)
echo "❓ Pour vérifier les variables actuelles:"
echo "   Aller manuellement sur GitHub > Settings > Secrets and variables > Actions"

echo ""
echo -e "${RED}⚠️  IMPORTANT: Variables sensibles non visibles ici pour sécurité${NC}"
echo "   Seuls vous et GitHub peuvent voir les valeurs"
