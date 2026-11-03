import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';

// Deterministic network fault injection; production service-worker behavior remains
// covered by the existing Sorting and Wrap browser suites.
test.use({serviceWorkers:'block'});

async function setup(page){await page.goto('/?review=1');await page.locator('[data-action="profile"]').click();await page.goto('/?review=1#sorting');}

test('sorting music loads lazily, ducks on cards/pause, resumes, mutes and stops on background/navigation',async({page})=>{
 await page.addInitScript(()=>{
  window.bandLevels=[];window.bandStarts=[];
  const Native=window.AudioContext||window.webkitAudioContext;
  window.AudioContext=class extends Native{constructor(...args){super(...args);window.sortContext=this;}createBufferSource(){const source=super.createBufferSource(),start=source.start;source.start=function(...args){window.bandStarts.push({length:source.buffer.length,rate:source.playbackRate.value});return start.apply(this,args);};return source;}};
  const target=AudioParam.prototype.setTargetAtTime;AudioParam.prototype.setTargetAtTime=function(value,...args){window.bandLevels.push(value);return target.call(this,value,...args);};
 });
 const audio=[];page.on('request',r=>{if(r.url().includes('/audio/')||r.url().endsWith('/sorting-music.js'))audio.push(r.url());});
 await page.goto('/?review=1');await page.locator('[data-action="profile"]').click();expect(audio).toEqual([]);
 await page.goto('/?review=1#sorting');await expect(page.locator('#music-loading')).toBeHidden();expect(audio.some(url=>url.endsWith('sources.json'))).toBe(true);expect(audio.filter(url=>url.endsWith('.wav')).length).toBe(10);
 await page.locator('[data-action="sound"]').click();await page.locator('#sort-stage-select').selectOption('5');await page.locator('[data-action="sorting-start"]').click();
 await expect.poll(()=>page.evaluate(()=>window.bandLevels.at(-1))).toBe(.14);await expect.poll(()=>page.evaluate(()=>window.bandStarts.length)).toBeGreaterThan(3);
 await page.locator('#sort-continue').click();await expect.poll(()=>page.evaluate(()=>window.bandLevels.at(-1))).toBe(.65);
 const sounds=await page.evaluate(()=>window.bandStarts);expect(new Set(sounds.map(s=>s.length)).size).toBeGreaterThan(3);
 await page.locator('#sort-pause').click();await expect.poll(()=>page.evaluate(()=>window.bandLevels.at(-1))).toBe(.14);expect(await page.evaluate(()=>window.sortContext.state)).toBe('running');
 await page.locator('[data-action="sound"]').filter({visible:true}).click();await expect.poll(()=>page.evaluate(()=>window.sortContext.state)).toBe('suspended');const muted=await page.evaluate(()=>window.bandStarts.length);await page.waitForTimeout(250);expect(await page.evaluate(()=>window.bandStarts.length)).toBe(muted);
 await page.locator('[data-action="sound"]').filter({visible:true}).click();await expect.poll(()=>page.evaluate(()=>window.sortContext.state)).toBe('running');await expect.poll(()=>page.evaluate(()=>window.bandStarts.length)).toBeGreaterThan(muted);await page.locator('#sort-resume').click();await expect.poll(()=>page.evaluate(()=>window.bandLevels.at(-1))).toBe(.65);
 await page.evaluate(()=>{window.testHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.testHidden});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>page.evaluate(()=>window.sortContext.state)).toBe('suspended');
 await page.evaluate(()=>{window.testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});expect(await page.evaluate(()=>window.sortContext.state)).toBe('suspended');await page.locator('#sort-resume').click();await expect.poll(()=>page.evaluate(()=>window.sortContext.state)).toBe('running');
 await page.locator('#sort-pause').click();await page.locator('#sort-home').click();await expect.poll(()=>page.evaluate(()=>window.sortContext.state)).toBe('suspended');
});

