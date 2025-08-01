#!/bin/bash

echo "🛑 MIREB CRM - ARRÊT DU SERVEUR"
echo "================================"
echo

# Vérifier si le serveur est en cours d'exécution
if ! lsof -i :8080 > /dev/null 2>&1; then
    echo "ℹ️  Aucun serveur n'est en cours d'exécution sur le port 8080"
    exit 0
fi

echo "🔍 Recherche du processus serveur..."
SERVER_PID=$(lsof -ti :8080)

if [ -n "$SERVER_PID" ]; then
    echo "🎯 Processus trouvé (PID: $SERVER_PID)"
    echo "🛑 Arrêt du serveur..."
    
    # Arrêt propre
    kill $SERVER_PID
    
    # Attendre un peu
    sleep 2
    
    # Vérifier si le processus est toujours actif
    if lsof -i :8080 > /dev/null 2>&1; then
        echo "⚠️  Arrêt forcé nécessaire..."
        kill -9 $SERVER_PID
        sleep 1
    fi
    
    # Vérification finale
    if ! lsof -i :8080 > /dev/null 2>&1; then
        echo "✅ Serveur arrêté avec succès !"
        echo
        echo "💡 Pour redémarrer :"
        echo "   ./start-mireb-codespaces.sh"
        echo "   ou"
        echo "   npm start"
    else
        echo "❌ Erreur : Le serveur n'a pas pu être arrêté"
        echo "🔧 Essayez manuellement : pkill -f 'node backend/server-unified.js'"
    fi
else
    echo "❌ Impossible de trouver le processus du serveur"
fi
