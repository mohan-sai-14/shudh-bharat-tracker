
const CACHE_NAME = 'bharat-shudh-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/bharat-shudh-logo.svg',
  '/static/js/main.chunk.js',
  '/static/js/vendors~main.chunk.js',
  '/static/js/bundle.js',
  '/map-placeholder.svg',
  '/avatar-placeholder.svg',
];

// Install a service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it's a stream and can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Add response to cache for future offline use
                // Only cache API responses that have a status of 200
                if (event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      }).catch(() => {
        // If both cache and network fail, show fallback content
        if (event.request.url.includes('/api/')) {
          return new Response(JSON.stringify({ 
            error: 'You are currently offline. Please connect to the internet.' 
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
});

// Update a service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.log('Push received...', data);

  const options = {
    body: data.body,
    icon: 'bharat-shudh-logo.svg',
    badge: 'bharat-shudh-logo.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    clients.openWindow('/');
  }
});
