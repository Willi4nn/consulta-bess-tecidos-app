const CACHE_NAME = 'bess-tecidos-cache-v1';

// Detecta se está em modo de desenvolvimento
const isDev =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  // Em desenvolvimento, pula o cache
  if (isDev) {
    self.skipWaiting();
    return;
  }

  // Arquivos essenciais (devem existir)
  const required = [
    '/',
    '/index.html',
    '/logo_bess.svg',
    '/icon-192.png',
    '/icon-512.png',
  ];
  // Arquivos opcionais: apenas um deles estará presente
  const optional = ['/fabrics.xlsx', '/fabrics.pdf'];

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(required);
      await Promise.all(
        optional.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {
              /* arquivo não existe, ignora */
            })
        )
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignora requisições do Vite durante desenvolvimento
  if (
    isDev ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('?t=') ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.searchParams.has('import')
  ) {
    return; // Deixa o navegador lidar com isso
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        // Retorna página offline se necessário
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});
