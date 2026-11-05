import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {freshSave,normalizeSave} from '../docs/game/engine.js';
import {createSleigh,acknowledgeSleigh,hop,releaseHop,tickSleigh,hitSleigh,recordSleigh,sleighDials,sleighHazards,stackHeight} from '../docs/game/sleigh.js';
const T=C.sleigh.tuning;
const rng=seed=>()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
function simulate({seed=1,interval=.08,held=false,randomTap=false,limit=1800,stage=1}={}){const random=rng(seed),r=createSleigh({random,stage});let next=0;for(let t=0;t<limit&&!r.complete;t+=1/120){if(r.card)acknowledgeSleigh(r);if(r.stage>=4&&r.garlandAt===undefined)r.garlandAt=r.elapsed;if(t>=next){hop(r);next=t+(randomTap?.03+random()*.2:interval);}if(!held)releaseHop(r);tickSleigh(r,1/120);}return r;}
function success(r,kind){acknowledgeSleigh(r);r.next=99;r.door=Infinity;if(kind==='gift')r.objects=[{kind,x:80,y:12,width:20}];else if(kind==='door'){r.objects=[{kind,x:80,width:78}];r.y=1;r.vy=-100;}else r.objects=[{kind,x:38,width:26}];tickSleigh(r,.02);if(kind==='door'){tickSleigh(r,.25);tickSleigh(r,.02);}}
test('content counts drive stages; cards freeze time; elapsed time cannot promote a lesson',()=>{
 const paused=createSleigh();tickSleigh(paused,1);assert.equal(paused.elapsed,0);
 for(const c of C.sleigh.stages){const r=createSleigh({stage:c.stage});acknowledgeSleigh(r);r.elapsed=999;r.next=Infinity;r.door=Infinity;tickSleigh(r,.02);assert.equal(r.stage,c.stage);assert.equal(r.card,false);
  for(let i=0;i<c.clears;i++){success(r,c.kind==='mixed'?'fence':c.kind);assert.equal(r.stage,i===c.clears-1?c.stage+1:c.stage);}
  if(c.stage<8)assert.equal(r.card,true);
  const d=sleighDials(createSleigh({stage:c.stage}));assert.ok((d.speed+12)*d.warning<=228.001);
 }
});
test('tap, hold, double hop, release and landing obey physics',()=>{
 const run=hold=>{const r=createSleigh();acknowledgeSleigh(r);hop(r);if(!hold)releaseHop(r);let max=0;for(let i=0;i<180;i++){tickSleigh(r,1/120);max=Math.max(max,r.y);}return max;};assert.ok(run(true)>run(false)+30);
 const r=createSleigh();acknowledgeSleigh(r);assert.ok(hop(r));tickSleigh(r,.1);assert.ok(hop(r));assert.equal(hop(r),false);for(let i=0;i<240;i++)tickSleigh(r,1/120);assert.equal(r.y,0);assert.equal(r.hops,0);
});
test('pickup caps stack; delivery requires landing, spends top gift, skipping costs nothing',()=>{
 const r=createSleigh({stage:3});acknowledgeSleigh(r);r.next=99;r.door=99;r.gifts=7;r.objects=[{kind:'gift',x:80,y:12,width:20}];tickSleigh(r,.01);assert.equal(r.gifts,8);
 r.objects=[{kind:'gift',x:80,y:12,width:20}];tickSleigh(r,.01);assert.equal(r.gifts,8);
 r.objects=[{kind:'door',x:80,width:78}];tickSleigh(r,.01);assert.equal(r.delivered,0);r.y=1;r.vy=-100;tickSleigh(r,.02);assert.equal(r.delivered,1);assert.equal(r.gifts,7);
 r.objects=[{kind:'door',x:80,width:78}];r.gifts=0;r.y=1;r.vy=-100;tickSleigh(r,.02);assert.equal(r.delivered,1);tickSleigh(r,.25);tickSleigh(r,.02);assert.equal(r.delivered,1);assert.equal(r.complete,false);
});
test('empty-cart hit ends; a knocked gift can be caught or lost',()=>{
 const r=createSleigh();acknowledgeSleigh(r);r.next=99;r.gifts=1;hitSleigh(r);assert.equal(r.gifts,0);assert.equal(r.complete,false);
 hop(r);for(let i=0;i<100;i++){if(i===28)hop(r);tickSleigh(r,1/120);}assert.ok(r.events.includes('catch'));assert.equal(r.gifts,1);
 hitSleigh(r);r.y=0;r.vy=0;r.hops=0;releaseHop(r);for(let i=0;i<140;i++)tickSleigh(r,1/120);assert.equal(r.gifts,0);assert.ok(r.events.includes('lost'));hitSleigh(r);assert.ok(r.complete);
});
test('safe practice teaches fence, garland, gift and landing, retrying each until success',()=>{
 const r=createSleigh({practice:true});acknowledgeSleigh(r);for(let i=0;i<20;i++)hitSleigh(r);assert.equal(r.complete,false);assert.equal(r.gifts,6);
 for(const [i,kind] of C.sleigh.practiceSteps.entries()){success(r,kind);assert.equal(r.practicePassed,i+1);assert.equal(r.complete,i===3);if(i<3)assert.equal(r.card,true);}
});
test('constant and seeded random tapping never earn Bronze and fail within twenty seconds after garland introduction',()=>{
 for(let seed=1;seed<=100;seed++)for(const options of [{},{held:true},{held:true,randomTap:true},{randomTap:true}]){const r=simulate({seed,...options});assert.ok(r.complete,JSON.stringify({seed,options}));if(r.garlandAt!==undefined)assert.ok(r.elapsed-r.garlandAt<20,`${seed} post-garland ${r.elapsed-r.garlandAt}`);assert.ok(r.delivered<C.sleigh.medalsAt[0]);}
});
test('mashing from the garland introduction ends in about twenty seconds, even with a full starting stack',()=>{
 for(let seed=1;seed<=100;seed++)for(const options of [{},{held:true},{held:true,randomTap:true},{randomTap:true}]){const r=simulate({seed,stage:4,...options});assert.ok(r.complete);assert.ok(r.elapsed<21,`${seed}: ${JSON.stringify(options)} ${r.elapsed}`);assert.ok(r.delivered<4);}
});
test('mashing and fixed rhythms never reach Bronze across spacing seeds',()=>{
 for(const interval of [.08,.12,.2,.3,.4,.5,.6,.7,.8,1,1.2,1.5,2,3])for(let seed=1;seed<=30;seed++){const r=simulate({seed,interval});assert.ok(r.complete,`${interval}: ${seed}`);assert.ok(r.delivered<4,`${interval}: ${seed} delivered ${r.delivered}`);}
 for(let seed=1;seed<=100;seed++)for(const options of [{held:true},{held:true,randomTap:true},{randomTap:true}])assert.ok(simulate({seed,...options}).delivered<4,`${seed} ${JSON.stringify(options)}`);
});
test('ceiling has sub-reaction warning and overlapping incompatible snowman/garland geometry',()=>{
 const r=createSleigh({stage:8});r.distance=T.ceilingDistance;r.elapsed=600;const d=sleighDials(r);assert.equal(d.warning,T.ceilingWarning);assert.ok(d.warning<.1);
 assert.ok(100>T.archUnderside-stackHeight(0));assert.ok((228/T.ceilingWarning-12)*T.ceilingSpacing<40/2+64/2+24);
 acknowledgeSleigh(r);for(let i=0;i<120*30&&!r.complete;i++){if(i%8===0)hop(r);releaseHop(r);tickSleigh(r,1/120);}assert.ok(r.complete);assert.ok(r.elapsed<630);
});
test('finished-run report handles records, ties, medals, cause of losses and old saves',()=>{
 const s=freshSave(),r=createSleigh();assert.equal(recordSleigh(s,r).celebration,0);assert.equal(s.sleighPlayed,true);
 r.hits={arch:3,fence:1};assert.deepEqual(recordSleigh(s,r).cause,{kind:'arch',count:3});
 for(const [n,medal] of [[3,-1],[4,0],[10,1],[20,2]]){r.delivered=n;const result=recordSleigh(s,r);assert.equal(result.medal,medal);assert.equal(result.wonLayer,n>=4);assert.ok(result.best);assert.equal(result.celebration,n>=4?2:1);assert.equal(recordSleigh(s,r).best,false);}
 assert.equal(normalizeSave({version:2}).sleighBest,0);assert.equal(normalizeSave({...s,sleighBest:NaN}).sleighBest,0);assert.equal(normalizeSave(s).sleighBest,20);
});
function deliberate(seed,limit=1200){
 const r=createSleigh({random:rng(seed)});let airAt=0,bronzeAt=0,stage4=0;const seen=[];
 for(let t=0;t<limit&&!r.complete;t+=1/120){
  if(r.card){if(r.stage===4)stage4=r.elapsed;acknowledgeSleigh(r);}
  for(const o of r.objects)if(!seen.includes(o.kind))seen.push(o.kind);
  const d=sleighDials(r),o=r.objects.filter(o=>!o.done&&o.x+o.width/2>68&&o.kind!=='catch').sort((a,b)=>a.x-a.width/2-b.x+b.width/2)[0];
  if(o){const until=(o.x-o.width/2-92)/(o.speed||d.speed);
   if(['fence','moving','gap','snowman'].includes(o.kind)&&until<(o.kind==='snowman'?.4:o.kind==='gap'?.13:.2)&&r.hops===0){hop(r);airAt=t;}
   if(['gap','snowman'].includes(o.kind)&&r.hops===1&&t-airAt>.5&&o.x+o.width/2>68)hop(r);
   if(o.kind==='door'&&until<.65&&until>0&&r.hops===0){hop(r);releaseHop(r);airAt=t;}
   if(o.kind==='gift'&&o.y>30&&until<.2&&r.hops===0){hop(r);releaseHop(r);airAt=t;}
  }
  tickSleigh(r,1/120);r.events=[];if(!bronzeAt&&r.delivered>=4)bronzeAt=r.elapsed;
 }
 return {r,bronzeAt,stage4,seen};
}
test('deliberate play meets garlands at 60–90 seconds, Bronze near two minutes and Gold before the ceiling',()=>{
 let goldRuns=0;for(let seed=1;seed<=5;seed++){const {r,bronzeAt,stage4}=deliberate(seed);assert.ok(stage4>=60&&stage4<=90,`${stage4}`);assert.ok(bronzeAt>=90&&bronzeAt<=125,`${seed}: Bronze ${bronzeAt}`);assert.ok(r.elapsed>180);if(r.delivered>=20)goldRuns++;assert.ok(r.complete);assert.ok(r.distance>=T.ceilingDistance);assert.ok(r.elapsed<1000);}
 assert.ok(goldRuns>=1);
});
test('first road elements follow introduction order',()=>{
 const {seen}=deliberate(7);assert.deepEqual(seen.slice(0,5),['fence','gift','door','arch','gap']);assert.ok(seen.includes('moving'));assert.ok(seen.includes('snowman'));
});
test('first encounters are isolated and hinted; no stage spawns four consecutive identical hazards',()=>{
 for(let stage=1;stage<=8;stage++){
  const r=createSleigh({stage,random:rng(stage)}),seen=new Set();let last='',count=0,spawns=0;
  for(let t=0;t<200;t+=1/120){if(r.card)acknowledgeSleigh(r);r.gifts=8;r.relief=0; // Observe generators independently of the player's collisions.
   if(r.events.includes('road-break')){last='';count=0;}r.events=[];
   for(const o of r.objects)if(!seen.has(o)){seen.add(o);spawns++;if(sleighHazards.includes(o.kind)){count=o.kind===last?count+1:1;last=o.kind;assert.ok(count<=3,`${stage}: ${o.kind}`);}else{count=0;last='';}
    if(o.hint){assert.equal(r.objects.length,1);assert.ok((o.x-o.width/2-92)/(o.speed||1)>=T.guidedWarning-.02);}
   }
   // Remove objects as successful passes without triggering stage promotion.
   for(const o of r.objects){if(o.x<160)o.done=true;}tickSleigh(r,1/120);
  }
  assert.ok(spawns>3);
 }
});
test('a hit clears incoming hazards and spawns none through the complete catch window',()=>{
 for(const kind of sleighHazards){const r=createSleigh({stage:7});acknowledgeSleigh(r);r.objects=[{kind:'arch',x:150,width:64},{kind:'fence',x:220,width:26}];hitSleigh(r,kind);r.next=0;
  for(let t=0;t<T.catchTime;t+=1/120){tickSleigh(r,1/120);assert.ok(!r.objects.some(o=>sleighHazards.includes(o.kind)));}
  assert.equal(r.lastHit,kind);assert.ok(C.sleigh.objects[kind].hit.toLowerCase().includes(kind==='arch'?'garland':kind==='gap'?'pothole':kind==='moving'?'toboggan':kind));
 }
});
test('a full cart fits under the visible garland; collisions follow the pile height',()=>{
 const r=createSleigh({stage:4});acknowledgeSleigh(r);r.next=Infinity;r.door=Infinity;r.gifts=8;assert.ok(stackHeight(8)<T.archUnderside);
 r.objects=[{kind:'arch',x:80,width:64}];tickSleigh(r,.01);assert.equal(r.gifts,8);
 r.y=T.archUnderside-stackHeight(8)+1;r.objects=[{kind:'arch',x:80,width:64}];tickSleigh(r,.01);assert.equal(r.gifts,7);assert.equal(r.objects.find(o=>o.kind==='catch').groundCatch,true);
});

