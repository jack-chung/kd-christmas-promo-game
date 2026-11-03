// Only host-verified time can advance a date gate. Device wall time is never read.
const KEY='tuneville-host-time-v1';
export class TrustedClock {
  constructor({storage,fetcher=(...args)=>globalThis.fetch(...args),monotonic=()=>performance.now()}={}) {
    this.storage=storage;this.fetcher=fetcher;this.monotonic=monotonic;this.verified=0;this.online=false;this.anchor=0;
    try{const value=Number(storage?.getItem(KEY));if(Number.isFinite(value)&&value>0)this.verified=value;}catch{}
  }
  now(){
    const value=this.online?this.verified+Math.max(0,this.monotonic()-this.anchor):this.verified;
    // Persist observed elapsed time too, so a reload cannot close a verified game.
    try{this.storage?.setItem(KEY,String(value));}catch{}
    return value;
  }
  freeze(){this.verified=this.now();this.online=false;}
  async sync(){
    this.freeze();
    try {
      const url=new URL('./',globalThis.location?.href||'https://localhost/');
      url.searchParams.set('host-time',globalThis.crypto.randomUUID());
      const response=await this.fetcher(url,{method:'HEAD',cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)});
      const time=Date.parse(response.headers.get('date'));
      const age=Number(response.headers.get('age')||0);
      if(!response.ok||!Number.isFinite(time)||age>0)throw Error('Unverified host time');
      this.verified=Math.max(this.verified,time);this.anchor=this.monotonic();this.online=true;this.now();
    }catch {this.online=false;}
    return this.now();
  }
}
