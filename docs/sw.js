const BUILD={"id":"512f16c3bac5bf79a389","files":["index.html","boot.js","game/build-info.js","game/app.js","game/art.js","game/audio/CC0-1.0.txt","game/audio/README.md","game/audio/bass-36.wav","game/audio/bow-79.wav","game/audio/credits.html","game/audio/fold-59.wav","game/audio/fold-65.wav","game/audio/fold-72.wav","game/audio/ribbon-62.wav","game/audio/ribbon-69.wav","game/audio/sources.json","game/audio/tape-62.wav","game/audio/tape-69.wav","game/audio/tape-72.wav","game/content.js","game/engine.js","game/music.js","game/rhythm.js","game/sorting-feedback.js","game/sorting-music.js","game/sorting-ui.js","game/sorting.js","game/style.css","game/trusted-clock.js","game/update-check.js"],"hashes":{"index.html":"d3f6719efa18528be6afa0595a2750f5f4b420b6426fc62c56b79d0be3c65287","boot.js":"494b8c917a27246648a9ecf09580c039fcd977d535692272c6f0a9bc304614bd","game/build-info.js":"a090ac175c5ee965d324da7fbed2c00d3967c7fec31f48b1b0dd8a9d0fa0634d","game/app.js":"a37b8931aff977f2ff8acda0e8bd5b41d4bef366f0404f95239cf9183c43d82e","game/art.js":"2159a9250a3f0e353f8359a93ad3c94d47b21cdb661f76c50a30558564db9164","game/audio/CC0-1.0.txt":"36ffd9dc085d529a7e60e1276d73ae5a030b020313e6c5408593a6ae2af39673","game/audio/README.md":"479effc091ce102716bb240e6f632f218503b9f470ecc390265e1a84954a621f","game/audio/bass-36.wav":"37ded4a9f80d4a5cd6aa0a0a78b28f9560ba1b8dbf62de0f72530d20bd92e7db","game/audio/bow-79.wav":"36e3f38b7600549f9a31fa66fc29a5c30a9f99c501fa4a8204c4daaba7122f2b","game/audio/credits.html":"9b04e9083f0738c487f49abf3e1b75d37cd22c60b2aac4305fe8749a6a61d5bb","game/audio/fold-59.wav":"67e4df748342ced6b13f4c78c0a964db4ffca983dd655f851a7a56b952efb273","game/audio/fold-65.wav":"8fdf5c3ac32651d6f898c7d04c38c76c85acfc1c4464c0ff7fab218602c59c03","game/audio/fold-72.wav":"fcf5397c3807fd2bf646014a9175bc7946cb054418fe936f5cb88da65bcb5116","game/audio/ribbon-62.wav":"08917d1261641ea44181df601512ad92a02c23ca6b2ac88bb0d696ba77d06331","game/audio/ribbon-69.wav":"0ffb477194ae6d11aa4fb0b26bb7ae21fc20786ea9b497d3854dda60a527e8ad","game/audio/sources.json":"ffbb6e3f3c841e4ce14f634d105fd2ec6fc20ee1565143f1554836e33d9a7874","game/audio/tape-62.wav":"75c24d1b6b4b5b11c8af361479929a11979ed0253977d0634d2a39247509adb2","game/audio/tape-69.wav":"d7e29e216eab24d7ad2f3e3bb1e253210746c38fca7df2283a025a3eafbb6647","game/audio/tape-72.wav":"600ea086a5e568b6ea19edbd113be835ac1e19c411e77b72a46fe0197f8679a2","game/content.js":"26b9cfe962fe90c6fdd5c403192252fd89758062eb286ecdb7c41ef61c0b8c52","game/engine.js":"6ffa8e553c94e353cb9474b68d295ec5039290415e2d6a54007c16095838bd5a","game/music.js":"817ce3c91eb2ef4450e56a22ee3231612cd8e10a121506d75d2f0efbfed3398f","game/rhythm.js":"87180d59d6a6c966f876847928ef81af51d53e5f9e6be53afe2c59ec6528de75","game/sorting-feedback.js":"21da5413d143fdefc4e9631637ca31a18a9ee60350757bbcdb5a08e861a920f4","game/sorting-music.js":"630d92051293cd0053aab9d3ba7846b2645be649ccd073d61b7de30493d1ede8","game/sorting-ui.js":"14194631a8226f7acb0e33a496f7276aaf6525305b50c4c32982fa8cbb0a08b2","game/sorting.js":"b7bf327f0eb8d81b57a112b7ef315cd03ed86ead9d896b39f73edefe2a2d1e66","game/style.css":"66884c9a2cc6090c461f28651e50df3a44378cd1876e16a9890e3a26c8a9413d","game/trusted-clock.js":"03061f85bbccf4aa12459cc60142a55ae23d446c6cefb9eaf5fcf7ffb81c06bf","game/update-check.js":"145361f068915d0dd07a5a79664f8d5957caf99732747de65c759e42740243fb"}};
const CACHE='tuneville-build-'+BUILD.id;
const base=new URL('./',self.location);
const release=new URL('releases/'+BUILD.id+'/',base);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Immutable paths: a missing file fails installation instead of borrowing another build.
 for(const path of [...BUILD.files,'manifest.json']){
  const url=new URL(path,release);
  // Update preparation already verifies this cache; recheck its bytes without downloading twice.
  const response=await cache.match(url)||await fetch(url,{cache:'no-store'});
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
