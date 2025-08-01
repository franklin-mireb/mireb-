#!/bin/bash

# Script pour convertir les fichiers CommonJS vers ES modules

echo "🔄 Conversion des fichiers CommonJS vers ES modules..."

# Fonction pour convertir un fichier
convert_file() {
    local file="$1"
    echo "Conversion de $file..."
    
    # Sauvegarde
    cp "$file" "$file.backup"
    
    # Conversions basic
    sed -i 's/const \([^=]*\) = require(\('\''[^'\'']*'\''\|"[^"]*"\));/import \1 from \2;/g' "$file"
    sed -i 's/const { \([^}]*\) } = require(\('\''[^'\'']*'\''\|"[^"]*"\));/import { \1 } from \2;/g' "$file"
    sed -i 's/module\.exports = \([^;]*\);/export default \1;/g' "$file"
    
    # Ajouter les extensions .js aux imports locaux
    sed -i "s/from '\.\([^']*\)';/from '.\1.js';/g" "$file"
    sed -i 's/from "\.\([^"]*\)";/from ".\1.js";/g' "$file"
}

# Convertir tous les fichiers dans routes/
for file in /workspaces/mireb-/backend/routes/*.js; do
    if [ -f "$file" ]; then
        convert_file "$file"
    fi
done

# Convertir tous les fichiers dans models/
for file in /workspaces/mireb-/backend/models/*.js; do
    if [ -f "$file" ]; then
        convert_file "$file"
    fi
done

echo "✅ Conversion terminée!"
