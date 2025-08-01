#!/bin/bash

# Script de démarrage robuste pour Render
# Ce script s'assure que le serveur démarre correctement

echo "🚀 Démarrage du serveur Mireb CRM..."
echo "📅 Date: $(date)"
echo "📁 Répertoire: $(pwd)"
echo "🔧 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Vérification des fichiers critiques
echo
echo "🔍 Vérification des fichiers..."

if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json manquant"
    exit 1
fi

if [ ! -f "backend/server-unified.js" ]; then
    echo "❌ Erreur: backend/server-unified.js manquant"
    exit 1
fi

echo "✅ Tous les fichiers critiques sont présents"

# Vérification des variables d'environnement
echo
echo "🌍 Variables d'environnement:"
echo "   PORT: ${PORT:-'non défini (utilisera 8080)'}"
echo "   NODE_ENV: ${NODE_ENV:-'non défini'}"

# Définition du port par défaut si absent
export PORT=${PORT:-8080}

echo
echo "🎯 Démarrage du serveur sur le port $PORT..."

# Démarrage du serveur avec gestion d'erreur
exec node backend/server-unified.js
