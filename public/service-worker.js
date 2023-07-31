const CACHE_NAME = 'my-pwa-cache-v1'

const urlsToCache = [
    '../',
    '../src/pages/dashboard',
    '../src/pages/appointments',
    // Add more routes to cache here
  ]

  self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
      )
  })
  

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      })
    )
  })