#!/bin/bash

echo "🔧 Démarrage du serveur Mireb en mode DEBUG..."
echo "📍 Port: 5001"
echo "💡 Mode simplifié sans MongoDB"
echo ""

# Se placer dans le répertoire backend
cd /workspaces/mireb-/backend

# Démarrer le serveur debug
node server-debug.js
