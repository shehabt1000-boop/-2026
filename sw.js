const CACHE_NAME = 'sharqia-app-v1';
// قائمة الملفات الأساسية التي يجب تخزينها مؤقتًا
const urlsToCache = [
  '/', // الصفحة الرئيسية (index.html)
  '/manifest.json' // ملف البيان
  // أضف هنا أي ملفات CSS أو JS أخرى إذا كانت منفصلة
  // مثال: '/style.css'
];

// 1. حدث التثبيت (Install)
// يتم تشغيله عند تثبيت الـ Service Worker لأول مرة
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // تفعيل الـ SW فوراً
  );
});

// 2. حدث التفعيل (Activate)
// يتم تشغيله لتنظيف الكاش القديم
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. حدث الجلب (Fetch)
// يقرر ما إذا كان سيتم جلب الملف من الكاش أو من الشبكة
self.addEventListener('fetch', event => {
  // لا تقم بتخزين طلبات Firebase مؤقتًا
  if (event.request.url.includes('firebase') || event.request.url.includes('gstatic')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // استراتيجية "الكاش أولاً" (Cache First)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد في الكاش، قم بإرجاعه
        if (response) {
          return response;
        }

        // إذا لم يوجد، اذهب للشبكة
        return fetch(event.request).then(
          networkResponse => {
            // (اختياري) يمكنك تخزين الردود الجديدة هنا إذا أردت
            return networkResponse;
          }
        );
      })
      .catch(error => {
        console.error('Service Worker: Fetch error:', error);
        // يمكنك إرجاع صفحة "أنت غير متصل" هنا
      })
  );
});