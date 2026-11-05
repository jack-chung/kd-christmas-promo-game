const BUILD={"id":"6fad168f2ed3ca4e3ab8","files":["index.html","boot.js","game/build-info.js","game/app.js","game/art.js","game/audio/CC0-1.0.txt","game/audio/README.md","game/audio/bass-36.wav","game/audio/bow-79.wav","game/audio/credits.html","game/audio/fold-59.wav","game/audio/fold-65.wav","game/audio/fold-72.wav","game/audio/ribbon-62.wav","game/audio/ribbon-69.wav","game/audio/sources.json","game/audio/tape-62.wav","game/audio/tape-69.wav","game/audio/tape-72.wav","game/content.js","game/engine.js","game/game-feedback.js","game/music.js","game/results-feedback.js","game/rhythm.js","game/sleigh-ui.js","game/sleigh.js","game/sorting-feedback.js","game/sorting-music.js","game/sorting-ui.js","game/sorting.js","game/style.css","game/trusted-clock.js","game/update-check.js"],"hashes":{"index.html":"d3f6719efa18528be6afa0595a2750f5f4b420b6426fc62c56b79d0be3c65287","boot.js":"494b8c917a27246648a9ecf09580c039fcd977d535692272c6f0a9bc304614bd","game/build-info.js":"529bebf9a14ec33758717f4747cf3977739eb2d8716ffbb0b3214a15c2f9389e","game/app.js":"6d7a73f8c2e23282b3f16b86537e473348117536a4466f4922f602f704e554e7","game/art.js":"2159a9250a3f0e353f8359a93ad3c94d47b21cdb661f76c50a30558564db9164","game/audio/CC0-1.0.txt":"36ffd9dc085d529a7e60e1276d73ae5a030b020313e6c5408593a6ae2af39673","game/audio/README.md":"479effc091ce102716bb240e6f632f218503b9f470ecc390265e1a84954a621f","game/audio/bass-36.wav":"37ded4a9f80d4a5cd6aa0a0a78b28f9560ba1b8dbf62de0f72530d20bd92e7db","game/audio/bow-79.wav":"36e3f38b7600549f9a31fa66fc29a5c30a9f99c501fa4a8204c4daaba7122f2b","game/audio/credits.html":"9b04e9083f0738c487f49abf3e1b75d37cd22c60b2aac4305fe8749a6a61d5bb","game/audio/fold-59.wav":"67e4df748342ced6b13f4c78c0a964db4ffca983dd655f851a7a56b952efb273","game/audio/fold-65.wav":"8fdf5c3ac32651d6f898c7d04c38c76c85acfc1c4464c0ff7fab218602c59c03","game/audio/fold-72.wav":"fcf5397c3807fd2bf646014a9175bc7946cb054418fe936f5cb88da65bcb5116","game/audio/ribbon-62.wav":"08917d1261641ea44181df601512ad92a02c23ca6b2ac88bb0d696ba77d06331","game/audio/ribbon-69.wav":"0ffb477194ae6d11aa4fb0b26bb7ae21fc20786ea9b497d3854dda60a527e8ad","game/audio/sources.json":"ffbb6e3f3c841e4ce14f634d105fd2ec6fc20ee1565143f1554836e33d9a7874","game/audio/tape-62.wav":"75c24d1b6b4b5b11c8af361479929a11979ed0253977d0634d2a39247509adb2","game/audio/tape-69.wav":"d7e29e216eab24d7ad2f3e3bb1e253210746c38fca7df2283a025a3eafbb6647","game/audio/tape-72.wav":"600ea086a5e568b6ea19edbd113be835ac1e19c411e77b72a46fe0197f8679a2","game/content.js":"e0ac95a326c3b51e5f45018965c0b9e5d6db66dd52d5d019b5d10e49f5b4dd36","game/engine.js":"7cd100ac16be22615739083cf172e11352fa3a235090b0e03c05431693c1e35f","game/game-feedback.js":"ca3797bd5ab7b2506942dabf985bb76bcace8b2d679d08f087bee766a070ff2b","game/music.js":"817ce3c91eb2ef4450e56a22ee3231612cd8e10a121506d75d2f0efbfed3398f","game/results-feedback.js":"5eca29e4855318ca88d8b743e8d1fb551425c166fb6ff27688869f17963f440e","game/rhythm.js":"87180d59d6a6c966f876847928ef81af51d53e5f9e6be53afe2c59ec6528de75","game/sleigh-ui.js":"ab6f4519758f5b529ca30d6eab2c44803806f6f7c6ddc39c31d3ec36ef99f5e4","game/sleigh.js":"b00d9e7f30c84c571b2695e661c4b6f2179cd922de36364bea48968978109c77","game/sorting-feedback.js":"b7cd5a8c530bf1821dd3337bc3162fcaa8829e44fe27f90e467ebab7b425bb43","game/sorting-music.js":"630d92051293cd0053aab9d3ba7846b2645be649ccd073d61b7de30493d1ede8","game/sorting-ui.js":"a53023b3a321f190b81815b9d74f6ef0405b98695db83f5cf78809df1cc4a402","game/sorting.js":"b7bf327f0eb8d81b57a112b7ef315cd03ed86ead9d896b39f73edefe2a2d1e66","game/style.css":"9710dad5e0049fb81ea8a69c712233050448c837be56ef776fe855bc20af2685","game/trusted-clock.js":"03061f85bbccf4aa12459cc60142a55ae23d446c6cefb9eaf5fcf7ffb81c06bf","game/update-check.js":"a282e4c66dca03d005b820c6e09f134d6a5acb66506b443a00b2555426ba45ba"}};
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
