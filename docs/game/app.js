import { C as baseContent, episodeContent, hiddenTargets } from './content.js';
let episode=baseContent.episodes.find(ep=>ep.id===Number(new URLSearchParams(location.search).get('episode')))||baseContent.episodes[0];
let C=episodeContent(episode);
import {SAVE_KEY,freshSave,loadSave,writeSave,newProfile,nickname,fmt,escapeHTML as esc,dateOpen,episodeOpen,nextRelease,countdown,clock,grade,timing,rhythmAction,mysteryCode,mysteryComplete,stars,landing} from './engine.js';
import {character,gift,house,landscape,moveIcon,parcel} from './art.js';

const root=document.querySelector('#app');
document.title=C.app.title;
let storage;
try {storage=window.localStorage;}catch {storage=null;}
const loaded=loadSave(storage);
let save=loaded.save, storageOK=loaded.ok, profile=save.profile||newProfile();
let review=new URLSearchParams(location.search).get('review')==='1';
let view='', preview=false, dispose=()=>{}, run=null, tower=null, wrapResult=null, towerResult=null, caseResult=null, practice=0, futureEpisode=C.episodes[1], difficulty='tunie', toastTimer, mysteryAnchor=null;
if(episode.id!==1)Object.assign(save,save.episodeData[episode.id]||{wrapBest:0,mysteryBest:null,mystery:null});
const $=(selector)=>root.querySelector(selector);
const all=(selector)=>[...root.querySelectorAll(selector)];
const t=(key,values)=>esc(fmt(key,values));
const button=(text,action,cls='primary',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${esc(text)}</button>`;
const nav=(text,route,cls='primary',extra='')=>button(text,`go:${route}`,cls,extra);
const eyebrow=text=>`<p class="eyebrow">${esc(text)}</p>`;
const heading=(small,title,copy='')=>`${eyebrow(small)}<h1 tabindex="-1">${esc(title)}</h1>${copy?`<p class="intro">${esc(copy)}</p>`:''}`;
const status=()=>'<p class="feedback" id="feedback" role="status" aria-live="polite"></p>';
function persist(){save.episodeData[episode.id]={wrapBest:save.wrapBest,mysteryBest:save.mysteryBest,mystery:save.mystery};storageOK=writeSave(storage,save);const notice=$('#storage-notice');if(notice)notice.hidden=storageOK;}
function toast(message){const el=$('#toast');if(!el)return;clearTimeout(toastTimer);el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),2600);}
function feedback(message){const el=$('#feedback');if(el)el.textContent=message;}
const routes=new Set(['onboard','hub','wrap','wrapPractice','wrapOrder','wrapPlay','wrapGift','wrapResults','mystery','mysteryMap','hidden','cipher','riddle','mysteryCode','mysteryResults','tower','towerPlay','towerResults','gift','unwrap','collection','future','finale','finalReveal','certificate','invitation','review']);
const gated=new Set(['wrap','wrapPractice','wrapOrder','wrapPlay','wrapGift','wrapResults','mystery','mysteryMap','hidden','cipher','riddle','mysteryCode','mysteryResults','tower','towerPlay','towerResults']);

// One AudioContext, unlocked only by an intentional sound toggle or game-start gesture.
let audio=null;
const voices=new Set();
function unlockAudio(){
  if(!save.sound)return;
  try {audio ||= new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch {save.sound=false;persist();}
}
function note(when=0,accent=false){
  if(!save.sound||!audio||audio.state!=='running')return;
  const at=audio.currentTime+Math.max(0,when),osc=audio.createOscillator(),gain=audio.createGain();
  osc.type='sine';osc.frequency.setValueAtTime(accent?660:440,at);osc.frequency.exponentialRampToValueAtTime(accent?330:220,at+.07);
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.14,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+.11);
  osc.connect(gain);gain.connect(audio.destination);voices.add(osc);osc.onended=()=>{voices.delete(osc);gain.disconnect();};osc.start(at);osc.stop(at+.12);
}
function hush(){for(const osc of voices){try{osc.stop();}catch{}}voices.clear();if(audio&&audio.state==='running')audio.suspend().catch(()=>{});}

function checkpoint(){
  if(mysteryAnchor!==null&&save.mystery){save.mystery.elapsed+=Math.max(0,performance.now()-mysteryAnchor);mysteryAnchor=null;persist();}
}
function caseTime(){return (save.mystery?.elapsed||0)+(mysteryAnchor===null?0:Math.max(0,performance.now()-mysteryAnchor));}
function startClock(){
  if(!save.mystery)save.mystery={solved:[],found:[],hints:[],elapsed:0};
  if(!document.hidden)mysteryAnchor=performance.now();
  const tick=()=>{const el=$('#case-time');if(el)el.textContent=clock(caseTime());};tick();const id=setInterval(tick,250);
  return ()=>{clearInterval(id);checkpoint();};
}
function selectEpisode(next){
  dispose();dispose=()=>{};checkpoint();persist();
  episode=next;C=episodeContent(episode);
  Object.assign(save,save.episodeData[episode.id]||{wrapBest:0,mysteryBest:null,mystery:null});
  run=null;wrapResult=null;caseResult=null;practice=0;
  const url=new URL(location.href);if(episode.id===1)url.searchParams.delete('episode');else url.searchParams.set('episode',episode.id);
  history.replaceState(null,'',url);
}
function navigate(target,{demo=false}={}) {
  if(!routes.has(target))target='hub';
  dispose();dispose=()=>{};hush();
  preview=demo&&review;
  if(!save.profile&&!['onboard','invitation','review'].includes(target)){target='onboard';preview=false;}
  if(gated.has(target)&&!episodeOpen(episode,review)){futureEpisode=episode;target='future';}
  if(['finalReveal','certificate'].includes(target)&&!save.finale&&!preview)target='finale';
  if(target==='unwrap'&&!save.layers.includes(episode.id)&&!preview)target='gift';
  if(['wrapOrder','wrapPlay'].includes(target)&&!run){newWrap();}
  if(target==='wrapGift'&&!run?.results.length&&!preview)target='wrap';
  if(target==='wrapResults'&&!wrapResult&&!preview)target='wrap';
  if(target==='towerPlay'&&!tower)newTower();
  if(target==='towerResults'&&!towerResult&&!preview)target='tower';
  if(['mysteryMap','hidden','cipher','riddle','mysteryCode'].includes(target)&&!save.mystery)save.mystery={solved:[],found:[],hints:[],elapsed:0};
  if(target==='mysteryCode'&&!mysteryComplete(save.mystery)&&!preview)target='mysteryMap';
  if(target==='mysteryResults'&&!caseResult&&!preview)target='mystery';
  view=target;
  const hash=`#${target}`;if(location.hash!==hash)history.pushState(null,'',hash);
  render();window.scrollTo(0,0);$('h1')?.focus({preventScroll:true});
}
function render(){
  const p=save.profile||profile;
  const scenes={onboard:onboardView,hub:hubView,wrap:wrapView,wrapPractice:practiceView,wrapOrder:orderView,wrapPlay:wrapPlayView,wrapGift:wrapGiftView,wrapResults:wrapResultsView,mystery:mysteryView,mysteryMap:caseMapView,hidden:hiddenView,cipher:cipherView,riddle:riddleView,mysteryCode:codeView,mysteryResults:caseResultsView,tower:towerView,towerPlay:towerPlayView,towerResults:towerResultsView,gift:giftView,unwrap:unwrapView,collection:collectionView,future:futureView,finale:finaleView,finalReveal:finalRevealView,certificate:certificateView,invitation:invitationView,review:reviewView};
  root.innerHTML=`${review?`<div class="review-strip">${esc(C.review.active)} ${button(C.hub.review,'review-menu','text-button')}</div>`:''}
    <header class="topbar"><a href="#hub" class="brand" data-action="go:hub"><span class="brand-gift">${gift({small:true})}</span><span>${esc(C.app.title)}</span></a><div class="top-actions">${view!=='onboard'?nav(C.app.home,'hub','small-button'):''}${button(save.sound?C.app.soundOn:C.app.soundOff,'sound','small-button','aria-pressed="'+save.sound+'"')}</div></header>
    <main class="screen screen-${view}" id="main">${preview?`<p class="preview-label">${esc(C.review.preview)}</p>`:''}${scenes[view]()}</main>
    <footer class="footer"><p>${esc(C.app.privacy)}</p><p id="storage-notice" class="storage-notice" ${storageOK?'hidden':''}>${esc(C.app.storage)}</p><div>${nav(C.hub.invite,'invitation','text-button')}${nav(C.hub.review,'review','text-button')}<a href="art-direction/">${esc(C.hub.gallery)}</a></div><p class="preview-caption">${esc(C.app.preview)}</p></footer>
    <div id="toast" class="toast" role="status"></div><div id="modal-root"></div>`;
  if(view==='hub'){const id=setInterval(updateCountdown,1000);dispose=()=>clearInterval(id);updateCountdown();}
  if(view==='wrapPlay')activateWrap();
  if(view==='towerPlay')activateTower();
  if(['hidden','cipher','riddle','mysteryCode'].includes(view))dispose=startClock();
  if(view==='unwrap'||view==='finalReveal'){const id=setTimeout(()=>$('#unwrap-scene')?.classList.add('unwrapped'),80);dispose=()=>clearTimeout(id);}
}
function onboardView(){return `<div class="welcome-scene">${landscape()}<div class="welcome-party">${character('kid')}${gift()}${character('wrapper')}</div></div>${heading(C.app.brand,C.profile.title,C.profile.intro)}<div class="nameplate">${eyebrow(C.profile.nameLabel)}<strong id="nickname">${esc(nickname(profile))}</strong>${button(C.profile.shuffle,'shuffle','text-button')}</div><fieldset class="avatar-picker"><legend>${esc(C.profile.choose)}</legend>${C.profile.avatars.map(a=>`<label class="avatar-option"><input type="radio" name="avatar" value="${a.id}" ${profile.avatar===a.id?'checked':''}>${character(a.id)}<span>${esc(a.name)}</span></label>`).join('')}</fieldset>${button(C.profile.start,'profile','primary full')}`;}
function hubView(){return `${eyebrow(C.hub.eyebrow)}<div class="hub-heading"><div><p class="greeting">${t(C.hub.greeting,{name:nickname(save.profile)})}</p><h1 tabindex="-1">${esc(C.hub.title)}</h1></div>${character(save.profile.avatar)}</div><p class="intro">${esc(C.hub.intro)}</p><section class="village" aria-label="${esc(C.app.title)}">${landscape()}<div class="village-houses">${C.episodes.map((ep,i)=>`<button class="house ${dateOpen(ep.date,review)?'':'locked'}" data-action="episode:${ep.id}" aria-label="${t(C.hub.house,{number:ep.house})}: ${esc(episodeOpen(ep,review)?fmt(C.hub.playEpisode,{number:ep.id}):ep.ready?fmt(C.hub.locked,{date:ep.label}):C.hub.coming)}">${house(i,!dateOpen(ep.date,review))}<span class="house-number">${ep.house}</span><span class="house-date">${esc(ep.label)}</span></button>`).join('')}<button class="house finale-house" data-action="go:finale" aria-label="${esc(C.finale.title)}">${house(2,!dateOpen(C.finale.date,review))}<span class="house-number">${C.finale.house}</span><span class="house-date">${esc(C.gift.finale)}</span></button></div><button class="village-gift" data-action="go:gift">${gift({paper:save.paper})}<span>${esc(C.hub.viewGift)}</span><small>${t(C.hub.layerCount,{count:save.layers.length})}</small></button><div class="village-cast">${character('wrapper')}${character('kid')}${character('note')}</div></section><div class="countdown-card"><span>${esc(C.hub.next)}</span><strong id="countdown"></strong></div>${eyebrow(C.hub.choose)}<p class="subtle">${t(C.hub.selectedEpisode,{number:episode.id,date:episode.label})}</p><div class="adventures">${adventure('wrap','01','wrapper',C.hub.wrap,C.hub.wrapSub)}${adventure('mystery','02','kid',C.hub.mystery,C.hub.mysterySub)}${adventure('tower','+','note',C.hub.tower,C.hub.towerSub)}</div><div class="hub-links">${nav(C.hub.collection,'collection','secondary')}${nav(C.hub.invite,'invitation','secondary')}</div>`;}
function adventure(route,num,cast,title,copy){const open=episodeOpen(episode,review);return `<button class="adventure" data-action="go:${route}"><span class="adventure-number">${num}</span>${character(cast)}<span class="adventure-copy"><strong>${esc(title)}</strong><small>${esc(copy)}</small><span class="availability">${esc(open?C.hub.play:fmt(C.hub.locked,{date:episode.label}))}</span></span><span class="arrow">↗</span></button>`;}
function updateCountdown(){const el=$('#countdown');if(!el)return;const next=nextRelease();el.textContent=next?fmt(C.hub.countdown,countdown(next.date)):C.hub.allOpen;}
function futureView(){const open=episodeOpen(C.episodes[0],review),ep=futureEpisode;return `<div class="single-art">${house(ep.id-1,true)}</div>${heading(fmt(C.hub.house,{number:ep.house}),dateOpen(ep.date,review)?C.hub.coming:fmt(C.hub.locked,{date:ep.label}),open?C.hub.future:C.hub.firstWait)}${button(open?fmt(C.hub.playEpisode,{number:1}):C.app.home,'first-episode','primary full')}${nav(C.hub.invite,'invitation','secondary full')}`;}
function giftView(){return `${heading(C.app.title,C.gift.title,C.gift.intro)}<div class="gift-stage">${gift({paper:save.paper})}<p class="gift-tag">${esc(C.hub.giftTag)}<small>${esc(C.hub.giftTime)}</small></p></div><ol class="layer-list">${C.episodes.map((ep,i)=>`<li class="${save.layers.includes(ep.id)?'collected':''}"><span class="layer-icon">${save.layers.includes(ep.id)?'✓':ep.id}</span><span><strong>${esc(C.gift.layers[i])}</strong><small>${esc(save.layers.includes(ep.id)?C.gift.earned:!ep.ready&&dateOpen(ep.date,review)?C.gift.notBuilt:fmt(C.gift.waiting,{date:ep.label}))}</small></span></li>`).join('')}<li><span class="layer-icon">✦</span><span><strong>${esc(C.gift.finale)}</strong><small>${esc(C.finale.locked)}</small></span></li></ol>${save.finale?nav(C.finale.showCertificate,'certificate','primary full'):dateOpen(C.finale.date,review)?nav(C.finale.title,'finale','primary full'):nav(C.gift.play,'hub','primary full')}`;}
function unwrapView(){return `<div class="unwrap-scene" id="unwrap-scene">${gift({paper:save.paper})}<span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✦</span><span class="spark s4">✦</span></div>${heading(C.gift.cardLabel,wrapResult?.replay||caseResult?.replay?C.gift.replayTitle:C.gift.unwrapTitle,C.gift.unwrapCopy)}<article class="keepsake">${character('wrapper')}${eyebrow(C.gift.cardLabel)}<h2>${esc(C.gift.cardTitle)}</h2><p>${esc(C.gift.cardCopy)}</p></article><p class="unlock-banner">${esc(C.gift.paper)}</p>${nav(C.hub.collection,'collection','primary full')}${nav(C.app.home,'hub','secondary full')}`;}
function collectionView(){return `${heading(C.app.title,C.gift.collectionTitle,C.gift.collectionIntro)}${save.layers.length?`${save.layers.map(id=>{const giftCopy=episodeContent(C.episodes.find(ep=>ep.id===id)).gift;return `<article class="keepsake">${character('wrapper')}${eyebrow(giftCopy.cardLabel)}<h2>${esc(giftCopy.cardTitle)}</h2><p>${esc(giftCopy.cardCopy)}</p></article>`;}).join('')}<div class="paper-grid">${['cranberry','stars'].map(p=>`<article class="paper-card">${gift({paper:p,small:true})}<h2>${esc(p==='stars'?C.gift.starPaper:C.gift.defaultPaper)}</h2>${button(save.paper===p?C.gift.equipped:C.gift.equip,`paper:${p}`,'secondary',save.paper===p?'disabled':'')}</article>`).join('')}</div>`:`<div class="empty-state">${gift()}<p>${esc(C.gift.empty)}</p>${nav(C.gift.play,'hub')}</div>`}`;}

