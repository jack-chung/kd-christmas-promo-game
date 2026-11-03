const CACHE='tuneville-sorting-feedback-v2';
const FILES=["./", "./index.html", "./game/trusted-clock.js", "./game/rhythm.js", "./game/sorting.js", "./game/sorting-ui.js", "./game/sorting-feedback.js", "./game/style.css", "./game/engine.js", "./game/content.js", "./game/music.js", "./game/art.js", "./game/app.js"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  // Host clock probes must reach the network, including while offline.
  if(event.request.method!=='GET'||url.searchParams.has('host-time')||url.origin!==location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request,{ignoreSearch:true})));
});
