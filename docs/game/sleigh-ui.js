import {C} from './content.js';
import {escapeHTML as e,fmt} from './engine.js';
import {character,house,landscape} from './art.js';
import {GameFeedback} from './game-feedback.js';
import {hop,releaseHop,tickSleigh,acknowledgeSleigh} from './sleigh.js';
import {roadObject,roadGuide} from './sleigh-art.js';
const S=C.sleigh;
export function sleighPlayView(){return `<div class="play-heading"><h1>${e(S.title)}</h1><button id="sleigh-pause" class="small-button">${e(C.app.pause)}</button></div><div class="sleigh-hud"><strong id="sleigh-score"></strong><span id="sleigh-stack"></span></div><label id="sleigh-progress"></label><progress id="sleigh-bronze" max="${S.medalsAt[0]}" value="0"></progress><div class="sleigh-road"><canvas id="sleigh-canvas" width="640" height="800" role="img" aria-label="${e(S.road)}"></canvas><div id="sleigh-overlay"></div></div><p id="sleigh-message" role="status"></p><p class="sleigh-controls">${e(S.controls)}</p><p class="sleigh-controls keyboard-help">${e(S.keyboard)}</p>`;}
function sprite(markup){const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);return img;}
export function activateSleigh(root,r,{music,finish,home,towerBest=0}){
 const $=s=>root.querySelector(s),canvas=$('#sleigh-canvas'),ctx=canvas.getContext('2d'),cues=new GameFeedback(music),pip=sprite(character('note')),town=sprite(landscape()),houses=[0,1,2,3].map(i=>sprite(house(i))),objects=Object.fromEntries(Object.keys(S.objects).map(kind=>[kind,sprite(roadObject(kind))]));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let frame,last=performance.now(),paused=false,shown=0,flash=0,squash=0,toss=0,pop=0,perfectFlash=false,disposed=false,soundtrack=null;
 music.load();
 import('./sleigh-music.js').then(({SleighMusic})=>{if(!disposed){soundtrack=new SleighMusic(music);if(paused||r.card)soundtrack.suspend();}}).catch(()=>{});
 function overlay(isPause=false){soundtrack?.suspend();releaseHop(r);const c=S.stages[r.stage-1],kind=r.practice?S.practiceSteps[r.practicePassed]:c.kind;shown=`${r.stage}:${r.practicePassed}`;
 const kinds=kind==='mixed'||kind==='speed'?['fence','arch','gap']:[kind];
 $('#sleigh-overlay').innerHTML=`<div class="pause-backdrop"><section class="pause-card" role="dialog" aria-modal="true" aria-labelledby="sleigh-card-title"><h2 id="sleigh-card-title">${e(isPause?C.app.paused:r.practice?S.practice:S.title)}</h2>${isPause?'':`${!r.practice&&r.stage>1?`<p>${e(S.faster)} ${e(C.sorting.streets[(r.stage-1)%C.sorting.streets.length].name)}</p>`:''}<div class="sleigh-rule-picture">${kinds.map(k=>roadObject(k,{card:true})).join('')}</div><p>${e(r.practice?S.objects[kind].action:c.rule)}</p>${r.practice?`<p>${e(S.practiceIntro)}</p>`:''}`}<button id="sleigh-continue" class="primary full">${e(isPause?C.app.resume:S.continue)}</button>${isPause?`<button id="sleigh-guide" class="secondary full">${e(S.guide)}</button><button data-action="sound" class="secondary full" aria-pressed="${music.enabled()}">${e(music.enabled()?C.app.soundOn:C.app.soundOff)}</button><button id="sleigh-home" class="secondary full">${e(C.app.home)}</button>`:''}</section></div>`;$('#sleigh-continue').focus();
 }
 function guide(){paused=true;soundtrack?.suspend();music.hush();releaseHop(r);$('#sleigh-overlay').innerHTML=`<div class="pause-backdrop"><div class="pause-card road-guide-card" role="dialog" aria-modal="true">${roadGuide()}</div></div>`;$('#sleigh-guide-close').focus();}
 function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
 function box(x,y,size=20,index=0){rect(x,y,size,size,'#29283d');rect(x+2,y+2,size-4,size-4,['#d64968','#5676b8','#3d9e97','#b96dba','#e88b4d','#75a54c'][index%6]);rect(x+size*.43,y,4,size,'#f4c766');rect(x,y+size*.42,size,4,'#f4c766');}
 function draw(){
 const h=400,ground=322,street=C.sorting.streets[(r.stage-1)%C.sorting.streets.length];ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;rect(0,0,320,h,'#bde5ec');
 if(town.complete&&town.naturalWidth)ctx.drawImage(town,0,0,320,180);
 const offset=reduced?0:r.distance*.18%120;
 for(let i=-1;i<4;i++){const img=houses[(i+5+r.stage-1)%4];if(img.complete&&img.naturalWidth)ctx.drawImage(img,i*120-offset,140,110,155);}
 rect(0,292,320,30,'#f4fbff');rect(0,ground,320,78,street.color);rect(0,ground,320,5,'#734d45');
 for(let i=0;i<(perfectFlash?24:12);i++)rect(i*38-(reduced?0:r.distance%38),357,20,3,'#b69069');
 rect(170,82,144,30,street.color);ctx.font='bold 11px monospace';ctx.fillStyle='#29283d';ctx.fillText(street.name,176,101);
 for(const o of r.objects){
 const img=objects[o.kind==='catch'?'gift':o.kind];
 const w=o.kind==='arch'?S.tuning.garlandWidth+124:120;
 if(img?.complete&&img.naturalWidth)ctx.drawImage(img,o.x-w/2,ground-160-(o.kind==='gift'||o.kind==='catch'?o.y:0),w,180);
 if(o.kind==='door'){
  rect(o.x-42,ground-4,84,14,street.color);
  rect(o.x-o.width/2,ground-5,o.width,7,'#f4c766');rect(o.x-o.width*S.tuning.perfectFraction/2,ground-4,o.width*S.tuning.perfectFraction,4,'#fff3d6');
  if(o.marker){const x=o.x-(o.speed||S.tuning.doorSpeed)*(2*S.tuning.hop/S.tuning.gravity-1/120);ctx.globalAlpha=Math.max(.25,1-r.delivered/S.tuning.markerDeliveries);rect(x-3,ground-3,6,9,'#fff3d6');ctx.font='bold 11px monospace';ctx.fillStyle='#734d45';ctx.fillText(S.hopHere,Math.max(3,x-27),ground+24);ctx.globalAlpha=1;}
 }
 if(o.hint){const label=S.objects[o.kind].hint;ctx.font='bold 12px monospace';const w=ctx.measureText(label).width+12,x=Math.max(2,Math.min(318-w,o.x-w/2));rect(x,ground-174,w,20,'#fff3d6');ctx.fillStyle='#29283d';ctx.fillText(label,x+6,ground-160);}
 }
 const y=ground-r.y;ctx.save();ctx.translate(80,y);if(!reduced)ctx.scale(1+squash*.12,1-squash*.15);
 rect(-25,-27,50,20,'#29283d');rect(-23,-25,46,16,'#a82947');rect(-29,-31,58,6,'#edc45d');rect(-33,-25,9,4,'#734d45');
 for(let i=0;i<2;i++){rect(-21+i*31,-7,12,12,'#29283d');rect(-18+i*31,-4,6,6,'#edc45d');}
 for(let i=0;i<r.gifts;i++){const wobble=reduced?0:Math.sin(r.elapsed*7+i*.6)*Math.min(i*.4,2);box(-5+(i%2)*19+wobble,-42-Math.floor(i/2)*18,(i===r.gifts-1?19+pop*2:19),i);}
 if(pip.complete&&pip.naturalWidth)ctx.drawImage(pip,-42,-66,34,40);
 if(towerBest>0){rect(29,-85,3,58,'#734d45');rect(32,-85,38,19,'#edc45d');ctx.font='bold 11px monospace';ctx.fillStyle='#29283d';ctx.fillText(String(towerBest),35,-71);}
 ctx.restore();
 if(toss>0){const t=1-toss/.65,x=80+((r.deliveryX||110)-80)*t,y=ground-70-4*65*t*(1-t);box(x-8,y,16);}
 if(flash>0){ctx.font='bold 24px monospace';ctx.fillStyle='#a82947';ctx.fillText('✦ +1 ✦',102,220);if(!reduced)for(let i=0;i<(perfectFlash?24:12);i++)rect(80+(i*23)%160,170+(i*17+flash*65)%110,perfectFlash?8:5,perfectFlash?8:5,['#edc45d','#da4962','#28655b'][i%3]);}
 if(r.complete&&!r.practice){ctx.font='bold 24px monospace';ctx.fillStyle='#a82947';ctx.fillText('✹',60,ground-40);}
 }
 function paint(){const f=(s,v)=>{const el=$(s);if(el.textContent!==v)el.textContent=v;};f('#sleigh-score',fmt(S.record,{count:r.delivered}));f('#sleigh-stack',fmt(S.stack,{count:r.gifts,max:S.tuning.maxGifts}));f('#sleigh-progress',r.practice?S.practiceIntro:fmt(S.progress,{count:r.delivered,goal:S.medalsAt[0]}));$('#sleigh-bronze').value=r.delivered;draw();}
 function down(event){if(event.target.closest('button')||paused||r.card)return;event.preventDefault();music.unlock();cues.effect(hop(r)?'boing':'pop',.6);}
 function up(){releaseHop(r);}
 function pause(){if(paused||disposed)return;paused=true;soundtrack?.suspend();music.hush();overlay(true);}
 function key(event){if(event.code==='Space'||event.code==='ArrowUp'){event.preventDefault();if(!event.repeat)down(event);}else if(event.key==='Escape')pause();}
 function keyup(event){if(['Space','ArrowUp'].includes(event.code))up();}
 function click(event){if(event.target.closest('#sleigh-continue')){music.unlock();soundtrack?.resume();acknowledgeSleigh(r);paused=false;last=performance.now();$('#sleigh-overlay').innerHTML='';cues.effect('pop',.4);}else if(event.target.closest('#sleigh-guide'))guide();else if(event.target.closest('#sleigh-guide-close'))overlay(true);else if(event.target.closest('#sleigh-pause'))pause();else if(event.target.closest('#sleigh-home'))home();}
 function hidden(){if(document.hidden)pause();}
 function context(event){event.preventDefault();}
 function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&!r.card){tickSleigh(r,dt);flash=Math.max(0,flash-dt);squash=Math.max(0,squash-dt*5);toss=Math.max(0,toss-dt);pop=Math.max(0,pop-dt*4);
 for(const event of r.events.splice(0)){const line=event==='hit'?(r.practice?S.practiceRetry:S.objects[r.lastHit].hit+(r.lastHit==='arch'?'':' '+S.messages.hit)):event==='pattern'?r.patternName:S.messages[event];if(line)$('#sleigh-message').textContent=line;if(['catch','pickup'].includes(event)){cues.effect('pop',.65);pop=reduced?0:1;}if(event==='hit')cues.oops();if(event==='perfect'){perfectFlash=true;flash=2.3;pop=1;cues.combo();}if(event==='deliver'){perfectFlash=false;flash=1.5;toss=reduced?0:.65;cues.combo();}if(event==='land')squash=1;if(event==='crash')cues.wrong();}
 if(r.card&&shown!==`${r.stage}:${r.practicePassed}`)overlay();
 }soundtrack?.update(r.stage+(r.stage===8?Math.floor((r.elapsed-r.stageAt)/45):0),paused||r.card||r.complete);paint();if(r.complete){if(r.practice){finish(r);return;}if(!r.crashAt)r.crashAt=now;if(now-r.crashAt>650){finish(r);return;}}frame=requestAnimationFrame(tick);}
 root.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);root.addEventListener('click',click);root.addEventListener('contextmenu',context);document.addEventListener('keydown',key);document.addEventListener('keyup',keyup);document.addEventListener('visibilitychange',hidden);overlay();paint();frame=requestAnimationFrame(tick);
 return ()=>{disposed=true;soundtrack?.dispose();cancelAnimationFrame(frame);music.hush();root.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);root.removeEventListener('click',click);root.removeEventListener('contextmenu',context);document.removeEventListener('keydown',key);document.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',hidden);};
}