function wrapView(){return `${heading(C.wrap.eyebrow,C.wrap.title,C.wrap.intro)}<div class="cast-line">${character('kid')}${character('wrapper')}${character('king')}${character('singer')}</div><section class="instruction-card"><h2>${esc(C.wrap.tutorial)}</h2><ol>${C.wrap.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p>${esc(C.wrap.tutorialEnd)}</p>${nav(C.wrap.practice,'wrapPractice','secondary full')}</section><fieldset class="difficulty"><legend>${esc(C.wrap.choose)}</legend>${C.wrap.difficulty.map(d=>`<label><input type="radio" name="difficulty" value="${d.id}" ${difficulty===d.id?'checked':''}><strong>${esc(d.label)}</strong><small>${esc(d.detail)}</small></label>`).join('')}</fieldset><p class="subtle">${esc(C.wrap.duration)}</p>${button(C.wrap.start,'wrap-start','primary full')}`;}
function practiceView(){const action=C.wrap.actions[practice%4];return `${heading(C.wrap.tutorial,C.wrap.practice,C.wrap.practiceCopy)}<div class="practice-track">${C.wrap.actions.map((a,i)=>`<span class="${i<practice?'done':i===practice?'current':''}">${moveIcon(a.id)}${esc(a.label)}</span>`).join('')}</div>${practice<4?button(action.label,'practice-hit','beat-pad practice-pad'):`<p class="unlock-banner">${esc(C.wrap.practiceDone)}</p>`}${nav(C.app.back,'wrap','secondary full')}`;}
function newWrap(){const d=C.wrap.difficulty.find(d=>d.id===difficulty)||C.wrap.difficulty[1];run={difficulty:d,customer:0,index:0,results:[],score:0,combo:0,maxCombo:0,complete:false,paused:false,giftPoints:0,giftCombo:0,start:0,judged:new Set(),scheduled:new Set()};wrapResult=null;}
function orderView(){const customer=C.wrap.customers[run?.customer||0];return `${heading(fmt(C.wrap.customer,{current:(run?.customer||0)+1}),C.cast[customer.cast])}<div class="customer-scene">${character(customer.cast)}${customer.cast==='king'?`<div class="singers">${character('singer')}${character('singer')}</div>`:''}<blockquote>${esc(customer.order)}</blockquote>${customer.cast==='king'?`<p class="echo">${esc(C.wrap.singerEcho)}</p>`:''}</div><div class="move-legend">${C.wrap.actions.map(a=>`<span>${moveIcon(a.id)}${esc(a.label)}</span>`).join('')}</div><p class="subtle">${esc(C.app.mutedTip)}</p>${button(C.wrap.ready,'wrap-ready','primary full')}`;}
function wrapPlayView(){return `${eyebrow(C.wrap.title)}<div class="play-heading"><h1 tabindex="-1">${t(C.wrap.round,{current:run.customer+1})}</h1>${button(C.app.pause,'pause','small-button')}</div><div class="scorebar"><span>${esc(C.app.score)} <strong id="wrap-score">${run.score}</strong></span><span id="combo">${t(C.wrap.combo,{count:run.combo})}</span><span id="beat-count"></span></div><div class="workbench"><div class="workbench-cast">${character('wrapper')}${character(C.wrap.customers[run.customer].cast)}</div>${gift({paper:save.paper})}<div class="bench-front"></div></div><div class="beat-track" aria-hidden="true"><div class="timing-zone" id="timing-zone"></div><div class="gold-line"></div><span id="beat-note">♪</span></div><p class="beat-instruction">${esc(C.wrap.tap)}</p><button type="button" id="beat-pad" class="beat-pad"><span id="move-icon"></span><strong id="move-label"></strong><small id="gesture-label"></small></button><p id="next-move" class="subtle"></p>${status()}<div id="pause-layer"></div>`;}
function wrapGiftView(){const result=preview?{grade:'A',ratio:.85,combo:20}:run.results.at(-1);const i=preview?0:run.customer;return `${heading(fmt(C.wrap.customer,{current:i+1}),C.wrap.giftDone)}<div class="grade-medal">${esc(result.grade)}</div><p class="grade-detail">${t(C.wrap.accuracy,{percent:Math.round(result.ratio*100)})}</p><p>${t(C.wrap.maxCombo,{count:result.combo})}</p><div class="thank-you">${character(C.wrap.customers[i].cast)}<p>${esc(C.wrap.customerThanks[i])}</p></div>${button(preview?C.hub.review:i<2?C.wrap.next:C.wrap.done,preview?'review-menu':'wrap-next','primary full')}`;}
function wrapResultsView(){const result=preview?{score:6240,maxCombo:24,grades:['A','S','B'],best:false}:wrapResult;return `${heading(C.wrap.results,C.wrap.done,C.wrap.resultCopy)}<div class="result-total">${result.score}<small>${esc(C.app.score)}</small></div><div class="grade-row" aria-label="${esc(C.wrap.grades)}">${result.grades.map(g=>`<span class="mini-grade" aria-label="${t(C.wrap.gradeLabel,{grade:g})}">${g}</span>`).join('')}</div><p>${t(C.wrap.maxCombo,{count:result.maxCombo})}</p>${result.best?`<p class="unlock-banner">${esc(C.app.newBest)}</p>`:''}<p class="subtle">${t(C.app.best,{value:save.wrapBest})}</p>${button(C.wrap.finish,preview?'go:unwrap':'claim:wrap','primary full')}${nav(C.app.playAgain,'wrap','secondary full')}`;}

