#!/usr/bin/env python3
import re

# Lire le fichier
with open('/workspaces/mireb-/mireb-ai-crm-complete.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Expression régulière pour trouver les template literals avec des expressions interpolées
# Pattern: {`texte${expression}texte`}
template_pattern = r'\{`([^`]*)\$\{([^}]*)\}([^`]*)`\}'

def replace_template(match):
    before = match.group(1)
    expression = match.group(2)
    after = match.group(3)
    
    # Construire la nouvelle syntaxe
    result = '{"' + before + '" + (' + expression + ') + "' + after + '"}'
    return result

# Remplacer tous les template literals problématiques
content = re.sub(template_pattern, replace_template, content)

# Gérer les cas spéciaux avec multilignes
multiline_pattern = r'\{`([^`]*)\n([^`]*)\$\{([^}]*)\}([^`]*)`\}'
content = re.sub(multiline_pattern, lambda m: '{"' + m.group(1).replace('\n', ' ') + ' ' + m.group(2) + '" + (' + m.group(3) + ') + "' + m.group(4) + '"}', content)

# Sauvegarder
with open('/workspaces/mireb-/mireb-ai-crm-complete.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Template literals corrigés avec succès!")
