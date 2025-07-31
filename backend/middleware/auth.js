import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
// import slowDown from 'express-slow-down'; // Temporairement commenté

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'Aucun token, autorisation refusée' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Le token n\'est pas valide' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès admin requis.' });
  }
};

const requireCommercial = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'commercial')) {
    next();
  } else {
    res.status(403).json({ message: 'Accès commercial ou admin requis.' });
  }
};


// Exports pour ES modules
export { auth, requireAdmin, requireCommercial };

// Rate limiting pour l'API du chatbot
export const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 messages par minute
  message: {
    success: false,
    message: 'Trop de messages envoyés, veuillez ralentir'
  }
});

// Slow down pour les uploads (temporairement désactivé)
/*
export const uploadSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Ralentir après 5 uploads
  delayMs: 500, // Ajouter 500ms de délai par upload supplémentaire
  maxDelayMs: 5000 // Délai maximum de 5 secondes
});
*/

// Middleware de validation des données d'entrée
export const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors
        });
      }

      req.body = value;
      next();
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        error: err.message
      });
    }
  };
};

// Middleware de journalisation des requêtes sensibles
export const logSensitiveAction = (action) => {
  return (req, res, next) => {
    const logData = {
      action,
      userId: req.user?.id || 'anonymous',
      userRole: req.user?.role || 'unknown',
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      path: req.path,
      method: req.method,
      body: req.method === 'POST' || req.method === 'PUT' ? 
        JSON.stringify(req.body).substring(0, 500) : undefined
    };

    console.log('Action sensible:', JSON.stringify(logData, null, 2));

    // Ici, vous pourriez sauvegarder dans une base de données d'audit
    // await AuditLog.create(logData);

    next();
  };
};

// Middleware de gestion des erreurs async
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware de pagination
export const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Limiter la taille de page pour éviter les abus
  const maxLimit = 100;
  const finalLimit = Math.min(limit, maxLimit);

  req.pagination = {
    page: Math.max(1, page),
    limit: finalLimit,
    skip: Math.max(0, skip)
  };

  next();
};

// Middleware de cache simple
export const cache = (duration = 300) => { // 5 minutes par défaut
  const cache = new Map();
  
  return (req, res, next) => {
    // Générer une clé de cache basée sur l'URL et les query params
    const key = req.originalUrl || req.url;
    const cached = cache.get(key);

    if (cached && (Date.now() - cached.timestamp) < duration * 1000) {
      return res.json(cached.data);
    }

    // Intercepter la méthode res.json
    const originalJson = res.json;
    res.json = function(data) {
      // Mettre en cache seulement les réponses réussies
      if (res.statusCode === 200) {
        cache.set(key, {
          data,
          timestamp: Date.now()
        });

        // Nettoyer le cache périodiquement
        if (cache.size > 1000) {
          const oldestKey = cache.keys().next().value;
          cache.delete(oldestKey);
        }
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware de sécurité pour les uploads
export const secureUpload = (req, res, next) => {
  // Vérifier les types de fichiers autorisés
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (req.file || req.files) {
    const files = req.files || [req.file];
    
    for (const file of files) {
      if (file && !allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Type de fichier non autorisé: ${file.mimetype}`
        });
      }

      // Vérifier la taille du fichier (10MB max)
      if (file && file.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Fichier trop volumineux (10MB maximum)'
        });
      }
    }
  }

  next();
};

// Middleware de nettoyage des données de sortie
export const sanitizeOutput = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Supprimer les champs sensibles des objets utilisateur
    if (data && typeof data === 'object') {
      const cleaned = JSON.parse(JSON.stringify(data), (key, value) => {
        // Supprimer les mots de passe et autres données sensibles
        if (key === 'password' || key === 'passwordHash' || key === '__v') {
          return undefined;
        }
        return value;
      });
      
      return originalJson.call(this, cleaned);
    }
    
    return originalJson.call(this, data);
  };

  next();
};

// Middleware de détection de bot/crawler
export const detectBot = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];

  req.isBot = botPatterns.some(pattern => pattern.test(userAgent));
  
  // Limiter l'accès pour les bots sur certaines routes
  if (req.isBot && req.path.includes('/api/')) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé pour les bots'
    });
  }

  next();
};
