const CACHE_NAME = 'njugush-pwa-v4';
const STATIC_ASSETS = ['/hero-bales.jpg', '/manifest.json']; // Do NOT cache index.html to avoid hash conflicts

// 1. Install Event: Cache only safe static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use .catch() to handle errors gracefully without crashing
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('Service Worker: Failed to cache some assets', err);
      });
    })
  );
});

// 2. Fetch Event: Network First, with automatic update
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        
        // 1. Try fetching from network
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // 2. If network fetch succeeds, update the cache in the background
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });

        // 3. Return cached version immediately for speed (Network-First), 
        // OR return the network promise if nothing is cached.
        return cachedResponse || fetchPromise;
      });
    })
  );
});