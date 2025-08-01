// Backend de démonstration ultra-simple avec Node.js natif
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const PORT = process.env.PORT || 5000;

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
    ]
};

// Fonction pour parser le body JSON
function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve({});
            }
        });
    });
}

// Fonction pour envoyer une réponse JSON avec CORS
function sendJSON(res, statusCode, data) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    
    res.statusCode = statusCode;
    res.end(JSON.stringify(data, null, 2));
}

// Serveur HTTP
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    console.log(`${method} ${path}`);

    // Gestion des requêtes OPTIONS pour CORS
    if (method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.statusCode = 200;
        res.end();
        return;
    }

    // Route status
    if (path === '/api/status' && method === 'GET') {
        sendJSON(res, 200, {
            status: 'running',
            mode: 'demo',
            message: 'Backend Mireb en mode démonstration (Node.js natif)',
            timestamp: new Date().toISOString(),
            data: {
                produits: demoData.produits.length
            }
        });
        return;
    }

    // Route GET /api/produits
    if (path === '/api/produits' && method === 'GET') {
        console.log('📦 GET /api/produits - Mode DEMO');
        sendJSON(res, 200, {
            success: true,
            data: demoData.produits,
            total: demoData.produits.length
        });
        return;
    }

    // Route GET /api/produits/:id
    if (path.startsWith('/api/produits/') && method === 'GET') {
        const id = path.split('/')[3];
        const produit = demoData.produits.find(p => p.id === id);
        
        if (!produit) {
            sendJSON(res, 404, {
                success: false,
                message: 'Produit non trouvé'
            });
            return;
        }
        
        sendJSON(res, 200, {
            success: true,
            data: produit
        });
        return;
    }

    // Route POST /api/produits
    if (path === '/api/produits' && method === 'POST') {
        console.log('📦 POST /api/produits - Mode DEMO');
        
        try {
            const body = await parseBody(req);
            console.log('📝 Données reçues:', body);
            
            const nouveauProduit = {
                id: Date.now().toString(),
                ...body,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            demoData.produits.push(nouveauProduit);
            
            console.log('✅ Produit ajouté:', nouveauProduit.nom);
            console.log('📊 Total produits:', demoData.produits.length);
            
            sendJSON(res, 201, {
                success: true,
                message: 'Produit créé avec succès en mode DEMO',
                data: nouveauProduit
            });
        } catch (error) {
            console.error('❌ Erreur création produit:', error);
            sendJSON(res, 500, {
                success: false,
                message: 'Erreur lors de la création du produit',
                error: error.message
            });
        }
        return;
    }

    // Route PUT /api/produits/:id
    if (path.startsWith('/api/produits/') && method === 'PUT') {
        const id = path.split('/')[3];
        const index = demoData.produits.findIndex(p => p.id === id);
        
        if (index === -1) {
            sendJSON(res, 404, {
                success: false,
                message: 'Produit non trouvé'
            });
            return;
        }
        
        const body = await parseBody(req);
        demoData.produits[index] = {
            ...demoData.produits[index],
            ...body,
            id,
            updatedAt: new Date().toISOString()
        };
        
        sendJSON(res, 200, {
            success: true,
            message: 'Produit mis à jour avec succès',
            data: demoData.produits[index]
        });
        return;
    }

    // Route DELETE /api/produits/:id
    if (path.startsWith('/api/produits/') && method === 'DELETE') {
        const id = path.split('/')[3];
        const index = demoData.produits.findIndex(p => p.id === id);
        
        if (index === -1) {
            sendJSON(res, 404, {
                success: false,
                message: 'Produit non trouvé'
            });
            return;
        }
        
        const produitSupprime = demoData.produits.splice(index, 1)[0];
        
        sendJSON(res, 200, {
            success: true,
            message: 'Produit supprimé avec succès',
            data: produitSupprime
        });
        return;
    }

    // Route POST /api/upload
    if (path === '/api/upload' && method === 'POST') {
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
            sendJSON(res, 200, {
                success: true,
                message: 'Images uploadées avec succès (mode DEMO)',
                data: fakeImages
            });
        }, 1000);
        return;
    }

    // Route POST /api/ai/description
    if (path === '/api/ai/description' && method === 'POST') {
        console.log('🤖 POST /api/ai/description - Mode DEMO');
        const body = await parseBody(req);
        const { nom, categorie } = body;
        
        const descriptions = [
            `${nom} est un produit exceptionnel dans la catégorie ${categorie}. Conçu avec les dernières technologies, il offre une expérience utilisateur incomparable et un design élégant qui séduira tous les utilisateurs.`,
            `Découvrez ${nom}, l'innovation parfaite en ${categorie}. Ce produit révolutionnaire combine performance, style et durabilité pour répondre à tous vos besoins avec une qualité premium.`,
            `${nom} représente l'excellence dans le domaine ${categorie}. Ses caractéristiques avancées et sa finition soignée en font un choix de premier plan pour les consommateurs exigeants.`
        ];
        
        setTimeout(() => {
            const description = descriptions[Math.floor(Math.random() * descriptions.length)];
            sendJSON(res, 200, {
                success: true,
                message: 'Description générée avec succès (IA simulée)',
                data: { description }
            });
        }, 2000);
        return;
    }

    // Route POST /api/ai/tags
    if (path === '/api/ai/tags' && method === 'POST') {
        console.log('🏷️ POST /api/ai/tags - Mode DEMO');
        const body = await parseBody(req);
        const { nom, categorie } = body;
        
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
            sendJSON(res, 200, {
                success: true,
                message: 'Tags optimisés avec succès (IA simulée)',
                data: { tags: allTags.slice(0, 8) } // Limiter à 8 tags
            });
        }, 1500);
        return;
    }

    // Route 404 par défaut
    sendJSON(res, 404, {
        success: false,
        message: 'Route non trouvée',
        path: path
    });
});

// Démarrage du serveur
server.listen(PORT, () => {
    console.log('🚀 =============================================');
    console.log('🧪 SERVEUR MIREB CRM - MODE DÉMONSTRATION');
    console.log('🚀 =============================================');
    console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 Mode: DEMO (données en mémoire)`);
    console.log(`📦 Produits initiaux: ${demoData.produits.length}`);
    console.log('🌐 CORS activé pour tous les domaines');
    console.log('🧪 Toutes les données sont simulées');
    console.log('🔗 API Status: http://localhost:5000/api/status');
    console.log('📄 Test Admin: admin-add-product-demo.html');
    console.log('🚀 =============================================');
});
