// API Backend en mode démo pour tests locaux
// Ce serveur utilise des données en mémoire pour simuler les fonctionnalités

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://franklin-mireb.github.io'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Données en mémoire pour la démo
let demoData = {
    produits: [
        {
            id: '1',
            nom: 'iPhone 15 Pro',
            categorie: 'Électronique',
            prix: 1200,
            stock: 50,
            stockMinimum: 10,
            description: 'Le dernier iPhone avec des performances exceptionnelles.',
            tags: ['iphone', 'apple', 'smartphone', 'pro'],
            images: [
                { url: 'https://via.placeholder.com/400x400/007ACC/FFFFFF?text=iPhone+15+Pro', alt: 'iPhone 15 Pro', isPrimaire: true }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            nom: 'MacBook Air M2',
            categorie: 'Électronique',
            prix: 1500,
            stock: 30,
            stockMinimum: 5,
            description: 'Ordinateur portable ultra-performant avec puce M2.',
            tags: ['macbook', 'apple', 'ordinateur', 'm2'],
            images: [
                { url: 'https://via.placeholder.com/400x400/28A745/FFFFFF?text=MacBook+Air', alt: 'MacBook Air M2', isPrimaire: true }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    clients: [],
    leads: [],
    users: [
        {
            id: '1',
            email: 'admin@mireb.com',
            nom: 'Administrateur',
            role: 'admin',
            password: 'hashed_password_demo'
        }
    ]
};

// Routes API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        mode: 'demo',
        message: 'Backend Mireb en mode démonstration',
        timestamp: new Date().toISOString(),
        data: {
            produits: demoData.produits.length,
            clients: demoData.clients.length,
            leads: demoData.leads.length
        }
    });
});

// Produits
app.get('/api/produits', (req, res) => {
    console.log('📦 GET /api/produits - Mode DEMO');
    res.json({
        success: true,
        data: demoData.produits,
        total: demoData.produits.length
    });
});

app.get('/api/produits/:id', (req, res) => {
    const { id } = req.params;
    const produit = demoData.produits.find(p => p.id === id);
    
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
});

app.post('/api/produits', (req, res) => {
    console.log('📦 POST /api/produits - Mode DEMO');
    console.log('📝 Données reçues:', req.body);
    
    try {
        const nouveauProduit = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        demoData.produits.push(nouveauProduit);
        
        console.log('✅ Produit ajouté:', nouveauProduit.nom);
        console.log('📊 Total produits:', demoData.produits.length);
        
        res.status(201).json({
            success: true,
            message: 'Produit créé avec succès en mode DEMO',
            data: nouveauProduit
        });
    } catch (error) {
        console.error('❌ Erreur création produit:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du produit',
            error: error.message
        });
    }
});

app.put('/api/produits/:id', (req, res) => {
    const { id } = req.params;
    const index = demoData.produits.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Produit non trouvé'
        });
    }
    
    demoData.produits[index] = {
        ...demoData.produits[index],
        ...req.body,
        id,
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: 'Produit mis à jour avec succès',
        data: demoData.produits[index]
    });
});

app.delete('/api/produits/:id', (req, res) => {
    const { id } = req.params;
    const index = demoData.produits.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Produit non trouvé'
        });
    }
    
    const produitSupprime = demoData.produits.splice(index, 1)[0];
    
    res.json({
        success: true,
        message: 'Produit supprimé avec succès',
        data: produitSupprime
    });
});

// Simulation d'upload d'images
app.post('/api/upload', (req, res) => {
    console.log('🖼️ POST /api/upload - Mode DEMO');
    
    // Simulation d'upload avec URLs placeholder
    const fakeImages = [
        {
            url: `https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Image+${Date.now()}`,
            alt: `Image simulée ${Date.now()}`,
            publicId: `demo_${Date.now()}`
        }
    ];
    
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Images uploadées avec succès (mode DEMO)',
            data: fakeImages
        });
    }, 1000); // Simulation de délai d'upload
});

// Route pour générer des descriptions avec IA simulée
app.post('/api/ai/description', (req, res) => {
    console.log('🤖 POST /api/ai/description - Mode DEMO');
    const { nom, categorie } = req.body;
    
    const descriptions = [
        `${nom} est un produit exceptionnel dans la catégorie ${categorie}. Conçu avec les dernières technologies, il offre une expérience utilisateur incomparable et un design élégant qui séduira tous les utilisateurs.`,
        `Découvrez ${nom}, l'innovation parfaite en ${categorie}. Ce produit révolutionnaire combine performance, style et durabilité pour répondre à tous vos besoins avec une qualité premium.`,
        `${nom} représente l'excellence dans le domaine ${categorie}. Ses caractéristiques avancées et sa finition soignée en font un choix de premier plan pour les consommateurs exigeants.`
    ];
    
    setTimeout(() => {
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        res.json({
            success: true,
            message: 'Description générée avec succès (IA simulée)',
            data: { description }
        });
    }, 2000);
});

// Route pour générer des tags SEO avec IA simulée  
app.post('/api/ai/tags', (req, res) => {
    console.log('🏷️ POST /api/ai/tags - Mode DEMO');
    const { nom, categorie } = req.body;
    
    const baseTags = [
        nom.toLowerCase().replace(/\s+/g, '-'),
        categorie.toLowerCase().replace(/\s+/g, '-'),
        'congo',
        'mireb',
        'qualité',
        'commerce',
        'vente-en-ligne'
    ];
    
    // Ajouter des tags spécifiques selon la catégorie
    const categoryTags = {
        'Électronique': ['tech', 'gadget', 'innovation', 'digital'],
        'Mode': ['fashion', 'style', 'tendance', 'vêtement'],
        'Maison & Jardin': ['maison', 'décoration', 'jardin', 'habitat'],
        'Automobile': ['auto', 'véhicule', 'transport', 'mécanique'],
        'Santé & Beauté': ['santé', 'beauté', 'bien-être', 'cosmétique'],
        'Sports & Loisirs': ['sport', 'fitness', 'loisir', 'activité']
    };
    
    const specificTags = categoryTags[categorie] || ['produit', 'article'];
    const allTags = [...baseTags, ...specificTags];
    
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Tags optimisés avec succès (IA simulée)',
            data: { tags: allTags.slice(0, 8) } // Limiter à 8 tags
        });
    }, 1500);
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur serveur'
    });
});

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('🚀 =============================================');
    console.log('🧪 SERVEUR MIREB CRM - MODE DÉMONSTRATION');
    console.log('🚀 =============================================');
    console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 Mode: DEMO (données en mémoire)`);
    console.log(`📦 Produits initiaux: ${demoData.produits.length}`);
    console.log('🌐 CORS activé pour localhost:3000 et GitHub Pages');
    console.log('🧪 Toutes les données sont simulées');
    console.log('🚀 =============================================');
});
