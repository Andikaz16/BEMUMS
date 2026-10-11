const CACHE_NAME = 'bem-ums-v2';
const STATIC_ASSETS = [
  '/assets/logo_bem_baru.png',
  '/assets/kolektiva_app_icon_192.png',
  '/assets/kolektiva_app_icon_512.png'
];

// Install: Cache critical static assets only (NEVER index.html or root to prevent stale SPA bundles)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Immediately purge all old versions of cache (including legacy bem-ums-v1)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Purging old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Listen for SKIP_WAITING signal from web app to apply updates immediately
self.addEventListener('message', (e) => {
  if (e.data && (e.data.type === 'SKIP_WAITING' || e.data === 'skipWaiting')) {
    self.skipWaiting();
  }
});

// Fetch: Strict Network-First for HTML/Navigation, Cache-First for static assets
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(e.request.url);

  // 1. STRICT NETWORK-FIRST for HTML documents & navigation
  // Guarantees users always receive the latest index.html on reload without Ctrl+Shift+R
  if (e.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // Fallback only if completely offline
          return caches.match(e.request) || caches.match('/index.html');
        })
    );
    return;
  }

  // 2. Static hashed assets (images, icons, fonts)
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|woff2?|ico)$/i)) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. All other requests (API, Firestore, functions): Direct network fetch
  e.respondWith(fetch(e.request));
});