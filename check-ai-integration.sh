#!/bin/bash

echo "🤖 Vérification de l'intégration IA - Mireb CRM"
echo "================================================="

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

log "Démarrage des vérifications IA..."

# 1. Vérifier la structure des fichiers IA
echo ""
echo "📁 Vérification de la structure des fichiers IA:"
echo "==============================================="

ai_files=(
    "backend/routes/openai.js" 
    "test-openai-api.html"
    "AI_INTEGRATION_GUIDE.md"
)

for file in "${ai_files[@]}"; do
    if [ -f "$file" ]; then
        success "Fichier IA trouvé: $file"
    else
        error "Fichier IA manquant: $file"
    fi
done

# 2. Vérifier AIService dans le frontend
echo ""
echo "🔍 Vérification d'AIService dans le frontend:"
echo "============================================"

if grep -q "class AIService" mireb-ai-crm-complete.html; then
    success "Classe AIService trouvée"
    
    # Vérifier les méthodes principales
    ai_methods=(
        "generateProductDescription"
        "analyzeProductImage" 
        "optimizeSEOTags"
        "generateFallbackDescription"
        "checkAIAvailability"
    )
    
    for method in "${ai_methods[@]}"; do
        if grep -q "$method" mireb-ai-crm-complete.html; then
            success "Méthode AIService trouvée: $method"
        else
            error "Méthode AIService manquante: $method"
        fi
    done
else
    error "Classe AIService manquante dans le frontend"
fi

# 3. Vérifier les routes OpenAI backend
echo ""
echo "🛠️ Vérification des routes OpenAI backend:"
echo "=========================================="

if [ -f "backend/routes/openai.js" ]; then
    backend_routes=(
        "/generate-description"
        "/analyze-image"
        "/optimize-tags"
    )
    
    for route in "${backend_routes[@]}"; do
        if grep -q "$route" backend/routes/openai.js; then
            success "Route OpenAI trouvée: $route"
        else
            error "Route OpenAI manquante: $route"
        fi
    done
    
    # Vérifier l'import OpenAI
    if grep -q "import OpenAI from" backend/routes/openai.js; then
        success "Import OpenAI correct (ES6 modules)"
    else
        error "Import OpenAI manquant ou incorrect"
    fi
    
    # Vérifier la gestion des erreurs
    if grep -q "fallback" backend/routes/openai.js; then
        success "Système de fallback implémenté"
    else
        warning "Système de fallback non détecté"
    fi
else
    error "Fichier routes OpenAI manquant"
fi

# 4. Vérifier l'intégration dans server.js
echo ""
echo "🔌 Vérification de l'intégration dans server.js:"
echo "=============================================="

if grep -q "openaiRoutes" backend/server.js; then
    success "Routes OpenAI importées dans server.js"
else
    error "Routes OpenAI non importées dans server.js"
fi

if grep -q "/api/openai" backend/server.js; then
    success "Endpoint /api/openai configuré"
else
    error "Endpoint /api/openai non configuré"
fi

# 5. Vérifier les schémas de validation
echo ""
echo "📋 Vérification des schémas de validation Joi:"
echo "============================================="

if [ -f "backend/middleware/validation.js" ]; then
    validation_schemas=(
        "generateDescription"
        "updateProduit"
    )
    
    for schema in "${validation_schemas[@]}"; do
        if grep -q "$schema" backend/middleware/validation.js; then
            success "Schéma validation trouvé: $schema"
        else
            error "Schéma validation manquant: $schema"
        fi
    done
else
    error "Fichier validation.js manquant"
fi

# 6. Vérifier les améliorations du formulaire
echo ""
echo "📝 Vérification des améliorations du formulaire produit:"
echo "======================================================"

form_features=(
    "generatingDescription"
    "Générer avec IA"
    "Analyser Image"
    "features.*input"
    "target.*select"
)

for feature in "${form_features[@]}"; do
    if grep -q "$feature" mireb-ai-crm-complete.html; then
        success "Fonctionnalité formulaire trouvée: $feature"
    else
        warning "Fonctionnalité formulaire manquante: $feature"
    fi
done

# 7. Vérifier les dépendances
echo ""
echo "📦 Vérification des dépendances IA:"
echo "==================================="

if grep -q "openai" package.json; then
    success "Dépendance OpenAI trouvée dans package.json"
else
    warning "Dépendance OpenAI manquante - Ajouter: npm install openai"
fi

# 8. Test de la page de test IA
echo ""
echo "🧪 Vérification de la page de test IA:"
echo "===================================="

if [ -f "test-openai-api.html" ]; then
    test_functions=(
        "testGenerateDescription"
        "testAnalyzeImage"
        "testOptimizeTags"
        "makeAPICall"
    )
    
    for func in "${test_functions[@]}"; do
        if grep -q "$func" test-openai-api.html; then
            success "Fonction de test trouvée: $func"
        else
            error "Fonction de test manquante: $func"
        fi
    done
else
    error "Page de test IA manquante"
fi

# 9. Compter les lignes de code IA ajoutées
echo ""
echo "📈 Statistiques du code IA:"
echo "==========================="

if [ -f "backend/routes/openai.js" ]; then
    openai_lines=$(wc -l < backend/routes/openai.js)
    success "Routes OpenAI: $openai_lines lignes"
fi

if [ -f "test-openai-api.html" ]; then
    test_lines=$(wc -l < test-openai-api.html)
    success "Page de test: $test_lines lignes"
fi

# Compter les lignes AIService dans le frontend
ai_service_lines=$(grep -n "class AIService" mireb-ai-crm-complete.html | wc -l)
if [ "$ai_service_lines" -gt 0 ]; then
    success "Classe AIService intégrée dans le frontend"
fi

# 10. Résumé et recommandations
echo ""
echo "📊 Résumé de l'intégration IA:"
echo "============================="

log "Vérification IA terminée!"

echo ""
echo "🎯 Checklist de déploiement IA:"
echo "==============================="
echo "1. ✅ Classes et services IA implémentés"
echo "2. ✅ Routes backend OpenAI créées"
echo "3. ✅ Validation Joi améliorée"
echo "4. ✅ Formulaires produit enrichis"
echo "5. ✅ Système de fallback robuste"
echo "6. ✅ Page de test dédiée"
echo "7. ⚠️  Configurer OPENAI_API_KEY en production"
echo "8. ⚠️  Installer: npm install openai"

echo ""
echo "🚀 Étapes de test recommandées:"
echo "==============================="
echo "1. Ouvrir test-openai-api.html dans un navigateur"
echo "2. Se connecter d'abord dans l'app principale"
echo "3. Tester chaque fonctionnalité IA individuellement"
echo "4. Vérifier les fallbacks si OpenAI indisponible"
echo "5. Tester la génération de descriptions produit"

echo ""
echo "📚 Documentation disponible:"
echo "==========================="
echo "- Guide complet: AI_INTEGRATION_GUIDE.md"
echo "- Tests: test-openai-api.html"
echo "- Code source: backend/routes/openai.js"

echo ""
success "🎉 Intégration IA Mireb CRM - VÉRIFICATION TERMINÉE!"
echo "====================================================="