function mysteryView(){return `${heading(C.mystery.eyebrow,C.mystery.title,C.mystery.intro)}<div class="trail-art">${house(0)}${house(1)}${house(2)}</div><p class="instruction-card">${esc(C.mystery.stars)}</p><p class="subtle">${esc(C.mystery.duration)}</p>${save.mystery?nav(C.mystery.resume,'mysteryMap','primary full'):button(C.mystery.start,'case-start','primary full')}${save.mystery?button(C.mystery.restart,'case-start','secondary full'):''}${save.mysteryBest!==null?`<p class="personal-best">${t(C.mystery.best,{time:clock(save.mysteryBest)})}</p>`:''}`;}
function clueDigits(){return ['hidden','cipher','riddle'].map((id,i)=>`<span class="digit ${save.mystery?.solved.includes(id)?'earned':''}">${save.mystery?.solved.includes(id)?[C.mystery.hiddenDigit,C.mystery.cipherAnswer,C.mystery.riddleDigit][i]:'?'}</span>`).join('');}
function caseMapView(){return `${heading(C.mystery.title,C.mystery.houseMap)}<div class="clue-notebook">${eyebrow(C.mystery.digits)}<div class="digits">${clueDigits()}</div></div><div class="case-houses">${['hidden','cipher','riddle'].map((id,i)=>`<button class="case-house" data-action="go:${id}">${house(i)}<span><small>${t(C.mystery.houseNumber,{current:i+1})}</small><strong>${esc(C.mystery.houses[i])}</strong>${save.mystery.solved.includes(id)?`<em>${esc(C.mystery.clueCollected)}</em>`:''}</span><span>↗</span></button>`).join('')}</div>${nav(C.mystery.codeSubmit,'mysteryCode','primary full',mysteryComplete(save.mystery)?'':'disabled')}`;}
function puzzleHead(index,title,copy){return `${eyebrow(index<3?fmt(C.mystery.houseNumber,{current:index+1}):C.mystery.digits)}<div class="puzzle-meta"><span id="case-time" aria-label="${esc(C.mystery.timer)}">${clock(caseTime())}</span><span id="case-stars">${t(C.app.stars,{count:stars(save.mystery)})}</span></div><h1 tabindex="-1">${esc(title)}</h1><p class="intro">${esc(copy)}</p>`;}
function hintRow(id){const used=save.mystery.hints.includes(id);return `<div class="hint-row">${button(used?C.mystery.hintUsed:C.mystery.hint,`hint:${id}`,'hint-button',used||stars(save.mystery)===0?'disabled':'')}<p id="hint-copy" class="hint-copy" ${used?'':'hidden'}>${used?esc(C.mystery[`${id}Hint`]):''}</p></div>`;}
function solvedFooter(id){const idx=['hidden','cipher','riddle'].indexOf(id),solved=save.mystery.solved.includes(id);return `<div id="solved-panel" class="solved-panel" ${solved?'':'hidden'}><strong>${esc(C.mystery[`${id}Solved`])}</strong>${nav(idx===2?C.mystery.codeSubmit:C.mystery.next,idx===2?'mysteryCode':['hidden','cipher','riddle'][idx+1],'primary full')}</div>${nav(C.app.back,'mysteryMap','text-button')}`;}
function hiddenView(){return `${puzzleHead(0,C.mystery.hiddenTitle,C.mystery.hiddenCopy)}<p id="found-count" class="found-count">${t(C.mystery.found,{count:save.mystery.found.length})}</p><div class="parcel-grid">${Array.from({length:C.mystery.parcels.count},(_,i)=>{const striped=C.mystery.parcels.striped.includes(i),bow=C.mystery.parcels.bows.includes(i),found=save.mystery.found.includes(i);return `<button class="parcel ${found?'found':''}" data-action="parcel:${i}" aria-label="${t(C.mystery.parcelLabel,{pattern:C.mystery.patterns[striped?1:i%2?2:0],number:i+1,bow:C.mystery.bowStates[bow?1:0]})}" aria-pressed="${found}">${parcel(i,C.mystery.parcels)}${found?`<span>${esc(C.mystery.hiddenCheck)}</span>`:''}</button>`;}).join('')}</div>${status()}${hintRow('hidden')}${solvedFooter('hidden')}`;}
function cipherView(){return `${puzzleHead(1,C.mystery.cipherTitle,C.mystery.cipherCopy)}<div class="cipher-note"><p>${esc(C.mystery.cipherKey)}</p><strong>${esc(C.mystery.cipherMessage)}</strong><span aria-hidden="true">✦ ✦ ✦ ✦ ✦ ✦</span></div><h2>${esc(C.mystery.cipherPrompt)}</h2><div class="answer-grid">${C.mystery.cipherOptions.map(a=>button(a,`cipher:${a}`,'answer')).join('')}</div>${status()}${hintRow('cipher')}${solvedFooter('cipher')}`;}
function riddleView(){return `${puzzleHead(2,C.mystery.riddleTitle,C.mystery.riddleCopy)}<ol class="logic-clues">${C.mystery.clues.map(clue=>`<li>${esc(clue)}</li>`).join('')}</ol><div class="suspect-grid">${C.mystery.riddleOptions.map(id=>`<button class="suspect" data-action="riddle:${id}">${character(id)}<span>${esc(C.cast[id])}</span>${id===C.mystery.riddleAnswer?`<small>${esc(C.mystery.riddleDigit)}</small>`:''}</button>`).join('')}</div>${status()}${hintRow('riddle')}${solvedFooter('riddle')}`;}
function codeView(){return `${puzzleHead(3,C.mystery.codeTitle,C.mystery.codeCopy)}<div class="clue-notebook">${eyebrow(C.mystery.digits)}<div class="digits">${clueDigits()}</div></div><form id="layer-form"><label for="layer-code">${esc(C.mystery.codeLabel)}</label><input id="layer-code" name="code" inputmode="numeric" pattern="[0-9]{3}" maxlength="3" autocomplete="off" required placeholder="${esc(C.mystery.codePlaceholder)}"><button type="submit" class="primary full">${esc(C.mystery.codeSubmit)}</button></form>${status()}${nav(C.app.back,'mysteryMap','secondary full')}`;}
function caseResultsView(){const result=preview?{stars:3,time:153000,best:true}:caseResult;return `${heading(C.mystery.title,C.mystery.complete)}<div class="case-finished">${gift({paper:save.paper})}<span>✓</span></div><p class="result-detail">${t(C.mystery.result,{stars:result.stars,time:clock(result.time)})}</p>${result.best?`<p class="unlock-banner">${esc(C.app.newBest)}</p>`:''}${save.mysteryBest!==null?`<p>${t(C.mystery.best,{time:clock(save.mysteryBest)})}</p>`:''}${button(C.wrap.finish,preview?'go:unwrap':'claim:mystery','primary full')}${nav(C.app.home,'hub','secondary full')}`;}

