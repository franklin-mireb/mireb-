# GUIDE FINAL VERCEL - Mireb Commercial

## Étapes finales sur Vercel.com

1. **Connectez-vous à Vercel** avec `hervinemireb@gmail.com`

2. **Importez le projet GitHub** `mireb-`

3. **Configuration du projet :**
   - Root Directory: `.` (racine)
   - Build Command: `echo "No build needed"`
   - Install Command: `cd backend && npm install`
   - Output Directory: (laisser vide)

4. **Variables d'environnement** (Settings > Environment Variables) :
   ```
   MONGODB_URI = your-mongodb-connection-string-here
   OPENAI_API_KEY = your-openai-api-key-here
   JWT_SECRET = your-jwt-secret-here
   NODE_ENV = production
   ```

5. **Déployez** le projet

6. **Testez** :
   - Frontend: `https://votre-projet.vercel.app/`
   - API: `https://votre-projet.vercel.app/api/health`

## Résultat attendu

✅ Frontend Mireb visible
✅ API `/api/health` retourne `{"status":"OK",...}`
✅ MongoDB connecté
✅ OpenAI configuré

**C'est terminé !** 🎉
