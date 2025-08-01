#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 3000

class MirebHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

# Changer vers le répertoire du projet
os.chdir('/workspaces/mireb-')

try:
    with socketserver.TCPServer(("", PORT), MirebHTTPRequestHandler) as httpd:
        print(f"🚀 Serveur Mireb CRM démarré sur le port {PORT}")
        print(f"📍 Local: http://localhost:{PORT}")
        print(f"🌐 Codespaces: https://turbo-chainsaw-pjppgx5v4r55f967q-{PORT}.app.github.dev")
        print(f"📱 Application: https://turbo-chainsaw-pjppgx5v4r55f967q-{PORT}.app.github.dev/mireb-ai-crm-complete.html")
        print("✨ Appuyez sur Ctrl+C pour arrêter")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🔄 Arrêt du serveur...")
    sys.exit(0)
except OSError as e:
    if "Address already in use" in str(e):
        print(f"❌ Le port {PORT} est déjà utilisé")
        print("💡 Un serveur est peut-être déjà en cours d'exécution")
        print(f"🌐 Essayez: https://turbo-chainsaw-pjppgx5v4r55f967q-{PORT}.app.github.dev/mireb-ai-crm-complete.html")
    else:
        print(f"❌ Erreur: {e}")
    sys.exit(1)
