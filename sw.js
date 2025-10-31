// sw.js - ملف عامل خدمة مع Caching أساسي

const CACHE_NAME = 'sharkia-services-cache-v1';
// قائمة بالملفات الأساسية التي يحتاجها تطبيقك ليعمل
const urlsToCache = [
  '.', // الصفحة الرئيسية (start_url)
  'index.html', // افترض أن هذه هي صفحتك الرئيسية
  'android-chrome-192x192.png',
  'android-chrome-512x512.png'
  // أضف هنا أي ملفات CSS أو JS أساسية أخرى
  // 'css/style.css',
  // 'js/app.js'
];

// 1. عند تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // تخزين كل الملفات الموجودة في urlsToCache
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. عند تفعيل الـ Service Worker (لحذف الـ Cache القديم)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // حذف أي Cache لا ينتمي للقائمة البيضاء
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. عند طلب أي ملف (Fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا وجد الملف في الـ Cache، قم بإرجاعه
        if (response) {
          return response;
        }
        // إذا لم يوجد، اطلبه من الإنترنت
        return fetch(event.request);
      }
    )
  );
});
