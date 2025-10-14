const CACHE_NAME = 'bess-tecidos-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/fabrics.xlsx',
  '/logo_bess.svg',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/components/FabricList.jsx',
  '/src/components/FabricListItem.jsx',
  '/src/components/FabricDetail.jsx',
  '/src/components/SearchBar.jsx',
  '/src/hooks/useExcelData.js',
  '/src/utils/formatPrice.jsx',
  '/src/App.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});