test('delayed or failed sorting bank never blocks visual sorting',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/audio/sources.json',async route=>{await gate;await route.fulfill({status:503,body:'unavailable'});});
 await setup(page);await expect(page.locator('#music-loading')).toHaveText(C.sorting.music.loading);release();await expect(page.locator('#music-loading')).toHaveText(C.sorting.music.failed);
 await page.locator('#sort-stage-select').selectOption('1');await page.locator('[data-action="sorting-start"]').click();await page.locator('#sort-continue').click();
 const symbol=await page.locator('#sort-spot .street-tag').textContent(),street=C.sorting.streets.find(s=>s.symbol===symbol).id;await page.locator(`[data-sack="${street}"]`).dispatchEvent('pointerdown');await expect(page.locator('#sort-multiplier')).toHaveAttribute('data-combo','1');
});

test('rendered sorting arrangement has audible melody and accompaniment with headroom for cues and a continuous loop',async({page},testInfo)=>{
 await page.goto('/?review=1');
 const result=await page.evaluate(async()=>{
  const {Music}=await import('/game/music.js'),{SortingMusic}=await import('/game/sorting-music.js'),{SortingFeedback}=await import('/game/sorting-feedback.js'),Original=window.AudioContext;
  async function render(mode){
   const rate=22050,seconds=40,ctx=new OfflineAudioContext(1,rate*seconds,rate);window.AudioContext=function(){return ctx;};
   const music=new Music(()=>true);await music.load();if(music.state!=='ready')throw Error('decode failed');
   const track=new SortingMusic(music);track.ready();track.band.bus.gain.value=.65;
   const sample=track.band.sample.bind(track.band),drum=track.band.drum.bind(track.band),play=track.band.play.bind(track.band);
   // The melody's distinct level identifies its voice, independent of instrument choice.
   track.band.sample=(pitch,instrument,delay,volume,duration)=>{if(mode==='melody'?volume===.75:mode==='backing'?volume!==.75:true)sample(pitch,instrument,delay,volume,duration);};
   if(mode==='melody'){track.band.drum=()=>{};track.band.play=(...args)=>{if(args[0]!==track.band.kit.pad)play(...args);};}
   for(let step=0;step<148;step++)track.schedule(step,.08+step*track.secondsPerBeat/2,7);
   if(mode==='mix'){
    const feedback=new SortingFeedback(music),play=music.play.bind(music);let offset=0;
    music.play=(buffer,midi,root,delay,...args)=>play(buffer,midi,root,delay+offset,...args);
    // Exercise the real landing, echo, error and promotion voices over the band.
    for(let i=0;i<8;i++){offset=i*.47;feedback.correct(['candy','holly','ginger','tinsel','fragile','royal'][i%6]);if(i===3)feedback.combo();}
    offset=4;feedback.wrong();offset=4.5;feedback.oops();offset=5;feedback.stage();
   }
   const buffer=await ctx.startRendering(),data=buffer.getChannelData(0);let squares=0,peak=0;
   for(const v of data){squares+=v*v;peak=Math.max(peak,Math.abs(v));}
   // No silent block around the 17-bar wrap, including the held final note.
   const seam=68*track.secondsPerBeat;let minRms=1;
   for(let t=seam-.5;t<seam+.5;t+=.1){let sum=0;for(let i=Math.floor(t*rate);i<Math.floor((t+.1)*rate);i++)sum+=data[i]**2;minRms=Math.min(minRms,Math.sqrt(sum/(.1*rate)));}
   return {rms:Math.sqrt(squares/data.length),peak,minRms};
  }
  try{return {melody:await render('melody'),backing:await render('backing'),mix:await render('mix')};}finally{window.AudioContext=Original;}
 });
 await testInfo.attach('sorting-mix-metrics',{body:JSON.stringify(result,null,2),contentType:'application/json'});
 expect(result.backing.rms).toBeGreaterThan(.015);expect(result.melody.rms).toBeGreaterThan(result.backing.rms);expect(result.mix.peak).toBeLessThan(.95);expect(result.mix.minRms).toBeGreaterThan(.003);
});
