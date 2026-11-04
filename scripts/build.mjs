import {readdir,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const digest=data=>createHash('sha256').update(data).digest('hex');
export const gameFile=path=>['index.html','boot.js','manifest.json'].includes(path)||/^game\/(?:[\w-]+\.(?:js|css)|audio\/[\w.-]+\.(?:wav|html|txt|md|json))$/.test(path);
export function releaseBudget(files,maxBytes){
 for(const path of Object.keys(files))if(!gameFile(path))throw Error('Non-game release file: '+path);
 const bytes=Object.values(files).reduce((sum,data)=>sum+Buffer.byteLength(data),0);
 if(bytes>maxBytes)throw Error(`Release size ${bytes} exceeds budget ${maxBytes}`);
 return bytes;
}
export const retainedReleases=(current,previous,count)=>[current,...previous.filter(id=>id!==current)].slice(0,count);
export async function build(check=false,root=projectRoot){
 const read=path=>readFile(root+path);
 async function walk(dir){const out=[];for(const e of await readdir(root+dir,{withFileTypes:true})){const path=dir+e.name;if(e.isDirectory())out.push(...await walk(path+'/'));else out.push(path);}return out.sort();}
 const config=JSON.parse(await read('scripts/build-config.json'));
 const files=await walk('docs/game/');
 const inputs=[...files,'scripts/build.mjs','scripts/build-config.json','scripts/index.html','scripts/sw.js'].sort();
 const hashes={};for(const path of inputs)hashes[path]=digest(await read(path));
 const id=digest(JSON.stringify(hashes)).slice(0,20),prefix=`releases/${id}/`;
 const html=(await read('scripts/index.html')).toString().replace('BUILD_SCRIPT',prefix+'boot.js');
 const entry=html.replace(prefix+'boot.js','boot.js');
 const boot=`const base=new URL('.',import.meta.url);\nconst home=new URL('../../',base);\nif(location.pathname.includes('/releases/'))history.replaceState(null,'',home.pathname+location.search+location.hash);\nconst link=document.createElement('link');link.rel='stylesheet';link.href=new URL('game/style.css',base);document.head.append(link);\nawait new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=reject;});\nawait import(new URL('game/app.js',base));\n`;
 const info=`export const BUILD_ID=${JSON.stringify(id)};\nexport const SITE_ROOT=new URL('../../../',import.meta.url);\n`;
 const contents={'index.html':entry,'boot.js':boot,'game/build-info.js':info};
 for(const path of files.filter(p=>p!=='docs/game/build-info.js'))contents[path.slice(5)]=await read(path);
 const published={id,files:Object.keys(contents),hashes:Object.fromEntries(Object.entries(contents).map(([path,bytes])=>[path,digest(bytes)]))};
 const manifest=JSON.stringify(published)+'\n';contents['manifest.json']=manifest;
 releaseBudget(contents,config.maxReleaseBytes);
 const previous=JSON.parse(await read('docs/releases.json').catch(()=> '[]'));
 const dirs=await readdir(root+'docs/releases').catch(()=>[]);
 // Only game-only, in-budget snapshots are eligible. This also removes pre-slim releases.
 const eligible=[];
 for(const old of previous){if(!/^[a-f0-9]{20}$/.test(old)||!dirs.includes(old))continue;
  const paths=await walk('docs/releases/'+old+'/'),saved={};
  for(const path of paths)saved[path.slice(('docs/releases/'+old+'/').length)]=await read(path);
  try{releaseBudget(saved,config.maxReleaseBytes);eligible.push(old);}catch{}
 }
 const keep=retainedReleases(id,eligible,config.keepReleases);
 const sw=(await read('scripts/sw.js')).toString().replace('BUILD_MANIFEST',JSON.stringify(published));
 const outputs={'docs/index.html':html,'docs/build.json':manifest,'docs/releases.json':JSON.stringify(keep)+'\n','docs/404.html':`<!doctype html><meta name="tuneville-build" content="${id}">\n`,'docs/sw.js':sw};
 for(const [path,bytes] of Object.entries(contents))outputs['docs/'+prefix+path]=bytes;
 if(check){
  for(const [path,value] of Object.entries(outputs))if(!Buffer.from(await read(path).catch(()=> '')).equals(Buffer.from(value)))throw Error(`Stale build: ${path}; run npm run build`);
  if(dirs.length!==keep.length||dirs.some(dir=>!keep.includes(dir)))throw Error('Stale release retention; run npm run build');
  for(const dir of keep){
   const paths=await walk('docs/releases/'+dir+'/'),saved={};
   for(const path of paths)saved[path.slice(('docs/releases/'+dir+'/').length)]=await read(path);
   releaseBudget(saved,config.maxReleaseBytes);
   const prior=JSON.parse(saved['manifest.json']);
   if(prior.id!==dir)throw Error('Wrong historical build id');
   if(Object.keys(saved).length!==prior.files.length+1)throw Error('Unexpected immutable release files');
   for(const path of prior.files)if(!saved[path]||digest(saved[path])!==prior.hashes[path])throw Error('Modified immutable release: '+dir+'/'+path);
  }
 }else{
  for(const [path,value] of Object.entries(outputs)){await mkdir(root+path.slice(0,path.lastIndexOf('/')),{recursive:true});await writeFile(root+path,value);}
  for(const dir of dirs)if(!keep.includes(dir))await rm(root+'docs/releases/'+dir,{recursive:true});
 }
 return id;
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(await build(process.argv.includes('--check')));
