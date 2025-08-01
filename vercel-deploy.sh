#!/bin/bash

echo "🚀 DÉPLOIEMENT VERCEL SIMPLIFIÉ"
echo "==============================="
echo ""
echo "📧 Vos identifiants:"
echo "Email: hervinimireb@gmail.com"
echo "Password: fiacre19"
echo ""
echo "🎯 Commandes à exécuter:"
echo ""
echo "1️⃣  vercel login"
echo "    (Utilisez vos identifiants ci-dessus)"
echo ""
echo "2️⃣  vercel --prod"
echo "    (Répondez 'y' aux questions)"
echo ""
echo "3️⃣  vercel ls"
echo "    (Affiche l'URL de votre site)"
echo ""

# Essai automatique si possible
echo "🔄 Tentative automatique..."
if vercel whoami > /dev/null 2>&1; then
    echo "✅ Déjà connecté!"
    echo "🚀 Déploiement en cours..."
    vercel --prod --yes
    echo ""
    echo "🌐 URLs de votre projet:"
    vercel ls
else
    echo "⚠️  Connexion manuelle requise"
    echo ""
    echo "💻 Exécutez manuellement:"
    echo "vercel login && vercel --prod && vercel ls"
fi

echo ""
echo "🎉 Une fois déployé, votre CRM sera accessible avec backend complet!"
