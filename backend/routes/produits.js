import express from 'express';
const router = express.Router();
import { auth, requireAdmin } from '../middleware/auth.js.js';
import { validate, schemas } from '../middleware/validation.js.js';
import Produit from '../models/Produit.js.js';

// @route   POST api/produits
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', [auth, requireAdmin, validate(schemas.createProduit)], async (req, res) => {
  try {
    const { nom, description, prix, categorie, stock, images } = req.body;
    const newProduit = new Produit({
      nom,
      description,
      prix,
      categorie,
      stock,
      images,
    });
    const produit = await newProduit.save();
    res.status(201).json(produit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});
// @route   GET api/produits
// @desc    Get all products with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, categorie, search } = req.query;
    const query = {};
    if (categorie) query.categorie = categorie;
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categorie: { $regex: search, $options: 'i' } },
      ];
    }
    const produits = await Produit.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const count = await Produit.countDocuments(query);
    res.json({
      produits,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProduits: count
// @route   GET api/produits/:id
// @desc    Get a single product by ID
router.get('/:id', async (req, res) => {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Produit non trouvé' });
// @route   PUT api/produits/:id
// @desc    Update a product
router.put('/:id', [auth, requireAdmin, validate(schemas.createProduit)], async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
// @route   DELETE api/produits/:id
// @desc    Delete a product
router.delete('/:id', [auth, requireAdmin], async (req, res) => {
        const produit = await Produit.findById(req.params.id);
        await Produit.deleteOne({ _id: req.params.id });
        res.json({ message: 'Produit supprimé avec succès.' });
export default router;
// GET /api/produits/:id - Obtenir un produit spécifique
    
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    // Incrémenter le compteur de vues
    await produit.incrementerVue();
      success: true,
      data: produit
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message
// POST /api/produits - Créer un nouveau produit
router.post('/', validateInput(produitSchema), async (req, res) => {
    const produit = new Produit(req.body);
    await produit.save();
    res.status(201).json({
      message: 'Produit créé avec succès',
    console.error('Erreur lors de la création du produit:', error);
      message: 'Erreur lors de la création du produit',
// PUT /api/produits/:id - Mettre à jour un produit
router.put('/:id', validateInput(produitSchema), async (req, res) => {
    Object.assign(produit, req.body);
      message: 'Produit mis à jour avec succès',
    console.error('Erreur lors de la mise à jour du produit:', error);
      message: 'Erreur lors de la mise à jour du produit',
// DELETE /api/produits/:id - Supprimer un produit (soft delete)
router.delete('/:id', async (req, res) => {
    produit.isActif = false;
      message: 'Produit supprimé avec succès'
    console.error('Erreur lors de la suppression du produit:', error);
      message: 'Erreur lors de la suppression du produit',
// POST /api/produits/:id/avis - Ajouter un avis
router.post('/:id/avis', async (req, res) => {
    const { auteur, email, note, commentaire } = req.body;
    if (!auteur || !note) {
      return res.status(400).json({
        message: 'L\'auteur et la note sont requis'
    if (note < 1 || note > 5) {
        message: 'La note doit être entre 1 et 5'
    await produit.ajouterAvis(auteur, email, note, commentaire);
      message: 'Avis ajouté avec succès',
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
      message: 'Erreur lors de l\'ajout de l\'avis',
// PUT /api/produits/:id/stock - Mettre à jour le stock
router.put('/:id/stock', async (req, res) => {
    const { quantite, operation = 'retirer' } = req.body;
    if (!quantite || quantite <= 0) {
        message: 'La quantité doit être positive'
    await produit.mettreAJourStock(quantite, operation);
      message: 'Stock mis à jour avec succès',
    console.error('Erreur lors de la mise à jour du stock:', error);
      message: 'Erreur lors de la mise à jour du stock',
// GET /api/produits/search/:terme - Recherche de produits
router.get('/search/:terme', async (req, res) => {
    const { terme } = req.params;
    const options = {
      categorie: req.query.categorie,
      prixMin: req.query.prixMin ? parseFloat(req.query.prixMin) : undefined,
      prixMax: req.query.prixMax ? parseFloat(req.query.prixMax) : undefined,
      enStock: req.query.enStock === 'true',
      limit: parseInt(req.query.limit) || 20,
      sort: req.query.sort ? { [req.query.sort]: req.query.order === 'desc' ? -1 : 1 } : undefined
    };
    const produits = await Produit.rechercherProduits(terme, options);
      data: produits
    console.error('Erreur lors de la recherche:', error);
      message: 'Erreur lors de la recherche',
// GET /api/produits/populaires - Produits populaires
router.get('/populaires', async (req, res) => {
    const limite = parseInt(req.query.limit) || 10;
    const produits = await Produit.obtenirProduitsPopulaires(limite);
    console.error('Erreur lors de la récupération des produits populaires:', error);
      message: 'Erreur lors de la récupération des produits populaires',
// GET /api/produits/promotions - Produits en promotion
router.get('/promotions', async (req, res) => {
    const produits = await Produit.obtenirProduitsEnPromotion();
    console.error('Erreur lors de la récupération des promotions:', error);
      message: 'Erreur lors de la récupération des promotions',
// GET /api/produits/stats/overview - Statistiques des produits
router.get('/stats/overview', async (req, res) => {
    const stats = await Produit.obtenirStatistiques();
      data: stats
    console.error('Erreur lors de la récupération des statistiques:', error);
      message: 'Erreur lors de la récupération des statistiques',
