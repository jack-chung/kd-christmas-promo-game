import {C} from './content.js';
const S=C.sleigh,T=S.tuning;
export const sleighHazards=['fence','arch','gap','moving','snowman'];
export const stackHeight=gifts=>Math.max(T.pipHeight,T.cartHeight+Math.ceil(gifts/2)*T.giftRow);
export function sleighDials(r){
 const base=S.stages[r.stage-1],extra=r.stage===8?Math.max(0,r.elapsed-r.stageAt):0,ceiling=r.distance>=T.ceilingDistance;
 const warning=ceiling?T.ceilingWarning:Math.max(.12,base.warning-extra*T.warningFall);
 return {...base,speed:Math.min(base.speed+extra*.45,228/warning-T.movingSpeed),warning,ceiling};
}
export function createSleigh({stage=1,practice=false,random=Math.random}={}){
 stage=Math.max(1,Math.min(8,Math.floor(stage)||1));
 return {stage,practice,random,elapsed:0,stageAt:0,progress:0,distance:0,gifts:T.startingGifts,delivered:0,y:0,vy:0,hops:0,held:false,hold:0,card:true,complete:false,objects:[],next:1,door:stage>=4?T.doorEvery:0,serial:0,practicePassed:0,seen:{},hits:{},relief:0,lastKinds:[],events:[],landed:false,groundedFor:0};
}
export function acknowledgeSleigh(r){r.card=false;}
export function hop(r){
 if(r.card||r.complete)return false;
 r.groundedFor=0;r.held=true;if(r.hops>=2)return false;
 r.vy=r.hops?T.doubleHop:T.hop;r.hops++;r.hold=0;r.events.push('hop');return true;
}
export function releaseHop(r){r.held=false;}
export function hitSleigh(r,kind='fence',contact=null){
 r.lastHit=kind;r.events.push('hit');r.progress=0;
 // Remove approaching hazards as well as postponing spawns: the whole recovery
 // window stays clear. The current overhead swag stays safe while grounded.
 r.objects=r.objects.filter(o=>o===contact||!sleighHazards.includes(o.kind)&&o.kind!=='catch');
 r.relief=T.catchTime+T.catchRecovery;r.next=Math.max(r.next,r.relief);
 if(r.practice)return;
 if(!r.gifts){r.complete=true;r.events.push('crash');return;}
 r.hits[kind]=(r.hits[kind]||0)+1;r.gifts--;
 const groundCatch=kind==='arch';
 r.objects.push({kind:'catch',x:115,y:groundCatch?14:r.y+T.catchHeight,launchY:groundCatch?14:r.y+T.catchHeight,width:24,ttl:T.catchTime,groundCatch});
}
export function recordSleigh(save,r){
 const previous=save.sleighBest||0,medal=S.medalsAt.reduce((m,n,i)=>r.delivered>=n?i:m,-1),cause=Object.entries(r.hits).sort((a,b)=>b[1]-a[1])[0];
 const best=r.delivered>previous;save.sleighBest=Math.max(previous,r.delivered);save.sleighPlayed=true;
 return {delivered:r.delivered,distance:Math.floor(r.distance/10),medal,wonLayer:medal>=0,best,personalBest:save.sleighBest,celebration:medal>=0?2:best?1:0,cause:cause?{kind:cause[0],count:cause[1]}:null};
}
const lessonRest=r=>r.stage<=2?T.lessonGap[0]+r.random()*(T.lessonGap[1]-T.lessonGap[0]):T.mixedLessonGap+r.random();
function lessonKind(r){return r.practice?S.practiceSteps[r.practicePassed]:S.stages[r.stage-1].kind;}
function guided(r,kind){return (r.seen[kind]||0)<T.guidedCount;}
function spawn(r,kind){
 const d=sleighDials(r),teach=!d.ceiling&&guided(r,kind);let speed=(teach?Math.min(d.speed,kind==='arch'?T.guidedGarlandSpeed:T.guidedSpeed):d.speed)+(kind==='moving'?T.movingSpeed:0);
 if(kind==='door')speed=Math.min(speed,T.doorSpeed);
 const warning=kind==='door'?Math.max(.95,teach?T.guidedWarning:d.warning):teach?T.guidedWarning:d.warning,width=kind==='gap'?T.gapWidth:kind==='door'?T.doorWidth:kind==='arch'?T.garlandWidth:kind==='snowman'?40:kind==='moving'?48:26;
 r.objects.push({kind,x:Math.min(320+width/2,105+speed*warning+width/2),y:kind==='gift'?(!r.practice&&r.serial%2?48:12):0,width,speed,hint:teach});
 r.seen[kind]=(r.seen[kind]||0)+1;r.lastKinds.push(kind);r.lastKinds=r.lastKinds.slice(-3);
}
function successful(r,o){
 const lesson=lessonKind(r),matches=o.kind===lesson||(lesson==='moving'&&o.kind==='snowman')||lesson==='mixed';
 if(!matches)return;
 if(r.practice){r.practicePassed++;r.objects=[];r.next=1;r.card=true;if(r.practicePassed===S.practiceSteps.length){r.complete=true;r.card=false;}return;}
 r.progress++;
 if(r.stage<8&&r.progress>=S.stages[r.stage-1].clears){r.stage++;r.stageAt=r.elapsed;r.progress=0;r.objects=[];r.next=1;r.y=0;r.vy=0;r.hops=0;releaseHop(r);r.card=true;}
}
function choose(r,d){
 const lesson=lessonKind(r);
 if(r.practice)return lesson;
 if(d.ceiling)return r.serial%2?'snowman':'arch';
 if(r.stage<=3){if(sleighHazards.includes(lesson)&&r.lastKinds.length===3&&r.lastKinds.every(k=>k===lesson))return 'rest';return lesson;}
 // First two encounters of each new shape are isolated. Then interleave
 // familiar shapes and gifts; never a fourth consecutive hazard of one type.
 if(r.stage===6&&guided(r,'snowman'))return r.serial%2?'moving':'snowman';
 if(S.objects[lesson]&&guided(r,lesson))return lesson;
 if(r.stage===4)return r.lastKinds.every(k=>k==='arch')&&r.lastKinds.length===3?'fence':'arch';
 const pool=['fence','gift','gift',...(r.stage>=4?['arch', 'gift']:[]),...(r.stage>=5?['gap']:[]),...(r.stage>=6?['moving','snowman']:[])];
 const eligible=pool.filter(k=>!(r.lastKinds.length===3&&r.lastKinds.every(last=>last===k)&&sleighHazards.includes(k)));
 return eligible[Math.floor(r.random()*eligible.length)];
}
function step(r,dt){
 r.elapsed+=dt;const d=sleighDials(r);r.distance+=d.speed*dt;r.landed=false;r.relief=Math.max(0,r.relief-dt);
 if(r.y>0||r.vy>0){r.hold+=dt;r.vy-=T.gravity*dt;if(r.held&&r.hold<T.holdTime)r.vy+=T.holdLift*dt;r.y+=r.vy*dt;if(r.y<=0){r.y=0;r.vy=0;r.hops=0;r.landed=true;r.events.push('land');}}
 r.groundedFor=r.y===0&&!r.held?r.groundedFor+dt:0;
 r.next-=dt;
 const isolated=!d.ceiling&&(r.practice||r.stage<=3||r.objects.some(o=>o.hint||o.kind==='door'));
 if(r.next<=0&&!r.relief&&(!isolated||r.objects.length===0)){
  r.serial++;
  const kind=r.giftAfterDoor?'gift':!r.practice&&!d.ceiling&&r.stage>=4&&r.elapsed>=r.door?'door':choose(r,d);
  if(kind==='rest'){r.lastKinds=['rest'];r.events.push('road-break');r.next=lessonRest(r);}
  else if((kind==='door'||!d.ceiling&&guided(r,kind))&&r.objects.length){r.next=.1;}
  else {spawn(r,kind);r.giftAfterDoor=false;if(kind==='door')r.door=r.elapsed+T.doorEvery;r.next=d.ceiling?T.ceilingSpacing:isolated?lessonRest(r):d.spacing[0]+r.random()*(d.spacing[1]-d.spacing[0]);}
 }
 for(const o of [...r.objects]){
  if(!r.objects.includes(o))continue;
  o.x-=(o.kind==='catch'?T.catchDrift:o.speed||d.speed)*dt;
  if(o.kind==='catch'){o.ttl-=dt;o.y=o.launchY+(o.groundCatch?0:T.catchBounce*Math.sin(Math.max(0,T.catchTime-o.ttl)*Math.PI/T.catchTime));if(o.ttl<=0){o.done=true;r.events.push('lost');}}
  const overlap=o.x-o.width/2<105&&o.x+o.width/2>55;
  if(!o.done&&overlap){
   const groundReady=!o.groundCatch||(r.groundedFor>=T.groundCatchSettle&&Math.abs(o.x-80)<6);
   if(groundReady&&(o.kind==='catch'||o.kind==='gift')&&Math.abs(r.y+14-o.y)<(o.kind==='catch'?T.catchReach:T.pickupReach)){r.gifts=Math.min(T.maxGifts,r.gifts+1);o.done=true;r.events.push(o.kind==='catch'?'catch':'pickup');if(o.kind==='gift')successful(r,o);}
   if(o.kind==='door'&&r.landed&&r.gifts>0){r.gifts--;r.delivered++;r.deliveryX=o.x;o.done=true;r.events.push('deliver');if(r.stage>=5)r.giftAfterDoor=true;successful(r,o);}
   const collision=(['fence','moving'].includes(o.kind)&&r.y<T.fenceClearance)||(o.kind==='snowman'&&r.y<100)||(o.kind==='arch'&&r.y+stackHeight(r.gifts)>T.archUnderside)||(o.kind==='gap'&&r.y<8);
   if(collision&&!r.relief){o.hit=true;o.done=o.kind!=='arch';hitSleigh(r,o.kind,o.kind==='arch'?o:null);}
  }
  if(o.x+o.width/2<50&&!o.passed){o.passed=true;if(!o.done&&!o.hit&&sleighHazards.includes(o.kind))successful(r,o);}
 }
 const remaining=r.objects.filter(o=>!o.done&&o.x+o.width/2>0);
 if(isolated&&r.objects.length&&!remaining.length&&!r.card)r.next=Math.max(r.next,lessonRest(r));
 r.objects=remaining;
}
export function tickSleigh(r,seconds){
 if(r.card||r.complete)return;
 for(let left=Math.min(seconds,.25);left>1e-7&&!r.complete&&!r.card;){const dt=Math.min(left,1/120);step(r,dt);left-=dt;}
}
