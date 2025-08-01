import Joi from 'joi';

const schemas = {
  register: Joi.object({
    nom: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  createLead: Joi.object({
    nom: Joi.string().required(),
    email: Joi.string().email().required(),
    telephone: Joi.string().optional().allow(''),
    adresse: Joi.string().optional().allow(''),
    ville: Joi.string().optional().allow(''),
    entreprise: Joi.string().optional().allow(''),
    source: Joi.string().optional().allow(''),
  }),
  createProduit: Joi.object({
    nom: Joi.string().trim().min(2).max(200).required().messages({
      'string.base': 'Le nom doit être une chaîne de caractères',
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 200 caractères',
      'any.required': 'Le nom du produit est obligatoire'
    }),
    description: Joi.string().trim().optional().allow('').default('<p>Description à compléter</p>').messages({
      'string.base': 'La description doit être une chaîne de caractères'
    }),
    prix: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Le prix doit être un nombre',
      'number.positive': 'Le prix doit être positif',
      'any.required': 'Le prix est obligatoire'
    }),
    categorie: Joi.string().trim().min(2).max(100).required().messages({
      'string.base': 'La catégorie doit être une chaîne de caractères',
      'string.empty': 'La catégorie est requise',
      'string.min': 'La catégorie doit contenir au moins 2 caractères',
      'string.max': 'La catégorie ne peut pas dépasser 100 caractères',
      'any.required': 'La catégorie est obligatoire'
    }),
    stock: Joi.number().integer().min(0).default(0).messages({
      'number.base': 'Le stock doit être un nombre',
      'number.integer': 'Le stock doit être un nombre entier',
      'number.min': 'Le stock ne peut pas être négatif'
    }),
    images: Joi.alternatives().try(
      Joi.array().items(Joi.string().uri().messages({
        'string.uri': 'Chaque image doit être une URL valide'
      })),
      Joi.string().custom((value, helpers) => {
        // Permettre les chaînes séparées par des virgules
        const urls = value.split(',').map(url => url.trim()).filter(Boolean);
        for (const url of urls) {
          try {
            new URL(url);
          } catch (error) {
            return helpers.error('any.invalid');
          }
        }
        return urls;
      }, 'URL validation')
    ).optional().default([]).messages({
      'any.invalid': 'Les URLs d\'images doivent être valides'
    }),
    tags: Joi.array().items(Joi.string().trim().max(50)).optional().default([]).messages({
      'array.base': 'Les tags doivent être un tableau',
      'string.max': 'Chaque tag ne peut pas dépasser 50 caractères'
    }),
    rating: Joi.number().min(0).max(5).precision(1).optional().messages({
      'number.base': 'La note doit être un nombre',
      'number.min': 'La note ne peut pas être inférieure à 0',
      'number.max': 'La note ne peut pas être supérieure à 5'
    }),
    reviews: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Le nombre d\'avis doit être un nombre',
      'number.integer': 'Le nombre d\'avis doit être un nombre entier',
      'number.min': 'Le nombre d\'avis ne peut pas être négatif'
    })
  }),
  updateProduit: Joi.object({
    nom: Joi.string().trim().min(2).max(200).optional(),
    description: Joi.string().trim().optional().allow(''),
    prix: Joi.number().positive().precision(2).optional(),
    categorie: Joi.string().trim().min(2).max(100).optional(),
    stock: Joi.number().integer().min(0).optional(),
    images: Joi.alternatives().try(
      Joi.array().items(Joi.string().uri()),
      Joi.string()
    ).optional(),
    tags: Joi.array().items(Joi.string().trim().max(50)).optional(),
    rating: Joi.number().min(0).max(5).precision(1).optional(),
    reviews: Joi.number().integer().min(0).optional()
  }),
  generateDescription: Joi.object({
    nom: Joi.string().trim().min(2).max(200).required().messages({
      'any.required': 'Le nom du produit est requis pour générer une description'
    }),
    categorie: Joi.string().trim().optional(),
    prix: Joi.number().positive().optional(),
    image: Joi.string().uri().optional().messages({
      'string.uri': 'L\'URL de l\'image doit être valide'
    }),
    features: Joi.array().items(Joi.string()).optional(),
    target: Joi.string().valid('jeune', 'adulte', 'senior', 'professionnel', 'general').optional().default('general')
  })
};

// Exports individuels pour ES modules
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const clientSchema = schemas.createLead;
export const productSchema = schemas.createProduit;
export const authSchemas = {
  register: schemas.register,
  login: schemas.login
};

export { schemas };
export default { validate, schemas };
