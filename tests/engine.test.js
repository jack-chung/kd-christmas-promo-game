import test from 'node:test';
import assert from 'node:assert/strict';
import {C,episodeContent} from '../docs/game/content.js';
import {freshSave,normalizeSave,loadSave,writeSave,newProfile,nickname,episodeOpen,dateOpen,countdown,nextRelease,grade,timing,landing,escapeHTML} from '../docs/game/engine.js';

test('Toronto weekly midnights and show time unlock at the exact instant',()=>{
  for(const ep of C.episodes){const release=Date.parse(ep.date);assert.equal(dateOpen(ep.date,false,release-1),false);assert.equal(dateOpen(ep.date,false,release),true);assert.equal(episodeOpen(ep,false,release),ep.ready);assert.equal(episodeOpen(ep,true,0),ep.ready);}
  assert.equal(dateOpen(C.finale.date,false,Date.parse('2026-12-12T20:59:59Z')),false);
  assert.equal(dateOpen(C.finale.date,false,Date.parse('2026-12-12T21:00:00Z')),true);
  assert.equal(dateOpen(C.finale.date,true,0),true);
  assert.deepEqual(countdown(C.episodes[0].date,Date.parse('2026-11-12T05:00:00Z')),{days:1,hours:0,minutes:0});
  assert.equal(nextRelease(Date.parse('2026-11-13T05:00:00Z')).id,2);
});
test('old saves reset safely; new saves retain only valid rewards',()=>{
  assert.deepEqual(normalizeSave({version:1,layers:[1]}),freshSave());
  assert.deepEqual(normalizeSave({...freshSave(),layers:[1,2,3,4]}).layers,[1,2,3]);
  assert.equal(normalizeSave({...freshSave(),profile:{avatar:'bad'}}).profile,null);
});
test('blocked storage and damaged JSON leave a playable fresh state',()=>{
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
  assert.deepEqual(loadSave(blocked),{save:freshSave(),ok:false});
  assert.equal(writeSave(blocked,freshSave()),false);
  assert.equal(loadSave({getItem:()=>'{bad'}).save.profile,null);
  const mem={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};
  const s={...freshSave(),profile:newProfile(()=>0),layers:[1],towerBest:17};assert.equal(writeSave(mem,s),true);assert.deepEqual(loadSave(mem).save,normalizeSave(s));
});
test('timing windows are symmetric and difficulty rewards mastery without requiring sound',()=>{
  for(const d of C.wrap.difficulty){assert.equal(timing(0,d),2);assert.equal(timing(-d.perfect,d),2);assert.equal(timing(d.window,d),1);assert.equal(timing(-d.window,d),1);assert.equal(timing(d.window+1,d),0);assert.equal(timing(-d.window-1,d),0);}
  assert.equal(grade(1),'S');assert.equal(grade(.8),'A');assert.equal(grade(.72),'B');assert.equal(grade(.3),'C');
});
test('stacking tolerates overlap, rewards centred drops, and rejects a miss',()=>{
  assert.equal(landing({x:160,w:100},{x:160,w:100}).perfect,true);
  assert.equal(landing({x:160,w:100},{x:200,w:100}).stable,true);
  assert.equal(landing({x:160,w:100},{x:225,w:100}).stable,false);
  assert.equal(landing({x:160,w:100},{x:300,w:100}).stable,false);
});
