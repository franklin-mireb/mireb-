// Force redeploy - Correction images Cloudinary et sync leads API
// Generated: 2025-01-15T12:00:00Z - FORCE PUSH
export default {
  forceRedeploy: true,
  timestamp: new Date().toISOString(),
  reason: "CRITICAL: Force Cloudinary images + API leads sync - User reported sync issues",
  deployCount: 3,
  criticalFix: true,
  features: ["cloudinary-only-images", "api-leads-sync", "cross-device-compatibility"]
};
