import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes imports
import authRoutes from './routes/auth.js';
import clientsRoutes from './routes/clients.js';
import leadsRoutes from './routes/leads.js';
import produitsRoutes from './routes/produits.js';
import categoriesRoutes from './routes/categories.js';
import analyticsRoutes from './routes/analytics.js';
import chatbotRoutes from './routes/chatbot.js';
import uploadRoutes from './routes/upload.js';
import openaiRoutes from './routes/openai.js';

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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mireb-commercial';

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par IP par fenêtre
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// ==========================================
// MIDDLEWARE GÉNÉRAL
// ==========================================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:8080'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware pour logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==========================================
// CONNEXION MONGODB
// ==========================================
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connecté avec succès');
  console.log(`📊 Base de données: ${mongoose.connection.db.databaseName}`);
})
.catch((error) => {
  console.error('❌ Erreur de connexion MongoDB:', error);
  process.exit(1);
});

// ==========================================
// ROUTES API
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/produits', produitsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/openai', openaiRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// Route de documentation API
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Mireb Commercial API',
    version: '1.0.0',
    description: 'API REST pour le CRM Mireb Commercial',
    endpoints: {
      'GET /api/health': 'Statut de l\'API',
      'POST /api/auth/login': 'Connexion utilisateur',
      'POST /api/auth/register': 'Inscription utilisateur',
      'GET /api/clients': 'Liste des clients',
      'POST /api/clients': 'Créer un client',
      'GET /api/leads': 'Liste des leads',
      'POST /api/leads': 'Créer un lead',
      'GET /api/produits': 'Liste des produits',
      'POST /api/produits': 'Créer un produit',
      'GET /api/categories': 'Liste des catégories',
      'POST /api/categories': 'Créer une catégorie',
      'GET /api/analytics': 'Analytics du CRM',
      'POST /api/chatbot': 'Interaction avec le chatbot',
      'POST /api/upload': 'Upload de fichiers',
      'POST /api/openai/generate-description': 'Générer description produit AI',
      'POST /api/openai/analyze-image': 'Analyser image produit AI',
      'POST /api/openai/optimize-tags': 'Optimiser tags SEO AI'
    },
    documentation: 'Consultez le README.md pour plus de détails'
  });
});

// Servir les fichiers statiques du frontend
app.use(express.static('../', {
  index: ['index.html', 'mireb-ai-crm-complete.html']
}));

// ==========================================
// WEBSOCKETS POUR LE CHAT EN TEMPS RÉEL
// ==========================================
io.on('connection', (socket) => {
  console.log('👤 Utilisateur connecté:', socket.id);

  socket.on('join_chat', (data) => {
    socket.join(data.roomId);
    console.log(`👤 ${socket.id} a rejoint le chat ${data.roomId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('👤 Utilisateur déconnecté:', socket.id);
  });
});

// ==========================================
// GESTION D'ERREURS
// ==========================================
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Route 404 pour l'API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    availableEndpoints: '/api/docs'
  });
});

// Redirection vers l'app frontend pour toutes les autres routes
app.get('*', (req, res) => {
  res.sendFile('mireb-ai-crm-complete.html', { root: '../' });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================
server.listen(PORT, () => {
  console.log(`🚀 Serveur Mireb CRM démarré sur le port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`💊 Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
