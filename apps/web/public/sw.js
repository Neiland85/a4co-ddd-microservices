const CACHE_NAME = 'a4co-v1';
const STATIC_CACHE = 'a4co-static-v1';
const DYNAMIC_CACHE = 'a4co-dynamic-v1';

// Archivos estáticos para cache
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Estrategias de cache
const cacheStrategies = {
  static: 'CacheFirst',
  dynamic: 'NetworkFirst',
  api: 'NetworkFirst',
  images: 'CacheFirst',
};

// Instalación del service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Cacheando archivos estáticos');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Instalación completada');
        return self.skipWaiting();
      })
  );
});

// Activación del service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activación completada');
        return self.clients.claim();
      })
  );
});

// Interceptación de fetch requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia para archivos estáticos
  if (request.destination === 'document' || request.destination === '') {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Estrategia para imágenes
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Estrategia para APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Estrategia por defecto: Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Estrategia Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache First fallback:', error);
    return getOfflineResponse(request);
  }
}

// Estrategia Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network First fallback:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return getOfflineResponse(request);
  }
}

// Respuesta offline
async function getOfflineResponse(request) {
  if (request.destination === 'document') {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
  }

  return new Response('Contenido no disponible offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain',
    }),
  });
}

// Manejo de notificaciones push
self.addEventListener('push', event => {
  console.log('Service Worker: Notificación push recibida');

  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de A4CO',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver más',
        icon: '/icons/icon-96x96.png',
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/icon-96x96.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('A4CO', options));
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notificación clickeada');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Acción por defecto: abrir la app
    event.waitUntil(clients.openWindow('/'));
  }
});

// Manejo de sincronización en background
self.addEventListener('sync', event => {
  console.log('Service Worker: Sincronización en background:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Función de sincronización en background
async function doBackgroundSync() {
  try {
    // Aquí puedes implementar la lógica de sincronización
    // Por ejemplo, sincronizar datos offline, enviar formularios pendientes, etc.
    console.log('Sincronizando datos en background...');

    // Ejemplo: sincronizar productos favoritos
    const favorites = await getOfflineFavorites();
    if (favorites.length > 0) {
      await syncFavorites(favorites);
    }
  } catch (error) {
    console.error('Error en sincronización background:', error);
  }
}

// Función para obtener favoritos offline (ejemplo)
async function getOfflineFavorites() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match('/api/favorites');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error obteniendo favoritos offline:', error);
  }
  return [];
}

// Función para sincronizar favoritos (ejemplo)
async function syncFavorites(favorites) {
  try {
    const response = await fetch('/api/favorites/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favorites),
    });

    if (response.ok) {
      console.log('Favoritos sincronizados exitosamente');
    }
  } catch (error) {
    console.error('Error sincronizando favoritos:', error);
  }
}

// Manejo de mensajes del cliente
self.addEventListener('message', event => {
  console.log('Service Worker: Mensaje recibido:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Función para limpiar caches antiguos
async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE);

    await Promise.all(oldCaches.map(name => caches.delete(name)));

    console.log('Caches antiguos limpiados');
  } catch (error) {
    console.error('Error limpiando caches:', error);
  }
}

// Limpiar caches cada 24 horas
setInterval(cleanupOldCaches, 24 * 60 * 60 * 1000);
