const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './test-simple.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>404 - Page non trouvée</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>🔍 Page non trouvée</h1>
                        <p>Le fichier <code>${req.url}</code> n'existe pas.</p>
                        <p><a href="/test-simple.html">📝 Aller à la page de test</a></p>
                        <p><a href="/mireb-ai-crm-complete.html">🏠 Aller au CRM principal</a></p>
                    </body>
                    </html>
                `);
            } else {
                res.writeHead(500);
                res.end('Erreur serveur: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📝 Page de test: http://localhost:${PORT}/test-simple.html`);
    console.log(`🏠 CRM principal: http://localhost:${PORT}/mireb-ai-crm-complete.html`);
    console.log(`⏹️  Pour arrêter: Ctrl+C`);
});
