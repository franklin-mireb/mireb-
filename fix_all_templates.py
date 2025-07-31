#!/usr/bin/env python3
import re

# Lire le fichier
with open('/workspaces/mireb-/mireb-ai-crm-complete.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("Correction des template literals en cours...")

# 1. Corriger tous les template literals avec variables
# Pattern: `texte${variable}texte`
template_pattern = r'`([^`]*?)\$\{([^}]+)\}([^`]*?)`'

def replace_template_literal(match):
    before = match.group(1)
    variable = match.group(2)
    after = match.group(3)
    
    # Échapper les guillemets dans les parties texte
    before = before.replace('"', '\\"')
    after = after.replace('"', '\\"')
    
    return f'"{before}" + ({variable}) + "{after}"'

# Appliquer le remplacement plusieurs fois pour gérer les imbrications
for _ in range(10):  # Maximum 10 passes
    old_content = content
    content = re.sub(template_pattern, replace_template_literal, content)
    if content == old_content:
        break

# 2. Corriger les template literals simples sans variables
simple_template_pattern = r'`([^`$]*)`'
content = re.sub(simple_template_pattern, r'"\1"', content)

# 3. Nettoyer les concaténations doubles
content = re.sub(r'"\s*"\s*\+\s*', '', content)
content = re.sub(r'\+\s*"\s*"', '', content)

# 4. Corriger les emojis problématiques (remplacer par des textes)
emoji_replacements = {
    '🛍️': '[SHOP]',
    '🏷️': '[TAG]',
    '✨': '[STAR]',
    '💰': '[MONEY]',
    '🚚': '[TRUCK]',
    '📞': '[PHONE]',
    '🎯': '[TARGET]',
    '📊': '[CHART]',
    '💻': '[LAPTOP]',
    '👆': '[FINGER]',
    '✅': '[CHECK]',
    '❌': '[X]',
    '⚠️': '[WARNING]',
    '🎉': '[PARTY]',
    '🔄': '[RELOAD]',
    '👀': '[EYES]',
    '💬': '[CHAT]',
    '📈': '[GRAPH]',
    '🌍': '[WORLD]',
    '1️⃣': '1.',
    '2️⃣': '2.',
    '3️⃣': '3.',
    '4️⃣': '4.',
    '5️⃣': '5.',
}

for emoji, replacement in emoji_replacements.items():
    content = content.replace(emoji, replacement)

# Sauvegarder
with open('/workspaces/mireb-/mireb-ai-crm-complete.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Correction terminée!")
print("- Template literals convertis en concaténation")
print("- Emojis remplacés par des textes compatibles")
print("- Syntaxe JavaScript normalisée")
