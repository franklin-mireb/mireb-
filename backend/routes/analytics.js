import express from 'express';

const router = express.Router();
// Mock analytics data (en production, utiliser MongoDB)
let analyticsData = {
  vues: 0,
  visiteurs: 0,
  conversions: 0,
  revenus: 0,
  commandesMoyenneParJour: 0,
  panierMoyen: 0,
  tauxConversion: 0,
  topProduits: [],
  topCategories: [],
  sourcesTrafic: {
    direct: 0,
    facebook: 0,
    google: 0,
    whatsapp: 0,
    autres: 0
  },
  analyticsParJour: [],
  lastUpdated: new Date()
};
// GET /api/analytics - Analytics générales
router.get('/', async (req, res) => {
  try {
    // En production, récupérer depuis MongoDB
    const stats = {
      ...analyticsData,
      periodicData: generatePeriodicData(),
      realTimeStats: generateRealTimeStats()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analytics',
      error: error.message
  }
});
// GET /api/analytics/dashboard - Dashboard simplifié
router.get('/dashboard', async (req, res) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dashboardStats = {
      vuesToday: Math.floor(Math.random() * 1000) + 500,
      vuesYesterday: Math.floor(Math.random() * 800) + 400,
      ordersToday: Math.floor(Math.random() * 50) + 10,
      ordersYesterday: Math.floor(Math.random() * 40) + 8,
      revenueToday: Math.floor(Math.random() * 5000) + 1000,
      revenueYesterday: Math.floor(Math.random() * 4000) + 800,
      conversionRate: (Math.random() * 5 + 2).toFixed(2),
      averageOrderValue: (Math.random() * 200 + 50).toFixed(2),
      
      // Graphiques pour les 7 derniers jours
      weeklyViews: generateWeeklyData('views'),
      weeklyOrders: generateWeeklyData('orders'),
      weeklyRevenue: generateWeeklyData('revenue'),
      // Top performing
      topProductsToday: [
        { nom: 'iPhone 15 Pro', ventes: 12, revenus: 14400 },
        { nom: 'Samsung Galaxy S24', ventes: 8, revenus: 8000 },
        { nom: 'MacBook Air M2', ventes: 5, revenus: 7500 }
      ],
      topCategoriesThisWeek: [
        { nom: 'Électronique', ventes: 45, part: 35 },
        { nom: 'Mode', ventes: 32, part: 25 },
        { nom: 'Maison', ventes: 28, part: 22 },
        { nom: 'Beauté', ventes: 23, part: 18 }
      trafficSources: {
        direct: 35,
        facebook: 28,
        google: 20,
        whatsapp: 12,
        autres: 5
      }
      data: dashboardStats
    console.error('Erreur dashboard analytics:', error);
      message: 'Erreur lors de la récupération du dashboard',
// GET /api/analytics/produits - Analytics des produits
router.get('/produits', async (req, res) => {
    const period = req.query.period || '7d'; // 7d, 30d, 90d
    const productAnalytics = {
      topVentes: [
        { id: 1, nom: 'iPhone 15 Pro', ventes: 124, revenus: 148800, vues: 2500 },
        { id: 2, nom: 'Samsung Galaxy S24', ventes: 98, revenus: 98000, vues: 2100 },
        { id: 3, nom: 'MacBook Air M2', ventes: 67, revenus: 100500, vues: 1800 },
        { id: 4, nom: 'AirPods Pro 2', ventes: 156, revenus: 46800, vues: 3200 },
        { id: 5, nom: 'Tesla Model Y', ventes: 3, revenus: 150000, vues: 450 }
      topVues: [
        { id: 4, nom: 'AirPods Pro 2', vues: 3200, tauxConversion: 4.9 },
        { id: 1, nom: 'iPhone 15 Pro', vues: 2500, tauxConversion: 5.0 },
        { id: 2, nom: 'Samsung Galaxy S24', vues: 2100, tauxConversion: 4.7 },
        { id: 3, nom: 'MacBook Air M2', vues: 1800, tauxConversion: 3.7 },
        { id: 6, nom: 'Nintendo Switch', vues: 1650, tauxConversion: 2.8 }
      produitsEnRupture: [
        { id: 7, nom: 'PlayStation 5', derniereVente: '2025-01-28', demandesPendantes: 45 },
        { id: 8, nom: 'RTX 4090', derniereVente: '2025-01-27', demandesPendantes: 23 }
      performanceParCategorie: [
        { categorie: 'Électronique', ventes: 412, revenus: 523600, croissance: 15.2 },
        { categorie: 'Mode', ventes: 234, revenus: 78900, croissance: 8.7 },
        { categorie: 'Maison', ventes: 189, revenus: 94500, croissance: -2.1 },
        { categorie: 'Beauté', ventes: 145, revenus: 43500, croissance: 12.3 },
        { categorie: 'Sport', ventes: 98, revenus: 29400, croissance: 5.8 }
      ]
      data: productAnalytics
    console.error('Erreur analytics produits:', error);
      message: 'Erreur lors de la récupération des analytics produits',
// GET /api/analytics/clients - Analytics des clients
router.get('/clients', async (req, res) => {
    const clientAnalytics = {
      totalClients: 1247,
      nouveauxClientsCeMois: 89,
      clientsActifs: 945,
      valeurVieMoyenne: 245.67,
      demographiques: {
        parAge: {
          '18-25': 23,
          '26-35': 34,
          '36-45': 28,
          '46-55': 12,
          '55+': 3
        },
        parSexe: {
          homme: 52,
          femme: 46,
          autre: 2
        parVille: [
          { ville: 'Kinshasa', clients: 678, pourcentage: 54.4 },
          { ville: 'Lubumbashi', clients: 234, pourcentage: 18.8 },
          { ville: 'Goma', clients: 123, pourcentage: 9.9 },
          { ville: 'Bukavu', clients: 89, pourcentage: 7.1 },
          { ville: 'Autres', clients: 123, pourcentage: 9.8 }
        ]
      },
      comportement: {
        frequenceAchat: {
          'Première fois': 312,
          '2-3 achats': 456,
          '4-10 achats': 334,
          'Plus de 10': 145
        panierMoyenParSegment: {
          nouveaux: 87.50,
          reguliers: 156.80,
          fideles: 234.60,
          vip: 567.90
        }
      retention: {
        tauxRetour30j: 24.5,
        tauxRetour90j: 38.2,
        tauxRetourAnnuel: 52.8
      data: clientAnalytics
    console.error('Erreur analytics clients:', error);
      message: 'Erreur lors de la récupération des analytics clients',
// POST /api/analytics/event - Enregistrer un événement
router.post('/event', async (req, res) => {
    const { type, data, userId, sessionId, timestamp } = req.body;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Le type d\'événement est requis'
      });
    }
    // En production, sauvegarder en MongoDB
    const event = {
      type,
      data: data || {},
      userId: userId || null,
      sessionId: sessionId || 'anonymous',
      timestamp: timestamp || new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    // Traitement basique des événements
    switch (type) {
      case 'page_view':
        analyticsData.vues++;
        break;
      case 'product_view':
        // Incrémenter les vues produit
      case 'add_to_cart':
        // Tracking ajout panier
      case 'purchase':
        analyticsData.conversions++;
        if (data.amount) {
          analyticsData.revenus += data.amount;
    analyticsData.lastUpdated = new Date();
      message: 'Événement enregistré',
      eventId: Date.now() // Mock ID
    console.error('Erreur enregistrement événement:', error);
      message: 'Erreur lors de l\'enregistrement de l\'événement',
// GET /api/analytics/export - Exporter les données
router.get('/export', async (req, res) => {
    const format = req.query.format || 'json'; // json, csv
    const period = req.query.period || '30d';
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-mireb.csv');
      const csvData = generateCSVData(period);
      res.send(csvData);
    } else {
      const exportData = {
        period,
        exported_at: new Date(),
        data: analyticsData
      };
      res.json({
        success: true,
        data: exportData
    console.error('Erreur export analytics:', error);
      message: 'Erreur lors de l\'export',
// Fonctions utilitaires
function generatePeriodicData() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      vues: Math.floor(Math.random() * 1000) + 200,
      visiteurs: Math.floor(Math.random() * 500) + 100,
      commandes: Math.floor(Math.random() * 50) + 5,
      revenus: Math.floor(Math.random() * 5000) + 500
  return days;
}
function generateRealTimeStats() {
  return {
    visiteursEnLigne: Math.floor(Math.random() * 50) + 10,
    commandesAujourdhui: Math.floor(Math.random() * 30) + 5,
    revenusAujourdhui: Math.floor(Math.random() * 3000) + 500,
    dernièreCommande: new Date(Date.now() - Math.random() * 3600000)
  };
function generateWeeklyData(type) {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    let value;
      case 'views':
        value = Math.floor(Math.random() * 1000) + 300;
      case 'orders':
        value = Math.floor(Math.random() * 40) + 10;
      case 'revenue':
        value = Math.floor(Math.random() * 4000) + 1000;
      default:
        value = 0;
    data.push({
      value
  return data;
function generateCSVData(period) {
  const headers = 'Date,Vues,Visiteurs,Commandes,Revenus\n';
  const rows = generatePeriodicData()
    .map(day => `${day.date},${day.vues},${day.visiteurs},${day.commandes},${day.revenus}`)
    .join('\n');
  
  return headers + rows;
export default router;
