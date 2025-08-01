#!/bin/bash

echo "🔍 DIAGNOSTIC COMPLET - MIREB CRM"
echo "=================================="
echo

echo "📅 Date: $(date)"
echo "💻 Répertoire: $(pwd)"
echo

echo "🌐 SERVICES:"
echo "------------"

# Test Frontend
echo -n "Frontend (http://localhost:3000): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ ACTIF"
else
    echo "❌ INACTIF"
fi

# Test Backend
echo -n "Backend (http://localhost:5000): "
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ ACTIF"
else
    echo "❌ INACTIF"
fi

# Test API Health
echo -n "API Health: "
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ OPÉRATIONNEL"
else
    echo "❌ ÉCHEC"
fi

# Test API Authentification
echo -n "API Auth: "
if curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@mireb.com","password":"admin123"}' > /dev/null 2>&1; then
    echo "✅ OPÉRATIONNEL"
else
    echo "❌ ÉCHEC"
fi

# Test API Produits
echo -n "API Produits: "
if curl -s http://localhost:5000/api/produits > /dev/null 2>&1; then
    echo "✅ OPÉRATIONNEL"
else
    echo "❌ ÉCHEC"
fi

echo
echo "🔧 PROCESSUS ACTIFS:"
echo "-------------------"
ps aux | grep -E "(serve|node)" | grep -v grep | head -5

echo
echo "🌍 URLS PRINCIPALES:"
echo "------------------"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "Health:   http://localhost:5000/api/health"
echo "Login:    admin@mireb.com / admin123"

echo
echo "✅ Diagnostic terminé!"
