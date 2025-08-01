// Serveur backend de démonstration pour Mireb CRM
// Fonctionne sans dépendances externes, données en mémoire

const http = require('http');
const url = require('url');

const PORT = 5001; // Port différent pour éviter les conflits

// Base de données en mémoire
let produits = [
  {
    id: 1,
    nom: "Smartphone Samsung Galaxy A24",
    prix: 299,
    categorie: "Électronique",
    stock: 15,
    description: "Smartphone Samsung Galaxy A24 avec écran 6,5\", 128GB, triple caméra 50MP.",
    images: [{
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
      alt: "Samsung Galaxy A24",
      isPrimaire: true
    }],
    tags: ["smartphone", "android", "samsung"],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    nom: "Robe Africaine Wax Premium",
    prix: 45,
    categorie: "Mode",
    stock: 30,
    description: "Robe wax 100% coton, motifs traditionnels, taille S à XL.",
    images: [{
      url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop",
      alt: "Robe Wax",
      isPrimaire: true
    }],
    tags: ["mode", "wax", "africain", "femme"],
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// Headers CORS pour permettre les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

// Fonction pour parser le body JSON
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Créer le serveur
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // Gérer les requêtes CORS
  if (method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  try {
    // Route: GET /api/health
    if (path === '/api/health' && method === 'GET') {
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Serveur de démonstration Mireb CRM',
        database: 'En mémoire (Mode démo)',
        timestamp: new Date().toISOString(),
        produits: produits.length
      }));
      return;
    }

    // Route: GET /api/produits
    if (path === '/api/produits' && method === 'GET') {
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        data: produits,
        total: produits.length
      }));
      return;
    }

    // Route: POST /api/produits
    if (path === '/api/produits' && method === 'POST') {
      const body = await parseBody(req);
      
      const nouveauProduit = {
        id: nextId++,
        nom: body.nom,
        prix: body.prix,
        categorie: body.categorie,
        stock: body.stock || 0,
        stockMinimum: body.stockMinimum || 5,
        description: body.description,
        descriptionCourte: body.descriptionCourte || '',
        images: body.images || [],
        tags: body.tags || [],
        caracteristiques: body.caracteristiques || [],
        statut: 'actif',
        isVisible: true,
        isActif: true,
        rating: { moyenne: 0, nombreAvis: 0 },
        analytics: { vues: 0, clics: 0, ajoutsAuPanier: 0, achats: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      produits.push(nouveauProduit);

      res.writeHead(201, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Produit ajouté avec succès (Mode démo)',
        data: nouveauProduit
      }));
      return;
    }

    // Route: POST /api/upload/single (simulation)
    if (path === '/api/upload/single' && method === 'POST') {
      // Simulation d'upload - retourne une URL d'image placeholder
      const imageUrl = `https://picsum.photos/600/400?random=${Date.now()}`;
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Image uploadée avec succès (Mode démo)',
        data: {
          url: imageUrl,
          originalName: 'demo-image.jpg',
          size: Math.floor(Math.random() * 1000000),
          mimetype: 'image/jpeg'
        }
      }));
      return;
    }

    // Route: POST /api/openai/generate-description (simulation)
    if (path === '/api/openai/generate-description' && method === 'POST') {
      const body = await parseBody(req);
      const { nom, categorie } = body;
      
      const description = `${nom} est un excellent produit de la catégorie ${categorie}. 
      Conçu avec soin pour offrir la meilleure qualité à nos clients congolais. 
      Ce produit combine innovation et tradition pour répondre à vos besoins quotidiens. 
      Disponible chez Mireb Commercial, votre partenaire de confiance pour tous vos achats.`;

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Description générée avec succès (Mode démo)',
        data: { description }
      }));
      return;
    }

    // Route: POST /api/openai/optimize-tags (simulation)
    if (path === '/api/openai/optimize-tags' && method === 'POST') {
      const body = await parseBody(req);
      const { nom, categorie } = body;
      
      const tags = [
        nom.toLowerCase().split(' ')[0],
        categorie.toLowerCase(),
        'qualité',
        'congo',
        'mireb',
        'commercial',
        'livraison',
        'garantie'
      ];

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Tags optimisés avec succès (Mode démo)',
        data: { tags }
      }));
      return;
    }

    // Route: POST /api/auth/login (simulation)
    if (path === '/api/auth/login' && method === 'POST') {
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        success: true,
        message: 'Connexion réussie (Mode démo)',
        data: {
          token: 'demo-token-' + Date.now(),
          user: {
            id: 1,
            nom: 'Admin Démo',
            email: 'admin@mireb.com',
            role: 'admin'
          }
        }
      }));
      return;
    }

    // Route non trouvée
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({
      success: false,
      message: 'Route non trouvée',
      availableRoutes: [
        'GET /api/health',
        'GET /api/produits',
        'POST /api/produits',
        'POST /api/upload/single',
        'POST /api/openai/generate-description',
        'POST /api/openai/optimize-tags',
        'POST /api/auth/login'
      ]
    }));

  } catch (error) {
    console.error('Erreur serveur:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({
      success: false,
      message: 'Erreur serveur interne',
      error: error.message
    }));
  }
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur de démonstration Mireb CRM démarré !`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📦 API Produits: http://localhost:${PORT}/api/produits`);
  console.log(`\n💡 Utilisez ce serveur pour tester l'interface admin localement.`);
  console.log(`🇨🇩 Serveur prêt pour Mireb Commercial !`);
});

// Gérer l'arrêt propre du serveur
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur de démonstration...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});
