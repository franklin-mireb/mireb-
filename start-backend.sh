#!/bin/bash

echo "🚀 Démarrage du serveur backend Mireb CRM..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install express cors
fi

# Démarrer le serveur
echo "🌐 Lancement du serveur sur le port 5001..."
node server-local.js
