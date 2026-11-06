import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {C} from '../../docs/game/content.js';
test.use({serviceWorkers:'block'});
async function setup(page){
 await page.addInitScript(()=>localStorage.setItem('tuneville-gift-v1',JSON.stringify({version:2,profile:{adjective:0,noun:0,number:10,avatar:'wrapper'},sleighPractice:true,sound:true})));
 await page.goto('/?review=1#sleigh');
}
test('Sleigh carol starts with the road and stays quiet on cards, pause, mute, background and navigation',async({page})=>{
 await page.addInitScript(()=>{
  window.bandStarts=0;window.bandLevels=[];const Native=window.AudioContext||window.webkitAudioContext;
  window.AudioContext=class extends Native{constructor(...args){super(...args);window.sleighAudio=this;}createBufferSource(){const source=super.createBufferSource(),start=source.start;source.start=function(...args){window.bandStarts++;return start.apply(this,args);};return source;}};
  const target=AudioParam.prototype.setTargetAtTime;AudioParam.prototype.setTargetAtTime=function(value,...args){window.bandLevels.push(value);return target.call(this,value,...args);};
 });
 const requests=[];page.on('request',r=>{if(r.url().endsWith('/sleigh-music.js'))requests.push(r.url());});
 await setup(page);expect(requests).toHaveLength(0);await expect(page.locator('#music-loading')).toBeHidden();
 await page.locator('[data-action="sleigh-start"]').click();await expect.poll(()=>requests.length).toBe(1);
 await page.waitForTimeout(200);const onCard=await page.evaluate(()=>window.bandStarts);await page.waitForTimeout(250);expect(await page.evaluate(()=>window.bandStarts)).toBe(onCard);
 await page.locator('#sleigh-continue').click();await expect.poll(()=>page.evaluate(()=>window.bandLevels.at(-1))).toBe(C.sleigh.music.level);
 const playing=await page.evaluate(()=>window.bandStarts);await expect.poll(()=>page.evaluate(()=>window.bandStarts)).toBeGreaterThan(playing);
 await page.locator('#sleigh-pause').click();await expect.poll(()=>page.evaluate(()=>window.sleighAudio.state)).toBe('suspended');
 const paused=await page.evaluate(()=>window.bandStarts);await page.waitForTimeout(250);expect(await page.evaluate(()=>window.bandStarts)).toBe(paused);
 await page.locator('[data-action="sound"]').filter({visible:true}).click();await page.locator('#sleigh-continue').click();
 const muted=await page.evaluate(()=>window.bandStarts);await page.waitForTimeout(250);expect(await page.evaluate(()=>window.bandStarts)).toBe(muted);
 await page.locator('#sleigh-pause').click();await page.locator('[data-action="sound"]').filter({visible:true}).click();await page.locator('#sleigh-continue').click();await expect.poll(()=>page.evaluate(()=>window.bandStarts)).toBeGreaterThan(muted);
 await page.evaluate(()=>{window.testHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.testHidden});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>page.evaluate(()=>window.sleighAudio.state)).toBe('suspended');
 await page.evaluate(()=>{window.testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});expect(await page.evaluate(()=>window.sleighAudio.state)).toBe('suspended');
 await page.locator('#sleigh-continue').click();await expect.poll(()=>page.evaluate(()=>window.sleighAudio.state)).toBe('running');
 await page.locator('#sleigh-pause').click();await page.locator('#sleigh-home').click();await expect.poll(()=>page.evaluate(()=>window.sleighAudio.state)).toBe('suspended');
});
test('failed sample bank leaves Sleigh visual play available',async({page})=>{
 await page.route('**/audio/sources.json',route=>route.fulfill({status:503,body:'unavailable'}));await setup(page);await expect(page.locator('#music-loading')).toContainText('sound');
 await page.locator('[data-action="sleigh-start"]').click();await page.locator('#sleigh-continue').click();await expect(page.locator('#sleigh-canvas')).toBeVisible();await page.keyboard.press('Space');
});
test('rendered Sleigh chorus has clear melody, accompaniment, loop continuity and cue headroom',async({page},testInfo)=>{
 await page.goto('/?review=1');
 const result=await page.evaluate(async()=>{
  const {Music}=await import('/game/music.js'),{SleighMusic}=await import('/game/sleigh-music.js'),{GameFeedback}=await import('/game/game-feedback.js'),Original=window.AudioContext;
  async function render(mode){
   const rate=22050,seconds=34,ctx=new OfflineAudioContext(1,rate*seconds,rate);window.AudioContext=function(){return ctx;};
   const music=new Music(()=>true);await music.load();if(music.state!=='ready')throw Error('decode failed');
   const track=new SleighMusic(music);track.ready();track.band.bus.gain.value=track.settings.level;
   const sample=track.band.sample.bind(track.band);track.band.sample=(pitch,instrument,delay,volume,duration)=>{if(mode==='melody'?volume===.75:mode==='backing'?volume!==.75:true)sample(pitch,instrument,delay,volume,duration);};
   if(mode==='melody'){track.band.drum=()=>{};const play=track.band.play.bind(track.band);track.band.play=(...args)=>{if(args[0]!==track.band.kit.pad)play(...args);};}
   for(let step=0;step<140;step++)track.schedule(step,.08+step*track.secondsPerBeat/2,7);
   if(mode==='mix'){
    const feedback=new GameFeedback(music),play=music.play.bind(music);let offset=0;music.play=(buffer,midi,root,delay,...args)=>play(buffer,midi,root,delay+offset,...args);
    for(let i=0;i<6;i++){offset=1+i*2;feedback.effect('boing',.5);offset+=.5;feedback.effect('pop',.5);}
    offset=14;feedback.correct('royal');offset=18;feedback.stage();
   }
   const buffer=await ctx.startRendering(),data=buffer.getChannelData(0);let squares=0,peak=0;
   for(const v of data){squares+=v*v;peak=Math.max(peak,Math.abs(v));}
   const seam=32*track.secondsPerBeat;let minRms=1;
   for(let t=seam-.5;t<seam+.5;t+=.1){let sum=0;for(let i=Math.floor(t*rate);i<Math.floor((t+.1)*rate);i++)sum+=data[i]**2;minRms=Math.min(minRms,Math.sqrt(sum/(.1*rate)));}
   return {rms:Math.sqrt(squares/data.length),peak,minRms,...mode==='mix'?{pcm:Array.from(data,v=>Math.round(Math.max(-1,Math.min(1,v))*32767))}:{}};
  }
  try{return {melody:await render('melody'),backing:await render('backing'),mix:await render('mix')};}finally{window.AudioContext=Original;}
 });
 const pcm=result.mix.pcm;delete result.mix.pcm;
 await testInfo.attach('sleigh-mix-metrics',{body:JSON.stringify(result,null,2),contentType:'application/json'});
 if(testInfo.project.name==='chrome-phone'){
  const wav=Buffer.alloc(44+pcm.length*2);wav.write('RIFF',0);wav.writeUInt32LE(36+pcm.length*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(22050,24);wav.writeUInt32LE(44100,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length*2,40);pcm.forEach((v,i)=>wav.writeInt16LE(v,44+i*2));writeFileSync('/tmp/sleigh-music-preview.wav',wav);
 }
 expect(result.backing.rms).toBeGreaterThan(.01);expect(result.melody.rms).toBeGreaterThan(result.backing.rms);expect(result.mix.peak).toBeLessThan(.95);expect(result.mix.minRms).toBeGreaterThan(.003);
});
