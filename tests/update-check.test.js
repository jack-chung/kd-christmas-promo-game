import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {build} from '../scripts/build.mjs';
import {UpdateCheck,safeView,publishedBuild} from '../docs/game/update-check.js';
const pause=()=>new Promise(resolve=>setTimeout(resolve,15));
function fixture(extra={}){const calls=[],data=new Map();const u=new UpdateCheck({running:'old',discover:async()=> 'a'.repeat(20),safe:()=>true,prepare:async()=>{},notice:()=>calls.push('note'),hide:()=>{},reload:url=>calls.push(url),url:()=> 'https://example.org/game/?review=1&episode=2#collection',storage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},delay:1,...extra});return {u,calls,data};}
test('safe views are explicit; play, pause, results and all celebrations remain unsafe',()=>{
 for(const view of ['hub','wrap','sorting','tower','collection','gift']){assert.ok(safeView(view));for(const flag of ['hidden','modal','editing'])assert.equal(safeView(view,{[flag]:true}),false);}
 for(const view of ['wrapPlay','wrapOrder','wrapGift','wrapPractice','towerPlay','sortingPlay','wrapResults','towerResults','sortingResults','unwrap','finale','finalReveal','certificate','onboard'])assert.equal(safeView(view),false);
});
test('safe update announces once then reloads preserving query and hash; session guards stale reload',async()=>{
 const {u,calls,data}=fixture();await u.check();await pause();assert.equal(calls[0],'note');const url=new URL(calls[1]);assert.equal(url.search,'?review=1&episode=2');assert.equal(url.hash,'#collection');assert.ok(url.pathname.includes('/releases/'+ 'a'.repeat(20)));
 await u.check();await pause();assert.equal(calls.length,2);
 const next=fixture({storage:{getItem:k=>data.get(k)}});await next.u.check();await pause();assert.equal(next.calls.length,0);
});
test('defer until safe; becoming unsafe during preparation or notice cancels reload',async()=>{
 let safe=false;const {u,calls}=fixture({safe:()=>safe});await u.check();await pause();assert.equal(calls.length,0);safe=true;await u.consider();assert.equal(calls.length,2);
 const f=fixture({safe:()=>safe,notice:()=>{safe=false;}});await f.u.check();await pause();assert.equal(f.calls.length,0);
 safe=true;const g=fixture({safe:()=>safe,prepare:async()=>{safe=false;}});await g.u.check();await pause();assert.equal(g.calls.length,0);
});
test('failed checks and incomplete deployments are silent',async()=>{
 for(const extra of [{discover:async()=>{throw Error('offline');}},{prepare:async()=>{throw Error('missing file');}},{discover:async()=> 'old'}]){const {u,calls}=fixture(extra);await u.check();await pause();assert.equal(calls.length,0);}
});
test('unique path discovery bypasses query-insensitive caches, rejects positive Age',async()=>{
 const urls=[];const fetcher=async(url,options)=>{urls.push(String(url));assert.equal(options.cache,'no-store');return new Response('<meta name="tuneville-build" content="'+ 'a'.repeat(20)+'">',{status:404});};
 assert.equal(await publishedBuild(fetcher),'a'.repeat(20));await publishedBuild(fetcher);assert.notEqual(new URL(urls[0]).pathname,new URL(urls[1]).pathname);
 await assert.rejects(publishedBuild(async()=>new Response('',{headers:{age:'1'}})));
 await assert.rejects(publishedBuild(async()=>new Response('<meta name="tuneville-build" content="'+ 'a'.repeat(20)+'">',{status:503})));
});
test('shipped file changes fail build check until regenerated; running and published ids agree',async()=>{
 await build(true);const path=new URL('../docs/game/style.css',import.meta.url),original=await readFile(path);
 try{await writeFile(path,Buffer.concat([original,Buffer.from('\n/* build gate test */\n')]));await assert.rejects(build(true),/Stale build/);}finally{await writeFile(path,original);}
 await build(true);
});

test('unwritable save cancels navigation and leaves the target available for a later retry',async()=>{
 let writable=false;const {u,calls,data}=fixture({beforeReload:()=>{if(!writable)throw Error('storage full');}});
 await u.check();await pause();assert.equal(calls.length,1);assert.equal(data.size,0);
 writable=true;await u.consider();assert.equal(calls.length,3);assert.equal(data.size,1);
});
