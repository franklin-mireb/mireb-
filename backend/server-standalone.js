import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE DE SÉCURITÉ
// ==========================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://via.placeholder.com"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://franklin-mireb.github.io'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre de temps
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// DONNÉES TEMPORAIRES EN MÉMOIRE
// ==========================================
let users = [];
let products = [
  {
    id: 1,
    nom: "Smartphone Samsung Galaxy A24",
    prix: 299,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"],
    categorie: "Électronique",
    stock: 15,
    description: "Smartphone Samsung Galaxy A24 avec écran 6,5\", 128GB, triple caméra 50MP.",
    tags: ["smartphone", "android", "samsung", "mobile"],
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    nom: "Robe Africaine Wax Premium",
    prix: 45,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop"],
    categorie: "Mode",
    stock: 30,
    description: "Robe wax 100% coton, motifs traditionnels, taille S à XL.",
    tags: ["mode", "wax", "africain", "femme"],
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    nom: "Casque Audio Bluetooth",
    prix: 89,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"],
    categorie: "Électronique",
    stock: 25,
    description: "Casque sans fil haute qualité, réduction de bruit active, 30h d'autonomie.",
    tags: ["audio", "bluetooth", "casque", "musique"],
    rating: 4.3,
    reviews: 203
  }
];

// ==========================================
// API ROUTES SIMPLIFIÉES
// ==========================================

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Mireb Commercial CRM',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/produits'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend Mireb CRM opérationnel',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: 'In-Memory (Development)',
    services: {
      server: 'online',
      database: 'mock',
      auth: 'ready'
    }
  });
});

// Auth temporaire
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation basique
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email et mot de passe requis'
    });
  }

  // Login test
  if (email === 'admin@mireb.com' && password === 'admin123') {
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          nom: 'Administrateur',
          email: 'admin@mireb.com',
          role: 'admin'
        }
      },
      message: 'Connexion réussie'
    });
  }

  res.status(401).json({
    success: false,
    message: 'Identifiants invalides'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { nom, email, password } = req.body;
  
  if (!nom || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs sont requis'
    });
  }

  const newUser = {
    id: users.length + 1,
    nom,
    email,
    role: 'user',
    createdAt: new Date()
  };

  users.push(newUser);

  res.json({
    success: true,
    data: {
      token: `mock-jwt-token-${newUser.id}`,
      user: newUser
    },
    message: 'Utilisateur créé avec succès'
  });
});

// Produits
app.get('/api/produits', (req, res) => {
  const { page = 1, limit = 10, categorie, q } = req.query;
  
  let filteredProducts = [...products];
  
  // Filtre par catégorie
  if (categorie) {
    filteredProducts = filteredProducts.filter(p => 
      p.categorie.toLowerCase().includes(categorie.toLowerCase())
    );
  }
  
  // Recherche
  if (q) {
    filteredProducts = filteredProducts.filter(p => 
      p.nom.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit)
    }
  });
});

app.get('/api/produits/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Catégories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.categorie))];
  
  res.json({
    success: true,
    data: categories.map(cat => ({
      nom: cat,
      count: products.filter(p => p.categorie === cat).length
    }))
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/produits',
      'GET /api/produits/:id',
      'GET /api/categories'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// ==========================================
// SERVER START
// ==========================================
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Base de données: En mémoire (Mode développement)`);
  console.log(`🔐 Login test: admin@mireb.com / admin123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal reçu. Fermeture gracieuse...');
  server.close(() => {
    console.log('✅ Serveur fermé');
    process.exit(0);
  });
});

export default app;
