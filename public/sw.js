const CACHE_NAME = 'shifa-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple fetch handler to satisfy PWA requirements
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If navigating to a page and offline, try returning index.html
      if (event.request.mode === 'navigate') {
        const indexHtml = await cache.match('/index.html');
        if (indexHtml) return indexHtml;
      }
      
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});
