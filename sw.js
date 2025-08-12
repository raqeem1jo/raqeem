
self.addEventListener('install', e => {
  e.waitUntil(caches.open('raqeem-v1').then(cache => cache.addAll([
    '/index.html','/styles.css','/assets/css/mobile-enhancements.css','/script.js','/logo.png'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});
