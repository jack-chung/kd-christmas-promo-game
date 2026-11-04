import {C} from './content.js';

// Recorded attacks share the CC0 bank. Rendered woody/spring/paper effects
// need no downloads; no bell timbres are used.
export class SortingFeedback {
 constructor(music){this.music=music;this.effects=null;}
 prepare(){
  const ctx=this.music.context;if(!ctx||this.effects)return;
  this.effects={};
  for(const [name,seconds] of [['pop',.16],['boing',.46],['oops',.32]]){
   const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*seconds),ctx.sampleRate),data=buffer.getChannelData(0);let phase=0,seed=17;
   for(let i=0;i<data.length;i++){
    const t=i/ctx.sampleRate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/2147483648-1;
    const hz=name==='boing'?470+230*Math.cos(t*37)*Math.exp(-t*5):name==='pop'?780-300*t/seconds:540+110*Math.sin(t*81);
    phase+=2*Math.PI*hz/ctx.sampleRate;
    const body=Math.sin(phase)+.3*Math.sin(phase*2)+.12*Math.sin(phase*3),envelope=Math.min(1,t/.002)*Math.exp(-t*(name==='pop'?33:name==='boing'?9:15));
    data[i]=(body*.38+noise*(name==='oops'?.32:.07))*envelope*Math.min(1,(seconds-t)/.025);
   }
   this.effects[name]=buffer;
  }
 }
 effect(name,level=.5,delay=0){this.prepare();this.music.play(this.effects?.[name],60,60,delay,level);}
 correct(id){
  const m=this.music,pitch=C.sorting.feedback.pitches[id]??67;
  if(m.state==='ready'){m.sample(pitch,'fold',0,1.15,.28);m.sample(pitch+12,'ribbon',.025,.26,.26);}
  this.effect('pop',m.state==='ready'?.15:.65);
 }
 wrong(){this.effect('boing',.65);}
 oops(){this.effect('oops',.65);}
 combo(){for(const [i,pitch] of [67,71,74].entries()){this.music.sample(pitch,'ribbon',i*.14,.65,.5);this.music.sample(pitch+12,'tape',i*.14,.22,.25);}}
 stage(){for(const [i,pitch] of [67,74,79].entries())this.music.sample(pitch,'tape',i*.13,.8,.35);}
 celebrate(tier=0){
  const m=this.music;
  // Original G-major flourish: all runs get a party, records add harmony,
  // and medals add a higher answering phrase. Duration is 2.8–3.4 seconds.
  for(const [i,pitch] of [67,71,74,79,74,71,74,79].entries()){
   const at=i*.24;m.sample(pitch,i%2?'ribbon':'fold',at,.85,.75);
   if(tier>=1)m.sample(pitch-12,'tape',at,.32,.5);
   if(tier>=2)m.sample(pitch+12,'ribbon',at+.1,.22,.5);
  }
  for(const pitch of [55,59,62])m.sample(pitch,'ribbon',1.9,.4,.9);
  for(let i=0;i<5+tier*2;i++)m.drum(i%2?'shaker':'snare',i*.24,.10);
  if(tier>=2)for(const [i,pitch] of [79,81,83,86,83,79].entries())m.sample(pitch,'fold',2.05+i*.17,.65,.5);
  if(m.state!=='ready')for(let i=0;i<6;i++)this.effect('pop',.4,i*.44);
 }
}
