#!/bin/bash

echo "🚀 Démarrage du serveur backend MIREB CRM..."
echo "📁 Répertoire: $(pwd)"
echo "📦 Version Node.js: $(node --version)"
echo ""

# Vérifier si MongoDB est installé/disponible
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB non détecté. Utilisation de MongoDB Cloud Atlas recommandée."
    echo "   Mettez à jour MONGODB_URI dans .env pour utiliser Atlas"
    echo ""
fi

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant. Copie depuis .env.example..."
    cp .env.example .env
fi

echo "🔧 Configuration environment:"
echo "   NODE_ENV: ${NODE_ENV:-development}"
echo "   PORT: ${PORT:-5000}"
echo ""

echo "📋 Démarrage du serveur..."
node server.js