function towerView(){return `${heading(C.tower.eyebrow,C.tower.title,C.tower.intro)}<div class="tower-promo">${gift({small:true,paper:'stars'})}${gift({small:true})}${gift({small:true,paper:'stars'})}</div><p class="instruction-card">${esc(C.tower.steps)}</p><p class="personal-best">${t(C.tower.best,{count:save.towerBest})}</p>${button(C.tower.start,'tower-start','primary full')}`;}
function newTower(){tower={boxes:[],fall:null,held:{x:160,y:26,w:104,color:0},score:0,height:0,phase:0,paused:false,complete:false,streak:0,lastColor:-1};towerResult=null;}
function towerPlayView(){return `${eyebrow(C.tower.title)}<div class="play-heading"><h1 tabindex="-1" id="tower-height">${t(C.tower.height,{count:tower.height})}</h1>${button(C.app.pause,'pause','small-button')}</div><div class="scorebar"><span id="tower-score">${esc(C.app.score)} ${tower.score}</span><span>${t(C.tower.best,{count:save.towerBest})}</span></div><canvas id="tower-canvas" width="320" height="360" role="img" aria-label="${esc(C.tower.sky)}"></canvas>${button(C.tower.drop,'tower-drop','primary full drop-pad')}<p class="subtle">${esc(C.tower.tip)}</p>${status()}<div id="pause-layer"></div>`;}
function towerResultsView(){const result=preview?{height:12,score:1050,best:true}:towerResult;return `${heading(C.tower.title,C.tower.over)}<div class="single-art">${character('kid')}</div><p class="result-detail">${t(C.tower.result,result)}</p>${result.best?`<p class="unlock-banner">${esc(C.app.newBest)}</p>`:''}<p>${t(C.tower.best,{count:save.towerBest})}</p>${button(C.app.playAgain,'tower-start','primary full')}${nav(C.app.home,'hub','secondary full')}`;}
function finaleView(){const open=dateOpen(C.finale.date,review);return `${heading(C.app.title,C.finale.title,C.finale.intro)}<div class="gift-stage">${gift({paper:save.paper})}</div>${save.finale?nav(C.finale.showCertificate,'certificate','primary full'):open?`<form id="finale-form"><label for="finale-code">${esc(C.finale.label)}</label><input id="finale-code" name="code" maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="${esc(C.finale.placeholder)}"><button type="submit" class="primary full">${esc(C.finale.submit)}</button></form>${status()}`:`<p class="instruction-card">${esc(C.finale.locked)}</p>`}${review?`<p class="subtle">${t(C.review.code,{code:C.finale.code})}</p>`:''}${nav(C.hub.invite,'invitation','secondary full')}`;}
function finalRevealView(){return `<div class="unwrap-scene final" id="unwrap-scene">${gift({open:true})}<span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✦</span><span class="spark s4">✦</span></div>${heading(C.app.title,C.finale.revealTitle,C.finale.revealCopy)}<p class="subtle">${esc(C.finale.placeholderNote)}</p>${nav(C.finale.showCertificate,'certificate','primary full')}`;}
function certificateView(){return `<article class="certificate"><div class="certificate-stars">✦ · ✦ · ✦</div>${eyebrow(C.app.brand)}<h1 tabindex="-1">${esc(C.finale.certificate)}</h1><p>${esc(C.finale.awarded)}</p><strong class="certificate-name">${esc(nickname(save.profile))}</strong><div class="certificate-party">${character('wrapper')}${character('note')}${character('king')}</div><p>${esc(C.finale.reason)}</p><span class="certificate-stamp">✓</span><p class="certificate-date">${esc(C.invitation.day)}</p></article><p class="table-callout">${esc(C.finale.table)}</p>${nav(C.hub.invite,'invitation','primary full')}${nav(C.app.home,'hub','secondary full')}`;}
function invitationView(){return `<div class="invite-art">${landscape()}${gift()}${character('wrapper')}</div>${heading(C.invitation.eyebrow,C.invitation.title,C.invitation.presenter)}<div class="event-facts"><p><span>▦</span><strong>${esc(C.invitation.day)}</strong><small>${esc(C.invitation.time)}</small></p><p><span>⌖</span><strong>${esc(C.invitation.location)}</strong><small>${esc(C.invitation.address)}<br>${esc(C.invitation.city)}</small></p></div><p class="donation">▣ ${esc(C.invitation.donation)}</p><p class="invite-cta">${esc(C.invitation.cta)}</p><a class="primary full" href="${C.invitation.websiteUrl}" rel="noopener noreferrer" target="_blank">${esc(C.invitation.website)} ↗</a>${nav(C.app.home,'hub','secondary full')}`;}
function reviewView(){return `${heading(C.app.preview,C.review.title,fmt(C.review.intro,{code:C.finale.code}))}${button(review?C.review.disable:C.review.enable,'review-toggle','primary full')}<h2>${esc(C.review.jump)}</h2><div class="review-grid">${C.review.routes.map(([id,label])=>button(label,`jump:${id}`,'secondary',review?'':'disabled')).join('')}</div><hr>${button(C.review.reset,'reset','danger full')}`;}

