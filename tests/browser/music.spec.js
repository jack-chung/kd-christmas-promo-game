import {test,expect} from '@playwright/test';

for(const songIndex of [0,2])test(`rendered audio song ${songIndex+1}: audible harmony/kit, melody above backing, controlled combined peaks`,async({page})=>{
  await page.goto('/?review=1');
  const result=await page.evaluate(async songIndex=>{
    const {Music}=await import('/game/music.js'),{C}=await import('/game/content.js');
    const OriginalAudio=window.AudioContext;
    const render=async mode=>{
      const offline=new OfflineAudioContext(1,22050*8,22050);
      window.AudioContext=function(){return offline;};
      const music=new Music(()=>true);music.wrap=true;await music.load();
      if(music.state!=='ready')throw Error('Samples did not decode');
      const anchor=performance.now()+100;
      if(mode!=='melody')for(let i=0;i<16;i++)music.backing(C.wrap.songs[songIndex],750,i,anchor+i*375);
      if(mode!=='backing')for(const e of C.wrap.songs[songIndex].chart.events.filter(e=>e.time<6000))music.tone(e.midi,['fold','tape','ribbon','bow'][e.lane],(e.time+100)/1000);
      const buffer=await offline.startRendering(),data=buffer.getChannelData(0);
      let squares=0,peak=0;for(const v of data){squares+=v*v;peak=Math.max(peak,Math.abs(v));}
      return {rms:Math.sqrt(squares/data.length),peak};
    };
    try{return {backing:await render('backing'),melody:await render('melody'),mix:await render('mix')};}
    finally{window.AudioContext=OriginalAudio;}
  },songIndex);
  expect(result.backing.rms).toBeGreaterThan(.025);
  expect(result.melody.rms).toBeGreaterThan(result.backing.rms);
  expect(result.mix.peak).toBeLessThan(.99);
});
