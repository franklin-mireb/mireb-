import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validate, schemas } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Un utilisateur avec cet email existe déjà.' 
      });
    }

    user = new User({
      nom,
      email,
      password
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              nom: user.nom,
              email: user.email,
              role: user.role
            }
          },
          message: 'Utilisateur créé avec succès'
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur du serveur' 
    });
  }
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifiants invalides.' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifiants invalides.' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Ce compte est désactivé.' 
      });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              nom: user.nom,
              email: user.email,
              role: user.role
            }
          },
          message: 'Connexion réussie'
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur du serveur' 
    });
  }
});

// @route   GET api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé.' 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur du serveur' 
    });
  }
});

// @route   POST api/auth/logout
// @desc    Logout user (mainly for client-side cleanup)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

export default router;