// Rhythm timing uses one monotonic clock for scoring, visual motion, and audio.
function activateWrap(){
  const d=run.difficulty,total=C.wrap.giftBeats;
  if(!run.start)run.start=performance.now()+2000;
  run.audioIndex=0;
  let frame=0,lastAction=-1,pointer=null;
  const pad=$('#beat-pad'),noteEl=$('#beat-note');
  $('#timing-zone').style.width=`${d.window/d.beat*56}%`;
  const update=()=>{
    $('#wrap-score').textContent=run.score;
    $('#combo').textContent=fmt(C.wrap.combo,{count:run.combo});
    $('#beat-count').textContent=fmt(C.wrap.beat,{current:Math.min(total,run.index+1),total});
    if(run.index!==lastAction&&run.index<total){
      const action=rhythmAction(run.index,C.wrap);$('#move-icon').innerHTML=moveIcon(action.id);$('#move-label').textContent=action.label;
      $('#gesture-label').textContent=action.id==='fold'?C.wrap.swipeLeft:action.id==='ribbon'?C.wrap.swipeRight:C.wrap.tapOnly;
      $('#next-move').textContent=fmt(C.wrap.upcoming,{move:rhythmAction(run.index+1,C.wrap).label});lastAction=run.index;
    }
  };
  function resolve(tier){
    run.judged.add(run.index);run.index++;
    if(tier){run.combo++;run.maxCombo=Math.max(run.maxCombo,run.combo);run.giftCombo=Math.max(run.giftCombo,run.combo);run.giftPoints+=tier===2?1:.72;run.score+=(tier===2?100:65)+Math.min(40,run.combo*2);feedback(tier===2?C.wrap.perfect:C.wrap.good);pad.classList.remove('hit');void pad.offsetWidth;pad.classList.add('hit');}
    else{run.combo=0;feedback(C.wrap.miss);}
    update();
  }
  function hit(gesture='tap'){
    if(run.paused||run.index>=total)return;
    const now=performance.now(),target=run.start+run.index*d.beat,offset=now-target;
    if(gesture!=='tap'&&gesture!==rhythmAction(run.index,C.wrap).id){feedback(C.wrap.wrong);return;}
    if(offset < -d.window){feedback(C.wrap.early);return;}
    if(offset>d.window)return;
    resolve(timing(offset,d));
  }
  function down(event){if(event.button!==0)return;pointer={x:event.clientX,y:event.clientY,id:event.pointerId};pad.setPointerCapture(event.pointerId);}
  function up(event){if(!pointer||pointer.id!==event.pointerId)return;const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;pointer=null;const gesture=Math.abs(dx)>28&&Math.abs(dx)>Math.abs(dy)?(dx<0?'fold':'ribbon'):'tap';hit(gesture);}
  function keyboard(event){if(event.detail===0)hit();}
  pad.addEventListener('pointerdown',down);pad.addEventListener('pointerup',up);pad.addEventListener('click',keyboard);pad.addEventListener('pointercancel',()=>{pointer=null;});
  function tick(now){
    if(view!=='wrapPlay')return;
    if(!run.paused){
      while(run.index<total&&now>run.start+run.index*d.beat+d.window)resolve(0);
      if(run.index>=total){
        run.results.push({grade:grade(run.giftPoints/total),ratio:run.giftPoints/total,combo:run.giftCombo});navigate('wrapGift');return;
      }
      while(run.audioIndex<total&&run.start+run.audioIndex*d.beat-now<150){const delta=run.start+run.audioIndex*d.beat-now;if(delta>=-35)note(delta/1000,run.audioIndex%4===0);run.audioIndex++;}
      const delta=run.start+run.index*d.beat-now;
      const position=50+delta/d.beat*28;
      noteEl.style.left=`${Math.max(-8,Math.min(108,position))}%`;
      noteEl.classList.toggle('in-zone',Math.abs(delta)<=d.window);
      pad.classList.toggle('on-beat',Math.abs(delta)<=d.perfect);
    }
    frame=requestAnimationFrame(tick);
  }
  update();feedback(C.wrap.countdown);frame=requestAnimationFrame(tick);
  dispose=()=>{cancelAnimationFrame(frame);pad.removeEventListener('pointerdown',down);pad.removeEventListener('pointerup',up);pad.removeEventListener('click',keyboard);};
}
function pauseGame(){
  const game=view==='wrapPlay'?run:view==='towerPlay'?tower:null;if(!game||game.paused)return;
  game.paused=true;game.pauseAt=performance.now();hush();
  $('#pause-layer').innerHTML=`<div class="pause-backdrop"><section class="pause-card" role="dialog" aria-modal="true" aria-labelledby="pause-title"><h2 id="pause-title">${esc(C.app.paused)}</h2><p>${esc(C.app.pausedCopy)}</p>${button(C.app.resume,'resume','primary full')}${nav(C.app.home,'hub','secondary full')}</section></div>`;
  $('#pause-layer button')?.focus();
}
function resumeGame(){const game=view==='wrapPlay'?run:tower;if(!game?.paused)return;if(view==='wrapPlay'){run.start+=performance.now()-run.pauseAt;run.audioIndex=Math.max(0,Math.ceil((performance.now()-run.start)/run.difficulty.beat));}game.paused=false;unlockAudio();$('#pause-layer').innerHTML='';(view==='wrapPlay'?$('#beat-pad'):$('[data-action="tower-drop"]'))?.focus();}

