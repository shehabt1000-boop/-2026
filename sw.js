// أبسط ملف عامل خدمة (فقط ليعمل التطبيق أوفلاين)
// This service worker doesn't do much, just fulfills the installability criteria.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // هذا الكود البسيط لا يقوم بعمل cache، هو فقط يفي بالمتطلبات
  event.respondWith(fetch(event.request));
});