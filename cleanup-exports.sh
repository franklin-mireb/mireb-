#!/bin/bash

echo "🧹 Nettoyage des doublons d'exports..."

# Fonction pour nettoyer un fichier
clean_file() {
    local file="$1"
    echo "Nettoyage de $file..."
    
    # Supprimer les lignes module.exports si export default existe
    if grep -q "export default" "$file"; then
        sed -i '/module\.exports/d' "$file"
    fi
    
    # Supprimer les doublons export default
    awk '!seen[$0]++' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

# Nettoyer tous les fichiers
for file in /workspaces/mireb-/backend/routes/*.js /workspaces/mireb-/backend/models/*.js; do
    if [ -f "$file" ]; then
        clean_file "$file"
    fi
done

echo "✅ Nettoyage terminé!"
