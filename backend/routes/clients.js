import express from 'express';
import Client from '../models/Client.js.js.js';
import { validateInput } from '../middleware/auth.js.js.js';
import { clientSchema } from '../middleware/validation.js.js.js';

const router = express.Router();
// GET /api/clients - Obtenir tous les clients
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = { isActif: true };
    // Filtres
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.search) {
      filter.$or = [
        { nom: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { telephone: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const clients = await Client.find(filter)
      .sort({ derniereActivite: -1 })
      .skip(skip)
      .limit(limit)
      .select('-notes'); // Exclure les notes pour la liste
    const total = await Client.countDocuments(filter);
    res.json({
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
      error: error.message
  }
});
// GET /api/clients/:id - Obtenir un client spécifique
router.get('/:id', async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
      data: client
    console.error('Erreur lors de la récupération du client:', error);
      message: 'Erreur lors de la récupération du client',
// POST /api/clients - Créer un nouveau client
router.post('/', validateInput(clientSchema), async (req, res) => {
    // Vérifier si l'email existe déjà
    if (req.body.email) {
      const existingClient = await Client.findOne({ 
        email: req.body.email,
        isActif: true 
      
      if (existingClient) {
        return res.status(409).json({
          success: false,
          message: 'Un client avec cet email existe déjà'
        });
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({
      message: 'Client créé avec succès',
    console.error('Erreur lors de la création du client:', error);
      message: 'Erreur lors de la création du client',
// PUT /api/clients/:id - Mettre à jour un client
router.put('/:id', validateInput(clientSchema), async (req, res) => {
    // Vérifier l'email unique (si modifié)
    if (req.body.email && req.body.email !== client.email) {
        _id: { $ne: req.params.id },
    Object.assign(client, req.body);
      message: 'Client mis à jour avec succès',
    console.error('Erreur lors de la mise à jour du client:', error);
      message: 'Erreur lors de la mise à jour du client',
// DELETE /api/clients/:id - Supprimer un client (soft delete)
router.delete('/:id', async (req, res) => {
    client.isActif = false;
      message: 'Client supprimé avec succès'
    console.error('Erreur lors de la suppression du client:', error);
      message: 'Erreur lors de la suppression du client',
// POST /api/clients/:id/notes - Ajouter une note à un client
router.post('/:id/notes', async (req, res) => {
    const { contenu, auteur } = req.body;
    if (!contenu || !auteur) {
      return res.status(400).json({
        message: 'Le contenu et l\'auteur sont requis'
    await client.ajouterNote(contenu, auteur);
      message: 'Note ajoutée avec succès',
    console.error('Erreur lors de l\'ajout de la note:', error);
      message: 'Erreur lors de l\'ajout de la note',
// PUT /api/clients/:id/statut - Changer le statut d'un client
router.put('/:id/statut', async (req, res) => {
    const { statut } = req.body;
    if (!statut) {
        message: 'Le statut est requis'
    const statutsValides = ['prospect', 'client', 'client_fidele', 'inactif'];
    if (!statutsValides.includes(statut)) {
        message: 'Statut invalide'
    await client.mettreAJourStatut(statut);
      message: 'Statut mis à jour avec succès',
    console.error('Erreur lors de la mise à jour du statut:', error);
      message: 'Erreur lors de la mise à jour du statut',
// GET /api/clients/stats/overview - Statistiques des clients
router.get('/stats/overview', async (req, res) => {
    const stats = await Client.obtenirStatistiques();
    const total = await Client.countDocuments({ isActif: true });
    const nouveauxCeMois = await Client.countDocuments({
      isActif: true,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      data: {
        ...stats,
        totalClients: total,
        nouveauxCeMois
    console.error('Erreur lors de la récupération des statistiques:', error);
      message: 'Erreur lors de la récupération des statistiques',
// GET /api/clients/search/:terme - Recherche de clients
router.get('/search/:terme', async (req, res) => {
    const clients = await Client.rechercherClients(req.params.terme);
      data: clients
    console.error('Erreur lors de la recherche:', error);
      message: 'Erreur lors de la recherche',
export default router;
