// sw.js
// kosong atau bisa tambah log dasar
import { precacheAndRoute } from 'workbox-precaching';

import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';



// Do precaching
precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching
// === 1. Story Data API (langsung ke origin API) ===
registerRoute(
  ({ url }) =>
    url.origin === 'https://story-api.dicoding.dev' &&
    url.pathname.startsWith('/v1/stories'),
  new NetworkFirst({
    cacheName: 'stories-data',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// === 2. Story Images ===
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'story-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// === 3. MapTiler tiles (jika digunakan) ===
registerRoute(
  ({ url }) => url.origin === 'https://a.tile.openstreetmap.org' ||
               url.origin === 'https://b.tile.openstreetmap.org' ||
               url.origin === 'https://c.tile.openstreetmap.org',
  new CacheFirst({
    cacheName: 'osm-tiles',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      
    ],
  })
);

// === 4. Leaflet CSS & JS dari unpkg ===
registerRoute(
  ({ url }) =>
    url.href.startsWith('https://unpkg.com/leaflet@1.9.3/dist/leaflet.css') ||
    url.href.startsWith('https://unpkg.com/leaflet@1.9.3/dist/leaflet.js') ||
    url.href.startsWith('https://unpkg.com/leaflet@1.9.3/dist/images/'),
  new StaleWhileRevalidate({
    cacheName: 'leaflet-lib',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// === 5. Font Awesome (CDN)
registerRoute(
  ({ url }) => url.origin === 'https://cdnjs.cloudflare.com' &&
               url.pathname.startsWith('/ajax/libs/font-awesome/6.5.0/'),
  new StaleWhileRevalidate({
    cacheName: 'fontawesome-cdn',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);





self.addEventListener('install', (event) => {
  console.log('Service Worker installed.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

// Notifikasi simulasi melalui devtools
self.addEventListener('push', (event) => {
  let data = {
    title: 'Ada cerita baru untuk Anda!',
    body: 'Lihat cerita baru sekarang!',
  };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }
  console.log('Push notification received:', data);
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});