test('garland recovery stays safe underneath; repeated fresh hops can hit a lingering swag',()=>{
 const r=createSleigh({stage:4});acknowledgeSleigh(r);r.next=Infinity;r.door=Infinity;
 const arch={kind:'arch',x:80,width:T.garlandWidth,speed:1};r.objects=[arch];r.y=60;hitSleigh(r,'arch',arch);r.y=0;r.vy=0;r.hops=0;releaseHop(r);
 for(let t=0;t<T.catchTime+.1;t+=1/120)tickSleigh(r,1/120);
 assert.equal(r.gifts,6);assert.equal(r.hits.arch,1);assert.ok(r.events.includes('catch'));
 for(let t=0;t<T.catchRecovery;t+=1/120)tickSleigh(r,1/120);hop(r);
 for(let t=0;t<.3;t+=1/120)tickSleigh(r,1/120);assert.equal(r.hits.arch,2);
 assert.ok(stackHeight(0)>=T.pipHeight);
});

test('toboggans move relative to the road while keeping the full guided warning',()=>{
 const r=createSleigh({stage:6});acknowledgeSleigh(r);for(let t=0;t<1.02;t+=1/120)tickSleigh(r,1/120);
 const o=r.objects.find(o=>o.kind==='moving');assert.ok(o);assert.equal(o.speed,T.guidedSpeed+T.movingSpeed);const before=o.x;tickSleigh(r,.1);assert.ok(Math.abs(before-o.x-o.speed*.1)<1e-6);
});
