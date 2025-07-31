import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  email: {
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  telephone: {
    required: [true, 'Le téléphone est requis'],
    match: [/^[+]?[0-9\s-()]+$/, 'Numéro de téléphone invalide']
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: {
      type: String,
      default: 'Congo RDC'
    }
  dateNaissance: Date,
  sexe: {
    enum: ['Homme', 'Femme', 'Autre'],
    default: 'Autre'
  statut: {
    enum: ['prospect', 'client', 'client_fidele', 'inactif'],
    default: 'prospect'
  sourceAcquisition: {
    enum: ['site_web', 'facebook', 'whatsapp', 'recommandation', 'publicite', 'autre'],
    default: 'site_web'
  preferences: {
    categories: [String],
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: true }
    },
    langue: {
      default: 'fr',
      enum: ['fr', 'en', 'ln', 'sw']
  valeurVieTotale: {
    type: Number,
    default: 0,
    min: 0
  nombreCommandes: {
  derniereActivite: {
    type: Date,
    default: Date.now
  notes: [{
    contenu: String,
    auteur: String,
    date: {
      type: Date,
      default: Date.now
  }],
  tags: [String],
  isActif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
// Index pour la recherche
clientSchema.index({ 
  nom: 'text', 
  email: 'text', 
  telephone: 'text' 
// Index pour les performances
clientSchema.index({ email: 1 });
clientSchema.index({ statut: 1 });
clientSchema.index({ derniereActivite: -1 });
// Virtual pour l'âge
clientSchema.virtual('age').get(function() {
  if (this.dateNaissance) {
    return Math.floor((Date.now() - this.dateNaissance.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return null;
// Middleware pour mettre à jour derniereActivite
clientSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('derniereActivite')) {
    this.derniereActivite = new Date();
  next();
// Méthodes d'instance
clientSchema.methods.ajouterNote = function(contenu, auteur) {
  this.notes.push({ contenu, auteur });
  return this.save();
};
clientSchema.methods.mettreAJourStatut = function(nouveauStatut) {
  this.statut = nouveauStatut;
  this.derniereActivite = new Date();
// Méthodes statiques
clientSchema.statics.rechercherClients = function(terme) {
  return this.find({
    $text: { $search: terme },
    isActif: true
  }).sort({ score: { $meta: 'textScore' } });
clientSchema.statics.obtenirStatistiques = async function() {
  const stats = await this.aggregate([
    { $match: { isActif: true } },
    {
      $group: {
        _id: '$statut',
        count: { $sum: 1 },
        valeurTotale: { $sum: '$valeurVieTotale' }
      }
  ]);
  return stats;
export default mongoose.model('Client', clientSchema);
