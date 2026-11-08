import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {freshSave,newProfile,normalizeSave} from '../docs/game/engine.js';
import {encodeSave,decodeSave} from '../docs/game/save-code.js';
import {finishRewards} from '../docs/game/treasure.js';
import {songOpen,songMedal,recordSong,SongClock} from '../docs/game/wrap-progress.js';
import {createRound,judgeTap,expireNotes,roundResult} from '../docs/game/rhythm.js';

test('twelve songs drop three per Toronto Friday; dates AND ladder apply; review opens all',()=>{
 assert.equal(C.wrap.songs.length,12);let records={};
 for(const song of C.wrap.songs){const date=Date.parse(song.release);
  assert.equal(songOpen(song,records,date-1),false);assert.equal(songOpen(song,records,date,true),true);
  assert.equal(songOpen(song,records,date),song.tier===1);
 }
 records['deck-the-halls']={grade:'C'};assert.equal(songOpen(C.wrap.songs[1],records,Infinity),false);
 records['deck-the-halls'].grade='B';assert.equal(songOpen(C.wrap.songs[1],records,Infinity),true);assert.equal(songOpen(C.wrap.songs[2],records,Infinity),false);
 records['o-christmas-tree']={grade:'A'};
 for(const song of C.wrap.songs){assert.equal(songOpen(song,records,Date.parse(song.release)-1),false);assert.equal(songOpen(song,records,Date.parse(song.release)),true);}
 for(const date of new Set(C.wrap.songs.map(s=>s.release)))assert.deepEqual(C.wrap.songs.filter(s=>s.release===date).map(s=>s.tier),[1,2,3]);
});

test('bar-boundary tempo steps preserve one inverse audio/visual mapping and already queued attacks',()=>{
 const clock=new SongClock(10000,3600);for(let i=0;i<8;i++)clock.hit(10000+i*100);
 assert.equal(clock.speed(13599),1);assert.equal(clock.speed(13600),1.05);
 for(const wall of [9000,10000,13000,13600,14000,18000])assert.ok(Math.abs(clock.wall(clock.time(wall))-wall)<.00001);
 const queued=clock.wall(clock.time(13400)+100);clock.miss(13400);assert.equal(clock.wall(clock.time(13400)+100),queued);
 assert.equal(clock.speed(clock.wall(7200)),1);
 for(let i=0;i<100;i++)clock.hit(18000);assert.equal(clock.segments.at(-1).speed,1.4);
 for(let i=0;i<100;i++)clock.miss(19000);assert.equal(clock.segments.at(-1).speed,1);
 const before=clock.wall(16000);clock.shift(20000);assert.equal(clock.wall(16000),before+20000);
});

test('score follows speed, while accuracy and medal thresholds remain identical',()=>{
 const chart=C.wrap.songs[2].chart,d=C.wrap.tiers[2],base=createRound(chart,d),fast=createRound(chart,d);
 for(const event of chart.events){judgeTap(base,event.lane,event.time);judgeTap(fast,event.lane,event.time,1.4);}
 assert.equal(roundResult(base).grade,'S');assert.deepEqual(roundResult(base),roundResult(fast));assert.ok(Math.abs(fast.score/base.score-1.4)<.01);
});

test('song records survive normalization and TV2 backup, improve independently; old saves retain Paper',()=>{
 const save=freshSave();save.profile=newProfile();const song=C.wrap.songs[0];
 assert.equal(recordSong(save,song,{grade:'A',score:100,topSpeed:1.2}).best,true);
 assert.equal(recordSong(save,song,{grade:'B',score:200,topSpeed:1.1}).best,true);
 assert.equal(recordSong(save,song,{grade:'S',score:150,topSpeed:1.4}).best,false);
 assert.deepEqual(save.wrapSongs[song.id],{score:200,grade:'S',topSpeed:1.4});
 assert.deepEqual(normalizeSave(save).wrapSongs,save.wrapSongs);assert.deepEqual(decodeSave(encodeSave(save)).wrapSongs,save.wrapSongs);
 assert.deepEqual(normalizeSave({version:3,layers:[1],wrapBest:1000}).layers,[1]);assert.deepEqual(normalizeSave({version:3,wrapSongs:{[song.id]:{grade:'Q',score:NaN}}}).wrapSongs,{});
});

test('each completed song grants a tier-capped box/outfit; C never wins Paper; a best adds a box',()=>{
 for(const song of C.wrap.songs)for(const grade of ['C','B','A','S']){
  const save=freshSave(),medal=songMedal(song,grade);finishRewards(save,{game:'wrap',medal,best:true});
  assert.deepEqual(save.collection.boxes,[medal+1,medal+1]);assert.equal(save.layers.includes(1),grade!=='C');assert.equal(save.collection.outfits.length,medal+1);
 }
});

test('seeded random tapping and four-lane mashing never earn B on any song',()=>{
 for(const song of C.wrap.songs)for(let seed=1;seed<=20;seed++){
  let r=seed;const random=()=>((r=Math.imul(1664525,r)+1013904223>>>0)/2**32);
  const round=createRound(song.chart,C.wrap.tiers[song.tier-1]);
  for(let time=0;time<song.chart.duration;time+=50+random()*350){expireNotes(round,time);judgeTap(round,Math.floor(random()*4),time);}
  expireNotes(round,song.chart.duration+1000);assert.equal(roundResult(round).grade,'C');
 }
});

test('original 21-field TV1 backup still restores the old best and earned Paper',()=>{
 const legacy='TV1-WzEsWzcsMCw3MCwwXSxbMV0sWzMyMSwwLDAsMF0sWzAsMCwwXSxbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdLFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sMCxbXSxbLTEsLTEsLTEsLTFdLCIwIiwwLGZhbHNlLCIiLFtdLFtdLCIiLDAsW10sMCwwXQ-0ni167n';
 const save=decodeSave(legacy);assert.equal(save.wrapBest,321);assert.deepEqual(save.layers,[1]);assert.deepEqual(save.wrapSongs,{});
});
