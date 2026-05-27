const CACHE='fm-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/']))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method==='GET') e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
