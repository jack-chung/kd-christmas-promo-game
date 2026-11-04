const BUILD=BUILD_MANIFEST;
const CACHE='tuneville-build-'+BUILD.id;
const base=new URL('./',self.location);
const release=new URL('releases/'+BUILD.id+'/',base);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Immutable paths: a missing file fails installation instead of borrowing another build.
 for(const path of [...BUILD.files,'manifest.json']){
  const url=new URL(path,release),response=await fetch(url,{cache:'no-store'});
  if(!response.ok)throw Error('Incomplete build');
  if(path!=='manifest.json'){
   const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer()))].map(n=>n.toString(16).padStart(2,'0')).join('');
   if(hash!==BUILD.hashes[path])throw Error('Wrong build file');
  }
  await cache.put(url,response);
 }
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==base.origin||url.pathname.includes('/.update-check/')||url.searchParams.has('host-time')||url.pathname.endsWith('/build.json')||url.pathname.endsWith('/sw.js'))return;
 // Only match an exact immutable URL. Never ignore a version or fall back to other releases.
 if(url.pathname.includes('/releases/')){
  event.respondWith((async()=>{const cached=await caches.match(event.request);return cached||fetch(event.request,{cache:'no-store'});})());return;
 }
 if(event.request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===new URL('index.html',base).pathname)){
  event.respondWith((async()=>{
   try{return await fetch(event.request,{cache:'no-store'});}catch{const cached=await (await caches.open(CACHE)).match(new URL('index.html',release));if(!cached)throw Error('No offline build');return new Response((await cached.text()).replace('src="boot.js"','src="'+new URL('boot.js',release).href+'"'),{headers:{'Content-Type':'text/html'}});}
  })());
 }
});
self.addEventListener('message',event=>{
 if(event.data?.type==='build-id'){event.ports[0]?.postMessage(BUILD.id);return;}
 if(event.data?.type!=='prune-builds'||event.data.id!==BUILD.id)return;
 event.waitUntil((async()=>{
  // Retain builds still used by other open tabs, including paused games.
  const clients=await self.clients.matchAll();
  if(clients.length>1)return;
  for(const name of await caches.keys())if(name.startsWith('tuneville-')&&name!==CACHE)await caches.delete(name);
 })());
});