function activateTower(){
  const canvas=$('#tower-canvas'),ctx=canvas.getContext('2d');
  const colours=[['#a82947','#da4962'],['#28655b','#71b5a3'],['#745a87','#b594c1']];
  let frame=0,last=performance.now();
  function sway(i){return Math.sin(tower.phase*.8)*Math.min(tower.height*.5,9)*(i/Math.max(1,tower.height));}
  function camera(){return Math.max(0,(tower.height-8)*24);}
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function box(x,y,w,color){const pair=colours[color];rect(x-w/2-2,y-2,w+4,26,'#29283d');rect(x-w/2,y,w,22,pair[0]);rect(x-w/2,y,w,4,pair[1]);rect(x-4,y,8,22,'#f4c766');rect(x-2,y,2,22,'#fff3d6');}
  function nextBox(){const colors=[0,1,1,1,2,0,0,0,2,2,2,1];tower.held={x:160,y:26,w:Math.max(30,tower.boxes.at(-1)?.w||104),color:colors[tower.height%colors.length]};tower.fall=null;$('[data-action="tower-drop"]').disabled=false;}
  function finish(){tower.complete=true;const best=tower.height>save.towerBest;save.towerBest=Math.max(save.towerBest,tower.height);persist();towerResult={height:tower.height,score:tower.score,best};navigate('towerResults');}
  function tick(now){
    if(view!=='towerPlay')return;
    const dt=Math.min(.04,Math.max(0,(now-last)/1000));last=now;
    if(!tower.paused){
      tower.phase+=dt*2;
      if(!tower.fall)tower.held.x=160+Math.sin(tower.phase)*105;
      else {
        const f=tower.fall;f.vy+=dt*700;f.y+=f.vy*dt;
        const top=320-tower.height*24+camera()-24;
        if(f.y>=top){
          const lastBox=tower.boxes.at(-1),base=lastBox?{x:lastBox.x+sway(tower.height),w:lastBox.w}:{x:160,w:146};
          const result=landing(base,f);
          if(!result.stable){finish();return;}
          const x=result.perfect?base.x:f.x-sway(tower.height+1);
          tower.boxes.push({x,w:result.perfect?Math.min(base.w,f.w):result.width,color:f.color});tower.height++;
          tower.streak=f.color===tower.lastColor?tower.streak+1:1;tower.lastColor=f.color;
          const bonus=tower.streak>=3&&tower.streak%3===0;
          tower.score+=100+(result.perfect?50:0)+(bonus?75:0);
          feedback(bonus?C.tower.streak:result.perfect?C.tower.perfect:C.tower.landed);note(0,result.perfect);
          $('#tower-height').textContent=fmt(C.tower.height,{count:tower.height});$('#tower-score').textContent=`${C.app.score} ${tower.score}`;nextBox();
        }
      }
    }
    ctx.clearRect(0,0,320,360);rect(0,0,320,360,'#d8eff1');
    for(const [x,y] of [[18,44],[256,70],[80,120]]){rect(x,y,32,5,'#f4fbff');rect(x+7,y-5,18,5,'#f4fbff');}
    const cam=camera();rect(0,334+cam,320,26,'#f4fbff');rect(74,320+cam,172,14,'#734d45');rect(78,320+cam,164,4,'#be833b');
    tower.boxes.forEach((b,i)=>{const y=296-i*24+cam;if(y>-24&&y<360)box(b.x+sway(i+1),y,b.w,b.color);});
    const held=tower.fall||tower.held;rect(0,4,320,5,'#734d45');rect(held.x-1,9,2,tower.fall?13:17,'#29283d');box(held.x,held.y,held.w,held.color);
    frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);dispose=()=>cancelAnimationFrame(frame);
}

