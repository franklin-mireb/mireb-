#!/bin/bash

# Script de démarrage complet pour Mireb CRM
echo "🚀 Démarrage de Mireb CRM - Full Stack Application"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Installer les dépendances si le dossier node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

# Vérifier si MongoDB est configuré
echo "🔧 Vérification de la configuration..."

# Créer un fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << EOL
# Configuration Mireb CRM Backend
NODE_ENV=development
PORT=5000

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/mireb-crm
# Pour MongoDB Atlas, utilisez : mongodb+srv://username:password@cluster.mongodb.net/mireb-crm

# JWT Secret (changez-le en production)
JWT_SECRET=mireb-secret-key-change-in-production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dwogv9nme
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Autres configurations
CORS_ORIGIN=http://localhost:3000,http://localhost:8080,http://127.0.0.1:5500
EOL
    echo "✅ Fichier .env créé. Veuillez configurer vos variables d'environnement."
fi

# Démarrer le serveur backend
echo "🖥️  Démarrage du serveur backend..."
echo "📍 URL Backend: http://localhost:5000"
echo "📍 URL Frontend: http://localhost:8080 (ou votre serveur web)"

# Afficher les informations importantes
echo ""
echo "🔗 URLs importantes:"
echo "   • Backend API: http://localhost:5000/api"
echo "   • Documentation: http://localhost:5000/api/health"
echo "   • WebSocket: ws://localhost:5000"
echo ""

echo "🔧 Configuration requise:"
echo "   • Configurez MongoDB (local ou Atlas)"
echo "   • Ajoutez vos clés API dans .env"
echo "   • Démarrez un serveur web pour le frontend"
echo ""

echo "🚀 Lancement du serveur..."

# Démarrer le serveur
if [ "$1" = "dev" ]; then
    echo "🔄 Mode développement avec nodemon..."
    npx nodemon backend/server.js
else
    echo "🏃 Mode production..."
    node backend/server.js
fi
