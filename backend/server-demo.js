// Serveur Express simple pour mode démo
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Base de données en mémoire pour la démo
let produits = [
  {
    id: 1,
    nom: "Smartphone Samsung Galaxy A24",
    prix: 299,
    stock: 15,
    categorie: "Électronique",
    description: "Smartphone Samsung Galaxy A24 avec écran 6,5\", 128GB, triple caméra 50MP.",
    images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", isPrimaire: true }],
    tags: ["smartphone", "android", "samsung"]
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur de démo opérationnel',
    database: 'En mémoire (mode démo)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/produits', (req, res) => {
  res.json({
    success: true,
    data: produits,
    total: produits.length
  });
});

app.post('/api/produits', (req, res) => {
  const nouveauProduit = {
    id: produits.length + 1,
    ...req.body,
    createdAt: new Date()
  };
  
  produits.push(nouveauProduit);
  
  res.json({
    success: true,
    message: 'Produit ajouté avec succès (mode démo)',
    data: nouveauProduit
  });
});

// Simulation upload d'images
app.post('/api/upload/single', (req, res) => {
  // Simulation d'un upload réussi
  const fakeImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Image uploadée avec succès (mode démo)',
    data: {
      url: fakeImageUrl,
      originalName: 'demo-image.jpg',
      size: 123456,
      mimetype: 'image/jpeg'
    }
  });
});

// Simulation OpenAI
app.post('/api/openai/generate-description', (req, res) => {
  const { nom, categorie } = req.body;
  const description = `${nom} est un excellent produit de la catégorie ${categorie}. Il offre une qualité exceptionnelle et répond parfaitement aux besoins des clients congolais. Produit durable et fiable, idéal pour une utilisation quotidienne.`;
  
  res.json({
    success: true,
    data: { description }
  });
});

app.post('/api/openai/optimize-tags', (req, res) => {
  const { nom, categorie } = req.body;
  const tags = [
    nom.toLowerCase().split(' ')[0],
    categorie.toLowerCase(),
    'congo',
    'kinshasa',
    'mireb',
    'qualité',
    'premium'
  ];
  
  res.json({
    success: true,
    data: { tags }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur de démo démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api/health`);
  console.log(`💾 Base de données: En mémoire (mode développement)`);
  console.log(`🔐 Mode: DEMO - Pas d'authentification requise`);
});

export default app;
