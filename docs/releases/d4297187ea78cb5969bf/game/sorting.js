import {C} from './content.js';
const S=C.sorting,T=S.tuning;
export function stageConfig(run){const base=S.stages[Math.min(run.stage,S.stages.length)-1];return {...base,arrival:Math.max(T.minArrival,base.arrival-Math.max(0,run.stage-S.stages.length)*T.speedStep),streets:base.fourAfter&&run.progress>=base.fourAfter?4:base.streets};}
export function targets(run){const c=stageConfig(run);return [...S.streets.slice(0,c.streets).map(s=>s.id),...(c.fragile?['fragile']:[]),...(c.royal?['royal']:[])];}
export function destination(run,gift){const c=stageConfig(run);return c.fragile&&gift.fragile?'fragile':c.royal&&gift.pattern===run.decree.pattern&&gift.bow===run.decree.bow?'royal':gift.street;}
export const comboMultiplier=combo=>Math.min(T.maxMultiplier,1+Math.floor(combo/T.comboEvery));
export const quickRemaining=r=>Math.max(0,1-(r.elapsed-r.queue[0]?.spot)/T.quickWindow);
export function createSorting(difficulty='easy',stage,practice=false,random=Math.random){const d=S.difficulties.find(d=>d.id===difficulty)||S.difficulties[0];const r={difficulty:d.id,climb:d.climb,stage:practice?1:stage||d.start,practice,progress:0,sorted:0,score:0,points:{base:0,quick:0,rush:0,combo:0},combo:0,bestCombo:0,oops:0,elapsed:0,arrival:0,switchAt:0,ease:0,slow:T.slowGifts,queue:[],card:true,complete:false,decree:{...S.decrees[0]},order:[],random};r.order=targets(r);feed(r);return r;}
export function feed(r){const c=stageConfig(r),pick=n=>Math.floor(r.random()*n);r.queue.push({street:S.streets[pick(c.streets)].id,pattern:S.patterns[pick(S.patterns.length)].id,bow:r.random()<.5,fragile:c.fragile&&r.random()<T.featureChance,rush:c.rush&&r.random()<T.featureChance,born:r.elapsed,spot:r.queue.length?null:r.elapsed,silly:pick(12)});}
export function acknowledge(r){r.card=false;r.arrival=r.elapsed;r.switchAt=r.elapsed;r.slow=T.slowGifts;}
function oops(r){r.oops++;r.combo=0;r.ease=Math.min(T.maxEase,r.ease+T.mistakeEase);if(r.oops>=5)r.complete=true;}
export function sortGift(r,target){if(r.card||r.complete||!r.queue.length)return null;const g=r.queue[0],correct=target===destination(r,g),points={base:0,quick:0,rush:0,combo:0};if(!correct&&r.practice)return {correct:false,gift:g,points,total:0};r.queue.shift();if(correct){r.sorted++;r.progress++;r.combo++;r.bestCombo=Math.max(r.combo,r.bestCombo);points.base=T.basePoints;points.combo=T.basePoints*(comboMultiplier(r.combo)-1);points.quick=Math.max(0,Math.round(T.speedPoints*(1-(r.elapsed-g.spot)/T.quickWindow)));points.rush=g.rush&&r.elapsed-g.spot<=T.rushWindow?T.rushPoints:0;for(const key of Object.keys(points)){r.points[key]+=points[key];r.score+=points[key];}r.ease=Math.max(0,r.ease-.015);r.slow=Math.max(0,r.slow-1);}else oops(r);
 if(r.practice&&r.sorted>=3)r.complete=true;
 if(!r.complete&&!r.practice){const c=stageConfig(r);if(r.progress>=Math.ceil(c.gifts*r.climb)){r.stage++;r.progress=0;r.card=true;r.order=targets(r);r.queue=[];}else if(c.fourAfter&&r.progress===c.fourAfter){r.card=true;r.order=targets(r);r.queue=[];}}
 if(!r.queue.length&&!r.complete)feed(r);if(r.queue[0])r.queue[0].spot=r.elapsed;return {correct,gift:g,points,total:Object.values(points).reduce((a,b)=>a+b,0)};}
export function tickSorting(r,delta){if(r.card||r.complete||r.practice)return;r.elapsed+=delta;const c=stageConfig(r),interval=(r.slow?Math.max(c.arrival,T.slowArrival):c.arrival)*(1+r.ease);
 if(r.elapsed-r.arrival>=interval){r.arrival+=interval;if(r.queue.length>=T.capacity){r.queue.pop();oops(r);}if(!r.complete)feed(r);}
 if(c.switch&&r.elapsed-r.switchAt>=c.switch){const i=S.decrees.findIndex(d=>d.pattern===r.decree.pattern&&d.bow===r.decree.bow);r.decree={...S.decrees[(i+1)%S.decrees.length]};r.card=true;if(c.shuffle)r.order=[...r.order.slice(1),r.order[0]];}
}
export function sortingMedals(difficulty,score){return S.papers.filter((p,i)=>score>=S.medals[difficulty][i]).map(p=>p.id);}
export function sortingTop(bests){return S.difficulties.map(d=>({difficulty:d.id,score:bests[d.id]})).reduce((top,r)=>r.score>top.score?r:top);}
export function recordSorting(save,r){
 const best=r.score>save.sortingBests[r.difficulty],medals=sortingMedals(r.difficulty,r.score);
 save.sortingBests[r.difficulty]=Math.max(save.sortingBests[r.difficulty],r.score);
 save.sortingBest=sortingTop(save.sortingBests).score;
 return {...r,replay:save.layers.includes(2),best,personalBest:save.sortingBests[r.difficulty],medals,celebration:medals.length?2:best?1:0};
}
