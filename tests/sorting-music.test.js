import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {SortingMusic,sortingScore} from '../docs/game/sorting-music.js';

test('sorting carol retains all 17 measures in each seamless verse, with no bell instruments',()=>{
 const song={...C.sorting.music,...sortingScore};assert.equal(song.phrase.reduce((n,[,length])=>n+length,0),68);assert.equal(song.chords.length,17);
 assert.deepEqual(C.wrap.songs.find(s=>s.id==='good-king-wenceslas').verse,song.phrase);
 const track=new SortingMusic({}),calls=[];track.ready=()=>true;
 track.band={sample:(pitch,instrument,delay,volume,duration)=>calls.push({pitch,instrument,volume,duration}),drum:()=>{},play:()=>{},kit:{pad:{}}};
 for(let verse=0;verse<3;verse++){
  const melody=[];
  for(let step=0;step<136;step++){calls.length=0;track.schedule(verse*136+step,0,7);if(calls[0]?.volume===.75)melody.push(calls[0].pitch);assert.ok(calls.every(c=>c.instrument!=='bow'));}
  assert.deepEqual(melody,song.phrase.map(([pitch])=>pitch));
 }
});

test('soundtrack schedules independently, caps tempo, ducks and clears on mute/background',()=>{
 let now=0,enabled=true;const levels=[],calls=[];
 const music={enabled:()=>enabled,state:'ready',context:{get currentTime(){return now;},state:'running'},unlock(){},hush(){calls.push('hush');}};
 const track=new SortingMusic(music);track.band={bus:{gain:{cancelScheduledValues(){},setTargetAtTime(level){levels.push(level);}}},voices:new Set([{stop(){calls.push('stop');}}])};track.ready=()=>true;track.schedule=(step,delay)=>calls.push({step,delay});
 track.update(1,true);assert.equal(levels.at(-1),.14);assert.equal(track.secondsPerBeat,60/112);
 now=1;track.update(1,false);assert.equal(levels.at(-1),.65);
 now=2;track.update(1,true);assert.equal(levels.at(-1),.14);
 const step=track.step;enabled=false;track.update(1);assert.equal(track.nextAt,0);assert.equal(track.step,step);assert.ok(calls.includes('stop'));
 enabled=true;track.step=8;track.update(50);assert.equal(track.secondsPerBeat,60/132);
 track.suspend();assert.ok(calls.includes('hush'));const pausedStep=track.step;now+=30;track.update(50);assert.equal(track.step,pausedStep);track.resume();track.update(50);assert.ok(track.step>pausedStep);
});
