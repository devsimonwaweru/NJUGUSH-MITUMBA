const CACHE_NAME = 'njugush-pwa-v2'; // Changed version to force a refresh
const ASSETS_CACHE = 'njugush-assets-v2';

// 1. Install: Only Cache Static Assets (Images, Icons)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSETS_CACHE).then((cache) => {
      // We DO NOT cache index.html here.
      // This ensures users always get the latest code when they refresh.
      return cache.addAll([
        // Add your specific images here if you want them offline
        '/hero-bales.jpg', 
        '/vite.svg'
      ]);
    })
  );
});

// 2. Fetch: Network First for Code, Cache First for Images
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // --- STRATEGY A: NETWORK FIRST (For HTML, JS, Manifest) ---
  // If it's a document (HTML) or script, ALWAYS fetch from network.
  // This prevents the "Stuck on old version" error.
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'manifest' ||
      url.pathname === '/sw.js') {
        
    return event.respondWith(
      fetch(request)
        .then((response) => {
          // If network fails, optionally fall back to cache (optional, but keeps it fresh mostly)
          return response || caches.match(request);
        })
        .catch(() => caches.match(request))
    );
  }

  // --- STRATEGY B: CACHE FIRST (For Images, CSS) ---
  // For images, try cache first, then network.
  return event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        return networkResponse || caches.match(request);
      });
    })
  );
});