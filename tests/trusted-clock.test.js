import test from 'node:test';
import assert from 'node:assert/strict';
import {TrustedClock} from '../docs/game/trusted-clock.js';
import {dateOpen} from '../docs/game/engine.js';
import {C} from '../docs/game/content.js';
test('host time, monotonic elapsed, offline persistence and device-date independence',async()=>{
  let tick=0,server=Date.parse('2026-11-13T04:59:59Z'),connected=true;
  const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
  const fetcher=async(url,options)=>{assert.equal(options.cache,'no-store');assert.equal(options.method,'HEAD');assert.ok(url.searchParams.has('host-time'));if(!connected)throw Error();return {ok:true,headers:new Headers({date:new Date(server).toUTCString()})};};
  const clock=new TrustedClock({storage,fetcher,monotonic:()=>tick});await clock.sync();
  const original=Date.now;
  try{for(const fake of [0,9999999999999]){Date.now=()=>fake;assert.equal(dateOpen(C.episodes[0].date,false,clock.now()),false);}
    tick=1000;assert.equal(dateOpen(C.episodes[0].date,false,clock.now()),true);
    connected=false;await clock.sync();tick+=999999999;assert.equal(clock.now(),Date.parse(C.episodes[0].date));
    const reload=new TrustedClock({storage,fetcher,monotonic:()=>tick});await reload.sync();assert.equal(reload.now(),Date.parse(C.episodes[0].date));assert.equal(dateOpen(C.episodes[1].date,false,reload.now()),false);
    const fresh=new TrustedClock({fetcher});await fresh.sync();assert.equal(fresh.now(),0);
  }finally{Date.now=original;}
});
test('every Toronto release and finale follow fresh host responses exactly',async()=>{
  for(const ep of [...C.episodes,C.finale])for(const delta of [-1000,0]){
    const server=Date.parse(ep.date)+delta;
    const clock=new TrustedClock({monotonic:()=>0,fetcher:async()=>({ok:true,headers:new Headers({date:new Date(server).toUTCString()})})});
    await clock.sync();assert.equal(dateOpen(ep.date,false,clock.now()),delta===0);
  }
});
test('cached and invalid responses cannot unlock anything',async()=>{
  for(const headers of [{date:'bad'},{date:'Fri, 04 Dec 2026 05:00:00 GMT',age:'60'}]){
    const clock=new TrustedClock({fetcher:async()=>({ok:true,headers:new Headers(headers)})});await clock.sync();assert.equal(clock.now(),0);assert.equal(clock.online,false);
  }
});

test('fresh missing-path HEAD supplies host time; each probe has a unique CDN key',async()=>{
  const paths=[];
  const clock=new TrustedClock({monotonic:()=>0,fetcher:async url=>{paths.push(url.pathname);return {ok:false,status:404,headers:new Headers({date:'Fri, 13 Nov 2026 05:00:00 GMT',age:'0'})};}});
  await clock.sync();await clock.sync();assert.equal(clock.online,true);assert.notEqual(paths[0],paths[1]);assert.ok(paths.every(path=>path.includes('/.host-time/')));assert.equal(clock.now(),Date.parse(C.episodes[0].date));
});
