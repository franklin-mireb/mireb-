// API simple pour GitHub Pages - Utilise les variables d'environnement
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Configuration CORS pour GitHub Pages
app.use(cors({
    origin: [
        'https://franklin-mireb.github.io',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true
}));

app.use(express.json());

// Connexion MongoDB avec variable d'environnement
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mireb_crm')
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

// Modèle Produit simplifié
const ProduitSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    categorie: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: String,
    tags: [String],
    images: [{
        url: String,
        alt: String,
        isPrimaire: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now }
});

const Produit = mongoose.model('Produit', ProduitSchema);

// Routes API
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API Mireb CRM opérationnelle',
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Récupérer tous les produits
app.get('/api/produits', async (req, res) => {
    try {
        const produits = await Produit.find().sort({ createdAt: -1 });
        res.json({ success: true, data: produits });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Créer un nouveau produit
app.post('/api/produits', async (req, res) => {
    try {
        const produit = new Produit(req.body);
        await produit.save();
        res.status(201).json({ success: true, data: produit });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Simulation d'upload (pour GitHub Pages)
app.post('/api/upload/single', (req, res) => {
    // En production, vous utiliseriez Cloudinary ou Firebase
    const mockImage = {
        url: `https://picsum.photos/400/400?random=${Date.now()}`,
        originalName: `produit_${Date.now()}.jpg`,
        publicId: `mireb_${Date.now()}`
    };
    
    res.json({ success: true, data: mockImage });
});

// Simulation OpenAI (à remplacer par vraie API en production)
app.post('/api/openai/generate-description', (req, res) => {
    const { nom, categorie } = req.body;
    
    // Utiliser vraie API OpenAI avec process.env.OPENAI_API_KEY
    const mockDescription = `${nom} est un excellent produit de la catégorie ${categorie}. Conçu avec des matériaux de qualité premium, ce produit offre des performances exceptionnelles et une durabilité remarquable. Idéal pour les utilisateurs exigeants qui recherchent la qualité et l'innovation.`;
    
    res.json({ 
        success: true, 
        data: { description: mockDescription }
    });
});

app.post('/api/openai/optimize-tags', (req, res) => {
    const { nom, categorie } = req.body;
    
    // Utiliser vraie API OpenAI avec process.env.OPENAI_API_KEY
    const mockTags = [
        nom.toLowerCase().replace(/\s+/g, '-'),
        categorie.toLowerCase().replace(/\s+/g, '-'),
        'qualite-premium',
        'innovation',
        'mireb-commercial'
    ];
    
    res.json({ 
        success: true, 
        data: { tags: mockTags }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur Mireb CRM démarré sur port ${PORT}`);
    console.log(`📡 API disponible sur: http://localhost:${PORT}/api`);
});

module.exports = app;
