import {BUILD_ID,SITE_ROOT} from './build-info.js';
export {BUILD_ID};
export const safeView=(view,{hidden=false,modal=false,editing=false}={})=>!hidden&&!modal&&!editing&&['hub','wrap','sorting','tower','collection','gift'].includes(view);
export async function publishedBuild(fetcher=fetch){
 const options={cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)};
 const probeURL=new URL('.update-check/'+crypto.randomUUID(),SITE_ROOT);
 // Also bypass the worker shipped before update-check support existed.
 probeURL.searchParams.set('host-time','update-check');
 const probe=await fetcher(probeURL,options);
 if((!probe.ok&&probe.status!==404)||Number(probe.headers.get('age')||0)>0)throw Error('Cached update probe');
 const marker=(await probe.text()).match(/name="tuneville-build" content="([a-f0-9]{20})"/);
 if(marker)return marker[1];
 // Hosts without custom 404 support must honor revalidation/no-store on build.json.
 const response=await fetcher(new URL('build.json?host-time=update-check&update-check='+crypto.randomUUID(),SITE_ROOT),options);
 if(!response.ok||Number(response.headers.get('age')||0)>0)throw Error('Unavailable build');
 const {id}=await response.json();if(!/^[a-f0-9]{20}$/.test(id))throw Error('Invalid build');return id;
}
export class UpdateCheck {
 constructor({running=BUILD_ID,discover=publishedBuild,safe,prepare,notice,beforeReload=()=>{},hide=()=>{},reload=url=>location.replace(url),url=()=>location.href,storage,delay=1600}){
  Object.assign(this,{running,discover,safe,prepare,notice,beforeReload,hide,reload,url,storage,delay});this.attempted=new Set();this.pending=null;this.busy=false;
 }
 async check(){if(this.checking)return;this.checking=true;try{const id=await this.discover();if(id!==this.running)this.pending=id;else this.pending=null;}catch{}finally{this.checking=false;}this.consider();}
 async consider(){
  if(!this.pending||this.busy||!this.safe())return;
  const id=this.pending,key='tuneville-update-'+id;
  try{if(this.storage?.getItem(key))return;}catch{}
  if(this.attempted.has(id))return;
  this.busy=true;
  try{
   // Fetch the complete target into its own cache before navigating to it.
   await this.prepare(id);
   if(!this.safe()||this.pending!==id)return;
   this.notice();
   await new Promise(resolve=>setTimeout(resolve,this.delay));
   if(!this.safe()||this.pending!==id)return;
   const current=new URL(this.url());
   const target=new URL('releases/'+id+'/index.html',SITE_ROOT);target.search=current.search;target.hash=current.hash;
   this.beforeReload();
   this.attempted.add(id);try{this.storage?.setItem(key,'1');}catch{}
   this.reload(target.href);
  }catch{}finally{this.hide();this.busy=false;}
 }
}
export async function prepareBuild(id){
 const base=new URL('releases/'+id+'/',SITE_ROOT);
 const response=await fetch(new URL('manifest.json',base),{cache:'no-store'});
 if(!response.ok)throw Error('Deploy not ready');
 const manifest=await response.clone().json();if(manifest.id!==id)throw Error('Deploy not ready');
 const cache=await caches.open('tuneville-build-'+id);
 await cache.put(new URL('manifest.json',base),response);
 for(const path of manifest.files){
  const url=new URL(path,base);if(await cache.match(url))continue;
  const file=await fetch(url,{cache:'no-store'});if(!file.ok)throw Error('Incomplete deploy');
  const bytes=await file.clone().arrayBuffer();
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
  if(hash!==manifest.hashes[path])throw Error('Wrong build file');await cache.put(url,file);
 }
}
