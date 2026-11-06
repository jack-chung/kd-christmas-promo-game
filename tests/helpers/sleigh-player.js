import {C} from '../../docs/game/content.js';
import {createSleigh,acknowledgeSleigh,hop,releaseHop,tickSleigh,sleighDials} from '../../docs/game/sleigh.js';
export const rng=seed=>()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
export function deliberate(seed=1,limit=620,{human=false}={}){
 const random=rng(seed),r=createSleigh({random});let airAt=0,empty=0,longest=0,doors=0,medals={},seen=new Set();
 for(let t=0;t<limit&&!r.complete;t+=1/120){
  if(r.card){r.timeline.push({type:'card',stage:r.stage,at:r.elapsed});acknowledgeSleigh(r);}
  const d=sleighDials(r),o=r.objects.filter(o=>!o.done&&o.x+o.width/2>64&&o.kind!=='catch').sort((a,b)=>(a.x-a.width/2)-(b.x-b.width/2))[0];
  if(o){if(!seen.has(o)&&o.kind!=='door'){seen.add(o);o.observedAt=t;o.reactionJitter=human?(random()-.5)*.20:0;}const speed=o.speed||d.speed,until=(o.x-o.width/2-96)/speed;
   if(o.kind==='door'){
    if(!seen.has(o)){seen.add(o);doors++;o.jitter=(random()-.5)*.2;}
    if(r.hops===0&&!o.tapped&&(o.x-80)/speed<=2*C.sleigh.tuning.hop/C.sleigh.tuning.gravity-1/120+o.jitter){o.tapped=true;hop(r);releaseHop(r);}
   }else if(['fence','moving','gap','snowman'].includes(o.kind)&&(!human||t-o.observedAt>=.25+(o.reactionJitter||0))&&r.hops===0&&until<(o.kind==='snowman'?.46:o.kind==='gap'?.22:.27)+(o.reactionJitter||0)){hop(r);airAt=t;if(o.kind==='fence'||o.kind==='moving')releaseHop(r);}
   if(o.kind==='snowman'&&r.hops===1&&t-airAt>.28)hop(r);
   if(o.kind==='gift'&&o.y>30&&r.hops===0&&until<.2){hop(r);airAt=t;releaseHop(r);}
  }
  tickSleigh(r,1/120);if(!r.objects.length){empty+=1/120;longest=Math.max(longest,empty);}else empty=0;
  for(const n of [4,10,20])if(r.delivered>=n&&!medals[n])medals[n]=r.elapsed;r.events=[];
 }
 return {elapsed:r.elapsed,delivered:r.delivered,complete:r.complete,distance:r.distance,doors,rate:r.delivered/doors,medals,longest,timeline:r.timeline,hits:r.hits,stage:r.stage};
}
