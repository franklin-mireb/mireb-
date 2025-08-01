import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS pour GitHub Pages et Vercel
app.use(cors({
  origin: [
    'https://franklin-mireb.github.io',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500',
    'http://localhost:5001'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Models
const ProduitSchema = new mongoose.Schema({
  nom: String,
  categorie: String,
  adresse: String,
  ville: String,
  prix: Number,
  stock: Number,
  stockMinimum: Number,
  description: String,
  tags: [String],
  images: [{
    url: String,
    alt: String,
    isPrimaire: Boolean
  }],
  caracteristiques: [{
    nom: String,
    valeur: String,
    unite: String
  }],
  createdAt: { type: Date, default: Date.now },
  createdBy: String
});

const Produit = mongoose.model('Produit', ProduitSchema);

// Routes API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend Mireb CRM fonctionne parfaitement!',
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'Connecté' : 'Déconnecté'
  });
});

// Produits CRUD
app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: produits,
      count: produits.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
});

app.post('/api/produits', async (req, res) => {
  try {
    const produit = new Produit(req.body);
    await produit.save();
    
    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: produit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error.message
    });
  }
});

app.get('/api/produits/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: produit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message
    });
  }
});

app.put('/api/produits/:id', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: produit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message
    });
  }
});

app.delete('/api/produits/:id', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: error.message
    });
  }
});

// OpenAI Endpoints simulés
app.post('/api/openai/generate-description', async (req, res) => {
  try {
    const { nom, categorie } = req.body;
    
    // Simulation d'appel OpenAI
    const descriptions = {
      'Électronique': `${nom} représente l'excellence technologique dans la catégorie ${categorie}. Doté des dernières innovations, ce produit offre des performances exceptionnelles et une fiabilité à toute épreuve. Conçu pour répondre aux besoins des utilisateurs les plus exigeants en République Démocratique du Congo.`,
      'Mode': `${nom} incarne l'élégance et le style contemporain. Cette pièce de mode allie qualité premium et design raffiné pour sublimer votre garde-robe. Un must-have pour tous les amateurs de mode en RDC.`,
      'Automobile': `${nom} combine puissance, sécurité et confort pour une expérience de conduite exceptionnelle. Parfaitement adapté aux routes congolaises, ce véhicule garantit performance et durabilité.`,
      'default': `${nom} est un produit de qualité supérieure dans la catégorie ${categorie}. Méticuleusement conçu avec des matériaux premium, il offre des performances remarquables et une longévité exceptionnelle. Disponible exclusivement chez Mireb Commercial, votre partenaire de confiance en RDC.`
    };
    
    const description = descriptions[categorie] || descriptions.default;
    
    res.json({
      success: true,
      data: { description },
      message: 'Description générée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de description',
      error: error.message
    });
  }
});

app.post('/api/openai/optimize-tags', async (req, res) => {
  try {
    const { nom, categorie, ville } = req.body;
    
    // Génération intelligente de tags
    const baseTags = [
      nom.toLowerCase().replace(/\s+/g, '-'),
      categorie.toLowerCase().replace(/\s+/g, '-'),
      'mireb-commercial',
      'qualite-premium',
      'rdc'
    ];
    
    if (ville) {
      baseTags.push(ville.toLowerCase());
    }
    
    // Tags spécifiques par catégorie
    const categoryTags = {
      'Électronique': ['technologie', 'innovation', 'digital', 'smart'],
      'Mode': ['style', 'tendance', 'fashion', 'elegant'],
      'Automobile': ['transport', 'vehicule', 'mobilite', 'performance'],
      'Maison & Jardin': ['decoration', 'confort', 'lifestyle', 'amenagement']
    };
    
    if (categoryTags[categorie]) {
      baseTags.push(...categoryTags[categorie]);
    }
    
    baseTags.push('kinshasa', 'congo-drc', 'afrique-centrale', 'commerce');
    
    res.json({
      success: true,
      data: { tags: baseTags.slice(0, 10) },
      message: 'Tags optimisés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'optimisation des tags',
      error: error.message
    });
  }
});

// Upload d'images simulé
app.post('/api/upload/single', async (req, res) => {
  try {
    // Simulation d'upload réussi
    const mockImage = {
      url: `https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=${encodeURIComponent('Image Mock')}`,
      originalName: 'mock-image.jpg',
      publicId: 'mock_' + Date.now(),
      size: 1024 * 1024 // 1MB
    };
    
    res.json({
      success: true,
      data: mockImage,
      message: 'Image uploadée avec succès (simulation)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [
    'Électronique',
    'Mode',
    'Maison & Jardin',
    'Automobile',
    'Santé & Beauté',
    'Sports & Loisirs',
    'Industrie & BTP'
  ];
  
  res.json({
    success: true,
    data: categories
  });
});

// Analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const totalProduits = await Produit.countDocuments();
    const produitsEnStock = await Produit.countDocuments({ stock: { $gt: 0 } });
    const produitsRupture = await Produit.countDocuments({ 
      $expr: { $lte: ['$stock', '$stockMinimum'] }
    });
    
    const topCategories = await Produit.aggregate([
      { $group: { _id: '$categorie', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalProduits,
        produitsEnStock,
        produitsRupture,
        topCategories,
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analytics',
      error: error.message
    });
  }
});

// Connexion MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connecté avec succès');
  })
  .catch(err => {
    console.error('❌ Erreur connexion MongoDB:', err);
  });
} else {
  console.warn('⚠️ MONGODB_URI non défini - Base de données non connectée');
}

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.path,
    method: req.method
  });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
  });
}

export default app;
