import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});
// Historique des conversations (en production, utiliser une base de données)
const chatHistory = new Map();
// Système de prompts pour le chatbot Mireb
const SYSTEM_PROMPTS = {
  commercial: `Tu es l'assistant commercial intelligent de Mireb Commercial, une plateforme e-commerce innovante au Congo RDC.
CONTEXTE:
- Mireb Commercial vend des produits électroniques, mode, maison, beauté, sport, etc.
- Tu aides les clients à trouver des produits, répondre aux questions, et faciliter les achats
- Tu es expert en recommandations personnalisées et service client
INSTRUCTIONS:
1. Sois chaleureux, professionnel et serviable
2. Pose des questions pertinentes pour comprendre les besoins
3. Recommande des produits appropriés
4. Fournis des informations sur les prix, livraison, garanties
5. Encourage l'achat en mettant en avant les avantages
6. Réponds en français avec un ton amical et commercial
PRODUITS DISPONIBLES:
- Électronique: smartphones, ordinateurs, accessoires
- Mode: vêtements homme/femme, chaussures, accessoires
- Maison: meubles, décoration, électroménager
- Beauté: cosmétiques, parfums, soins
- Sport: équipements, vêtements de sport
Si tu ne connais pas un produit spécifique, propose des alternatives similaires et encourage à contacter l'équipe pour plus d'informations.`,
  support: `Tu es l'assistant support client de Mireb Commercial.
Tu aides avec:
- Questions sur les commandes
- Problèmes de livraison
- Retours et échanges
- Problèmes techniques
- Informations sur les garanties
Sois patient, empathique et solution-oriented.`,
  technique: `Tu es l'assistant technique de Mireb Commercial.
- Spécifications techniques des produits
- Comparaisons de produits
- Conseils d'utilisation
- Problèmes de compatibilité
- Guides d'installation
Fournis des informations précises et techniques.`
};
// POST /api/chatbot/chat - Interaction avec le chatbot
router.post('/chat', async (req, res) => {
  try {
    const { 
      message, 
      sessionId, 
      context = 'commercial',
      produits = [],
      userId = null 
    } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message et sessionId requis'
      });
    }
    // Récupérer l'historique de la conversation
    if (!chatHistory.has(sessionId)) {
      chatHistory.set(sessionId, []);
    const history = chatHistory.get(sessionId);
    // Construire le contexte avec les produits
    let contextMessage = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.commercial;
    
    if (produits.length > 0) {
      contextMessage += `\n\nPRODUITS ACTUELLEMENT DISPONIBLES:\n`;
      produits.slice(0, 10).forEach(p => {
        contextMessage += `- ${p.nom}: ${p.prix}$ (${p.categorie}) - ${p.description?.substring(0, 100)}...\n`;
    // Préparer les messages pour OpenAI
    const messages = [
      { role: 'system', content: contextMessage },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];
    // Appel à OpenAI (si API key disponible)
    let botResponse;
    if (process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        });
        botResponse = completion.choices[0].message.content;
      } catch (openaiError) {
        console.error('Erreur OpenAI:', openaiError);
        botResponse = generateFallbackResponse(message, produits);
      }
    } else {
      // Réponse de fallback si pas d'API key
      botResponse = generateFallbackResponse(message, produits);
    // Ajouter à l'historique
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: botResponse });
    // Limiter l'historique à 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    // Mettre à jour l'historique
    chatHistory.set(sessionId, history);
    res.json({
      success: true,
      data: {
        response: botResponse,
        sessionId,
        messageCount: history.length
    });
  } catch (error) {
    console.error('Erreur chatbot:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur du chatbot',
      error: error.message
  }
// Fonction de réponse de fallback
function generateFallbackResponse(message, produits) {
  const messageLower = message.toLowerCase();
  
  // Détection d'intention basique
  if (messageLower.includes('prix') || messageLower.includes('coût') || messageLower.includes('combien')) {
      const produitExemple = produits[0];
      return `Nos prix varient selon les produits. Par exemple, ${produitExemple.nom} coûte ${produitExemple.prix}$. Quel type de produit vous intéresse pour que je puisse vous donner des prix précis ?`;
    return "Nos prix sont très compétitifs ! Dites-moi quel produit vous cherchez et je vous donnerai le prix exact.";
  if (messageLower.includes('livraison') || messageLower.includes('délai')) {
    return "Nous livrons dans tout Kinshasa sous 24-48h et dans les autres villes du Congo sous 3-5 jours. La livraison est gratuite pour les commandes de plus de 50$. Voulez-vous plus d'informations sur une commande spécifique ?";
  if (messageLower.includes('produit') || messageLower.includes('cherche') || messageLower.includes('besoin')) {
      const categories = [...new Set(produits.map(p => p.categorie))];
      return `Nous avons une large gamme de produits dans ces catégories : ${categories.join(', ')}. Quelle catégorie vous intéresse le plus ? Je peux vous recommander les meilleurs produits !`;
    return "Nous avons des produits électroniques, mode, maison, beauté et sport. Quelle catégorie vous intéresse ?";
  if (messageLower.includes('bonjour') || messageLower.includes('salut') || messageLower.includes('hello')) {
    return "Bonjour ! 👋 Bienvenue chez Mireb Commercial ! Je suis votre assistant personnel pour vous aider à trouver les meilleurs produits. Que puis-je faire pour vous aujourd'hui ?";
  if (messageLower.includes('merci') || messageLower.includes('thanks')) {
    return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider à faire le meilleur choix !";
  if (messageLower.includes('contact') || messageLower.includes('téléphone') || messageLower.includes('whatsapp')) {
    return "Vous pouvez nous contacter directement via WhatsApp au +243 842 267 252 ou par email à mirebshop@gmail.com. Notre équipe est disponible 7j/7 pour vous accompagner ! 📱";
  // Réponse générique
  return "Je suis là pour vous aider à trouver les meilleurs produits chez Mireb Commercial ! Pouvez-vous me dire plus précisément ce que vous cherchez ? (produits, prix, livraison, etc.)";
}
// GET /api/chatbot/history/:sessionId - Récupérer l'historique d'une session
router.get('/history/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const history = chatHistory.get(sessionId) || [];
        messages: history,
        count: history.length
    console.error('Erreur récupération historique:', error);
      message: 'Erreur lors de la récupération de l\'historique',
// DELETE /api/chatbot/history/:sessionId - Effacer l'historique d'une session
router.delete('/history/:sessionId', async (req, res) => {
    chatHistory.delete(sessionId);
      message: 'Historique effacé avec succès'
    console.error('Erreur effacement historique:', error);
      message: 'Erreur lors de l\'effacement de l\'historique',
// POST /api/chatbot/feedback - Envoyer un feedback sur une réponse
router.post('/feedback', async (req, res) => {
    const { sessionId, messageIndex, rating, comment } = req.body;
    if (!sessionId || messageIndex === undefined) {
        message: 'SessionId et messageIndex requis'
    // En production, sauvegarder en base de données
    console.log('Feedback reçu:', { sessionId, messageIndex, rating, comment });
      message: 'Feedback enregistré avec succès'
    console.error('Erreur feedback:', error);
      message: 'Erreur lors de l\'enregistrement du feedback',
// GET /api/chatbot/stats - Statistiques du chatbot
router.get('/stats', async (req, res) => {
    const totalSessions = chatHistory.size;
    const totalMessages = Array.from(chatHistory.values())
      .reduce((total, history) => total + history.length, 0);
    const activeSessions = Array.from(chatHistory.entries())
      .filter(([sessionId, history]) => {
        // Sessions actives dans les dernières 24h
        return history.length > 0;
      }).length;
        totalSessions,
        totalMessages,
        activeSessions,
        averageMessagesPerSession: totalSessions > 0 ? (totalMessages / totalSessions).toFixed(1) : 0
    console.error('Erreur stats chatbot:', error);
      message: 'Erreur lors de la récupération des statistiques',
// POST /api/chatbot/recommendations - Obtenir des recommandations de produits
router.post('/recommendations', async (req, res) => {
    const { preferences, budget, categorie, produits = [] } = req.body;
    if (!produits.length) {
      return res.json({
        success: true,
        data: {
          recommendations: [],
          message: "Aucun produit disponible pour le moment."
        }
    // Filtrage basique
    let filtered = produits.filter(p => p.stock > 0);
    if (categorie) {
      filtered = filtered.filter(p => 
        p.categorie.toLowerCase().includes(categorie.toLowerCase())
      );
    if (budget && budget.max) {
      filtered = filtered.filter(p => p.prix <= budget.max);
    if (budget && budget.min) {
      filtered = filtered.filter(p => p.prix >= budget.min);
    // Tri par popularité/rating
    filtered.sort((a, b) => {
      const scoreA = (a.rating || 0) + (a.analytics?.vues || 0) / 100;
      const scoreB = (b.rating || 0) + (b.analytics?.vues || 0) / 100;
      return scoreB - scoreA;
    // Prendre les 5 meilleurs
    const recommendations = filtered.slice(0, 5);
        recommendations,
        totalFound: filtered.length,
        message: recommendations.length > 0 
          ? `J'ai trouvé ${recommendations.length} produit(s) qui correspondent à vos critères !`
          : "Désolé, aucun produit ne correspond à vos critères. Essayez d'élargir votre recherche."
    console.error('Erreur recommandations:', error);
      message: 'Erreur lors de la génération des recommandations',
export default router;
