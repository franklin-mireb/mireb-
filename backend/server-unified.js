import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Routes simplifiées
import produitsRoutes from './routes/produits.js';

dotenv.config();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration multer pour l'upload en mémoire
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ==========================================
// MIDDLEWARE BASIC
// ==========================================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques depuis le répertoire parent
app.use(express.static(path.join(__dirname, '..')));

// Logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`${new Date().toISOString()} - API ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.body) {
      console.log('📤 Body:', JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// ==========================================
// ROUTES API
// ==========================================

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend Mireb unifié fonctionne!',
    version: '1.0.0-unified',
    port: PORT
  });
});

// Routes produits
app.use('/api/produits', produitsRoutes);

// ==========================================
// AUTHENTIFICATION SIMPLE
// ==========================================
const ADMIN_CREDENTIALS = {
  email: 'mirebshop@gmail.com',
  password: 'Fiacre-19',
  name: 'Fiacre Mireb',
  role: 'admin'
};

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Tentative de connexion:', { email });
  
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const token = 'mireb_' + Date.now(); // Token simple pour demo
    console.log('✅ Connexion réussie pour:', email);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role
        }
      }
    });
  } else {
    console.log('❌ Échec de connexion pour:', email);
    res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }
});

// Vérification du token
app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;
  
  if (token && token.startsWith('mireb_')) {
    res.json({
      success: true,
      message: 'Token valide',
      data: {
        user: {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// Routes upload - Support multipart ET JSON avec Cloudinary
app.post('/api/upload/single', upload.single('image'), async (req, res) => {
  console.log('🔄 Upload image vers Cloudinary');
  
  try {
    let uploadResult;
    
    // Si fichier multipart présent
    if (req.file) {
      console.log('📁 Fichier reçu:', { name: req.file.originalname, size: req.file.size });
      
      // Upload vers Cloudinary
      uploadResult = await cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'mireb-products',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Erreur Cloudinary:', error);
            throw error;
          }
          return result;
        }
      );
      
      // Stream le buffer vers Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'mireb-products',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Erreur Cloudinary:', error);
            return res.status(500).json({
              success: false,
              message: 'Erreur lors de l\'upload vers Cloudinary',
              error: error.message
            });
          }
          
          console.log('✅ Image uploadée vers Cloudinary:', result.secure_url);
          
          res.json({
            success: true,
            message: 'Image uploadée avec succès vers Cloudinary',
            data: {
              url: result.secure_url,
              public_id: result.public_id,
              fileName: req.file.originalname,
              fileSize: req.file.size,
              cloudinary_id: result.public_id
            }
          });
        }
      );
      
      stream.end(req.file.buffer);
      return;
    }
    
    // Si données JSON présentes (fallback avec image par défaut)
    else if (req.body.fileName) {
      console.log('📄 Données JSON reçues, utilisation image par défaut');
      const defaultImageUrl = `https://via.placeholder.com/400x300/orange/white?text=${encodeURIComponent(req.body.fileName || 'Produit')}`;
      
      res.json({
        success: true,
        message: 'Image par défaut générée',
        data: {
          url: defaultImageUrl,
          fileName: req.body.fileName,
          fileSize: req.body.fileSize || 100000,
          mimetype: 'image/jpeg',
          cloudinary_id: `default_${Date.now()}`
        }
      });
    }
    
    // Aucun fichier fourni
    else {
      const defaultUrl = 'https://via.placeholder.com/400x300/orange/white?text=Produit';
      res.json({
        success: true,
        message: 'Aucun fichier, image par défaut utilisée',
        data: {
          url: defaultUrl,
          fileName: 'default.jpg',
          fileSize: 0,
          cloudinary_id: `default_${Date.now()}`
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// Routes OpenAI simulées
app.post('/api/openai/generate-description', (req, res) => {
  const { nom, categorie, prix } = req.body;
  console.log('🔄 Génération description IA simulée pour:', { nom, categorie, prix });
  
  if (!nom || !categorie) {
    return res.status(400).json({
      success: false,
      error: 'Nom et catégorie requis pour générer une description'
    });
  }
  
  // Descriptions variées par catégorie
  const templates = {
    'electronique': [
      `${nom} - Technologie de pointe pour un usage quotidien. Design élégant et performances exceptionnelles qui révolutionnent votre expérience utilisateur.`,
      `Découvrez ${nom}, l'innovation électronique qui combine style et fonctionnalité. Qualité premium garantie pour les utilisateurs exigeants.`,
      `${nom} redéfinit les standards. Interface intuitive, durabilité remarquable et performance optimale pour tous vos besoins.`
    ],
    'mode': [
      `${nom} - Style intemporel et confort absolu. Pour un look parfait en toute occasion, alliant élégance et praticité.`,
      `Adoptez ${nom} et exprimez votre personnalité unique. Mode contemporaine et qualité supérieure pour un style irrésistible.`,
      `${nom} combine tendance et authenticité. Matériaux nobles et finitions soignées pour un style qui vous ressemble.`
    ],
    'maison': [
      `${nom} - Transformez votre intérieur avec ce produit exceptionnel. Praticité et esthétique réunies pour votre bien-être quotidien.`,
      `${nom} apporte confort et fonctionnalité à votre maison. Design moderne et durabilité assurée pour un foyer harmonieux.`,
      `Découvrez ${nom}, l'alliance parfaite entre utilité et beauté. Innovation et style pour embellir votre espace de vie.`
    ],
    'sport': [
      `${nom} - Dépassez vos limites avec cet équipement de qualité professionnelle. Performance et résistance pour atteindre vos objectifs.`,
      `${nom} vous accompagne dans tous vos défis sportifs. Conception ergonomique et matériaux techniques pour l'excellence.`,
      `Atteignez de nouveaux sommets avec ${nom}. Conçu pour les athlètes exigeants qui ne font aucun compromis sur la qualité.`
    ],
    'beaute': [
      `${nom} - Révélez votre beauté naturelle avec ce produit d'exception. Formule innovante pour des résultats visibles et durables.`,
      `${nom} sublime votre routine beauté. Ingrédients sélectionnés et efficacité prouvée pour une peau éclatante.`,
      `Découvrez ${nom}, votre allié beauté au quotidien. Texture agréable et bienfaits incomparables pour vous sentir rayonnante.`
    ]
  };
  
  const categoryKey = categorie.toLowerCase();
  const categoryTemplates = templates[categoryKey] || templates['electronique'];
  const randomTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  
  // Ajout d'informations sur le prix
  let description = randomTemplate;
  if (prix && prix > 0) {
    description += ` Disponible à un prix exceptionnel de ${prix}€. Qualité garantie et satisfaction assurée.`;
  } else {
    description += ` Contactez-nous pour connaître notre tarif préférentiel et nos offres spéciales.`;
  }
  
  // Ajout d'informations Mireb
  description += ` Disponible chez Mireb Commercial, votre partenaire de confiance en RDC.`;
  
  res.json({
    success: true,
    message: 'Description générée avec succès',
    data: { description },
    generated_at: new Date().toISOString()
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
    name: 'Mireb Commercial API - Version Unifiée',
    version: '1.0.0-unified',
    description: 'API REST et Frontend sur le même port',
    port: PORT,
    endpoints: {
      'GET /api/health': 'Statut de l\'API',
      'GET /api/produits': 'Liste des produits',
      'POST /api/produits': 'Créer un produit',
      'GET /api/produits/:id': 'Détails d\'un produit',
      'GET /api/analytics/dashboard': 'Analytics du dashboard',
      'POST /api/upload/single': 'Upload d\'image (simulé)',
      'POST /api/openai/generate-description': 'Générer description IA (simulé)',
      'POST /api/openai/optimize-tags': 'Optimiser tags SEO (simulé)'
    },
    status: 'Unified Mode - Pas de problème CORS',
    note: 'Frontend et API sur le même port pour éviter les problèmes CORS'
  });
});

// Route Analytics Dashboard
app.get('/api/analytics/dashboard', (req, res) => {
  console.log('🔄 Requête analytics dashboard');
  
  // Données analytics simulées
  const analyticsData = {
    success: true,
    data: {
      totalProduits: 1,
      totalVentes: 0,
      chiffreAffaires: 0,
      nouveauxClients: 0,
      ventesJour: [],
      topProduits: [],
      recentActivities: [
        {
          id: 1,
          type: 'produit_ajoute',
          message: 'Nouveau produit ajouté',
          timestamp: new Date().toISOString()
        }
      ],
      stats: {
        conversion: 0,
        panierMoyen: 0,
        satisfaction: 95,
        performanceServeur: 100
      }
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(analyticsData);
});

// Routes Leads - Gestion des prospects
app.get('/api/leads', (req, res) => {
  console.log('🔄 Récupération des leads');
  
  // Lecture des leads depuis db.json
  try {
    const dbPath = path.join(__dirname, '..', 'db.json');
    
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      res.json({
        success: true,
        data: data.leads || [],
        count: (data.leads || []).length
      });
    } else {
      res.json({
        success: true,
        data: [],
        count: 0
      });
    }
  } catch (error) {
    console.error('❌ Erreur lecture leads:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la lecture des leads'
    });
  }
});

app.post('/api/leads', (req, res) => {
  console.log('🔄 Ajout nouveau lead:', req.body);
  
  try {
    const dbPath = path.join(__dirname, '..', 'db.json');
    
    // Lire les données existantes
    let data = { leads: [], produits: [] };
    if (fs.existsSync(dbPath)) {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    // Créer le nouveau lead
    const newLead = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      statut: 'nouveau',
      source: 'website'
    };
    
    // Ajouter à la liste
    if (!data.leads) data.leads = [];
    data.leads.push(newLead);
    
    // Sauvegarder
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    console.log('✅ Lead ajouté avec succès:', newLead.id);
    
    res.json({
      success: true,
      message: 'Lead ajouté avec succès',
      data: newLead
    });
    
  } catch (error) {
    console.error('❌ Erreur ajout lead:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout du lead'
    });
  }
});

// Routes frontend - servir les pages HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Gestion des erreurs 404 pour les routes API seulement
app.use('/api/*', (req, res) => {
  console.log(`❌ Route API non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route API ${req.method} ${req.originalUrl} non trouvée`,
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
const HOST = process.env.HOST || '0.0.0.0'; // Écouter sur toutes les interfaces
const server = app.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 MIREB COMMERCIAL - SERVEUR UNIFIÉ');
  console.log('='.repeat(50));
  console.log(`📍 Host: ${HOST}`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`🌐 URL Codespaces: https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev (si applicable)`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🎯 Interface: http://localhost:${PORT}/admin-add-product.html`);
  console.log('\n💡 Avantages:');
  console.log('   • Pas de problème CORS');
  console.log('   • Frontend et API sur le même port');
  console.log('   • Configuration simplifiée');
  console.log('='.repeat(50) + '\n');
});

// Gestion arrêt propre
process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur Mireb unifié...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

export default app;
