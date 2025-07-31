#!/bin/bash

echo "🚀 Script de déploiement automatique Mireb Commercial"
echo "====================================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "mireb-ai-crm-complete.html" ]; then
    echo "❌ Erreur: Fichier principal non trouvé!"
    echo "Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

echo "✅ Fichiers du projet trouvés"

# Fonction de déploiement automatique
auto_deploy() {
    echo ""
    echo "🔄 Déploiement automatique en cours..."
    
    # 1. Ajouter tous les fichiers modifiés
    echo "📁 Ajout des fichiers modifiés..."
    git add .
    
    # 2. Commit avec timestamp
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    echo "💾 Commit des modifications..."
    git commit -m "Auto-deploy: Mise à jour du $TIMESTAMP - Nouvelles fonctionnalités: formulaires enrichis, marketing, catégories dynamiques"
    
    # 3. Push vers GitHub (trigger auto-deploy Netlify)
    echo "🚀 Push vers GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Déploiement automatique terminé !"
        echo ""
        echo "🌐 Votre site sera automatiquement mis à jour sur:"
        echo "   - Netlify: https://mireb-commercial.netlify.app"
        echo "   - GitHub: https://franklin-mireb.github.io/mireb-"
        echo ""
        echo "⏱️  Délai de mise à jour: 2-5 minutes"
        echo ""
        echo "🔍 Vérifications recommandées après déploiement:"
        echo "   1. Tester les nouveaux champs adresse/ville"
        echo "   2. Vérifier l'onglet Marketing dans l'admin"
        echo "   3. Tester les catégories dynamiques"
        echo "   4. Valider la navigation mise à jour"
    else
        echo "❌ Erreur lors du push Git"
        exit 1
    fi
}

# Menu de déploiement
echo ""
echo "🌐 Options de déploiement:"
echo "1. Déploiement automatique (Recommandé)"
echo "2. Netlify manuel"
echo "3. GitHub Pages"
echo "4. Tests locaux seulement"
echo ""

read -p "Choisissez une option (1-4): " choice

case $choice in
    1)
        echo "🚀 Déploiement automatique sélectionné"
        auto_deploy
        ;;
    2)
        echo "📋 Déploiement Netlify manuel:"
        echo "1. Aller sur https://app.netlify.com/"
        echo "2. Glisser-déposer le dossier du projet"
        echo "3. Ou connecter le repository GitHub"
        ;;
    3)
        echo "📋 GitHub Pages:"
        echo "1. Push vos modifications: git push origin main"
        echo "2. Aller dans Settings > Pages sur GitHub"
        echo "3. Sélectionner la branche main"
        ;;
    4)
        echo "🔍 Tests locaux activés"
        echo "Ouvrez mireb-ai-crm-complete.html dans votre navigateur"
        ;;
    *)
        echo "❌ Option invalide"
        exit 1
        ;;
esac
echo "4. Tous les plateformes"

read -p "Choisir une option (1-4): " choice

case $choice in
    1)
        echo "🌟 Déploiement sur Netlify..."
        netlify deploy --prod --dir .
        ;;
    2)
        echo "🐙 Push vers GitHub (déploiement automatique)..."
        git add .
        git commit -m "📱 Mise à jour: Navigation + Upload Cloudinary + Corrections"
        git push origin main
        echo "✅ GitHub Pages se mettra à jour automatiquement"
        ;;
    3)
        echo "▲ Déploiement sur Vercel..."
        vercel --prod
        ;;
    4)
        echo "🚀 Déploiement sur toutes les plateformes..."
        
        echo "📱 1/3 - Push vers GitHub..."
        git add .
        git commit -m "🚀 Déploiement complet: $(date)"
        git push origin main
        
        echo "🌟 2/3 - Déploiement Netlify..."
        netlify deploy --prod --dir .
        
        echo "▲ 3/3 - Déploiement Vercel..."
        vercel --prod
        
        echo "✅ Déploiement terminé sur toutes les plateformes!"
        ;;
    *)
        echo "❌ Option invalide"
        exit 1
        ;;
esac

echo ""
echo "🎉 Déploiement terminé!"
echo ""
echo "📋 URLs de votre application:"
echo "• Netlify: https://mireb.netlify.app"
echo "• GitHub Pages: https://franklin-mireb.github.io/mireb-/"
echo "• Vercel: Vérifiez votre tableau de bord Vercel"
echo ""
echo "🔧 Pour configurer l'application:"
echo "1. Connectez-vous en tant qu'admin (admin/admin123)"
echo "2. Configurez vos APIs dans l'onglet Configuration"
echo "3. Ajoutez vos produits"
echo ""
echo "✨ Votre plateforme e-commerce avec IA est maintenant live!"
