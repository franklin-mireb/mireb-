#!/bin/bash

echo "🚀 Guide Déploiement Vercel - Mireb CRM"
echo "======================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}📋 PRÉREQUIS (vérifiez d'abord):${NC}"
echo "✅ Variables GitHub configurées"
echo "✅ Compte MongoDB Atlas (gratuit)"
echo "✅ Clé OpenAI API"

echo ""
echo -e "${BLUE}🛠  ÉTAPE 1: Installation Vercel CLI${NC}"
echo "npm install -g vercel"

echo ""
echo -e "${BLUE}🔑 ÉTAPE 2: Connexion à Vercel${NC}"
echo "vercel login"
echo "# Suivez les instructions pour vous connecter"

echo ""
echo -e "${BLUE}📦 ÉTAPE 3: Préparation du projet${NC}"
echo "# Copier le package.json pour Vercel"
echo "cp package-vercel.json package.json"

echo ""
echo -e "${BLUE}🚀 ÉTAPE 4: Déploiement${NC}"
echo "vercel --prod"
echo "# Répondez aux questions:"
echo "#   - Project name: mireb-api"
echo "#   - Directory: ./"
echo "#   - Build command: [laisser vide]"
echo "#   - Output directory: [laisser vide]"

echo ""
echo -e "${BLUE}⚙️  ÉTAPE 5: Configuration Variables Vercel${NC}"
echo "# Aller sur: https://vercel.com/dashboard"
echo "# Sélectionner votre projet 'mireb-api'"
echo "# Aller dans Settings > Environment Variables"
echo "# Ajouter:"

echo ""
echo -e "${GREEN}Variables à ajouter sur Vercel:${NC}"
echo "MONGODB_URI = votre_connection_string_mongodb"
echo "OPENAI_API_KEY = votre_clé_openai"
echo "JWT_SECRET = mireb_jwt_secret_2025_franklin_secure_congo_drc"
echo "NODE_ENV = production"

echo ""
echo -e "${BLUE}🔄 ÉTAPE 6: Redéploiement après variables${NC}"
echo "vercel --prod"
echo "# Pour appliquer les nouvelles variables"

echo ""
echo -e "${BLUE}🧪 ÉTAPE 7: Test du backend${NC}"
echo "curl https://mireb-api.vercel.app/api/health"
echo "# Devrait retourner: {\"success\":true,\"message\":\"API Mireb CRM opérationnelle\"}"

echo ""
echo -e "${YELLOW}📍 URLs finales:${NC}"
echo "🌐 Frontend: https://franklin-mireb.github.io/mireb-/"
echo "🔧 Backend: https://mireb-api.vercel.app/api"
echo "⚙️  Admin: https://franklin-mireb.github.io/mireb-/admin-add-product.html"

echo ""
echo -e "${GREEN}🎉 Une fois terminé, votre CRM sera 100% fonctionnel !${NC}"

echo ""
echo -e "${RED}🆘 En cas de problème:${NC}"
echo "1. Vérifier les variables d'environnement sur Vercel"
echo "2. Vérifier la connexion MongoDB"
echo "3. Consulter les logs: vercel logs mireb-api"

echo ""
echo "▶️  Prêt à commencer ? Exécutez les commandes une par une !"
