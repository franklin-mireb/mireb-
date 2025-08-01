#!/bin/bash

echo "🚀 Démarrage du serveur Mireb UNIFIÉ..."
echo "📍 Port: 8080"
echo "💡 Frontend + API sur le même port (pas de CORS)"
echo ""

# Arrêter les anciens serveurs
echo "🛑 Arrêt des anciens serveurs..."
pkill -f "node.*server-debug" 2>/dev/null || true
pkill -f "python.*http.server" 2>/dev/null || true

# Attendre un peu
sleep 2

# Se placer dans le répertoire backend
cd /workspaces/mireb-/backend

# Démarrer le serveur unifié
echo "▶️ Démarrage du serveur unifié..."
node server-unified.js
