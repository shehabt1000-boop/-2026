const CACHE_NAME = 'sharqia-services-v13-cache';
const urlsToCache = [
    '/',
    '/index.html', // اسم ملفك الرئيسي
    '/manifest.json',
    // ملفات CSS و JS الأساسية
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&display=swap',
    // Firebase CDN URLs (لضمان عمل وظائف Firebase الأساسية عند الاتصال)
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
    // الأيقونات (تأكد من وجودها في المسار الصحيح)
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // يمكنك إضافة المزيد من الأصول الثابتة هنا
];

// تثبيت عامل الخدمة وتخزين الأصول الثابتة مؤقتاً
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// اعتراض طلبات الشبكة (Fetch) لتقديم الأصول من التخزين المؤقت أولاً
self.addEventListener('fetch', event => {
    // استراتيجية Cache-First للطلبات التي تم تخزينها
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد استجابة في الكاش، يعيدها
                if (response) {
                    return response;
                }
                // إذا لم يجد، يذهب إلى الشبكة
                return fetch(event.request);
            })
    );
});

// تحديث عامل الخدمة: حذف الكاشات القديمة
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