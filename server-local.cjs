#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: [
    'https://franklin-mireb.github.io',
    'http://localhost:3000',
    'http://localhost:5000', 
    'http://127.0.0.1:5500',
    'null' // Pour les fichiers ouverts directement
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base de données simple en fichier JSON
const DB_FILE = path.join(__dirname, 'db.json');

// Initialiser la base de données
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      produits: [],
      leads: [],
      analytics: {
        views: 0,
        totalLeads: 0,
        conversions: 0,
        conversionRate: 0,
        leadsByStatus: {
          nouveau: 0,
          en_cours: 0,
          converti: 0,
          perdu: 0
        }
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Lire la base de données
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture DB:', error);
    initDB();
    return readDB();
  }
}

// Écrire dans la base de données
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur écriture DB:', error);
    return false;
  }
}

// Routes API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend Mireb CRM Local fonctionne parfaitement!',
    environment: 'development',
    mongodb: 'Local JSON DB'
  });
});

// Produits CRUD
app.get('/api/produits', (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.produits,
      count: db.produits.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
});

app.post('/api/produits', (req, res) => {
  try {
    const db = readDB();
    const produit = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.produits.push(produit);
    writeDB(db);
    
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

// Leads CRUD
app.get('/api/leads', (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.leads,
      count: db.leads.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des leads',
      error: error.message
    });
  }
});

app.post('/api/leads', (req, res) => {
  try {
    const db = readDB();
    const lead = {
      id: Date.now().toString(),
      ...req.body,
      status: 'nouveau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.leads.push(lead);
    
    // Mettre à jour les analytics
    db.analytics.totalLeads = db.leads.length;
    db.analytics.leadsByStatus.nouveau++;
    
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: 'Lead créé avec succès',
      data: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du lead',
      error: error.message
    });
  }
});

// OpenAI Endpoints simulés
app.post('/api/openai/generate-description', (req, res) => {
  try {
    const { nom, categorie } = req.body;
    
    const descriptions = {
      'Électronique': `${nom} représente l'excellence technologique dans la catégorie ${categorie}. Doté des dernières innovations, ce produit offre des performances exceptionnelles et une fiabilité à toute épreuve. Conçu pour répondre aux besoins des utilisateurs les plus exigeants en République Démocratique du Congo. Design moderne et fonctionnalités avancées pour une expérience utilisateur optimale.`,
      'Mode': `${nom} incarne l'élégance et le style contemporain. Cette pièce de mode allie qualité premium et design raffiné pour sublimer votre garde-robe. Un must-have pour tous les amateurs de mode en RDC. Matériaux de haute qualité et finitions soignées.`,
      'Automobile': `${nom} combine puissance, sécurité et confort pour une expérience de conduite exceptionnelle. Parfaitement adapté aux routes congolaises, ce véhicule garantit performance et durabilité. Technologie avancée et design moderne.`,
      'Maison & Jardin': `${nom} transforme votre espace de vie avec style et fonctionnalité. Produit de qualité supérieure conçu pour embellir et optimiser votre maison. Idéal pour créer un environnement confortable et esthétique.`,
      'Santé & Beauté': `${nom} révèle votre beauté naturelle avec des formulations expertes. Produit de soin premium pour prendre soin de vous au quotidien. Ingrédients sélectionnés pour des résultats visibles.`,
      'Sports & Loisirs': `${nom} accompagne vos activités sportives avec performance et confort. Équipement de qualité professionnelle pour optimiser vos performances. Design ergonomique et matériaux résistants.`,
      'default': `${nom} est un produit de qualité supérieure dans la catégorie ${categorie}. Méticuleusement conçu avec des matériaux premium, il offre des performances remarquables et une longévité exceptionnelle. Disponible exclusivement chez Mireb Commercial, votre partenaire de confiance en RDC. Innovation, qualité et style réunis en un seul produit.`
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

app.post('/api/openai/optimize-tags', (req, res) => {
  try {
    const { nom, categorie, ville } = req.body;
    
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
    
    const categoryTags = {
      'Électronique': ['technologie', 'innovation', 'digital', 'smart', 'moderne'],
      'Mode': ['style', 'tendance', 'fashion', 'elegant', 'design'],
      'Automobile': ['transport', 'vehicule', 'mobilite', 'performance', 'confort'],
      'Maison & Jardin': ['decoration', 'confort', 'lifestyle', 'amenagement', 'design'],
      'Santé & Beauté': ['soin', 'beaute', 'wellness', 'premium', 'naturel'],
      'Sports & Loisirs': ['sport', 'fitness', 'loisir', 'performance', 'equipement']
    };
    
    if (categoryTags[categorie]) {
      baseTags.push(...categoryTags[categorie]);
    }
    
    baseTags.push('kinshasa', 'congo-drc', 'afrique-centrale', 'commerce', 'boutique-en-ligne');
    
    // Nettoyer et dédupliquer
    const uniqueTags = [...new Set(baseTags)].slice(0, 12);
    
    res.json({
      success: true,
      data: { tags: uniqueTags },
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
app.post('/api/upload/single', (req, res) => {
  try {
    const mockImage = {
      url: `https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=${encodeURIComponent('Mireb Product')}`,
      originalName: 'produit-mireb.jpg',
      publicId: 'mireb_' + Date.now(),
      size: 1024 * 1024
    };
    
    res.json({
      success: true,
      data: mockImage,
      message: 'Image uploadée avec succès (mode simulation)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// Analytics
app.get('/api/analytics/dashboard', (req, res) => {
  try {
    const db = readDB();
    
    res.json({
      success: true,
      data: {
        ...db.analytics,
        conversionRate: db.analytics.totalLeads > 0 ? 
          Math.round((db.analytics.conversions / db.analytics.totalLeads) * 100) : 0,
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: error.message
  });
});

// Initialiser et démarrer le serveur
initDB();

app.listen(PORT, () => {
  console.log(`
🚀 Serveur Backend Mireb démarré!
🌐 URL: http://localhost:${PORT}
📁 Base de données: ${DB_FILE}
🔗 Health Check: http://localhost:${PORT}/api/health

Endpoints disponibles:
- GET  /api/produits
- POST /api/produits  
- GET  /api/leads
- POST /api/leads
- POST /api/openai/generate-description
- POST /api/openai/optimize-tags
- POST /api/upload/single
- GET  /api/analytics/dashboard
  `);
});

module.exports = app;
