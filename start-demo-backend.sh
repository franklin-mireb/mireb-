#!/bin/bash

# Script de démarrage du backend DEMO
echo "🧪 Démarrage du Backend Mireb en mode DÉMONSTRATION"
echo "================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Afficher la version de Node.js
echo "📦 Version Node.js: $(node --version)"

# Vérifier si le fichier backend-demo.js existe
if [ ! -f "backend-demo.js" ]; then
    echo "❌ Fichier backend-demo.js non trouvé!"
    exit 1
fi

echo "🚀 Lancement du serveur de démonstration..."
echo "📡 Le serveur sera accessible sur http://localhost:5000"
echo "🧪 Mode: DÉMONSTRATION (données simulées)"
echo "🔗 API Status: http://localhost:5000/api/status"
echo ""
echo "Pour tester l'admin, ouvrez: admin-add-product-demo.html"
echo ""
echo "▶️  Appuyez sur Ctrl+C pour arrêter le serveur"
echo "================================================="

# Démarrer le serveur
node backend-demo.js
