import express from 'express';
const router = express.Router();
import { auth, requireCommercial, requireAdmin } from '../middleware/auth.js.js';
import { validate, schemas } from '../middleware/validation.js.js';
import Lead from '../models/Lead.js.js';
import User from '../models/User.js.js';

// @route   POST api/leads
// @desc    Create a new lead
// @access  Private (Commercial or Admin)
router.post('/', [auth, requireCommercial, validate(schemas.createLead)], async (req, res) => {
  try {
    const { nom, email, telephone, adresse, ville, entreprise, source } = req.body;
    const newLead = new Lead({
      nom,
      email,
      telephone,
      adresse,
      ville,
      entreprise,
      source,
      creePar: req.user.id,
      assigneA: req.user.id, // Assign to self by default
    });
    const lead = await newLead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur');
  }
});
// @route   GET api/leads
// @desc    Get all leads with pagination and filtering
router.get('/', [auth, requireCommercial], async (req, res) => {
    const { page = 1, limit = 10, statut, source, search } = req.query;
    const query = {};
    // Role-based access: Admins see all, commercials see their own or unassigned
    if (req.user.role !== 'admin') {
        query.$or = [
            { assigneA: req.user.id },
            { assigneA: null }
        ];
    }
    if (statut) query.statut = statut;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { entreprise: { $regex: search, $options: 'i' } },
      ];
    const leads = await Lead.find(query)
      .populate('creePar', 'nom email')
      .populate('assigneA', 'nom email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const count = await Lead.countDocuments(query);
    res.json({
      leads,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalLeads: count
// @route   GET api/leads/:id
// @desc    Get a single lead by ID
router.get('/:id', [auth, requireCommercial], async (req, res) => {
    const lead = await Lead.findById(req.params.id)
      .populate('assigneA', 'nom email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead non trouvé' });
    // Security check: ensure commercial can only access their leads
    if (req.user.role !== 'admin' && lead.assigneA && lead.assigneA.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Accès non autorisé à ce lead.' });
    res.json(lead);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Lead non trouvé (ID invalide)' });
// @route   PUT api/leads/:id/status
// @desc    Update lead status
router.put('/:id/status', [auth, requireCommercial], async (req, res) => {
    try {
        const { statut } = req.body;
        if (!['nouveau', 'contacté', 'qualifié', 'perdu', 'gagné'].includes(statut)) {
            return res.status(400).json({ message: 'Statut non valide.' });
        }
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead non trouvé' });
        if (req.user.role !== 'admin' && lead.assigneA && lead.assigneA.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        lead.statut = statut;
        await lead.save();
        
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
// @route   PUT api/leads/:id/assign
// @desc    Assign a lead to a user
// @access  Private (Admin)
router.put('/:id/assign', [auth, requireAdmin], async (req, res) => {
        const { userId } = req.body;
        const userToAssign = await User.findById(userId);
        if (!userToAssign || (userToAssign.role !== 'commercial' && userToAssign.role !== 'admin')) {
            return res.status(400).json({ message: 'Utilisateur invalide ou non autorisé pour l\'assignation.' });
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { assigneA: userId },
            { new: true }
        ).populate('assigneA', 'nom email');
// @route   DELETE api/leads/:id
// @desc    Delete a lead
router.delete('/:id', [auth, requireAdmin], async (req, res) => {
        await lead.remove();
        res.json({ message: 'Lead supprimé avec succès.' });
export default router;
