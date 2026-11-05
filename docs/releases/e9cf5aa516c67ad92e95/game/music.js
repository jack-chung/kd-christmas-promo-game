// Wrap uses local CC0 instrument recordings; other game cues retain their original synthesis.
const BANK=new URL('./audio/sources.json',import.meta.url);
export class Music {
  constructor(enabled){this.enabled=enabled;this.context=null;this.voices=new Set();this.samples=[];this.state='idle';this.wrap=false;}
  prepare(){
    if(this.context)return this.context;
    this.context=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});
    const ctx=this.context;
    this.bus=ctx.createGain();this.bus.gain.value=.8;
    const limit=ctx.createDynamicsCompressor();
    limit.threshold.value=-6;limit.knee.value=6;limit.ratio.value=12;limit.attack.value=.003;limit.release.value=.12;
    this.bus.connect(limit);limit.connect(ctx.destination);
    // Original generated kit/pad buffers: no additional downloads or third-party sounds.
    this.kit={};
    for(const [name,seconds] of [['kick',.24],['shaker',.09],['snare',.14],['pad',2]]){
      const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*seconds),ctx.sampleRate),data=buffer.getChannelData(0);
      let seed=12345;
      for(let i=0;i<data.length;i++){
        const t=i/ctx.sampleRate;seed=(1664525*seed+1013904223)>>>0;
        const noise=seed/2147483648-1;
        data[i]=name==='kick'?Math.sin(2*Math.PI*(90*t+6*(1-Math.exp(-t*30))))*Math.exp(-t*22):
          name==='pad'?(Math.sin(2*Math.PI*261.625565*t)+.22*Math.sin(2*Math.PI*523.25113*t))*Math.min(1,t/.06)*Math.min(1,(seconds-t)/.18)*.45:
          noise*Math.exp(-t*(name==='shaker'?65:38))*.7;
      }
      this.kit[name]=buffer;
    }
    return ctx;
  }
  load(){
    if(this.loading)return this.loading;
    this.state='loading';
    this.loading=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
      try{
        const ctx=this.prepare(),response=await fetch(BANK,{signal:controller.signal});
        if(!response.ok)throw Error('Audio manifest unavailable');
        const manifest=await response.json();
        this.samples=await Promise.all(manifest.samples.map(async sample=>{
          const response=await fetch(new URL(sample.file,BANK),{signal:controller.signal});
          if(!response.ok)throw Error('Instrument unavailable');
          const buffer=await ctx.decodeAudioData(await response.arrayBuffer());
          return {...sample,buffer};
        }));
        this.state='ready';
      }catch{controller.abort();this.samples=[];this.state='failed';}
      finally{clearTimeout(timer);}
      return this.state;
    })();
    return this.loading;
  }
  play(buffer,midi,root,delay,level,duration){
    const ctx=this.context;if(!this.enabled()||!ctx||ctx.state==='closed'||!buffer)return;
    const at=ctx.currentTime+Math.max(0,delay),voice=ctx.createBufferSource(),gain=ctx.createGain();
    voice.buffer=buffer;voice.playbackRate.value=2**((midi-root)/12);
    const length=Math.min(duration||10,buffer.duration/voice.playbackRate.value);
    gain.gain.setValueAtTime(level,at);gain.gain.setValueAtTime(level,at+Math.max(0,length-.04));gain.gain.linearRampToValueAtTime(0,at+length);
    voice.connect(gain);gain.connect(this.bus);this.voices.add(voice);
    voice.onended=()=>{this.voices.delete(voice);voice.disconnect();gain.disconnect();};voice.start(at);voice.stop(at+length);
  }
  sample(midi,instrument,delay=0,volume=1,duration){
    const sample=this.samples.filter(s=>s.instrument===instrument).sort((a,b)=>Math.abs(a.midi-midi)-Math.abs(b.midi-midi))[0];
    if(sample)this.play(sample.buffer,midi,sample.midi,delay,volume*.65,duration||({fold:1.2,tape:.7,ribbon:1.7,bow:1.5,bass:.55}[instrument]));
  }
  drum(name,delay,volume){this.play(this.kit?.[name],60,60,delay,volume);}
  unlock(){
    if(!this.enabled())return;
    try {this.prepare();this.context.resume().catch(()=>{});}catch {/* Visual play remains available. */}
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
    if(this.wrap){this.sample(midi,instrument,delay,volume);return;}
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
    if(delay<-.08||!this.enabled()||this.state!=='ready')return;
    if(index<0){this.drum('shaker',delay,.38);return;}
    const beatIndex=Math.floor(index/2),half=index%2;
    const chord=song.chords[Math.floor(beatIndex/song.meter)%song.chords.length];
    this.drum('shaker',delay,half?.075:.10);
    if(half===0){
      this.sample(chord[0]+(beatIndex%2?7:0),'bass',delay,.48);
      this.drum(beatIndex%song.meter===0?'kick':'snare',delay,.18);
      if(beatIndex%song.meter===0){
        for(const pitch of chord){
          this.sample(pitch+12,'ribbon',delay,.18,beat/1000*song.meter);
          this.play(this.kit.pad,pitch+12,60,delay,.055,beat/1000*song.meter);
        }
      }else for(const pitch of chord)this.sample(pitch+12,'tape',delay,.12,.35);
    }
  }
  automatic(event,target){
    const delay=(target-performance.now())/1000-this.latency;
    if(delay>=-.08)this.sample(event.midi,'ribbon',delay,.28);
  }
  hush(){for(const osc of this.voices){try{osc.stop();}catch{}}this.voices.clear();if(this.context?.state==='running')this.context.suspend().catch(()=>{});}
}
