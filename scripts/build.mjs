import {readdir,readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const digest=data=>createHash('sha256').update(data).digest('hex');
async function walk(dir){const out=[];for(const e of await readdir(root+dir,{withFileTypes:true})){if(dir==='docs/'&&['releases','build.json','404.html','index.html','sw.js'].includes(e.name))continue;const path=dir+e.name;if(e.isDirectory())out.push(...await walk(path+'/'));else out.push(path);}return out.sort();}
export async function build(check=false){
 const files=await walk('docs/');
 const inputs=[...files,'scripts/build.mjs','scripts/index.html','scripts/sw.js'].sort();
 const hashes={};for(const path of inputs)hashes[path]=digest(await readFile(root+path));
 const id=digest(JSON.stringify(hashes)).slice(0,20);
 const prefix=`releases/${id}/`;
 const html=(await readFile(root+'scripts/index.html','utf8')).replace('BUILD_SCRIPT',prefix+'boot.js');
 const entry=html.replace(prefix+'boot.js','boot.js');
 const boot=`const base=new URL('.',import.meta.url);\nconst home=new URL('../../',base);\nif(location.pathname.includes('/releases/'))history.replaceState(null,'',home.pathname+location.search+location.hash);\nconst link=document.createElement('link');link.rel='stylesheet';link.href=new URL('game/style.css',base);document.head.append(link);\nawait new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=reject;});\nawait import(new URL('game/app.js',base));\n`;
 const info=`export const BUILD_ID=${JSON.stringify(id)};\nexport const SITE_ROOT=new URL('../../../',import.meta.url);\n`;
 const published={id,files:['index.html','boot.js','game/build-info.js',...files.filter(p=>p!=='docs/game/build-info.js').map(p=>p.slice(5))]};
 published.hashes=Object.fromEntries(files.filter(p=>p!=='docs/game/build-info.js').map(p=>[p.slice(5),hashes[p]]));
 published.hashes['index.html']=digest(entry);published.hashes['boot.js']=digest(boot);published.hashes['game/build-info.js']=digest(info);
 const sw=(await readFile(root+'scripts/sw.js','utf8')).replace('BUILD_MANIFEST',JSON.stringify(published));
 const outputs={'docs/index.html':html,'docs/build.json':JSON.stringify(published)+'\n',[`docs/${prefix}manifest.json`]:JSON.stringify(published)+'\n','docs/404.html':`<!doctype html><meta name="tuneville-build" content="${id}">\n`,'docs/sw.js':sw,[`docs/${prefix}index.html`]:entry,[`docs/${prefix}boot.js`]:boot,[`docs/${prefix}game/build-info.js`]:info};
 if(check){
  for(const [path,value] of Object.entries(outputs))if(await readFile(root+path,'utf8').catch(()=>'')!==value)throw Error(`Stale build: ${path}; run npm run build`);
  // Published history is immutable too; reject edits rather than silently recaching it.
  for(const dir of await readdir(root+'docs/releases')){
   const saved=JSON.parse(await readFile(root+'docs/releases/'+dir+'/manifest.json'));
   if(saved.id!==dir)throw Error('Wrong historical build id');
   for(const [path,hash] of Object.entries(saved.hashes))if(digest(await readFile(root+'docs/releases/'+dir+'/'+path))!==hash)throw Error('Modified immutable release: '+dir+'/'+path);
  }
  for(const path of files.filter(p=>p!=='docs/game/build-info.js'))if(digest(await readFile(root+`docs/${prefix}`+path.slice(5)).catch(()=>''))!==hashes[path])throw Error(`Stale shipped file: ${path}`);
 }else{
  for(const [path,value] of Object.entries(outputs)){await mkdir(root+path.slice(0,path.lastIndexOf('/')),{recursive:true});await writeFile(root+path,value);}
  for(const path of files.filter(p=>p!=='docs/game/build-info.js')){const dest=root+'docs/'+prefix+path.slice(5);await mkdir(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});await copyFile(root+path,dest);}
 }
 return id;
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(await build(process.argv.includes('--check')));
