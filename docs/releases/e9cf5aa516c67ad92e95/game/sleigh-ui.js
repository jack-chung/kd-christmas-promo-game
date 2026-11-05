import {C} from './content.js';
import {escapeHTML as e,fmt} from './engine.js';
import {character,house,landscape} from './art.js';
import {GameFeedback} from './game-feedback.js';
import {hop,releaseHop,tickSleigh,acknowledgeSleigh,sleighDials} from './sleigh.js';
const S=C.sleigh;
export function sleighPlayView(){return `<div class="play-heading"><h1>${e(S.title)}</h1><button id="sleigh-pause" class="small-button">${e(C.app.pause)}</button></div><div class="sleigh-hud"><strong id="sleigh-score"></strong><span id="sleigh-stack"></span></div><label id="sleigh-progress"></label><progress id="sleigh-bronze" max="${S.medalsAt[0]}" value="0"></progress><div class="sleigh-road"><canvas id="sleigh-canvas" width="640" height="800" role="img" aria-label="${e(S.road)}"></canvas><div id="sleigh-overlay"></div></div><p id="sleigh-message" role="status"></p><p class="sleigh-controls">${e(S.controls)}</p><p class="sleigh-controls keyboard-help">${e(S.keyboard)}</p>`;}
function sprite(markup){const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);return img;}
export function activateSleigh(root,r,{music,finish,home,towerBest=0}){
 const $=s=>root.querySelector(s),canvas=$('#sleigh-canvas'),ctx=canvas.getContext('2d'),cues=new GameFeedback(music),pip=sprite(character('note')),town=sprite(landscape()),houses=[0,1,2,3].map(i=>sprite(house(i)));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let frame,last=performance.now(),paused=false,shown=0,flash=0,squash=0,rumble=0,disposed=false;
 music.load();
 function overlay(isPause=false){releaseHop(r);const c=S.stages[r.stage-1];shown=r.stage;
 $('#sleigh-overlay').innerHTML=`<div class="pause-backdrop"><section class="pause-card" role="dialog" aria-modal="true" aria-labelledby="sleigh-card-title">${character('note')}<h2 id="sleigh-card-title">${e(isPause?C.app.paused:r.practice?S.practice:S.title)}</h2>${isPause?'':`<div class="sleigh-rule-icon" aria-hidden="true">${e(r.practice?'▥ ↑ ▣':c.icon)}</div><p>${e(r.practice?S.practiceIntro:c.rule)}</p>`}<button id="sleigh-continue" class="primary full">${e(isPause?C.app.resume:S.continue)}</button>${isPause?`<button data-action="sound" class="secondary full" aria-pressed="${music.enabled()}">${e(music.enabled()?C.app.soundOn:C.app.soundOff)}</button><button id="sleigh-home" class="secondary full">${e(C.app.home)}</button>`:''}</section></div>`;$('#sleigh-continue').focus();
 }
 function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
 function box(x,y,size=20){rect(x,y,size,size,'#29283d');rect(x+2,y+2,size-4,size-4,'#da4962');rect(x+size*.43,y,4,size,'#f4c766');rect(x,y+size*.42,size,4,'#f4c766');}
 function draw(){
 const h=400,ground=322,street=C.sorting.streets[Math.floor(r.elapsed/28)%C.sorting.streets.length];ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;rect(0,0,320,h,'#bde5ec');
 if(town.complete&&town.naturalWidth)ctx.drawImage(town,0,0,320,180);
 const offset=reduced?0:r.distance*.18%120;
 for(let i=-1;i<4;i++){const img=houses[(i+5+Math.floor(r.elapsed/28))%4];if(img.complete&&img.naturalWidth)ctx.drawImage(img,i*120-offset,140,110,155);}
 rect(0,292,320,30,'#f4fbff');rect(0,ground,320,78,'#d2ae7f');rect(0,ground,320,5,'#734d45');
 for(let i=0;i<12;i++)rect(i*38-(reduced?0:r.distance%38),357,20,3,'#b69069');
 rect(170,82,144,30,street.color);ctx.font='bold 11px monospace';ctx.fillStyle='#29283d';ctx.fillText(street.name,176,101);
 for(const o of r.objects){const x=o.x,w=o.width;
 if(o.kind==='fence'){rect(x-w/2,ground-30,w,7,'#a82947');for(let i=0;i<3;i++)rect(x-w/2+i*11,ground-35,5,35,'#fff3d6');}
 if(o.kind==='moving'){rect(x-18,ground-22,36,17,'#28655b');rect(x-22,ground-5,44,5,'#734d45');}
 if(o.kind==='gap'){rect(x-w/2,ground,w,20,'#734d45');rect(x-w/2+5,ground+4,w-10,13,'#29283d');}
 if(o.kind==='arch'){rect(x-w/2,ground-140,5,140,'#734d45');rect(x+w/2,ground-140,5,140,'#734d45');rect(x-w/2,ground-140,w,95,'#28655b');for(let i=0;i<4;i++)rect(x-w/2+i*12,ground-52,7,7,'#da4962');}
 if(['gift','catch'].includes(o.kind))box(x-10,ground-o.y-12);
 if(o.kind==='door'){rect(x-22,ground-95,44,90,'#734d45');rect(x-18,ground-90,36,85,'#28655b');if(pip.complete&&pip.naturalWidth)ctx.drawImage(pip,x-17,ground-60,34,40);rect(x-w/2,ground-3,w,6,'#f4c766');ctx.strokeStyle='#fff3d6';ctx.strokeRect(x-w/2,ground-4,w,8);}
 }
 const y=ground-r.y;ctx.save();ctx.translate(80,y);if(!reduced)ctx.scale(1+squash*.12,1-squash*.15);
 rect(-25,-27,50,20,'#29283d');rect(-23,-25,46,16,'#a82947');rect(-29,-31,58,6,'#edc45d');rect(-33,-25,9,4,'#734d45');
 for(let i=0;i<2;i++){rect(-21+i*31,-7,12,12,'#29283d');rect(-18+i*31,-4,6,6,'#edc45d');}
 for(let i=0;i<r.gifts;i++){const wobble=reduced?0:Math.sin(r.elapsed*7+i*.6)*Math.min(i*.7,3);box(-10+wobble,-51-i*19,21);}
 if(pip.complete&&pip.naturalWidth)ctx.drawImage(pip,-51,-66,32,38);
 if(towerBest>0){rect(24,-80,3,53,'#734d45');rect(27,-80,38,19,'#edc45d');ctx.font='bold 11px monospace';ctx.fillStyle='#29283d';ctx.fillText(String(towerBest),30,-66);}
 ctx.restore();
 if(flash>0){ctx.font='bold 24px monospace';ctx.fillStyle='#a82947';ctx.fillText('✦ +1 ✦',102,220);if(!reduced)for(let i=0;i<12;i++)rect(80+(i*23)%160,170+(i*17+flash*65)%110,5,5,['#edc45d','#da4962','#28655b'][i%3]);}
 if(r.complete&&!r.practice){ctx.font='bold 24px monospace';ctx.fillStyle='#a82947';ctx.fillText('✹',60,ground-40);}
 }
 function paint(){const f=(s,v)=>{const el=$(s);if(el.textContent!==v)el.textContent=v;};f('#sleigh-score',fmt(S.record,{count:r.delivered}));f('#sleigh-stack',fmt(S.stack,{count:r.gifts,max:S.tuning.maxGifts}));f('#sleigh-progress',r.practice?S.practiceIntro:fmt(S.progress,{count:r.delivered,goal:S.medalsAt[0]}));$('#sleigh-bronze').value=r.delivered;draw();}
 function down(event){if(event.target.closest('button')||paused||r.card)return;event.preventDefault();music.unlock();if(hop(r))cues.effect('boing',.6);}
 function up(){releaseHop(r);}
 function pause(){if(paused||disposed)return;paused=true;music.hush();overlay(true);}
 function key(event){if(event.code==='Space'||event.code==='ArrowUp'){event.preventDefault();if(!event.repeat)down(event);}else if(event.key==='Escape')pause();}
 function keyup(event){if(['Space','ArrowUp'].includes(event.code))up();}
 function click(event){if(event.target.closest('#sleigh-continue')){music.unlock();acknowledgeSleigh(r);paused=false;last=performance.now();$('#sleigh-overlay').innerHTML='';cues.effect('pop',.4);}else if(event.target.closest('#sleigh-pause'))pause();else if(event.target.closest('#sleigh-home'))home();}
 function hidden(){if(document.hidden)pause();}
 function context(event){event.preventDefault();}
 function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&!r.card){tickSleigh(r,dt);flash=Math.max(0,flash-dt);squash=Math.max(0,squash-dt*5);rumble+=dt;
 for(const event of r.events.splice(0)){const line=S.messages[event];if(line)$('#sleigh-message').textContent=line;if(['catch','pickup'].includes(event))cues.effect('pop',.65);if(event==='hit')cues.oops();if(event==='deliver'){flash=1.5;cues.combo();}if(event==='land')squash=1;if(event==='crash')cues.wrong();}
 if(rumble>.3){rumble=0;cues.effect('oops',.035);}if(r.card&&shown!==r.stage)overlay();
 }paint();if(r.complete){if(r.practice){finish(r);return;}if(!r.crashAt)r.crashAt=now;if(now-r.crashAt>650){finish(r);return;}}frame=requestAnimationFrame(tick);}
 root.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);root.addEventListener('click',click);root.addEventListener('contextmenu',context);document.addEventListener('keydown',key);document.addEventListener('keyup',keyup);document.addEventListener('visibilitychange',hidden);overlay();paint();frame=requestAnimationFrame(tick);
 return ()=>{disposed=true;cancelAnimationFrame(frame);music.hush();root.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);root.removeEventListener('click',click);root.removeEventListener('contextmenu',context);document.removeEventListener('keydown',key);document.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',hidden);};
}
