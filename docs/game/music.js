// Original synthesized arrangement. No downloaded recordings or musical content.
export class Music {
  constructor(enabled){this.enabled=enabled;this.context=null;this.voices=new Set();}
  unlock(){
    if(!this.enabled())return;
    try {this.context ||= new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});this.context.resume().catch(()=>{});}catch {/* Visual play remains available. */}
  }
  // Place backing attacks on the visual beat at the speaker, rather than the render clock.
  get latency(){
    const ctx=this.context;if(!ctx)return 0;
    const stamp=ctx.getOutputTimestamp?.();
    if(stamp?.contextTime>0&&stamp.performanceTime>0){
      const ahead=ctx.currentTime-(stamp.contextTime+(performance.now()-stamp.performanceTime)/1000);
      if(ahead>=0&&ahead<.5)return ahead;
    }
    return Math.min(.3,(ctx.baseLatency||0)+(ctx.outputLatency||0));
  }
  tone(midi,instrument='bow',delay=0,volume=1){
    // A gesture can resume asynchronously: queue its note at the paused audio clock
    // so the first tap still sounds as soon as the device opens its audio output.
    const ctx=this.context;if(!this.enabled()||!ctx||ctx.state==='closed')return;
    const at=ctx.currentTime+Math.max(0,delay),hz=440*2**((midi-69)/12);
    const settings={fold:['triangle',.13,.2],tape:['sawtooth',.075,.09],ribbon:['triangle',.48,.14],bow:['sine',.65,.19],bass:['sine',.32,.12],pulse:['triangle',.045,.045]};
    const [type,duration,level]=settings[instrument]||settings.bow;
    const partials=instrument==='bow'?[[1,1],[2.99,.24],[5.02,.1]]:instrument==='fold'?[[1,1],[2,.35]]:[[1,1]];
    for(const [multiple,strength] of partials){
      const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
      osc.type=type;osc.frequency.setValueAtTime(hz*multiple,at);
      filter.type='lowpass';filter.frequency.value=instrument==='tape'?1800:instrument==='ribbon'?2600:7000;
      gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(level*volume*strength,at+(instrument==='ribbon'?.018:.003));gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
      osc.connect(filter);filter.connect(gain);gain.connect(ctx.destination);this.voices.add(osc);
      osc.onended=()=>{this.voices.delete(osc);gain.disconnect();filter.disconnect();};osc.start(at);osc.stop(at+duration+.02);
    }
  }
  backing(song,beat,index,target){
    const delay=(target-performance.now())/1000-this.latency;
    if(delay<-.08)return;
    this.tone(song.bass[Math.floor(index/4)%song.bass.length],index%2===0?'bass':'pulse',delay,index%4===0?1:.65);
  }
  hush(){for(const osc of this.voices){try{osc.stop();}catch{}}this.voices.clear();if(this.context?.state==='running')this.context.suspend().catch(()=>{});}
}
