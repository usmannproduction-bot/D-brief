/* D'brief - service worker
   Strategie : RESEAU D'ABORD (toujours la derniere version en ligne),
   cache en secours pour le mode hors-ligne.
   -> Pour forcer un nettoyage complet du cache, change 'dbrief-v1' en 'dbrief-v2'. */
var CACHE = 'dbrief-v1';
var CORE = ['/D-brief/', '/D-brief/index.html', '/D-brief/manifest.json',
            '/D-brief/icon-192.png', '/D-brief/icon-512.png'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(CORE).catch(function () {});
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) { return caches.delete(k); }
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') { return; }
  var url = new URL(req.url);
  // Ne touche pas a Firebase / Google / CDN : laisse passer vers le reseau.
  if (url.origin !== self.location.origin) { return; }
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (m) {
        if (m) { return m; }
        return caches.match('/D-brief/index.html');
      });
    })
  );
});
