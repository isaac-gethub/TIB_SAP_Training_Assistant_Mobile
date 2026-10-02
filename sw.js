const C='tib-mobile-v2.0-supabase-gate';
const A=['./','index.html','reset.html','style.css','app.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.pathname.endsWith('/courses.json')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}e.respondWith(fetch(e.request).then(r=>{if(e.request.method==='GET'&&u.origin===location.origin){let x=r.clone();caches.open(C).then(c=>c.put(e.request,x))}return r}).catch(()=>caches.match(e.request)))});
