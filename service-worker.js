const CACHE_NAME = 'waqti-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
    'https://cdn.quilljs.com/1.3.6/quill.snow.css',
    'https://cdn.quilljs.com/1.3.6/quill.js',
    'https://unpkg.com/prop-types@15.8.1/prop-types.min.js',
    'https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching assets');
                return cache.addAll(URLS_TO_CACHE);
            })
            .catch(err => {
                console.error('Failed to cache assets during install:', err);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // Abaikan permintaan API, biarkan logika aplikasi yang menanganinya (dengan localStorage)
    if (event.request.url.includes('api.aladhan.com')) {
        return;
    }

    // Untuk semua permintaan lain, gunakan strategi cache-first
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika ada di cache, kembalikan dari cache
                if (response) {
                    return response;
                }
                // Jika tidak, ambil dari jaringan
                return fetch(event.request).then(networkResponse => {
                    // Caching asset yang baru diakses untuk penggunaan offline berikutnya
                    // Ini berguna untuk aset dinamis atau yang tidak ada di URLS_TO_CACHE awal (seperti file font woff2)
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return networkResponse;
                });
            })
    );
});