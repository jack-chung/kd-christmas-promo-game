const base=new URL('.',import.meta.url);
const home=new URL('../../',base);
if(location.pathname.includes('/releases/'))history.replaceState(null,'',home.pathname+location.search+location.hash);
const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('game/style.css',base);document.head.append(link);
await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=reject;});
await import(new URL('game/app.js',base));
