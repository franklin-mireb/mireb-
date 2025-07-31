import mongoose from 'mongoose';

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères']
  },
  description: {
    required: [true, 'La description est requise'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  descriptionCourte: {
    maxlength: [500, 'La description courte ne peut pas dépasser 500 caractères']
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  prixPromo: {
    min: [0, 'Le prix promotionnel ne peut pas être négatif'],
    validate: {
      validator: function(v) {
        return !v || v < this.prix;
      },
      message: 'Le prix promotionnel doit être inférieur au prix normal'
    }
  devise: {
    default: 'USD',
    enum: ['USD', 'CDF', 'EUR']
  categorie: {
    required: [true, 'La catégorie est requise'],
    trim: true
  sousCategorie: {
  marque: {
  modele: {
  stock: {
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  stockMinimum: {
    default: 5,
    min: [0, 'Le stock minimum ne peut pas être négatif']
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimaire: {
      type: Boolean,
      default: false
    cloudinaryId: String
  }],
  caracteristiques: [{
    nom: String,
    valeur: String,
    unite: String
  dimensions: {
    longueur: Number,
    largeur: Number,
    hauteur: Number,
    poids: Number,
    unite: {
      default: 'cm'
  couleurs: [String],
  tailles: [String],
  tags: [String],
  motsCles: [String],
  statut: {
    enum: ['actif', 'inactif', 'epuise', 'discontinue'],
    default: 'actif'
  isVisible: {
    type: Boolean,
    default: true
  isFeatured: {
    default: false
  rating: {
    moyenne: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    nombreAvis: {
      min: 0
  avis: [{
    auteur: String,
    email: String,
    note: {
      required: true,
      min: 1,
    commentaire: String,
    date: {
      type: Date,
      default: Date.now
    verifie: {
  fournisseur: {
    contact: String,
    prixAchat: Number,
    delaiLivraison: Number
  livraison: {
    gratuite: {
    fragilite: {
      enum: ['faible', 'moyenne', 'haute'],
      default: 'faible'
    delaiMin: Number,
    delaiMax: Number
  promotion: {
    active: {
    typePromo: {
      enum: ['pourcentage', 'montant_fixe', 'achat_groupe'],
      default: 'pourcentage'
    valeurPromo: Number,
    dateDebut: Date,
    dateFin: Date,
    description: String
  seo: {
    titre: String,
    metaDescription: String,
    slug: {
      unique: true,
      sparse: true
  analytics: {
    vues: {
      default: 0
    clics: {
    ajoutsAuPanier: {
    achats: {
    derniereVue: Date
  isActif: {
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
// Index pour les recherches et performances
produitSchema.index({ 
  nom: 'text', 
  description: 'text',
  tags: 'text',
  motsCles: 'text'
produitSchema.index({ categorie: 1 });
produitSchema.index({ prix: 1 });
produitSchema.index({ statut: 1 });
produitSchema.index({ 'rating.moyenne': -1 });
produitSchema.index({ createdAt: -1 });
produitSchema.index({ 'analytics.vues': -1 });
produitSchema.index({ 'seo.slug': 1 });
// Virtual pour le prix final (avec promo)
produitSchema.virtual('prixFinal').get(function() {
  if (this.promotion.active && this.prixPromo) {
    const maintenant = new Date();
    if ((!this.promotion.dateDebut || this.promotion.dateDebut <= maintenant) &&
        (!this.promotion.dateFin || this.promotion.dateFin >= maintenant)) {
      return this.prixPromo;
  return this.prix;
// Virtual pour le pourcentage de réduction
produitSchema.virtual('pourcentageReduction').get(function() {
  if (this.prixPromo && this.prix > this.prixPromo) {
    return Math.round(((this.prix - this.prixPromo) / this.prix) * 100);
  return 0;
// Virtual pour l'état du stock
produitSchema.virtual('etatStock').get(function() {
  if (this.stock === 0) return 'epuise';
  if (this.stock <= this.stockMinimum) return 'faible';
  if (this.stock <= this.stockMinimum * 2) return 'moyen';
  return 'bon';
// Virtual pour l'image principale
produitSchema.virtual('imagePrincipale').get(function() {
  const imagePrimaire = this.images.find(img => img.isPrimaire);
  return imagePrimaire || this.images[0] || null;
// Middleware pour générer le slug automatiquement
produitSchema.pre('save', function(next) {
  if (this.isModified('nom') && !this.seo.slug) {
    this.seo.slug = this.nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  
  // Génération automatique du titre SEO
  if (this.isModified('nom') && !this.seo.titre) {
    this.seo.titre = `${this.nom} - ${this.categorie} | Mireb Commercial`;
  // Génération automatique de la méta-description
  if ((this.isModified('description') || this.isModified('nom')) && !this.seo.metaDescription) {
    this.seo.metaDescription = `${this.nom} - ${this.descriptionCourte || this.description.substring(0, 150)}...`;
  next();
// Middleware pour mettre à jour le rating
  if (this.isModified('avis')) {
    const avisVerifies = this.avis.filter(avis => avis.verifie);
    if (avisVerifies.length > 0) {
      const somme = avisVerifies.reduce((acc, avis) => acc + avis.note, 0);
      this.rating.moyenne = Number((somme / avisVerifies.length).toFixed(1));
      this.rating.nombreAvis = avisVerifies.length;
// Méthodes d'instance
produitSchema.methods.ajouterAvis = function(auteur, email, note, commentaire) {
  this.avis.push({ auteur, email, note, commentaire });
  return this.save();
};
produitSchema.methods.mettreAJourStock = function(quantite, operation = 'retirer') {
  if (operation === 'retirer') {
    this.stock = Math.max(0, this.stock - quantite);
  } else if (operation === 'ajouter') {
    this.stock += quantite;
produitSchema.methods.incrementerVue = function() {
  this.analytics.vues += 1;
  this.analytics.derniereVue = new Date();
produitSchema.methods.activerPromotion = function(typePromo, valeurPromo, dateDebut, dateFin, description) {
  this.promotion = {
    active: true,
    typePromo,
    valeurPromo,
    dateDebut,
    dateFin,
    description
  };
  // Calculer le prix promo
  if (typePromo === 'pourcentage') {
    this.prixPromo = this.prix * (1 - valeurPromo / 100);
  } else if (typePromo === 'montant_fixe') {
    this.prixPromo = Math.max(0, this.prix - valeurPromo);
// Méthodes statiques
produitSchema.statics.rechercherProduits = function(terme, options = {}) {
  const query = {
    $text: { $search: terme },
    isActif: true,
    isVisible: true
  if (options.categorie) query.categorie = options.categorie;
  if (options.prixMin) query.prix = { $gte: options.prixMin };
  if (options.prixMax) query.prix = { ...query.prix, $lte: options.prixMax };
  if (options.enStock) query.stock = { $gt: 0 };
  return this.find(query)
    .sort({ score: { $meta: 'textScore' }, ...options.sort })
    .limit(options.limit || 20);
produitSchema.statics.obtenirProduitsPopulaires = function(limite = 10) {
  return this.find({ 
    isActif: true, 
    isVisible: true,
    'analytics.vues': { $gt: 0 }
  })
  .sort({ 'analytics.vues': -1, 'rating.moyenne': -1 })
  .limit(limite);
produitSchema.statics.obtenirProduitsEnPromotion = function() {
  return this.find({
    'promotion.active': true,
    'promotion.dateDebut': { $lte: new Date() },
    'promotion.dateFin': { $gte: new Date() },
  }).sort({ pourcentageReduction: -1 });
produitSchema.statics.obtenirStatistiques = async function() {
  const stats = await this.aggregate([
    { $match: { isActif: true } },
    {
      $group: {
        _id: null,
        totalProduits: { $sum: 1 },
        valeurStockTotale: { $sum: { $multiply: ['$prix', '$stock'] } },
        prixMoyen: { $avg: '$prix' },
        stockTotal: { $sum: '$stock' },
        produitsEnStock: { $sum: { $cond: [{ $gt: ['$stock', 0] }, 1, 0] } },
        produitsEnRupture: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } }
      }
  ]);
  return stats[0];
export default mongoose.model('Produit', produitSchema);
