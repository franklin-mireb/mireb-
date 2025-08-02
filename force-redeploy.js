// Force redeploy - Render needs analyze-image endpoint
// Generated: 2025-08-02T00:00:00Z - FORCE PUSH
module.exports = {
  forceRedeploy: true,
  timestamp: new Date().toISOString(),
  reason: "URGENT: Deploy /api/openai/analyze-image endpoint - User waiting for IA functionality",
  deployCount: 2,
  criticalFix: true
};
