const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types pour les fichiers
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  // Configuration CORS pour permettre les requêtes depuis le frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let pathname = url.parse(req.url).pathname;
  
  // Redirection vers la page principale si aucun fichier spécifié
  if (pathname === '/') {
    pathname = '/mireb-ai-crm-complete.html';
  }

  const filePath = path.join(__dirname, pathname);

  // Vérifier si le fichier existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Fichier non trouvé - retourner 404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - Fichier non trouvé</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            .links { margin-top: 30px; }
            .links a { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚫 Fichier non trouvé</h1>
            <p>Le fichier demandé n'existe pas : <code>${pathname}</code></p>
            <div class="links">
              <a href="/mireb-ai-crm-complete.html">🚀 Application CRM Complète</a>
              <a href="/index.html">🏠 Page d'accueil</a>
              <a href="/manifest.json">📱 Manifest PWA</a>
            </div>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // Lire et servir le fichier
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erreur serveur interne');
        return;
      }

      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur de développement Mireb CRM démarré !`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌐 GitHub Codespaces: https://turbo-chainsaw-pjppgx5v4r55f967q-${PORT}.app.github.dev`);
  console.log(`📱 Application: https://turbo-chainsaw-pjppgx5v4r55f967q-${PORT}.app.github.dev/mireb-ai-crm-complete.html`);
  console.log(`✨ Mireb CRM prêt à l'utilisation !`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('🔄 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🔄 Arrêt du serveur (Ctrl+C)...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});
