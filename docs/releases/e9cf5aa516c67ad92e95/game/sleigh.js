import {C} from './content.js';
const S=C.sleigh,T=S.tuning;
export function sleighDials(r){
 const base=S.stages[Math.min(r.stage,8)-1],extra=Math.max(0,r.elapsed-S.stages.at(-1).at);
 const ceiling=r.distance>=T.ceilingDistance;
 const warning=ceiling?T.ceilingWarning:Math.max(.12,base.warning-extra*.002);
 return {...base,speed:Math.min(base.speed+extra*.45,228/warning-12),warning,ceiling};
}
export function createSleigh({stage=1,practice=false,random=Math.random}={}){
 stage=Math.max(1,Math.min(8,Math.floor(stage)||1));
 return {stage,practice,random,elapsed:practice?0:S.stages[stage-1].at,distance:0,gifts:T.startingGifts,delivered:0,y:0,vy:0,hops:0,held:false,hold:0,card:true,complete:false,objects:[],next:1,door:T.doorFirst,serial:0,practicePassed:0,events:[],landed:false};
}
export function acknowledgeSleigh(r){r.card=false;}
export function hop(r){
 if(r.card||r.complete)return false;
 r.held=true;
 if(r.hops>=2)return false;
 r.vy=r.hops?T.doubleHop:T.hop;r.hops++;r.hold=0;r.events.push('hop');return true;
}
export function releaseHop(r){r.held=false;}
export function hitSleigh(r){
 if(r.practice){r.events.push('hit');return;}
 if(r.gifts===0){r.complete=true;r.events.push('crash');return;}
 r.gifts--;r.events.push('hit');
 r.objects.push({kind:'catch',x:115,y:r.y+142,launchY:r.y+142,width:24,ttl:T.catchTime});
}
export function recordSleigh(save,r){
 const previous=save.sleighBest||0,medal=S.medalsAt.reduce((m,n,i)=>r.delivered>=n?i:m,-1);
 const best=r.delivered>previous;save.sleighBest=Math.max(previous,r.delivered);save.sleighPlayed=true;
 return {delivered:r.delivered,distance:Math.floor(r.distance/10),medal,wonLayer:medal>=0,best,personalBest:save.sleighBest,celebration:medal>=0?2:best?1:0};
}
function spawn(r,kind,override={}){
 const d=sleighDials(r),moving=kind==='moving';
 r.objects.push({kind,x:80+(d.speed+(moving?12:0))*d.warning,y:kind==='gift'?(r.serial%2?48:12):0,width:kind==='gap'?100:kind==='door'?T.doorWidth:kind==='arch'?42:26,...override});
}
function step(r,dt){
 r.elapsed+=dt;const d=sleighDials(r);r.distance+=d.speed*dt;r.landed=false;
 if(r.y>0||r.vy>0){r.hold+=dt;r.vy-=T.gravity*dt;if(r.held&&r.hold<T.holdTime)r.vy+=T.holdLift*dt;r.y+=r.vy*dt;if(r.y<=0){r.y=0;r.vy=0;r.hops=0;r.landed=true;r.events.push('land');}}
 r.next-=dt;
 if(r.next<=0){
  r.serial++;
  let kind='fence';
  if(r.practice){kind=r.practicePassed<3?'fence':'gift';if(r.objects.some(o=>o.kind!=='catch'))kind=null;}
  else if(d.ceiling)kind=r.serial%2?'fence':'arch';
  else if(r.stage===4)kind='arch';
  else {const pool=['fence',...(r.stage>=2?['gift','gift']:[]),...(r.stage>=4?['arch','arch']:[]),...(r.stage>=5?['gap']:[]),...(r.stage>=6?['moving']:[])];kind=pool[Math.floor(r.random()*pool.length)];}
  if(kind)spawn(r,kind);
  r.next=d.ceiling?T.ceilingSpacing:d.spacing[0]+r.random()*(d.spacing[1]-d.spacing[0]);
 }
 if(!r.practice&&r.stage>=3&&r.elapsed>=r.door){
  // A clear approach lets a deliberate hop land on the mat.
  r.objects=r.objects.filter(o=>o.kind==='catch'||o.x<50);spawn(r,'door');spawn(r,'gift',{x:80+d.speed*d.warning+T.doorWidth+50,y:12});r.door=r.elapsed+T.doorEvery;r.next=d.warning+1.4;
 }
 for(const o of [...r.objects]){
  o.x-=(o.kind==='catch'?32:d.speed+(o.kind==='moving'?12:0))*dt;
  if(o.kind==='catch'){o.ttl-=dt;o.y=o.launchY+10*Math.sin(Math.max(0,T.catchTime-o.ttl)*Math.PI/T.catchTime);if(o.ttl<=0){o.done=true;r.events.push('lost');}}
  const overlap=o.x-o.width/2<92&&o.x+o.width/2>68;
  if(!o.done&&overlap){
   if((o.kind==='catch'||o.kind==='gift')&&Math.abs(r.y+14-o.y)<(o.kind==='catch'?12:27)){r.gifts=Math.min(T.maxGifts,r.gifts+1);o.done=true;r.events.push(o.kind==='catch'?'catch':'pickup');if(r.practice&&o.kind==='gift'){r.complete=true;}}
   if(o.kind==='door'&&r.landed&&r.gifts>0){r.gifts--;r.delivered++;o.done=true;r.events.push('deliver');}
   const collision=(['fence','moving'].includes(o.kind)&&r.y<32)||(o.kind==='arch'&&r.y>8)||(o.kind==='gap'&&r.y<8);
   if(collision){o.done=true;hitSleigh(r);}
  }
  if(o.x+o.width/2<55&&!o.passed){o.passed=true;if(r.practice&&o.kind==='fence'){if(!o.done){r.practicePassed++;}else r.events.push('retry');}}
 }
 r.objects=r.objects.filter(o=>!o.done&&o.x+o.width/2>0);
 if(!r.practice){const next=S.stages[r.stage];if(next&&r.elapsed>=next.at){r.stage++;r.card=true;}}
}
// Fixed substeps keep collisions and holds identical on slow and fast frames.
export function tickSleigh(r,seconds){
 if(r.card||r.complete)return;
 for(let left=Math.min(seconds,.25);left>1e-7&&!r.complete&&!r.card;){const dt=Math.min(left,1/120);step(r,dt);left-=dt;}
}
