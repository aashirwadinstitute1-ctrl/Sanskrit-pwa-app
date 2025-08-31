const CACHE_NAME = 'sanskrit-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './sanskrit_database_full.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => {
      if(res) return res;
      return fetch(e.request).then(r => {
        // cache new GET requests (non CORS/opaque might fail)
        if(e.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => { try { cache.put(e.request, r.clone()); } catch(_){} });
        }
        return r;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })))
  );
});
