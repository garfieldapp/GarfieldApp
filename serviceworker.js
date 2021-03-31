
const OFFLINE_VERSION = 2;
const CACHE_NAME = 'offline';
const OFFLINE_URL = 
[
  "./index.html",
  "./garlogo.webp",
  "./mail.webp",
  "./paypaldonate.webp",
  "./pwa-pass-3.svg",
  "./swiped-events.min.js",    
  "./app.js",
  "./main.css",
  "./serviceworker.js",
  "./garfield.webp",    
  "./maskable_icon.png",
  "./mstile-150x150.png",
  "./favicon.ico",
  "./favicon-32x32.png",
  "./favicon-16x16.png",
  "./favicon-32x32.webp",
  "./favicon-16x16.webp",
  "./apple-touch-icon.png",
  "./android-chrome-192x192.png",
  "./android-chrome-192x192.png"
 ];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
   
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
 
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
       
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
});