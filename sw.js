const CACHE_NAME = 'mireb-crm-v1';
const API_CACHE = 'mireb-api-v1';

// Ressources à mettre en cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/mireb-ai-crm-complete.html',
  '/manifest.json',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.socket.io/4.7.2/socket.io.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// URLs API à mettre en cache
const API_ENDPOINTS = [
  '/api/produits',
  '/api/categories', 
  '/api/leads',
  '/api/analytics/dashboard'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache ouvert:', CACHE_NAME);
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('✅ Service Worker installé et resources mises en cache');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Erreur installation Service Worker:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activé');
        return self.clients.claim();
      })
  );
});

// Stratégie de mise en cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Stratégie pour les APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE)
        .then((cache) => {
          return fetch(event.request)
            .then((response) => {
              // Si la requête réussit, mettre en cache et retourner
              if (response.ok) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Si la requête échoue, retourner du cache
              console.log('📱 Mode hors-ligne: utilisation du cache pour', url.pathname);
              return cache.match(event.request);
            });
        })
    );
    return;
  }

  // Stratégie pour les ressources statiques
  if (STATIC_RESOURCES.some(resource => event.request.url.includes(resource))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // Pour toutes les autres requêtes - Network First
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'lead-sync') {
    event.waitUntil(syncPendingLeads());
  }
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Notifications Push
self.addEventListener('push', (event) => {
  console.log('📬 Push reçu:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification Mireb CRM',
    icon: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=192&h=192&fit=crop',
    badge: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=72&h=72&fit=crop',
    vibrate: [200, 100, 200],
    data: event.data ? JSON.parse(event.data.text()) : {},
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification('Mireb CRM', options)
  );
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Clic notification:', event);
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Fonctions de synchronisation
async function syncPendingLeads() {
  try {
    // Récupérer les leads en attente depuis IndexedDB ou localStorage
    const pendingLeads = JSON.parse(localStorage.getItem('pendingLeads') || '[]');
    
    for (const lead of pendingLeads) {
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('mireb_auth_token')}`
          },
          body: JSON.stringify(lead)
        });
        
        if (response.ok) {
          // Supprimer le lead synchronisé
          const updatedPending = pendingLeads.filter(p => p.tempId !== lead.tempId);
          localStorage.setItem('pendingLeads', JSON.stringify(updatedPending));
        }
      } catch (error) {
        console.error('Erreur sync lead:', error);
      }
    }
  } catch (error) {
    console.error('Erreur sync leads:', error);
  }
}

async function syncAnalytics() {
  try {
    // Synchroniser les données analytics locales avec le serveur
    const localAnalytics = JSON.parse(localStorage.getItem('localAnalytics') || '{}');
    
    if (Object.keys(localAnalytics).length > 0) {
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mireb_auth_token')}`
        },
        body: JSON.stringify(localAnalytics)
      });
      
      if (response.ok) {
        localStorage.removeItem('localAnalytics');
      }
    }
  } catch (error) {
    console.error('Erreur sync analytics:', error);
  }
}

console.log('🎯 Service Worker Mireb CRM chargé');
