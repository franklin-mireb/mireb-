#!/bin/bash

echo "🚀 Démarrage de l'application Mireb CRM"
echo "======================================"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Arrêter tout processus existant sur le port 3000
echo "🔄 Vérification du port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 occupé - arrêt du processus existant"
    kill $(lsof -ti:3000) 2>/dev/null || true
    sleep 2
fi

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur le port 3000..."
echo ""
echo "🔗 URLs d'accès:"
echo "  Local: http://localhost:3000"
echo "  Codespaces: https://turbo-chainsaw-pjppgx5v4r55f967q-3000.app.github.dev"
echo "  Application: https://turbo-chainsaw-pjppgx5v4r55f967q-3000.app.github.dev/mireb-ai-crm-complete.html"
echo ""
echo "✨ Appuyez sur Ctrl+C pour arrêter le serveur"
echo "======================================"

# Démarrer le serveur avec serve
npx serve -s . -l 3000
