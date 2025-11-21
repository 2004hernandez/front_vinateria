// =======================
// CONFIGURACIÓN GENERAL
// =======================
const CACHE_NAME = 'vinateria-cache-v1';
const API_BASE_URL = 'https://vinateria-back-backend.yf3yhp.easypanel.host/api';

const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/logo.webp',
  '/manifest.json',
];

// =======================
// INSTALL — PRE-CACHE
// =======================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Caché inicial creada');
      await cache.addAll(STATIC_ASSETS);

      // 🔹 Activación inmediata del SW
      await self.skipWaiting();
    })()
  );
});

// =======================
// ACTIVATE — LIMPIAR CACHÉS ANTIGUAS
// =======================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');

  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      // Elimina cachés viejas que no coincidan con la versión actual
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );

      // 🔹 Toma control inmediato de las pestañas
      await self.clients.claim();
    })()
  );
});

// =======================
// FETCH — ESTRATEGIAS DE CACHÉ
// =======================
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // ❌ NO interceptar ping.json nunca
  if (url.pathname === "/ping.json") {
    return;
  }

  const isAPI = request.url.startsWith(API_BASE_URL);
  const isImage = request.destination === 'image';
  const isNextAsset = request.url.includes('/_next/');

  // ⚠️ No interceptar archivos internos de Next.js
  if (isNextAsset) {
    return;
  }

  // 🔹 API e imágenes → cacheThenNetwork
  if (isAPI || isImage) {
    event.respondWith(cacheThenNetwork(request));
    return;
  }

  // 🔹 Resto de archivos → cache first
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});


// =======================
// FUNCIÓN AUXILIAR — cache then network
// =======================
async function cacheThenNetwork(request) {
  const cache = await caches.open(CACHE_NAME);

  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Actualizar en segundo plano
    fetch(request).then((networkResponse) => {
      cache.put(request, networkResponse.clone());
    });

    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}
