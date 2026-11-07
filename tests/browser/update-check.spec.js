import {test as base,expect} from '@playwright/test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile(new URL('../../docs/build.json',import.meta.url)));
const original=new URL('../../docs/releases/'+manifest.id+'/',import.meta.url);
const template=await readFile(new URL('../../scripts/sw.js',import.meta.url),'utf8');
const A='a'.repeat(20),B='b'.repeat(20);
const hash=b=>createHash('sha256').update(b).digest('hex');
const bundles={};
for(const id of [A,B]){
 const files={};for(const path of manifest.files)files[path]=await readFile(new URL(path,original));
 files['game/build-info.js']=Buffer.from(`export const BUILD_ID='${id}';export const SITE_ROOT=new URL('../../../',import.meta.url);`);
 files['game/app.js']=Buffer.concat([files['game/app.js'],Buffer.from(`\nglobalThis.__assetBuild='${id}';`)]);
 files['game/style.css']=Buffer.concat([files['game/style.css'],Buffer.from(`\n/* ${id} */`)]);
 const release={id,files:manifest.files,hashes:Object.fromEntries(Object.entries(files).map(([path,bytes])=>[path,hash(bytes)]))};
 files['manifest.json']=Buffer.from(JSON.stringify(release));bundles[id]={files,release};
}
const types={html:'text/html',js:'text/javascript',css:'text/css',json:'application/json',wav:'audio/wav',png:'image/png',svg:'image/svg+xml'};
const test=base.extend({host:async({},use)=>{
 let current=A,incomplete=false,stale=false;const requests=[],removed=new Set(),downloads=[];
 const server=createServer((req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;requests.push(path);res.setHeader('Date','Tue, 03 Nov 2026 17:00:00 GMT');
  let body,type='text/html';
  if(path.includes('/.update-check/')){res.statusCode=404;body=`<meta name="tuneville-build" content="${current}">`;}
  else if(path==='/preview/sw.js'){type='text/javascript';body=template.replace('BUILD_MANIFEST',JSON.stringify(bundles[current].release));}
  else if(path==='/preview/build.json'){type='application/json';body=JSON.stringify(bundles[current].release);}
  else if(path==='/preview/'||path==='/preview/index.html'){
   // Simulate a CDN retaining the old root document despite a new deploy.
   body=bundles[A].files['index.html'].toString().replace('src="boot.js"',`src="releases/${A}/boot.js"`).replaceAll('href="game/',`href="releases/${A}/game/`);
  }else if(path.startsWith('/preview/releases/')){
   const [,id,file]=path.match(/\/releases\/([^/]+)\/(.*)/)||[];
   body=removed.has(id)?undefined:bundles[id]?.files[file];type=types[file?.split('.').at(-1)]||'text/plain';
   if(incomplete&&id===B&&file==='game/sorting-music.js'){res.statusCode=503;body='not deployed';}
   if(stale&&id===B&&file==='game/style.css')body=bundles[A].files[file];
  }
  if(body===undefined){res.statusCode=404;body='missing';}
  downloads.push({path,bytes:Buffer.byteLength(body)});res.setHeader('Content-Type',type);res.end(body);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/preview/`;
 await use({url,requests,downloads,prune:id=>removed.add(id),deploy:()=>{current=B;},incomplete:value=>{incomplete=value;},stale:value=>{stale=value;}});
 server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
}});
async function enter(page,host){
 await page.goto(host.url+'?review=1&episode=1#hub');
 await page.locator('[data-action="profile"]').click({force:true});
 await page.locator('[data-action="go:hub"]').last().click();
 await expect(page.locator('[data-build-id]')).toHaveText(A);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
 await page.evaluate(()=>{const key='tuneville-gift-v1',s=JSON.parse(localStorage.getItem(key));s.layers=[1,2];s.paper='stars';localStorage.setItem(key,JSON.stringify(s));});
 return page.evaluate(()=>localStorage.getItem('tuneville-gift-v1'));
}
const recheck=page=>page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
async function buildB(page){await expect(page.locator('[data-build-id]')).toHaveText(B,{timeout:20000});}
test('active worker: safe reload keeps save/query/hash and every asset belongs to B despite a stale root document',async({page,host,context})=>{
 await enter(page,host);await page.reload();await expect(page.locator('[data-build-id]')).toHaveText(A);
 const saved=await page.evaluate(()=>localStorage.getItem('tuneville-gift-v1'));
 await page.emulateMedia({reducedMotion:'reduce'});host.deploy();await recheck(page);
 await expect(page.locator('#update-note')).toBeVisible({timeout:20000});
 await page.screenshot({path:'/tmp/tuneville-update-note-'+test.info().project.name+'.png'});
 await buildB(page);expect(page.url()).toBe(host.url+'?review=1&episode=1#hub');
 expect(await page.evaluate(()=>localStorage.getItem('tuneville-gift-v1'))).toBe(saved);
 expect(await page.evaluate(()=>globalThis.__assetBuild)).toBe(B);
 await page.locator('[data-action="episode:2"]').first().click({force:true});await expect(page.locator('#music-loading')).toBeHidden();
 const urls=await page.evaluate(async id=>{const cache=await caches.open('tuneville-build-'+id);return (await cache.keys()).map(r=>r.url);},B);
 for(const path of manifest.files)expect(urls.some(url=>url.endsWith('/releases/'+B+'/'+path))).toBe(true);
 expect(host.requests.filter(path=>path.startsWith('/preview/game/'))).toEqual([]);
 // The new worker must also restore the immutable build offline.
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
 await expect.poll(()=>page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();if(!navigator.serviceWorker.controller)return '';return new Promise(resolve=>{const channel=new MessageChannel();channel.port1.onmessage=e=>resolve(e.data);navigator.serviceWorker.controller.postMessage({type:'build-id'},[channel.port2]);});})).toBe(B);
 await context.setOffline(true);await page.goto(host.url+'?review=1#hub');await buildB(page);
});
test('Wrap play and pause defer the update until home; modal and all celebration screens block it',async({page,host})=>{
 await enter(page,host);await page.locator('[data-action="review-menu"]').first().click({force:true});
 await page.locator('[data-action="jump:wrapPlay"]').click({force:true});await page.locator('[data-action="pause"]').click({force:true});
 host.deploy();await recheck(page);await page.waitForTimeout(2200);await expect(page.locator('[data-build-id]')).toHaveText(A);await expect(page.locator('#update-note')).toHaveCount(0);
 await page.locator('[data-action="resume"]').click({force:true});await recheck(page);await page.waitForTimeout(1800);await expect(page.locator('[data-build-id]')).toHaveText(A);
 for(const route of ['wrapResults','wrapGift','unwrap','finalReveal','finale']){
  await page.locator('[data-action="review-menu"]').first().click({force:true});await page.locator(`[data-action="jump:${route}"]`).click({force:true});await recheck(page);await page.waitForTimeout(1700);await expect(page.locator('[data-build-id]')).toHaveText(A);
 }
 await page.locator('[data-action="go:hub"]').first().click({force:true});await buildB(page);
});
test('incomplete or wrong-byte target stays on A silently, then a later check retries successfully',async({page,host})=>{
 await enter(page,host);host.deploy();host.incomplete(true);await recheck(page);await page.waitForTimeout(2500);await expect(page.locator('[data-build-id]')).toHaveText(A);await expect(page.locator('#update-note')).toHaveCount(0);
 host.incomplete(false);host.stale(true);await page.evaluate(async id=>{await caches.delete('tuneville-build-'+id);},B);await recheck(page);await page.waitForTimeout(2500);await expect(page.locator('[data-build-id]')).toHaveText(A);
 host.stale(false);await recheck(page);await buildB(page);
});
test('offline check leaves the game intact; five-minute visible check finds the deployment',async({page,host,context})=>{
 await page.clock.install();await enter(page,host);await context.setOffline(true);host.deploy();await recheck(page);await page.waitForTimeout(1800);await expect(page.locator('[data-build-id]')).toHaveText(A);await expect(page.locator('#update-note')).toHaveCount(0);
 await context.setOffline(false);await page.clock.fastForward(300001);await page.clock.resume();await buildB(page);
});

test('a modal or focused text field on a calm screen defers reloading until both clear',async({page,host})=>{
 await page.clock.install();await enter(page,host);
 await page.evaluate(()=>{const input=document.createElement('input');input.id='update-test-input';document.querySelector('#main').append(input);input.focus();const modal=document.createElement('section');modal.id='update-test-modal';modal.setAttribute('aria-modal','true');document.querySelector('#main').append(modal);});
 host.deploy();await page.clock.fastForward(300001);await page.waitForTimeout(1800);await expect(page.locator('#update-note')).toHaveCount(0);
 await page.locator('#update-test-modal').evaluate(el=>el.remove());await page.waitForTimeout(1800);await expect(page.locator('[data-build-id]')).toHaveText(A);
 await page.locator('#update-test-input').evaluate(el=>el.remove());await buildB(page);
});

test('slim release stays within budget and an open pruned release updates after leaving paused play',async({page,host,context})=>{
 const config=JSON.parse(await readFile(new URL('../../scripts/build-config.json',import.meta.url)));
 for(const path of manifest.files)expect(path==='index.html'||path==='boot.js'||path.startsWith('game/')).toBe(true);
 const releaseBytes=Object.values(bundles[A].files).reduce((sum,bytes)=>sum+bytes.length,0);
 expect(releaseBytes).toBeLessThanOrEqual(config.maxReleaseBytes);
 expect(releaseBytes).toBeLessThan(1500000);
 await enter(page,host);
 const firstOpenBytes=host.downloads.reduce((sum,{bytes})=>sum+bytes,0);expect(firstOpenBytes).toBeLessThan(1500000);
 await page.reload();
 const saved=await page.evaluate(()=>localStorage.getItem('tuneville-gift-v1'));
 const gallery=page.locator('a[href*="art-direction/"]');expect(await gallery.getAttribute('href')).toBe(host.url+'art-direction/');
 await page.locator('[data-action="review-menu"]').click({force:true});await page.locator('[data-action="jump:wrapPlay"]').click({force:true});await page.locator('[data-action="pause"]').click({force:true});
 const beforeUpdate=host.downloads.length;host.deploy();host.prune(A);
 // This request bypasses the worker: the old release really is gone from the host.
 expect((await context.request.get(host.url+'releases/'+A+'/game/sorting-music.js')).status()).toBe(404);
 // Lazy old-build assets still resolve from the complete local cache while play is unsafe.
 expect(await page.evaluate(async id=>{await import(new URL('releases/'+id+'/game/sorting-music.js',location.href));const r=await fetch(new URL('releases/'+id+'/game/audio/bass-36.wav',location.href));return r.ok;},A)).toBe(true);
 await recheck(page);await page.waitForTimeout(2000);await expect(page.locator('[data-build-id]')).toHaveText(A);await expect(page.locator('#update-note')).toHaveCount(0);
 await page.locator('.pause-card [data-action="go:hub"]').click({force:true});await buildB(page);
 expect(await page.evaluate(()=>localStorage.getItem('tuneville-gift-v1'))).toBe(saved);
 expect(page.url()).toBe(host.url+'?review=1&episode=1#hub');
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
 await expect.poll(()=>page.evaluate(async()=>{if(!navigator.serviceWorker.controller)return '';return new Promise(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>resolve(e.data);navigator.serviceWorker.controller.postMessage({type:'build-id'},[c.port2]);});})).toBe(B);
 const updateBytes=host.downloads.slice(beforeUpdate).reduce((sum,{bytes})=>sum+bytes,0);
 expect(updateBytes).toBeLessThan(1500000);
 console.log(JSON.stringify({browser:test.info().project.name,releaseBytes,firstOpenBytes,updateBytes}));
});