function solvePuzzle(id){
  if(!save.mystery.solved.includes(id))save.mystery.solved.push(id);persist();
  feedback(C.mystery[`${id}Solved`]);const panel=$('#solved-panel');if(panel)panel.hidden=false;
}
function useHint(id){
  const m=save.mystery;if(!m||m.hints.includes(id)||stars(m)===0)return;
  m.hints.push(id);persist();$('[data-action="hint:'+id+'"]').disabled=true;$('[data-action="hint:'+id+'"]').textContent=C.mystery.hintUsed;
  $('#hint-copy').hidden=false;$('#hint-copy').textContent=C.mystery[`${id}Hint`];$('#case-stars').textContent=fmt(C.app.stars,{count:stars(m)});
}
function claim(source){
  const earned=source==='wrap'?wrapResult&&run?.complete:caseResult&&mysteryComplete(save.mystery);
  if(!earned||!episodeOpen(episode,review))return;
  const replay=save.layers.includes(episode.id);if(!replay)save.layers.push(episode.id);save.paper='stars';persist();
  if(source==='wrap')wrapResult.replay=replay;else caseResult.replay=replay;
  navigate('unwrap');unlockAudio();note(0,true);note(.14);note(.28,true);
}
function jump(route){
  if(!review||!routes.has(route))return;
  if(!save.profile){save.profile=newProfile();profile=save.profile;persist();}
  if(route.startsWith('wrap')&&['wrapOrder','wrapPlay','wrapGift'].includes(route)){newWrap();if(route==='wrapPlay'){run.start=0;unlockAudio();}}
  if(route==='towerPlay'){newTower();unlockAudio();}
  if(route==='wrapPractice')practice=0;if(route==='future')futureEpisode=C.episodes[1];
  const demo=['wrapGift','wrapResults','mysteryCode','mysteryResults','towerResults','unwrap','finalReveal','certificate'].includes(route);
  navigate(route,{demo});
}
function resetDialog(){
  $('#modal-root').innerHTML=`<div class="pause-backdrop"><section class="pause-card" role="alertdialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">${esc(C.app.resetQuestion)}</h2><p>${esc(C.app.resetDetail)}</p>${button(C.app.cancel,'reset-cancel','primary full')}${button(C.app.yes,'reset-confirm','danger full')}</section></div>`;$('#modal-root button')?.focus();
}

