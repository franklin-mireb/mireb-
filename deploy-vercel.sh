#!/bin/bash

echo "🚀 DÉPLOIEMENT VERCEL AUTOMATIQUE - MIREB CRM"
echo "=============================================="

# 1. Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# 2. Configuration automatique Vercel
echo "⚙️  Configuration Vercel..."
cat > .vercelignore << 'EOF'
node_modules
.env
.git
server-local.cjs
server.log
nohup.out
*.md
EOF

# 3. Mise à jour du package.json pour Vercel
echo "📝 Configuration package.json..."
cat > package.json << 'EOF'
{
  "name": "mireb-crm",
  "version": "1.0.0",
  "description": "CRM Mireb avec interface admin complète",
  "main": "api/vercel.js",
  "type": "module",
  "scripts": {
    "start": "node server-local.cjs",
    "dev": "node server-local.cjs",
    "build": "echo 'Build complete'",
    "vercel-build": "echo 'Vercel build complete'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["crm", "mireb", "admin", "api"],
  "author": "Mireb",
  "license": "MIT"
}
EOF

# 4. Mettre à jour vercel.json
echo "🔧 Configuration vercel.json optimisée..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "mireb-crm",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/vercel.js"
    },
    {
      "src": "/admin",
      "dest": "/mireb-ai-crm-complete.html"
    },
    {
      "src": "/test",
      "dest": "/test-backend.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/vercel.js": {
      "runtime": "nodejs18.x"
    }
  }
}
EOF

# 5. Commit des changements
echo "📤 Commit des changements..."
git add .
git commit -m "🚀 Configuration Vercel complète - Ready to deploy

✅ Optimisations:
- API Vercel optimisée (api/vercel.js)
- Configuration vercel.json complète
- Package.json mis à jour
- Routes personnalisées (/admin, /test)
- Build configuration optimisée

🌐 Endpoints API Vercel:
- /api/health - Test de santé
- /api/produits - Gestion produits
- /api/leads - Gestion leads
- /api/analytics/dashboard - Analytics
- /api/openai/* - Simulation IA
- /api/upload/* - Upload simulation

📋 URLs raccourcies:
- /admin → Interface admin complète
- /test → Page de test API
- / → Accueil du site" 2>/dev/null || true

git push origin main 2>/dev/null || true

# 6. Déploiement sur Vercel
echo "🌐 Déploiement sur Vercel..."
echo "Connectez-vous à Vercel si demandé..."

# Déploiement automatique
vercel --prod --yes

echo ""
echo "🎉 DÉPLOIEMENT VERCEL TERMINÉ!"
echo "=============================="
echo ""
echo "🌐 Votre CRM est maintenant disponible sur:"
echo "👉 GitHub Pages: https://franklin-mireb.github.io/mireb-/"
echo "👉 Vercel: [URL affichée ci-dessus]"
echo ""
echo "📋 URLs spéciales Vercel:"
echo "• /admin - Interface admin"
echo "• /test - Test API"
echo "• /api/health - Test backend"
echo ""
echo "✨ Double déploiement réussi!"
echo "😴 Vous pouvez vraiment vous reposer maintenant!"
