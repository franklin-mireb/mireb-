#!/usr/bin/env python3
import re

# Lire le fichier
with open('/workspaces/mireb-/mireb-ai-crm-complete.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Corriger tous les className avec template literals
content = re.sub(r'className=\{`([^`]*)\$\{([^}]+)\}([^`]*)`\}', 
                 r'className={"\\1" + (\\2) + "\\3"}', content)

# 2. Corriger les autres attributs avec template literals  
content = re.sub(r'(\w+)=\{`([^`]*)\$\{([^}]+)\}([^`]*)`\}', 
                 r'\\1={"\\2" + (\\3) + "\\4"}', content)

# 3. Corriger les template literals dans les alert et autres fonctions
content = re.sub(r'alert\(`([^`]*)\$\{([^}]+)\}([^`]*)`\)', 
                 r'alert("\\1" + (\\2) + "\\3")', content)

# 4. Corriger les template literals dans les variables
content = re.sub(r'const\s+(\w+)\s*=\s*`([^`]*)\$\{([^}]+)\}([^`]*)`', 
                 r'const \\1 = "\\2" + (\\3) + "\\4"', content)

# 5. Corriger les template literals multilignes simples (sans variables)
content = re.sub(r'`([^`\$]*)`(?!\s*\})', r'\"\\1\"', content)

# Sauvegarder
with open('/workspaces/mireb-/mireb-ai-crm-complete.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Template literals corrigés!")
