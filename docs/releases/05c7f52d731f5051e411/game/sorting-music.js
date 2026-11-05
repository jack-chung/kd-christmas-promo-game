import {Music} from './music.js';
import {C} from './content.js';

// Numeric score is fetched with this module only when Sorting Office plays.
export const sortingScore={
phrase:[
 [67,1],[67,1],[67,1],[69,1], [67,1],[67,1],[62,2],
 [64,1],[62,1],[64,1],[66,1], [67,2],[67,2],
 [67,1],[67,1],[67,1],[69,1], [67,1],[67,1],[62,2],
 [64,1],[62,1],[64,1],[66,1], [67,2],[67,2],
 [74,1],[72,1],[71,1],[69,1], [71,1],[69,1],[67,2],
 [64,1],[62,1],[64,1],[66,1], [67,2],[67,2],
 [62,1],[62,1],[64,1],[66,1], [67,1],[67,1],[69,2],
 [74,1],[72,1],[71,1],[69,1], [67,2],[72,2], [67,4]],
 chords:[[43,47,50],[43,47,50],[48,52,55],[43,47,50],
 [43,47,50],[43,47,50],[48,52,55],[43,47,50],
 [48,52,55],[43,47,50],[48,52,55],[43,47,50],
 [50,54,57],[43,47,50],[50,54,57],[48,52,55],[43,47,50]]};

// A separate, duckable band bus shares the decoded bank and AudioContext with cues.
// The score runs on the audio clock; sorting inputs never advance its notes.
export class SortingMusic {
  constructor(music){this.music=music;this.band=null;this.step=0;this.nextAt=0;this.hidden=false;this.liftUntil=0;this.stage=0;this.secondsPerBeat=60/C.sorting.music.bpm;}
  ready(){
    const m=this.music;if(m.state!=='ready'||!m.context)return false;
    if(!this.band){
      const band=this.band=new Music(m.enabled);band.context=m.context;band.samples=m.samples;band.kit=m.kit;band.state='ready';
      band.bus=m.context.createGain();band.bus.gain.value=0;band.bus.connect(m.bus);
    }
    return true;
  }
  clear(){if(this.band){for(const voice of this.band.voices){try{voice.stop();}catch{}}this.band.voices.clear();}this.nextAt=0;}
  suspend(){this.hidden=true;this.clear();this.music.hush();}
  resume(){this.hidden=false;this.music.unlock();}
  update(stage,duck=false){
    const m=this.music;
    if(this.hidden||!m.enabled()){this.clear();return;}
    if(!this.ready()||m.context.state!=='running')return;
    const now=m.context.currentTime;
    if(stage!==this.stage){this.stage=stage;this.liftUntil=now+.65;}
    const gain=this.band.bus.gain,level=(duck||now<this.liftUntil)? .14 : .65;
    if(this.level!==level){gain.cancelScheduledValues(now);gain.setTargetAtTime(level,now,.08);this.level=level;}
    if(!this.nextAt||this.nextAt<now-.2)this.nextAt=now+.025;
    while(this.nextAt<now+.18){
      // Tempo changes on bar boundaries, preserving the scheduled phrase and groove.
      if(this.step%8===0)this.secondsPerBeat=60/Math.min(C.sorting.music.maxBpm,C.sorting.music.bpm+(stage-1)*C.sorting.music.stageBpm);
      this.schedule(this.step,this.nextAt-now,stage);
      this.step++;this.nextAt+=this.secondsPerBeat/2;
    }
  }
  schedule(step,delay,stage){
    if(!this.ready())return;
    const song=sortingScore,loop=song.chords.length*8,index=step%loop,bar=Math.floor(index/8),beat=Math.floor(index/2),half=index%2,variation=Math.floor(step/loop)%3,b=this.band,chord=song.chords[bar],quarter=this.secondsPerBeat;
    let at=0;
    for(const [midi,length] of song.phrase){if(at*2===index)b.sample(midi,variation===1?'ribbon':'fold',delay,.75,quarter*length*.96);at+=length;}
    b.drum('shaker',delay,half?.045:.065);
    if(!half){
      b.sample(chord[0]+(beat%2?7:0),'bass',delay,.40,quarter*.85);
      b.drum(beat%4===0?'kick':'snare',delay,beat%4===0?.14:.075);
      if(beat%4===0){for(const pitch of chord)b.sample(pitch+12,'ribbon',delay,.13,quarter*3.7);}
      else for(const pitch of chord)b.sample(pitch+12,'tape',delay,.105,quarter*.65);
    }
    // Alternate verse textures; upper pizzicato answers on offbeats in later stages.
    if(half&&stage>=3&&variation!==1)b.sample(chord[1]+12+(variation===2?12:0),'tape',delay,.085,quarter*.4);
    if(stage>=5&&index%8===0)for(const pitch of chord)b.play(b.kit.pad,pitch+12,60,delay,.025,quarter*4);
  }
  dispose(){this.clear();this.band?.bus.disconnect();}
}
