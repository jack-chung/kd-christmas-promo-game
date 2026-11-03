import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {C} from '../docs/game/content.js';
import {Music} from '../docs/game/music.js';

test('all difficulties retain the complete carol; only Easy fills uncharted notes',()=>{
  for(const song of C.wrap.songs){
    let beat=0;
    const melody=song.phrase.flatMap(([midi,length])=>{
      const event={beat,midi};beat+=length;return midi?[event]:[];
    });
    for(const [id,chart] of Object.entries(song.variants)){
      const notes=[...chart.events.filter((e,i)=>!i||e.time!==chart.events[i-1].time),...chart.automatic].sort((a,b)=>a.time-b.time);
      assert.deepEqual(notes.map(e=>({beat:e.time/chart.beat,midi:e.midi})),melody);
      assert.equal(chart.automatic.length>0,id==='easy');
      if(id==='easy')assert.ok(chart.events.every((e,i)=>!i||e.time-chart.events[i-1].time>=1500));
      for(const lane of [0,1,2,3]){
        const events=chart.events.filter(e=>e.lane===lane);
        const window=C.wrap.difficulty.find(d=>d.id===id).window;
        assert.ok(events.every((e,i)=>!i||e.time-events[i-1].time>2*window));
      }
    }
  }
});

test('sample bank fits the budget, has a pinned CC0 source for every recording and valid PCM',()=>{
  const root=new URL('../docs/game/audio/',import.meta.url);
  const manifest=JSON.parse(readFileSync(new URL('sources.json',root)));
  assert.equal(manifest.license,'CC0-1.0');assert.match(manifest.revision,/^[a-f0-9]{40}$/);
  let bytes=0;
  for(const sample of manifest.samples){
    const file=new URL(sample.file,root),data=readFileSync(file);bytes+=statSync(file).size;
    assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');
    assert.ok(sample.source.endsWith('.wav'));assert.ok(Number.isInteger(sample.midi));
  }
  assert.ok(bytes<2_000_000);
  assert.deepEqual([...new Set(manifest.samples.map(s=>s.instrument))].sort(),['bass','bow','fold','ribbon','tape']);
});

test('backing schedules harmony and kit without playing chart melody; late attacks are dropped',()=>{
  const music=new Music(()=>true),calls=[];music.state='ready';music.kit={pad:{}};
  music.sample=(midi,instrument)=>calls.push({midi,instrument});
  music.drum=name=>calls.push({drum:name});music.play=()=>calls.push({pad:true});
  const song={...C.wrap.songs[0],get variants(){throw Error('Backing must never read chart melody');}};
  music.backing(song,750,-6,performance.now()+100);assert.deepEqual(calls,[{drum:'shaker'}]);calls.length=0;
  music.backing(song,750,0,performance.now()+100);
  assert.ok(calls.some(c=>c.instrument==='bass'));assert.ok(calls.some(c=>c.drum==='kick'));assert.ok(calls.some(c=>c.pad));
  assert.ok(calls.filter(c=>c.midi).every(c=>c.midi<=67));
  calls.length=0;music.backing(song,750,0,performance.now()-500);assert.deepEqual(calls,[]);
});
