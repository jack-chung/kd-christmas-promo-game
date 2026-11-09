import {C} from '../../docs/game/content.js';
import {createSorting,acknowledge,tickSorting,sortGift,targets,destination} from '../../docs/game/sorting.js';
export const rng=seed=>()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
// Active milliseconds only; rule-card reading time deliberately excluded.
export function simulateSorting(seed,{mash=false,reaction=1400,jitter=300,accuracy=1}={}){
 const random=rng(seed),r=createSorting(undefined,false,random);let next=0;r.milestones={};
 for(let ms=0;ms<900000&&!r.complete;ms+=20){
  if(r.card)acknowledge(r);tickSorting(r,20);
  if(r.complete)break;
  if(r.elapsed>=next){const ids=targets(r),correct=destination(r,r.queue[0]);sortGift(r,mash?ids[Math.floor(random()*ids.length)]:random()<accuracy?correct:ids.find(id=>id!==correct));next=r.elapsed+(mash?100:reaction+(random()-.5)*2*jitter);}
  for(const [key,yes] of Object.entries({bronze:r.score>=C.sorting.medals[0],silver:r.score>=C.sorting.medals[1],gold:r.score>=C.sorting.medals[2],fragile:r.stage>=4}))if(yes&&!r.milestones[key])r.milestones[key]=r.elapsed;
 }
 return r;
}
