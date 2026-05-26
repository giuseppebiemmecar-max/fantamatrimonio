// sw.js — Service Worker per notifiche push
// Fantamatrimonio · Giuseppe & Sofia

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCmrLyzKYtZraDtWoU3KGaqOFVV4wKUWCs",
  authDomain: "frantamatrimonio.firebaseapp.com",
  projectId: "frantamatrimonio",
  storageBucket: "frantamatrimonio.firebasestorage.app",
  messagingSenderId: "225931901296",
  appId: "1:225931901296:web:05cb2996263bbb5dce77b5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Notifiche in background (app chiusa o in background)
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title || '💍 Fantamatrimonio', {
    body: body || 'Nuova domanda disponibile!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [{ action: 'open', title: 'Rispondi ora →' }]
  });
});

// Click sulla notifica → apre la webapp
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// Cache minimale per funzionamento offline
const CACHE = 'fm-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
