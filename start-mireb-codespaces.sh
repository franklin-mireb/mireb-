#!/bin/bash

echo "🚀 MIREB CRM - DÉMARRAGE GITHUB CODESPACES"
echo "=========================================="
echo

# Vérifier si le serveur est déjà en cours d'exécution
if lsof -i :8080 > /dev/null 2>&1; then
    echo "⚠️  Le serveur est déjà en cours d'exécution sur le port 8080"
    echo
    echo "📱 URLs d'accès :"
    echo "   • CRM Complet  : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/mireb-ai-crm-complete.html"
    echo "   • Admin Panel  : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/admin-dashboard.html"
    echo "   • API Health   : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/api/health"
    echo
    echo "✅ Application déjà accessible !"
    exit 0
fi

echo "🔄 Démarrage du serveur Mireb CRM..."
cd /workspaces/mireb-

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le serveur
echo "🚀 Lancement du serveur..."
npm start &

# Attendre que le serveur démarre
echo "⏳ Attente du démarrage du serveur..."
sleep 3

# Vérifier que le serveur fonctionne
if lsof -i :8080 > /dev/null 2>&1; then
    echo
    echo "✅ SERVEUR DÉMARRÉ AVEC SUCCÈS !"
    echo
    echo "📱 URLs d'accès principales :"
    echo "   • CRM Complet  : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/mireb-ai-crm-complete.html"
    echo "   • Admin Panel  : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/admin-dashboard.html"
    echo "   • Ajout Produit: https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/admin-add-product.html"
    echo
    echo "🔧 URLs techniques :"
    echo "   • API Health   : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/api/health"
    echo "   • API Status   : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/api/status"
    echo "   • API Produits : https://organic-telegram-jjqq4xp6vjqgh5v66-8080.app.github.dev/api/produits"
    echo
    echo "💡 Pour arrêter le serveur : Ctrl+C ou pkill -f 'node backend/server-unified.js'"
    echo "🔄 Pour redémarrer : ./start-mireb-codespaces.sh"
    echo
    echo "🎉 Application CRM Mireb opérationnelle sur GitHub Codespaces !"
else
    echo "❌ Erreur : Le serveur n'a pas pu démarrer sur le port 8080"
    echo "🔍 Vérifiez les logs pour plus d'informations"
    exit 1
fi
