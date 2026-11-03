import test from 'node:test';
import assert from 'node:assert/strict';
import {C,episodeContent,hiddenTargets} from '../docs/game/content.js';
import {freshSave,normalizeSave,loadSave,writeSave,newProfile,nickname,episodeOpen,dateOpen,countdown,nextRelease,grade,timing,mysteryCode,mysteryComplete,landing,escapeHTML} from '../docs/game/engine.js';

test('Toronto weekly midnights and show time unlock at the exact instant',()=>{
  for(const ep of C.episodes){const release=Date.parse(ep.date);assert.equal(dateOpen(ep.date,false,release-1),false);assert.equal(dateOpen(ep.date,false,release),true);assert.equal(episodeOpen(ep,false,release),ep.ready);assert.equal(episodeOpen(ep,true,0),ep.ready);}
  assert.equal(dateOpen(C.finale.date,false,Date.parse('2026-12-12T20:59:59Z')),false);
  assert.equal(dateOpen(C.finale.date,false,Date.parse('2026-12-12T21:00:00Z')),true);
  assert.equal(dateOpen(C.finale.date,true,0),true);
  assert.deepEqual(countdown(C.episodes[0].date,Date.parse('2026-11-19T05:00:00Z')),{days:1,hours:0,minutes:0});
  assert.equal(nextRelease(Date.parse('2026-11-20T05:00:00Z')).id,2);
});
test('only preset identities and implemented rewards survive an untrusted saved value',()=>{
  const p=newProfile(()=>.5);assert.match(nickname(p),/^Dancing Cocoa 55$/);
  const s=normalizeSave({...freshSave(),profile:{...p,avatar:'<script>'},layers:[1,2,4,12],paper:'stars',wrapBest:-9,towerBest:'bad',mysteryBest:-100,mystery:{solved:['hidden','cipher','riddle','future'],found:[1,1,3],hints:['hidden','hidden','future'],elapsed:-3}});
  assert.equal(s.profile,null);assert.deepEqual(s.layers,[1]);assert.equal(s.wrapBest,0);assert.equal(s.towerBest,0);assert.equal(s.mysteryBest,null);assert.equal(s.mystery.elapsed,0);assert.deepEqual(s.mystery.found,[1]);assert.deepEqual(s.mystery.solved,['cipher','riddle']);assert.deepEqual(s.mystery.hints,['hidden']);
  assert.equal(normalizeSave({...freshSave(),layers:[],paper:'stars'}).paper,'cranberry');
  assert.equal(escapeHTML('<a "x">&'), '&lt;a &quot;x&quot;&gt;&amp;');
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
test('three different puzzles produce one ordered code and require all clues',()=>{
  assert.equal(mysteryCode(),'462');assert.equal(mysteryComplete({solved:['cipher','hidden']}),false);assert.equal(mysteryComplete({solved:['riddle','hidden','cipher']}),true);
  const decode=C.mystery.cipherMessage.replace(/[A-Z]/g,c=>String.fromCharCode((c.charCodeAt(0)-65+25)%26+65));assert.equal(decode,'COUNT THE SIX STARS');
  const assignments=[];for(const tansy of ['red','green','blue'])for(const filbert of ['red','green','blue'])for(const pip of ['red','green','blue'])if(new Set([tansy,filbert,pip]).size===3&&tansy==='red'&&filbert!=='blue')assignments.push({tansy,filbert,pip});assert.equal(assignments.length,1);assert.equal(assignments[0].pip,'blue');
});
test('stacking tolerates overlap, rewards centred drops, and rejects a miss',()=>{
  assert.equal(landing({x:160,w:100},{x:160,w:100}).perfect,true);
  assert.equal(landing({x:160,w:100},{x:200,w:100}).stable,true);
  assert.equal(landing({x:160,w:100},{x:225,w:100}).stable,false);
  assert.equal(landing({x:160,w:100},{x:300,w:100}).stable,false);
});

test('ready episode content controls puzzle validation and keeps weekly records separate',()=>{
  const ep=C.episodes[1];const original={...ep};
  try {
    ep.ready=true;ep.content={wrap:{title:'Second wrapping day'},mystery:{parcels:{count:16,striped:[0,2,4,6],bows:[0,2,4,6]},hiddenDigit:'4',cipherAnswer:'3',riddleDigit:'1'},gift:{cardTitle:'Second keepsake'}};
    const content=episodeContent(ep);assert.equal(content.wrap.title,'Second wrapping day');assert.equal(content.hub.play,'▶ Play Episode 2');assert.equal(content.gift.cardLabel,'EPISODE 2 KEEPSAKE');assert.equal(mysteryCode(content.mystery),'431');assert.deepEqual(hiddenTargets(content.mystery),[0,2,4,6]);
    const save=normalizeSave({...freshSave(),layers:[1,2,3],episodeData:{1:{wrapBest:100,mystery:null},2:{wrapBest:200,mysteryBest:5000,mystery:{solved:['hidden'],found:[0,2,4,6,10],hints:[],elapsed:5000}}}});
    assert.deepEqual(save.layers,[1,2]);assert.equal(save.wrapBest,100);assert.equal(save.episodeData[2].wrapBest,200);assert.deepEqual(save.episodeData[2].mystery.found,[0,2,4,6]);assert.deepEqual(save.episodeData[2].mystery.solved,['hidden']);
  } finally {Object.assign(ep,original);}
});
