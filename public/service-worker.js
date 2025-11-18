const CACHE_NAME = 'vinateria-cache-v1';
const API_BASE_URL = 'http://localhost:4000/api';
const STATIC_ASSETS = [
  '/', // página principal
  '/favicon.ico',
  '/logo.webp',
  '/manifest.json',
];

// 🔹 Instalación: pre-cache de recursos estáticos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caché inicial creada');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 🔹 Activación: limpiar versiones antiguas
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 🔹 Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Si la petición va al backend o a una imagen, la cacheamos dinámicamente
  if (request.url.startsWith(API_BASE_URL) || request.destination === 'image') {
    event.respondWith(cacheThenNetwork(request));
    return;
  }

  // Para otros recursos, tratamos de obtener desde caché o red
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});

// 🔹 Función auxiliar para cachear dinámicamente peticiones de API o imágenes
async function cacheThenNetwork(request) {
  const cache = await caches.open(CACHE_NAME);

  // Primero intenta obtener de caché
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Mientras devuelve el caché, intenta actualizarlo en segundo plano
    fetch(request).then((networkResponse) => {
      cache.put(request, networkResponse.clone());
    });
    return cachedResponse;
  }

  // Si no hay caché, va a la red y guarda la respuesta
  const networkResponse = await fetch(request);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}
