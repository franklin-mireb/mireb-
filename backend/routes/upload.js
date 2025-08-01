import express from 'express';
import multer from 'multer';
import { bucket } from '../firebase.js';
import path from 'path';

const router = express.Router();

// Configuration Multer pour le stockage temporaire
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp')
      .split(',');
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  }
});

// POST /api/upload/single - Upload d'un fichier unique vers Firebase Storage
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Générer un nom de fichier unique
    const fileName = `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Uploader le fichier vers Firebase Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Rendre le fichier public
    await file.makePublic();
    
    // Générer l'URL publique
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    res.json({
      success: true,
      message: 'Fichier uploadé avec succès (Firebase)',
      data: {
        url: publicUrl,
        fileName: fileName,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Erreur upload Firebase:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// POST /api/upload/multiple - Upload de plusieurs fichiers
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const fileName = `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
      const firebaseFile = bucket.file(fileName);

      await firebaseFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadedAt: new Date().toISOString()
          }
        }
      });

      await firebaseFile.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return {
        originalName: file.originalname,
        url: publicUrl,
        fileName: fileName,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    const results = await Promise.allSettled(uploadPromises);
    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    const failed = results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason);

    res.json({
      success: true,
      message: `${successful.length} fichier(s) uploadé(s) avec succès`,
      data: {
        successful,
        failed,
        total: req.files.length
      }
    });

  } catch (error) {
    console.error('Erreur upload multiple Firebase:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload multiple',
      error: error.message
    });
  }
});

// DELETE /api/upload/:fileName - Supprimer un fichier
router.delete('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier requis'
      });
    }

    const file = bucket.file(fileName);
    await file.delete();

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression Firebase:', error);
    res.status(404).json({
      success: false,
      message: 'Fichier non trouvé ou erreur de suppression',
      error: error.message
    });
  }
});

// GET /api/upload/images - Lister les images uploadées
router.get('/images', async (req, res) => {
  try {
    const prefix = req.query.folder || 'uploads/';
    const maxResults = parseInt(req.query.max_results) || 50;

    const [files] = await bucket.getFiles({
      prefix,
      maxResults
    });

    const images = files.map(file => ({
      fileName: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      timeCreated: file.metadata.timeCreated,
      updated: file.metadata.updated
    }));

    res.json({
      success: true,
      data: {
        images,
        total: images.length
      }
    });

  } catch (error) {
    console.error('Erreur liste images Firebase:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des images',
      error: error.message
    });
  }
});

// Middleware de gestion d'erreurs pour Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers'
      });
    }
  }
  
  if (error.message === 'Type de fichier non autorisé') {
    return res.status(400).json({
      success: false,
      message: 'Type de fichier non autorisé'
    });
  }

  next(error);
});

export default router;
