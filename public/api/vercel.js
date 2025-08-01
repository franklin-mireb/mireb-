// API principale pour Vercel - Mireb CRM
let dbData = {
  produits: [],
  leads: [],
  analytics: {
    totalProduits: 0,
    totalLeads: 0,
    lastUpdate: new Date().toISOString()
  }
};

// Fonction pour générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const urlParts = url.split('/api/')[1]?.split('/') || [];
  const endpoint = urlParts[0];
  const action = urlParts[1];

  try {
    // Health check
    if (endpoint === 'health') {
      return res.status(200).json({
        success: true,
        message: 'Mireb CRM API Vercel opérationnel ✅',
        timestamp: new Date().toISOString()
      });
    }

    // Gestion des produits
    if (endpoint === 'produits') {
      if (method === 'GET') {
        return res.status(200).json({
          success: true,
          data: dbData.produits,
          count: dbData.produits.length
        });
      }
      
      if (method === 'POST') {
        const produit = {
          id: generateId(),
          ...req.body,
          dateCreation: new Date().toISOString()
        };
        
        dbData.produits.push(produit);
        dbData.analytics.totalProduits = dbData.produits.length;
        dbData.analytics.lastUpdate = new Date().toISOString();
        
        return res.status(201).json({
          success: true,
          message: 'Produit créé avec succès ✅',
          data: produit
        });
      }
    }

    // Gestion des leads
    if (endpoint === 'leads') {
      if (method === 'GET') {
        return res.status(200).json({
          success: true,
          data: dbData.leads,
          count: dbData.leads.length
        });
      }
      
      if (method === 'POST') {
        const lead = {
          id: generateId(),
          ...req.body,
          statut: req.body.statut || 'nouveau',
          source: req.body.source || 'Site Web',
          dateCreation: new Date().toISOString()
        };
        
        dbData.leads.push(lead);
        dbData.analytics.totalLeads = dbData.leads.length;
        dbData.analytics.lastUpdate = new Date().toISOString();
        
        return res.status(201).json({
          success: true,
          message: 'Lead créé avec succès ✅',
          data: lead
        });
      }
    }

    // Analytics
    if (endpoint === 'analytics') {
      if (action === 'dashboard') {
        return res.status(200).json({
          success: true,
          data: {
            ...dbData.analytics,
            produitsRecents: dbData.produits.slice(-5),
            leadsRecents: dbData.leads.slice(-5)
          }
        });
      }
    }

    // Simulation OpenAI
    if (endpoint === 'openai') {
      if (action === 'generate-description') {
        const { nom, categorie } = req.body;
        return res.status(200).json({
          success: true,
          data: {
            description: `Description optimisée pour ${nom} - ${categorie}. Produit de haute qualité avec caractéristiques exceptionnelles.`,
            tags: ['premium', 'qualité', categorie?.toLowerCase()].filter(Boolean)
          }
        });
      }
      
      if (action === 'optimize-tags') {
        return res.status(200).json({
          success: true,
          data: {
            tags: ['optimisé', 'ia', 'premium', 'tendance'],
            score: 85
          }
        });
      }
    }

    // Upload simulation
    if (endpoint === 'upload' && action === 'single') {
      return res.status(200).json({
        success: true,
        data: {
          url: 'https://via.placeholder.com/300x200',
          filename: 'image-uploaded.jpg'
        }
      });
    }

    // Endpoint non trouvé
    return res.status(404).json({
      success: false,
      message: 'Endpoint non trouvé'
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
}
