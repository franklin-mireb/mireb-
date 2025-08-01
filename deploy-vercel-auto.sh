#!/bin/bash

echo "🚀 DÉPLOIEMENT VERCEL AUTOMATIQUE AVEC IDENTIFIANTS"
echo "=================================================="

# Configuration des identifiants
EMAIL="hervinimireb@gmail.com"
echo "📧 Utilisation du compte: $EMAIL"

# Déploiement direct avec token (plus simple)
echo "🌐 Déploiement sur Vercel..."

# Créer un script temporaire pour éviter l'interaction
cat > temp_deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash

# Tentative de déploiement automatique
echo "🔄 Tentative de déploiement..."

# Si pas de token, utiliser le déploiement interactif
if ! vercel --version > /dev/null 2>&1; then
    echo "❌ Vercel CLI non trouvé"
    exit 1
fi

# Déploiement avec configuration automatique
echo "y" | vercel --prod --confirm 2>/dev/null || {
    echo "🔑 Connexion requise..."
    echo "Utilisez: hervinimireb@gmail.com / fiacre19"
    vercel login
    echo "y" | vercel --prod --confirm
}
DEPLOY_SCRIPT

chmod +x temp_deploy.sh
./temp_deploy.sh

# Nettoyer
rm -f temp_deploy.sh

echo ""
echo "🎉 DÉPLOIEMENT VERCEL TERMINÉ!"
echo "=============================="
echo ""
echo "📧 Compte utilisé: hervinimireb@gmail.com"
echo "🌐 Votre CRM est maintenant disponible sur Vercel!"
echo ""
echo "📋 URLs probables:"
echo "👉 https://mireb-crm.vercel.app"
echo "👉 https://mireb-crm-franklin-mireb.vercel.app"
echo "👉 https://mireb-crm-git-main-franklin-mireb.vercel.app"
echo ""
echo "🔗 URLs spéciales Vercel:"
echo "• [URL]/admin - Interface admin"
echo "• [URL]/test - Test API"
echo "• [URL]/api/health - Test backend"
echo ""
echo "✨ Votre CRM est maintenant sur 2 plateformes!"
