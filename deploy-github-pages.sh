#!/bin/bash

echo "🚀 Déploiement GitHub Pages Automatique"
echo "======================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}📦 Étape 1: Préparation des fichiers pour GitHub Pages${NC}"

# Créer un index.html qui redirige vers l'interface principale
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mireb CRM - Redirection</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 3rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            background: #ff6b6b;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 10px;
        }
        .btn:hover {
            background: #ff5252;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .counter {
            font-size: 1.5rem;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏢</div>
        <h1 class="title">Mireb CRM</h1>
        <p class="subtitle">Système de Gestion Commerciale Intelligent</p>
        
        <a href="mireb-ai-crm-complete.html" class="btn">
            🎯 Accéder au CRM Principal
        </a>
        <br>
        <a href="admin-add-product.html" class="btn">
            ⚙️ Interface Admin Produits
        </a>
        <br>
        <a href="admin-add-product-demo.html" class="btn">
            🧪 Version Démonstration
        </a>
        
        <div class="counter">
            <p>🚀 Redirection automatique dans <span id="countdown">10</span> secondes</p>
        </div>
    </div>

    <script>
        let countdown = 10;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = 'mireb-ai-crm-complete.html';
            }
        }, 1000);
    </script>
</body>
</html>
EOF

echo -e "${GREEN}✅ index.html créé${NC}"

echo ""
echo -e "${BLUE}📦 Étape 2: Optimisation pour GitHub Pages${NC}"

# Créer un fichier .nojekyll pour éviter les problèmes avec Jekyll
touch .nojekyll
echo -e "${GREEN}✅ .nojekyll créé${NC}"

# Mettre à jour le _redirects pour Netlify (si jamais utilisé)
cat > _redirects << 'EOF'
# Redirections pour Mireb CRM
/admin    /admin-add-product.html    200
/demo     /admin-add-product-demo.html    200
/api/*    https://mireb-api.vercel.app/api/:splat    200
/*        /index.html                200
EOF

echo -e "${GREEN}✅ _redirects mis à jour${NC}"

echo ""
echo -e "${BLUE}📦 Étape 3: Commit et Push vers GitHub Pages${NC}"

# Ajouter tous les fichiers
git add .
git commit -m "🚀 Déploiement GitHub Pages avec redirection automatique"

echo -e "${GREEN}✅ Changements committés${NC}"

# Push vers GitHub
git push origin main

echo -e "${GREEN}✅ Push vers GitHub terminé${NC}"

echo ""
echo -e "${YELLOW}🎉 DÉPLOIEMENT GITHUB PAGES TERMINÉ !${NC}"
echo ""
echo "📍 URLs disponibles :"
echo "   🏠 Principal: https://franklin-mireb.github.io/mireb-/"
echo "   🎯 CRM: https://franklin-mireb.github.io/mireb-/mireb-ai-crm-complete.html"
echo "   ⚙️  Admin: https://franklin-mireb.github.io/mireb-/admin-add-product.html"
echo "   🧪 Démo: https://franklin-mireb.github.io/mireb-/admin-add-product-demo.html"
echo ""
echo "⏳ Attendez 2-3 minutes pour la propagation..."
