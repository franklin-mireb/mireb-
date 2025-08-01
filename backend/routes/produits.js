import express from 'express';
const router = express.Router();

// Base de données temporaire en mémoire pour les tests
let produits = [
  {
    id: 1,
    nom: "iPhone 14 Pro",
    description: "Smartphone Apple dernière génération avec puce A16 Bionic",
    prix: 1200,
    categorie: "Électronique",
    stock: 15,
    stockMinimum: 5,
    adresse: "Avenue de la Révolution",
    ville: "Kinshasa",
    images: [
      {
        url: "https://via.placeholder.com/400x300",
        alt: "iPhone 14 Pro",
        isPrimaire: true
      }
    ],
    tags: ["iphone", "apple", "smartphone", "electronique"],
    caracteristiques: [
      { nom: "Écran", valeur: "6.1", unite: "pouces" },
      { nom: "Stockage", valeur: "128", unite: "GB" }
    ],
    createdAt: new Date().toISOString(),
    createdBy: "Admin"
  }
];

// Schema de validation simplifié
const validateProduit = (data) => {
  const required = ['nom', 'categorie', 'prix', 'stock', 'description'];
  for (let field of required) {
    if (!data[field]) {
      throw new Error(`Le champ ${field} est requis`);
    }
  }
  if (isNaN(data.prix) || data.prix <= 0) {
    throw new Error('Le prix doit être un nombre positif');
  }
  if (isNaN(data.stock) || data.stock < 0) {
    throw new Error('Le stock doit être un nombre positif ou zéro');
  }
};

// @route   GET api/produits
// @desc    Get all products with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, categorie, search } = req.query;
    
    console.log('🔄 Requête GET /api/produits avec params:', { page, limit, categorie, search });
    
    let filteredProduits = [...produits];

    // Filtrage par catégorie
    if (categorie) {
      filteredProduits = filteredProduits.filter(p => 
        p.categorie.toLowerCase().includes(categorie.toLowerCase())
      );
    }

    // Recherche textuelle
    if (search) {
      filteredProduits = filteredProduits.filter(p =>
        p.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.categorie.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProduits = filteredProduits.slice(startIndex, endIndex);

    const response = {
      success: true,
      data: paginatedProduits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProduits.length / limit),
        total: filteredProduits.length,
        hasNext: endIndex < filteredProduits.length,
        hasPrev: startIndex > 0
      }
    };

    console.log('✅ Produits récupérés:', response.data.length);
    res.json(response);
  } catch (error) {
    console.error('❌ Erreur récupération produits:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
});

// @route   POST api/produits
// @desc    Create a new product
// @access  Public (simplifié pour le débogage)
router.post('/', async (req, res) => {
  try {
    console.log('🔄 Requête POST /api/produits reçue:', req.body);
    
    // Validation des données
    validateProduit(req.body);
    
    const {
      nom,
      description,
      prix,
      categorie,
      stock,
      stockMinimum = 5,
      adresse,
      ville,
      images = [],
      tags = [],
      caracteristiques = []
    } = req.body;

    const newProduit = {
      id: produits.length + 1,
      nom,
      description,
      prix: parseFloat(prix),
      categorie,
      stock: parseInt(stock),
      stockMinimum: parseInt(stockMinimum),
      adresse,
      ville,
      images,
      tags,
      caracteristiques,
      createdAt: new Date().toISOString(),
      createdBy: req.body.createdBy || 'Admin'
    };

    produits.push(newProduit);
    
    console.log('✅ Produit créé avec succès:', newProduit.id);
    
    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: newProduit
    });
  } catch (error) {
    console.error('❌ Erreur création produit:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET api/produits/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const produit = produits.find(p => p.id === parseInt(req.params.id));
    
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
    console.error('❌ Erreur récupération produit:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message
    });
  }
});

export default router;
