import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {freshSave,normalizeSave} from '../docs/game/engine.js';
import {createSorting,acknowledge,sortGift,destination,comboMultiplier,quickRemaining,recordSorting,sortingTop} from '../docs/game/sorting.js';
import {SortingFeedback} from '../docs/game/sorting-feedback.js';

test('visible score parts preserve the formula and sum to each award and final total',()=>{
 const r=createSorting('easy',5);acknowledge(r);
 for(let i=0;i<15;i++){
  const g=r.queue[0];g.rush=i%2===0;r.elapsed+=i%3*650;
  const quick=Math.max(0,Math.round(20*(1-(r.elapsed-g.spot)/2000))),rush=g.rush&&r.elapsed-g.spot<=2000?40:0;
  const before=r.score,result=sortGift(r,destination(r,g));
  assert.equal(result.total,100*Math.min(5,1+Math.floor((i+1)/5))+quick+rush);
  assert.equal(Object.values(result.points).reduce((a,b)=>a+b,0),r.score-before);
 }
 assert.equal(r.points.base,r.sorted*100);assert.ok(r.points.quick>0);assert.ok(r.points.combo>0);assert.ok(r.points.rush>0);
 assert.equal(Object.values(r.points).reduce((a,b)=>a+b,0),r.score);
 const before=r.score;sortGift(r,'wrong');assert.equal(r.score,before);assert.equal(comboMultiplier(r.combo),1);
});
test('quick bar reflects the same two-second scoring window and freezes with game time',()=>{
 const r=createSorting();acknowledge(r);assert.equal(quickRemaining(r),1);r.elapsed=1000;assert.equal(quickRemaining(r),.5);r.elapsed=2500;assert.equal(quickRemaining(r),0);
 const result=sortGift(r,destination(r,r.queue[0]));assert.equal(result.points.quick,0);assert.equal(quickRemaining(r),1);
});
test('records stay separate, ties are not new bests, all finishes celebrate and medals lift the party',()=>{
 const save=freshSave(),r=createSorting('rapper');r.score=500;
 let result=recordSorting(save,r);assert.equal(result.best,true);assert.equal(result.celebration,1);assert.equal(result.personalBest,500);
 assert.deepEqual(save.sortingBests,{easy:0,tunie:0,rapper:500});
 result=recordSorting(save,r);assert.equal(result.best,false);assert.equal(result.celebration,0);
 r.difficulty='easy';r.score=C.sorting.medals.easy[0];result=recordSorting(save,r);assert.equal(result.celebration,2);assert.equal(result.medals.length,1);
 assert.deepEqual(sortingTop(save.sortingBests),{difficulty:'easy',score:r.score});
 r.score=0;r.difficulty='tunie';result=recordSorting(save,r);assert.equal(result.celebration,0);assert.equal(result.best,false);
});
test('old unattributed records reset safely and malformed per-difficulty values are filtered',()=>{
 assert.deepEqual(normalizeSave({version:2,sortingBest:99999}).sortingBests,{easy:0,tunie:0,rapper:0});
 assert.deepEqual(normalizeSave({version:2,sortingBests:{easy:240.9,tunie:-1,rapper:'900'}}).sortingBests,{easy:240,tunie:0,rapper:0});
 const save=freshSave();save.sortingBests={easy:123,tunie:456,rapper:789};assert.deepEqual(normalizeSave(save).sortingBests,save.sortingBests);
});
test('every correct sack has a distinct sampled in-key cue above 300 Hz, separate from error/echo voices',()=>{
 const samples=[],effects=[],music={state:'ready',sample:(...args)=>samples.push(args)};
 const cues=new SortingFeedback(music);cues.effect=(...args)=>effects.push(args);
 const pitches=[];
 for(const id of [...C.sorting.streets.map(s=>s.id),'fragile','royal']){
  samples.length=0;cues.correct(id);pitches.push(samples[0][0]);
  assert.equal(samples[0][1],'fold');assert.equal(samples[0][2],0);
  for(const [pitch,instrument] of samples){assert.ok(440*2**((pitch-69)/12)>=300);assert.notEqual(instrument,'bow');assert.ok([0,2,4,5,7,9,11].includes((pitch-67+12)%12));}
 }
 assert.equal(new Set(pitches).size,6);cues.wrong();cues.oops();assert.deepEqual(effects.slice(-2).map(e=>e[0]),['boing','oops']);
 samples.length=0;cues.combo();assert.ok(samples.some(s=>s[1]==='ribbon'&&s[2]>0));
});
test('celebration grows for records and medals and stays within two to four seconds',()=>{
 const counts=[];
 for(let tier=0;tier<3;tier++){
  const calls=[],music={state:'ready',sample:(pitch,instrument,delay,level,duration)=>calls.push({delay,duration}),drum:()=>{}};
  new SortingFeedback(music).celebrate(tier);counts.push(calls.length);
  const end=Math.max(...calls.map(c=>c.delay+c.duration));assert.ok(end>=2&&end<=4);
 }
 assert.ok(counts[0]<counts[1]&&counts[1]<counts[2]);
 const fallback=new SortingFeedback({state:'failed',sample:()=>{},drum:()=>{}}),starts=[];
 fallback.effect=(name,level,delay)=>starts.push(delay);fallback.celebrate();
 assert.ok(Math.max(...starts)+.16>=2&&Math.max(...starts)+.16<=4);
});
