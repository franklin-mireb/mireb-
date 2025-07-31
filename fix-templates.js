// Script pour corriger les template literals dans le fichier HTML
const fs = require('fs');

// Lire le fichier
let content = fs.readFileSync('/workspaces/mireb-/mireb-ai-crm-complete.html', 'utf8');

// Remplacer les template literals className problématiques
content = content.replace(/className=\{`([^`]*)\$\{([^}]*)\}([^`]*)`\}/g, 'className={"$1" + ($2) + "$3"}');

// Remplacer les autres template literals dans les attributs
content = content.replace(/\{`([^`]*)\$\{([^}]*)\}([^`]*)`\}/g, '{"$1" + ($2) + "$3"}');

// Remplacer les template literals dans les variables
content = content.replace(/const\s+(\w+)\s*=\s*`([^`]*)\$\{([^}]*)\}([^`]*)`/g, 'const $1 = "$2" + ($3) + "$4"');

// Sauvegarder
fs.writeFileSync('/workspaces/mireb-/mireb-ai-crm-complete.html', content);

console.log('Template literals corrigés avec succès!');
