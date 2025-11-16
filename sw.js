self.addEventListener('install', e=>{
  e.waitUntil(caches.open('animo-v1').then(c=>c.addAll(['./','./index.html','./style.css','./app.js','./data/catalog.json','./assets/logo.svg'])));
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
  }
});