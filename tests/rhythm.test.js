import test from 'node:test';
import assert from 'node:assert/strict';
import {C} from '../docs/game/content.js';
import {createRound,judgeTap,expireNotes,roundResult} from '../docs/game/rhythm.js';

test('every full song has four lanes, legal pitches, tier-specific pairs and a perfect-run S',()=>{
  for(const song of C.wrap.songs){const d=C.wrap.tiers[song.tier-1];
    const chart=song.variants[d.id];assert.ok(chart.duration>=90000&&chart.duration<=180000);
    assert.deepEqual([...new Set(chart.events.map(e=>e.lane))].sort(),[0,1,2,3]);
    assert.ok(chart.events.every((e,i)=>e.time>=0&&e.time<chart.duration&&e.lane>=0&&e.lane<4&&Number.isInteger(e.midi)&&e.midi>=36&&e.midi<=96&&(i===0||e.time>=chart.events[i-1].time)));
    const chords=chart.events.length-new Set(chart.events.map(e=>e.time)).size;assert.equal(chords>0,d.id==='rapper');
    assert.ok(chart.events.every((e,i)=>!chart.events.slice(0,i).some(p=>p.time===e.time&&p.lane===e.lane)));
    const round=createRound(chart,d);for(const e of chart.events)assert.equal(judgeTap(round,e.lane,e.time).tier,2);
    assert.equal(roundResult(round).grade,'S');assert.equal(round.hits,chart.events.length);
  }
});
test('matching shape and timing are both required; a chord accepts independent thumbs',()=>{
  const chart={events:[{time:0,lane:0,midi:60},{time:1000,lane:1,midi:64},{time:1000,lane:3,midi:67}]},d=C.wrap.difficulty[1];
  const round=createRound(chart,d);
  assert.equal(judgeTap(round,2,0).tier,0);assert.ok(round.judged.has(0));assert.equal(judgeTap(round,0,0).tier,0);
  assert.equal(judgeTap(round,3,1000).tier,2);assert.equal(judgeTap(round,1,1000).tier,2);assert.equal(round.hits,2);
  assert.equal(judgeTap(round,1,1000).tier,0);assert.equal(round.combo,0);
  const fresh=createRound(chart,d);assert.equal(judgeTap(fresh,0,-d.window-1).tier,0);assert.equal(fresh.judged.size,0);
  assert.deepEqual(expireNotes(fresh,301),[0]);assert.equal(judgeTap(fresh,0,302).tier,0);
});
test('mashing all four lanes on every beat cannot earn a good grade',()=>{
  for(const song of C.wrap.songs){const d=C.wrap.tiers[song.tier-1];
    const chart=song.variants[d.id],round=createRound(chart,d);
    for(const time of [...new Set(chart.events.map(e=>e.time))]){expireNotes(round,time);for(let lane=0;lane<4;lane++)judgeTap(round,lane,time);}
    expireNotes(round,chart.duration+1000);assert.equal(roundResult(round).grade,'C');assert.ok(roundResult(round).ratio<.25);
  }
});
