import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {SleighMusic,sleighScore} from '../docs/game/sleigh-music.js';

test('Sleigh carol preserves the complete eight-bar chorus in three textures without bells',()=>{
 assert.equal(sleighScore.phrase.reduce((n,[,beats])=>n+beats,0),32);
 assert.equal(sleighScore.chords.length,8);
 const track=new SleighMusic({}),calls=[];track.ready=()=>true;
 track.band={sample:(pitch,instrument,delay,volume)=>calls.push({pitch,instrument,volume}),drum(){},play(){},kit:{pad:{}}};
 for(let verse=0;verse<3;verse++){
  const melody=[];
  for(let step=0;step<64;step++){calls.length=0;track.schedule(verse*64+step,0,7);if(calls[0]?.volume===.75)melody.push(calls[0].pitch);assert.ok(calls.every(c=>c.instrument!=='bow'));}
  assert.deepEqual(melody,sleighScore.phrase.map(([pitch])=>pitch));
 }
});

test('Sleigh tempo changes at bars; mute, pause and background clear all scheduled voices',()=>{
 let now=0,enabled=true,hushed=0,stopped=0;const levels=[],steps=[];
 const music={enabled:()=>enabled,state:'ready',context:{get currentTime(){return now;},state:'running'},unlock(){},hush(){hushed++;}};
 const track=new SleighMusic(music);track.ready=()=>true;track.band={bus:{gain:{cancelScheduledValues(){},setTargetAtTime(level){levels.push(level);}}},voices:new Set([{stop(){stopped++;}}])};track.schedule=step=>steps.push(step);
 track.update(1);assert.equal(track.secondsPerBeat,60/124);now=1;track.update(1);assert.equal(levels.at(-1),C.sleigh.music.level);
 track.step=7;now=2;track.nextAt=now+.15;track.update(8);assert.equal(track.secondsPerBeat,60/124);
 now=3;track.update(8);assert.equal(track.secondsPerBeat,60/138);
 track.step=16;now=4;track.update(99);assert.equal(track.secondsPerBeat,60/144);
 enabled=false;track.update(99);assert.equal(track.nextAt,0);assert.equal(stopped,1);
 enabled=true;track.suspend();const count=steps.length;now+=30;track.update(99);assert.equal(steps.length,count);assert.equal(hushed,1);
 track.resume();track.update(99);assert.ok(steps.length>count);
});
