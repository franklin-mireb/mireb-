import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes simplifiées
import produitsRoutes from './routes/produits.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ==========================================
// MIDDLEWARE BASIC
// ==========================================
app.use(cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware CORS supplémentaire pour tout autoriser en debug
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware simplifié
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Afficher les données POST pour debug
  if (req.method === 'POST' && req.body) {
    console.log('📤 Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
});

// ==========================================
// ROUTES SIMPLIFIÉES
// ==========================================

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mireb Commercial API - Mode Debug',
    version: '1.0.0-debug',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      docs: '/api/docs',
      produits: '/api/produits'
    }
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend Mireb simplifié fonctionne!',
    version: '1.0.0-debug'
  });
});

// Routes produits
app.use('/api/produits', produitsRoutes);

// Routes upload simulées
app.post('/api/upload/single', (req, res) => {
  console.log('🔄 Upload image simulé');
  const fakeImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Image uploadée avec succès (mode simulation)',
    data: {
      url: fakeImageUrl,
      originalName: `image-${Date.now()}.jpg`,
      size: Math.floor(Math.random() * 500000) + 100000,
      mimetype: 'image/jpeg',
      publicId: `mireb_${Date.now()}`
    }
  });
});

// Routes OpenAI simulées
app.post('/api/openai/generate-description', (req, res) => {
  const { nom, categorie } = req.body;
  console.log('🔄 Génération description IA simulée pour:', { nom, categorie });
  
  const description = `${nom} est un excellent produit de la catégorie ${categorie}. Conçu avec des matériaux de qualité premium, ce produit offre des performances exceptionnelles et une durabilité remarquable. Idéal pour les utilisateurs exigeants qui recherchent la qualité et l'innovation. Disponible chez Mireb Commercial, votre partenaire de confiance en RDC.`;
  
  res.json({
    success: true,
    message: 'Description générée avec succès',
    data: { description }
  });
});

app.post('/api/openai/optimize-tags', (req, res) => {
  const { nom, categorie, ville } = req.body;
  console.log('🔄 Optimisation tags simulée pour:', { nom, categorie, ville });
  
  const baseTags = [
    nom?.toLowerCase().replace(/\s+/g, '-') || 'produit',
    categorie?.toLowerCase().replace(/\s+/g, '-') || 'general',
    ville?.toLowerCase() || 'kinshasa',
    'mireb-commercial',
    'rdc',
    'congo',
    'qualite-premium',
    'livraison-rapide',
    'garantie'
  ];
  
  res.json({
    success: true,
    message: 'Tags optimisés avec succès',
    data: { tags: baseTags }
  });
});

// Route documentation API
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Mireb Commercial API - Version Debug',
    version: '1.0.0-debug',
    description: 'API REST simplifiée pour le CRM Mireb Commercial',
    endpoints: {
      'GET /api/health': 'Statut de l\'API',
      'GET /api/produits': 'Liste des produits',
      'POST /api/produits': 'Créer un produit',
      'GET /api/produits/:id': 'Détails d\'un produit',
      'POST /api/upload/single': 'Upload d\'image (simulé)',
      'POST /api/openai/generate-description': 'Générer description IA (simulé)',
      'POST /api/openai/optimize-tags': 'Optimiser tags SEO (simulé)'
    },
    status: 'Debug Mode - MongoDB désactivé',
    note: 'Utilise une base de données en mémoire pour les tests'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/docs',
      'GET /api/produits',
      'POST /api/produits',
      'POST /api/upload/single',
      'POST /api/openai/generate-description',
      'POST /api/openai/optimize-tags'
    ]
  });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('❌ Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
  });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 MIREB COMMERCIAL API - MODE DEBUG');
  console.log('='.repeat(50));
  console.log(`📍 Serveur démarré sur le port: ${PORT}`);
  console.log(`🌐 URL locale: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api/docs`);
  console.log('\n💡 Mode Debug:');
  console.log('   • MongoDB désactivé');
  console.log('   • Base de données en mémoire');
  console.log('   • Uploads simulés');
  console.log('   • IA simulée');
  console.log('='.repeat(50) + '\n');
});

// Gestion arrêt propre
process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur Mireb...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

export default app;