root.addEventListener('click',event=>{
  const el=event.target.closest('[data-action]');if(!el||el.disabled)return;event.preventDefault();
  const [action,value]=el.dataset.action.split(':');
  if(action==='go'){if(value==='wrapPractice')practice=0;navigate(value,{demo:preview&&['unwrap','certificate'].includes(value)});return;}
  if(action==='jump'){jump(value);return;}
  if(action==='review-menu'){navigate('review');return;}
  if(action==='sound'){
    save.sound=!save.sound;if(save.sound){unlockAudio();note(0,true);}else hush();persist();el.textContent=save.sound?C.app.soundOn:C.app.soundOff;el.setAttribute('aria-pressed',String(save.sound));return;
  }
  if(action==='shuffle'){const avatar=profile.avatar;profile={...newProfile(),avatar};$('#nickname').textContent=nickname(profile);return;}
  if(action==='profile'){save.profile={...profile};persist();navigate('hub');return;}
  if(action==='episode'){const next=C.episodes.find(ep=>ep.id===Number(value))||C.episodes[0];if(episodeOpen(next,review)){selectEpisode(next);navigate('hub');$('.adventures')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}else{futureEpisode=next;navigate('future');}return;}
  if(action==='first-episode'){selectEpisode(C.episodes[0]);navigate('hub');return;}
  if(action==='future'){futureEpisode=C.episodes.find(ep=>ep.id===Number(value))||C.episodes[1];navigate('future');return;}
  if(action==='paper'){if(save.layers.length&&['cranberry','stars'].includes(value)){save.paper=value;persist();render();}return;}
  if(action==='practice-hit'){practice++;if(practice>=4)note(0,true);render();return;}
  if(action==='wrap-start'){newWrap();unlockAudio();navigate('wrapOrder');return;}
  if(action==='wrap-ready'){run.index=0;run.giftPoints=0;run.giftCombo=0;run.start=0;run.paused=false;run.judged=new Set();unlockAudio();navigate('wrapPlay');unlockAudio();return;}
  if(action==='wrap-next'){
    if(!run||run.results.length!==run.customer+1)return;
    if(run.customer<2){run.customer++;navigate('wrapOrder');}
    else{run.complete=true;const best=run.score>save.wrapBest;save.wrapBest=Math.max(save.wrapBest,run.score);persist();wrapResult={score:run.score,maxCombo:run.maxCombo,grades:run.results.map(r=>r.grade),best};navigate('wrapResults');}return;
  }
  if(action==='pause'){pauseGame();return;}if(action==='resume'){resumeGame();return;}
  if(action==='case-start'){checkpoint();save.mystery={solved:[],found:[],hints:[],elapsed:0};caseResult=null;persist();navigate('mysteryMap');return;}
  if(action==='hint'){useHint(value);return;}
  if(action==='parcel'){
    const i=Number(value);if(save.mystery.found.includes(i))return;
    if(!hiddenTargets(C.mystery).includes(i)){feedback(C.mystery.hiddenWrong);return;}
    save.mystery.found.push(i);persist();el.classList.add('found');el.setAttribute('aria-pressed','true');el.insertAdjacentHTML('beforeend',`<span>${esc(C.mystery.hiddenCheck)}</span>`);$('#found-count').textContent=fmt(C.mystery.found,{count:save.mystery.found.length});
    if(save.mystery.found.length===hiddenTargets(C.mystery).length)solvePuzzle('hidden');else feedback(C.mystery.hiddenFound);return;
  }
  if(action==='cipher'){if(value===C.mystery.cipherAnswer)solvePuzzle('cipher');else feedback(C.mystery.cipherWrong);return;}
  if(action==='riddle'){if(value===C.mystery.riddleAnswer)solvePuzzle('riddle');else feedback(C.mystery.riddleWrong);return;}
  if(action==='claim'){claim(value);return;}
  if(action==='tower-start'){newTower();navigate('towerPlay');unlockAudio();return;}
  if(action==='tower-drop'){if(tower&&!tower.paused&&!tower.fall&&!tower.complete){tower.fall={...tower.held,vy:0};el.disabled=true;}return;}
  if(action==='review-toggle'){review=!review;const url=new URL(location.href);if(review)url.searchParams.set('review','1');else url.searchParams.delete('review');history.replaceState(null,'',url);navigate('review');return;}
  if(action==='reset'){resetDialog();return;}if(action==='reset-cancel'){$('#modal-root').innerHTML='';$('[data-action="reset"]')?.focus();return;}
  if(action==='reset-confirm'){
    dispose();mysteryAnchor=null;save=freshSave();profile=newProfile();run=null;tower=null;wrapResult=null;caseResult=null;towerResult=null;practice=0;
    try{storage?.removeItem(SAVE_KEY);}catch{}selectEpisode(C.episodes[0]);persist();navigate('onboard');toast(C.app.resetDone);return;
  }
});
root.addEventListener('change',event=>{if(event.target.name==='avatar')profile.avatar=event.target.value;if(event.target.name==='difficulty')difficulty=event.target.value;});
root.addEventListener('submit',event=>{
  event.preventDefault();
  if(event.target.id==='layer-form'){
    if(!mysteryComplete(save.mystery)&&!preview){feedback(C.mystery.notYet);return;}
    if($('#layer-code').value.trim()!==mysteryCode(C.mystery)){feedback(C.mystery.codeWrong);return;}
    if(preview){navigate('mysteryResults',{demo:true});return;}
    checkpoint();const time=save.mystery.elapsed,best=save.mysteryBest===null||time<save.mysteryBest;save.mysteryBest=save.mysteryBest===null?time:Math.min(time,save.mysteryBest);caseResult={stars:stars(save.mystery),time,best};persist();navigate('mysteryResults');
  }
  if(event.target.id==='finale-form'){
    if(!dateOpen(C.finale.date,review)){feedback(C.finale.locked);return;}
    if($('#finale-code').value.trim().toUpperCase()!==C.finale.code){feedback(C.finale.incorrect);return;}
    save.finale=true;persist();navigate('finalReveal');unlockAudio();note(0,true);note(.14);note(.28,true);
  }
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){checkpoint();if(['wrapPlay','towerPlay'].includes(view))pauseGame();hush();}
  else if(['hidden','cipher','riddle','mysteryCode'].includes(view))mysteryAnchor=performance.now();
});
window.addEventListener('pagehide',()=>checkpoint());
window.addEventListener('popstate',()=>{const next=C.episodes.find(ep=>ep.id===Number(new URLSearchParams(location.search).get('episode')))||C.episodes[0];if(next.id!==episode.id)selectEpisode(next);navigate(location.hash.slice(1)||'hub');});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if($('#modal-root')?.children.length){$('#modal-root').innerHTML='';$('[data-action="reset"]')?.focus();}else if(['wrapPlay','towerPlay'].includes(view))pauseGame();}
  const dialog=root.querySelector('[role="dialog"], [role="alertdialog"]');
  if(dialog&&event.key==='Tab'){const focusables=[...dialog.querySelectorAll('button')],first=focusables[0],last=focusables.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
navigate(location.hash.slice(1)||'hub');
