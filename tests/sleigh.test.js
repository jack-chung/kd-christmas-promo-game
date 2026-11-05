import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {freshSave,normalizeSave} from '../docs/game/engine.js';
import {createSleigh,acknowledgeSleigh,hop,releaseHop,tickSleigh,hitSleigh,recordSleigh,sleighDials} from '../docs/game/sleigh.js';
const T=C.sleigh.tuning;
const rng=seed=>()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
function simulate({seed=1,interval=.08,held=false,randomTap=false,limit=120}={}){const random=rng(seed),r=createSleigh({random});let next=0;for(let t=0;t<limit&&!r.complete;t+=1/120){if(r.card)acknowledgeSleigh(r);if(t>=next){hop(r);next=t+(randomTap?.03+random()*.2:interval);}if(!held)releaseHop(r);tickSleigh(r,1/120);}return r;}
test('content drives stages, cards freeze all time, and portrait warning fits the visible road',()=>{
 const r=createSleigh();tickSleigh(r,1);assert.equal(r.elapsed,0);
 for(const c of C.sleigh.stages){r.stage=c.stage;r.elapsed=c.at;r.distance=0;const d=sleighDials(r);assert.equal(d.warning,c.warning);assert.ok((d.speed+12)*d.warning<=228.001);r.elapsed=(C.sleigh.stages[c.stage]?.at||c.at+10)-.001;acknowledgeSleigh(r);tickSleigh(r,.02);if(c.stage<8){assert.equal(r.stage,c.stage+1);assert.equal(r.card,true);}}
 for(const seconds of [110,180,300,500]){r.stage=8;r.elapsed=seconds;const d=sleighDials(r);assert.ok((d.speed+12)*d.warning<=228.001);}
});
test('tap, hold, double hop, release and landing obey physics',()=>{
 const run=hold=>{const r=createSleigh();acknowledgeSleigh(r);hop(r);if(!hold)releaseHop(r);let max=0;for(let i=0;i<120;i++){tickSleigh(r,1/120);max=Math.max(max,r.y);}return max;};assert.ok(run(true)>run(false)+30);
 const r=createSleigh();acknowledgeSleigh(r);assert.ok(hop(r));tickSleigh(r,.1);assert.ok(hop(r));assert.equal(hop(r),false);for(let i=0;i<240;i++)tickSleigh(r,1/120);assert.equal(r.y,0);assert.equal(r.hops,0);
});
test('pickup caps stack; delivery requires landing, spends top gift, skipping costs nothing',()=>{
 const r=createSleigh({stage:3});acknowledgeSleigh(r);r.next=99;r.door=99;r.gifts=7;r.objects=[{kind:'gift',x:80,y:12,width:20}];tickSleigh(r,.01);assert.equal(r.gifts,8);
 r.objects=[{kind:'gift',x:80,y:12,width:20}];tickSleigh(r,.01);assert.equal(r.gifts,8);
 r.objects=[{kind:'door',x:80,width:78}];tickSleigh(r,.01);assert.equal(r.delivered,0);r.y=1;r.vy=-100;tickSleigh(r,.02);assert.equal(r.delivered,1);assert.equal(r.gifts,7);
 r.objects=[{kind:'door',x:80,width:78}];r.gifts=0;r.y=1;r.vy=-100;tickSleigh(r,.02);assert.equal(r.delivered,1);assert.equal(r.complete,false);
});
test('an empty-cart hit ends the run; a knocked gift can be caught with a held double hop or lost',()=>{
 const r=createSleigh();acknowledgeSleigh(r);r.next=99;r.gifts=1;hitSleigh(r);assert.equal(r.gifts,0);assert.equal(r.complete,false);
 hop(r);for(let i=0;i<100;i++){if(i===28)hop(r);tickSleigh(r,1/120);}assert.ok(r.events.includes('catch'));assert.equal(r.gifts,1);
 hitSleigh(r);r.y=0;r.vy=0;r.hops=0;releaseHop(r);for(let i=0;i<140;i++)tickSleigh(r,1/120);assert.equal(r.gifts,0);assert.ok(r.events.includes('lost'));hitSleigh(r);assert.ok(r.complete);
});
test('practice retries fences safely and ends only after three clears and the gift',()=>{
 const r=createSleigh({practice:true});acknowledgeSleigh(r);r.next=99;r.gifts=0;for(let i=0;i<20;i++)hitSleigh(r);assert.equal(r.complete,false);
 for(let i=0;i<3;i++){r.objects=[{kind:'fence',x:38,width:26}];tickSleigh(r,.01);}assert.equal(r.practicePassed,3);r.objects=[];r.next=0;tickSleigh(r,.01);assert.equal(r.objects.at(-1).kind,'gift');
 r.objects=[{kind:'gift',x:80,y:12,width:20}];tickSleigh(r,.01);assert.ok(r.complete);
});
test('constant and seeded random tapping fail under twenty seconds without Bronze',()=>{
 for(let seed=1;seed<=100;seed++)for(const options of [{},{held:true},{held:true,randomTap:true},{randomTap:true}]){const r=simulate({seed,...options});assert.ok(r.complete,JSON.stringify({seed,options}));assert.ok(r.elapsed<20,`${seed} ${r.elapsed}`);assert.ok(r.delivered<C.sleigh.medalsAt[0]);}
});
test('fixed rhythms cannot survive or reach Bronze, across spacing seeds',()=>{
 for(const interval of [.12,.2,.3,.4,.5,.6,.7,.8,1,1.2,1.5,2,3])for(let seed=1;seed<=30;seed++){const r=simulate({seed,interval});assert.ok(r.complete);assert.ok(r.delivered<4);}
});
test('ceiling has sub-reaction warning and physically incompatible fence/arch transitions',()=>{
 const r=createSleigh({stage:8});r.distance=T.ceilingDistance;r.elapsed=600;const d=sleighDials(r);assert.equal(d.warning,T.ceilingWarning);assert.ok(d.warning<.1);
 // Even an oracle cannot fall from fence clearance to arch clearance in .09 s.
 assert.ok(Math.sqrt(2*(32-8)/T.gravity)>T.ceilingSpacing);
 acknowledgeSleigh(r);for(let i=0;i<1200&&!r.complete;i++){if(i%8===0)hop(r);releaseHop(r);tickSleigh(r,1/120);}assert.ok(r.complete);assert.ok(r.elapsed<610);
});
test('one finished-run report handles records, ties, medals, layer eligibility and old saves',()=>{
 const s=freshSave(),r=createSleigh();assert.equal(recordSleigh(s,r).celebration,0);assert.equal(s.sleighPlayed,true);
 for(const [n,medal] of [[3,-1],[4,0],[10,1],[20,2]]){r.delivered=n;const result=recordSleigh(s,r);assert.equal(result.medal,medal);assert.equal(result.wonLayer,n>=4);assert.ok(result.best);assert.equal(result.celebration,n>=4?2:1);assert.equal(recordSleigh(s,r).best,false);}
 assert.equal(normalizeSave({version:2}).sleighBest,0);assert.equal(normalizeSave({...s,sleighBest:NaN}).sleighBest,0);assert.equal(normalizeSave(s).sleighBest,20);
});
function deliberate(seed,limit=700){
 const r=createSleigh({random:rng(seed)});let airAt=0,bronzeAt=0;
 for(let t=0;t<limit&&!r.complete;t+=1/120){
  if(r.card)acknowledgeSleigh(r);
  const d=sleighDials(r),o=r.objects.filter(o=>!o.done&&o.x+o.width/2>68&&o.kind!=='catch').sort((a,b)=>a.x-a.width/2-b.x+b.width/2)[0];
  if(o){const until=(o.x-o.width/2-92)/d.speed;
   if(['fence','moving','gap'].includes(o.kind)&&until<.22&&r.hops===0){hop(r);airAt=t;}
   if(o.kind==='gap'&&r.hops===1&&t-airAt>.35&&o.x+o.width/2>68)hop(r);
   if(o.kind==='door'&&until<.4&&until>-.15&&r.hops===0){hop(r);releaseHop(r);airAt=t;}
   if(o.kind==='gift'&&o.y>30&&until<.2&&r.hops===0){hop(r);releaseHop(r);airAt=t;}
  }
  tickSleigh(r,1/120);r.events=[];if(!bronzeAt&&r.delivered>=4)bronzeAt=r.elapsed;
 }
 return {r,bronzeAt};
}
test('deliberate obstacle-reading play reaches Bronze near 1.5 minutes and Gold before the finite ceiling',()=>{
 let goldRuns=0;for(let seed=1;seed<=5;seed++){const {r,bronzeAt}=deliberate(seed);assert.ok(bronzeAt>=85&&bronzeAt<=125,`${seed}: Bronze ${bronzeAt}`);assert.ok(r.elapsed>180);if(r.delivered>=20)goldRuns++;assert.ok(r.complete);assert.ok(r.distance>=T.ceilingDistance);assert.ok(r.elapsed<700);}
 assert.ok(goldRuns>=1,'Gold is reachable before the ceiling');
});
test('first road elements follow the introduction order, with a teaching door before garlands',()=>{
 const r=createSleigh({random:rng(7)}),seen=[];for(let i=0;i<120*30;i++){if(r.card)acknowledgeSleigh(r);tickSleigh(r,1/120);for(const o of r.objects)if(!seen.includes(o.kind))seen.push(o.kind);if(r.complete)break;}
 assert.ok(seen.includes('door'));assert.ok(seen.indexOf('door')<seen.indexOf('arch'));
});
