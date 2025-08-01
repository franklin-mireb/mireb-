#!/bin/bash

echo "🔍 Test Validation Variables GitHub"
echo "==================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}📊 MÉTHODE DE VÉRIFICATION${NC}"
echo "=========================="

echo ""
echo "🔐 Les variables GitHub secrets ne sont pas lisibles depuis ici"
echo "   (c'est normal pour la sécurité)"

echo ""
echo -e "${YELLOW}💡 COMMENT VÉRIFIER QUE C'EST BON :${NC}"

echo ""
echo "1️⃣ **Sur GitHub** :"
echo "   https://github.com/franklin-mireb/mireb-/settings/secrets/actions"
echo "   Vous devriez voir 3 lignes :"
echo "   - MONGODB_URI"
echo "   - OPENAI_API_KEY"
echo "   - JWT_SECRET"

echo ""
echo "2️⃣ **Test indirect** - Vérifier la config du site :"

# Tester le contenu de l'interface pour voir si elle est bien configurée
SITE_URL="https://franklin-mireb.github.io/mireb-/admin-add-product.html"

echo "   Vérification de la configuration Vercel dans l'interface..."

if curl -s "$SITE_URL" | grep -q "mireb-api.vercel.app"; then
    echo -e "${GREEN}   ✅ Interface configurée pour utiliser les variables Vercel${NC}"
else
    echo -e "${RED}   ❌ Problème de configuration interface${NC}"
fi

echo ""
echo "3️⃣ **Test après déploiement backend** :"
echo "   Une fois Vercel déployé, on pourra tester :"
echo "   curl https://mireb-api.vercel.app/api/health"

echo ""
echo -e "${BLUE}🎯 CHECKLIST VALIDATION${NC}"
echo "======================"

echo ""
echo "✅ À vérifier sur GitHub :"
echo "   □ Variable OPENAI renommée en OPENAI_API_KEY"
echo "   □ Variable JWT_SECRET ajoutée"
echo "   □ Total : 3 variables visibles"

echo ""
echo "✅ À vérifier ensuite :"
echo "   □ Commit vide pour déclencher redéploiement"
echo "   □ Attendre 2-3 minutes"
echo "   □ Déployer backend Vercel"
echo "   □ Tester interface admin complète"

echo ""
echo -e "${GREEN}🚀 PROCHAINES ÉTAPES${NC}"
echo "=================="

echo ""
echo "1. **MAINTENANT** : Corriger variables GitHub (2 min)"
echo "2. **ENSUITE** : Commit vide pour redéploiement"
echo "3. **PUIS** : Déployer backend Vercel"
echo "4. **ENFIN** : Test complet du CRM"

echo ""
echo -e "${YELLOW}📝 Commande pour commit vide après correction :${NC}"
echo "git commit --allow-empty -m '🔧 Variables GitHub corrigées'"
echo "git push origin main"

echo ""
echo -e "${BLUE}🔗 Liens utiles :${NC}"
echo "Variables GitHub: https://github.com/franklin-mireb/mireb-/settings/secrets/actions"
echo "Site déployé: https://franklin-mireb.github.io/mireb-/"
echo "Interface admin: https://franklin-mireb.github.io/mireb-/admin-add-product.html"

echo ""
echo "▶️  Allez corriger les variables maintenant !"
