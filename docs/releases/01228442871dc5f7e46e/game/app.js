import {finishRewards,wrapMedal,towerMedal,settleCollection,welcomePack,openBox,exchangeStars} from './treasure.js';
import {helper} from './treasure-art.js';
import {bookView,helperView,backupView,boxLink,cardView,homePrompt,browserWarning} from './treasure-ui.js';
import {decodeSave} from './save-code.js';
import {roadGuide} from './sleigh-art.js';
import {celebration,activateResults} from './results-feedback.js';
import {createSleigh,recordSleigh} from './sleigh.js';
import {sleighPlayView,activateSleigh} from './sleigh-ui.js';
import {createSorting,sortingTop,recordSorting} from './sorting.js';
import {sortingPlayView,activateSorting,activateSortingResults} from './sorting-ui.js';
import { C as baseContent, episodeContent } from './content.js';
let episode=baseContent.episodes.find(ep=>ep.id===Number(new URLSearchParams(location.search).get('episode')))||baseContent.episodes[0];
let C=episodeContent(episode);
import {SAVE_KEY,freshSave,loadSave,writeSave,newProfile,nickname,fmt,escapeHTML as esc,dateOpen as rawDateOpen,episodeOpen as rawEpisodeOpen,nextRelease,countdown,landing} from './engine.js';
import {character,gift,house,landscape,moveIcon,scene} from './art.js';
import {BUILD_ID,UpdateCheck,safeView,prepareBuild} from './update-check.js';
import {SITE_ROOT} from './build-info.js';
import {TrustedClock} from './trusted-clock.js';
import {Music} from './music.js';
import {createRound,judgeTap,expireNotes,roundResult} from './rhythm.js';

const root=document.querySelector('#app');
document.title=C.app.title;
let storage;
try {storage=window.localStorage;}catch {storage=null;}
const loaded=loadSave(storage);
const trusted=new TrustedClock({storage});
const dateOpen=(date,review=false)=>rawDateOpen(date,review,trusted.now());
const episodeOpen=(ep,review=false)=>rawEpisodeOpen(ep,review,trusted.now());
async function refreshTime(){await trusted.sync();if(['hub','gift','finale','collection'].includes(view))navigate(view);}
let save=loaded.save, storageOK=loaded.ok, profile=save.profile||newProfile();
let review=new URLSearchParams(location.search).get('review')==='1';
let view='', preview=false, dispose=()=>{}, run=null, tower=null, wrapResult=null, towerResult=null, practice=0, difficulty='tunie', toastTimer;
const $=(selector)=>root.querySelector(selector);
const all=(selector)=>[...root.querySelectorAll(selector)];
const t=(key,values)=>esc(fmt(key,values));
const button=(text,action,cls='primary',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${esc(text)}</button>`;
const nav=(text,route,cls='primary',extra='')=>button(text,`go:${route}`,cls,extra);
const eyebrow=text=>`<p class="eyebrow">${esc(text)}</p>`;
const heading=(small,title,copy='')=>`${eyebrow(small)}<h1 tabindex="-1">${esc(title)}</h1>${copy?`<p class="intro">${esc(copy)}</p>`:''}`;

const status=()=>'<p class="feedback" id="feedback" role="status" aria-live="polite"></p>';
function persist(){storageOK=writeSave(storage,save);const notice=$('#storage-notice');if(notice)notice.hidden=storageOK;}
function toast(message){const el=$('#toast');if(!el)return;clearTimeout(toastTimer);el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),2600);}
function feedback(message){const el=$('#feedback');if(el)el.textContent=message;}
let sleigh=null,sleighResult=null;
let sorting=null,sortingResult=null,sortingDifficulty='easy';
let bookTab='cards',lastPull=null,welcomePulls=[];
const routes=new Set(['helper','backup','boxes','welcome','sleigh','sleighPlay','sleighResults','sorting','sortingPlay','sortingResults','onboard','hub','wrap','wrapPractice','wrapOrder','wrapPlay','wrapGift','wrapResults','tower','towerPlay','towerResults','gift','unwrap','collection','finale','finalReveal','certificate','invitation','review']);
const gated=new Set(['sleigh','sleighPlay','sleighResults','sorting','sortingPlay','sortingResults','wrap','wrapPractice','wrapOrder','wrapPlay','wrapGift','wrapResults','tower','towerPlay','towerResults']);

let sessionStorage;try{sessionStorage=window.sessionStorage;}catch{}
const updates=new UpdateCheck({storage:sessionStorage,safe:()=>safeView(view,{hidden:document.hidden,modal:Boolean(document.querySelector('[aria-modal="true"]')),editing:Boolean(document.activeElement?.matches('input:not([type=radio]):not([type=checkbox]),textarea,[contenteditable="true"]'))}),prepare:prepareBuild,beforeReload:()=>{persist();trusted.now();if(!storageOK)throw Error('Save unavailable');},notice:()=>{persist();trusted.now();const el=document.createElement('div');el.id='update-note';el.className='update-note';el.setAttribute('role','status');el.textContent=C.update.note;document.body.append(el);},hide:()=>document.querySelector('#update-note')?.remove()});
const music=new Music(()=>save.sound);
const unlockAudio=()=>music.unlock();
const note=(when=0,accent=false)=>music.tone(accent?72:67,'bow',when,.65);
const hush=()=>music.hush();

function selectEpisode(next){
  dispose();dispose=()=>{};persist();
  episode=next;C=episodeContent(episode);
  run=null;wrapResult=null;practice=0;
  const url=new URL(location.href);if(episode.id===1)url.searchParams.delete('episode');else url.searchParams.set('episode',episode.id);
  history.replaceState(null,'',url);
}
function navigate(target,{demo=false}={}) {
  if(!routes.has(target))target='hub';
  dispose();dispose=()=>{};hush();
  preview=demo&&review;
  if(!save.profile&&!['onboard','invitation','review'].includes(target)){target='onboard';preview=false;}
  if(target.startsWith('wrap')){episode=C.episodes.find(ep=>ep.game==='wrap');C=episodeContent(episode);}
  if(target.startsWith('sorting')){episode=C.episodes.find(ep=>ep.game==='sorting');C=episodeContent(episode);}
  if(target==='sortingPlay'&&!sorting)target='sorting';
  if(target==='sortingResults'&&!sortingResult)target='sorting';
  if(target.startsWith('sleigh')){episode=C.episodes.find(ep=>ep.game==='sleigh');C=episodeContent(episode);}
  if(target==='sleighPlay'&&!sleigh)target='sleigh';
  if(target==='sleighResults'&&!sleighResult)target='sleigh';
  if(target.startsWith('tower')){episode=C.episodes.find(ep=>ep.game==='tower');C=episodeContent(episode);}
  if(gated.has(target)&&!episodeOpen(episode,review))target='hub';
  if(['finalReveal','certificate'].includes(target)&&!save.finale&&!preview)target='finale';
  if(target==='unwrap'&&!save.layers.includes(episode.id)&&!preview)target='gift';
  if(['wrapOrder','wrapPlay'].includes(target)&&!run){newWrap();}
  if(target==='wrapGift'&&!run?.results.length&&!preview)target='wrap';
  if(target==='wrapResults'&&!wrapResult&&!preview)target='wrap';
  if(target==='towerPlay'&&!tower)newTower();
  if(target==='towerResults'&&!towerResult&&!preview)target='tower';
  if(target==='helper'&&view!=='helper')profile={...save.profile};
  view=target;
  const hash=`#${target}`;if(location.hash!==hash)history.pushState(null,'',hash);
  render();queueMicrotask(()=>updates.consider());window.scrollTo(0,0);$('h1')?.focus({preventScroll:true});
}
function render(){
  const p=save.profile||profile;
  music.wrap=view.startsWith('wrap');
  if(music.wrap||view.startsWith('sorting')||view.startsWith('sleigh'))music.load().then(()=>{
    const message=$('#music-loading');
    if(message){message.textContent=music.state==='failed'?(view.startsWith('sleigh')?C.sleigh.music.failed:view.startsWith('sorting')?C.sorting.music.failed:C.wrap.musicFailed):'';message.hidden=music.state==='ready';}
  });
  const scenes={helper:()=>helperView(save,profile),backup:()=>backupView(save),boxes:boxesView,welcome:welcomeView,sleigh:sleighView,sleighPlay:sleighPlayView,sleighResults:sleighResultsView,sorting:sortingView,sortingPlay:()=>sortingPlayView(sorting),sortingResults:sortingResultsView,onboard:onboardView,hub:hubView,wrap:wrapView,wrapPractice:practiceView,wrapOrder:orderView,wrapPlay:wrapPlayView,wrapGift:wrapGiftView,wrapResults:wrapResultsView,tower:towerView,towerPlay:towerPlayView,towerResults:towerResultsView,gift:giftView,unwrap:unwrapView,collection:collectionView,finale:finaleView,finalReveal:finalRevealView,certificate:certificateView,invitation:invitationView,review:reviewView};
  document.body.dataset.scene=(view.startsWith('wrap')||view.startsWith('sorting'))?'workshop':'town';
  document.body.classList.toggle('rhythm-active',Boolean(view==='wrapPlay'||(view==='wrapPractice'&&practice.guided)||view==='sortingPlay'||view==='sleighPlay'));
  root.innerHTML=`<div class="scene-backdrop" aria-hidden="true">${scene(document.body.dataset.scene)}</div>${review?`<div class="review-strip">${esc(C.review.active)} <small data-build-id>${BUILD_ID}</small> ${button(C.hub.review,'review-menu','text-button')}</div>`:''}
    <header class="topbar"><a href="#hub" class="brand" data-action="go:hub"><span class="brand-gift">${gift({small:true})}</span><span>${esc(C.app.title)}</span></a><div class="top-actions">${view!=='onboard'?nav(C.app.home,'hub','small-button'):''}${button(save.sound?C.app.soundOn:C.app.soundOff,'sound','small-button','aria-pressed="'+save.sound+'"')}</div></header>
    <main class="screen screen-${view}" id="main">${preview?`<p class="preview-label">${esc(C.review.preview)}</p>`:''}${scenes[view]()}${['hub','wrapResults','sortingResults','towerResults','sleighResults'].includes(view)?homePrompt(save,trusted.now()):''}${music.wrap?`<p id="music-loading" class="subtle" role="status" ${music.state==='ready'?'hidden':''}>${esc(music.state==='failed'?C.wrap.musicFailed:C.wrap.musicLoading)}</p>`:''}${['unwrap','finalReveal','wrapGift','wrapResults',].includes(view)?celebration():''}</main>
    <footer class="footer">${browserWarning(storageOK)}<p>${esc(C.app.privacy)}</p><p id="storage-notice" class="storage-notice" ${storageOK?'hidden':''}>${esc(C.app.storage)}</p><div>${nav(C.hub.invite,'invitation','text-button')}${nav(C.hub.review,'review','text-button')}<a href="${new URL('art-direction/',SITE_ROOT)}">${esc(C.hub.gallery)}</a></div><p class="preview-caption">${esc(C.app.preview)}</p></footer>
    <div id="toast" class="toast" role="status"></div><div id="modal-root"></div>`;
  if(view==='helper')$('#nickname').textContent=nickname(profile);
  if(view==='hub'){const id=setInterval(updateCountdown,1000);dispose=()=>clearInterval(id);updateCountdown();}
  if(view==='sleighResults')dispose=activateResults(music,sleighResult);
  if(view==='sleighPlay')dispose=activateSleigh(root,sleigh,{music,finish:finishSleigh,home:()=>navigate('hub'),towerBest:save.towerBest});
  if(view==='sortingResults')dispose=activateSortingResults(music,sortingResult);
  if(view==='wrapPlay')activateWrap();
  if(view==='wrapPractice')activatePractice();
  if(view==='towerPlay')activateTower();
  if(view==='sortingPlay')dispose=activateSorting(root,sorting,{finish:finishSorting,music,home:()=>navigate('hub')});
  if(view==='unwrap'||view==='finalReveal'){const id=setTimeout(()=>$('#unwrap-scene')?.classList.add('unwrapped'),80);dispose=()=>clearTimeout(id);}
}
function onboardView(){return `<div class="welcome-scene">${landscape()}<div class="welcome-party">${character('kid')}${gift()}${character('wrapper')}</div></div>${heading(C.app.brand,C.profile.title,C.profile.intro)}<div class="nameplate">${eyebrow(C.profile.nameLabel)}<strong id="nickname">${esc(nickname(profile))}</strong>${button(C.profile.shuffle,'shuffle','text-button')}</div><fieldset class="avatar-picker"><legend>${esc(C.profile.choose)}</legend>${C.profile.avatars.map(a=>`<label class="avatar-option"><input type="radio" name="avatar" value="${a.id}" ${profile.avatar===a.id?'checked':''}>${helper({avatar:a.id})}<span>${esc(a.name)}</span></label>`).join('')}</fieldset>${button(C.profile.start,'profile','primary full')}`;}
function hubView(){return `${eyebrow(C.hub.eyebrow)}<div class="hub-heading"><div><p class="greeting">${t(C.hub.greeting,{name:nickname(save.profile)})}</p><h1 tabindex="-1">${esc(C.hub.title)}</h1></div>${helper(save.profile,save.collection.equipped)}</div><section class="village" aria-label="${esc(C.app.title)}">${landscape()}<div class="village-houses">${C.episodes.map((ep,i)=>`<button class="house ${episodeOpen(ep,review)?'':'locked'}" data-action="episode:${ep.id}" ${episodeOpen(ep,review)?'':'disabled'} aria-label="${t(C.hub.house,{number:ep.house})}: ${esc(episodeOpen(ep,review)?fmt(C.hub.playEpisode,{number:ep.id}):ep.ready?fmt(C.hub.locked,{date:ep.label}):C.hub.coming)}">${house(i,!episodeOpen(ep,review))}<span class="house-number">${ep.house}</span><span class="house-date">${esc(ep.label)}</span></button>`).join('')}<button class="house finale-house" data-action="go:finale" aria-label="${esc(C.finale.title)}">${house(2,!dateOpen(C.finale.date,review))}<span class="house-number">${C.finale.house}</span><span class="house-date">${esc(C.gift.finale)}</span></button></div><button class="village-gift" data-action="go:gift">${gift()}<span>${esc(C.hub.viewGift)}</span><small class="gift-progress">${C.gift.layers.map((name,i)=>`<span title="${esc(name)}" class="${save.layers.includes(i+1)?'won':''}">${save.layers.includes(i+1)?'◆':'◇'}</span>`).join('')}<span title="${esc(C.gift.finale)}" class="${save.finale?'won':''}">${save.finale?'★':'☆'}</span></small><small>${t(C.hub.layerCount,{count:save.layers.length})}</small><small>${t(C.treasure.count,{count:Object.keys(save.collection.cards).length,total:C.treasure.cards.length})}</small></button><div class="village-cast">${character('wrapper')}${character('kid')}${character('note')}</div></section><p class="intro">${esc(C.hub.intro)}</p><div class="countdown-card"><span>${esc(C.hub.next)}</span><strong id="countdown"></strong></div>${eyebrow(C.hub.choose)}<p class="subtle">${t(C.hub.selectedEpisode,{number:episode.id,date:episode.label})}</p><div class="adventures">${C.episodes.map(adventure).join('')}</div>${boxLink(save)}<div class="hub-links">${nav(C.treasure.helper,'helper','secondary')}${nav(C.hub.collection,'collection','secondary')}${nav(C.hub.invite,'invitation','secondary')}</div>`;}
const sortingNumber=value=>value.toLocaleString('en-US');
function sortingHubBest(){const best=sortingTop(save.sortingBests);return fmt(C.sorting.scoring.hubBest,{score:sortingNumber(best.score),difficulty:C.sorting.difficulties.find(d=>d.id===best.difficulty).label});}
function adventure(ep){const open=episodeOpen(ep,review);return `<button class="adventure" data-action="episode:${ep.id}" ${open?'':'disabled'}><span class="adventure-number">0${ep.id}</span>${character(ep.cast)}<span class="adventure-copy"><strong>${esc(ep.title)}</strong><small>${esc(ep.label)}</small><span class="availability">${esc(!ep.ready?C.hub.coming:open?(ep.game==='sleigh'?(save.sleighPlayed?fmt(C.sleigh.best,{count:save.sleighBest}):C.app.notPlayed):(save.layers.includes(ep.id)||save.collection.claims.includes(`played:${ep.game}`))?(ep.game==='sorting'?sortingHubBest():fmt(C.app.best,{value:ep.game==='wrap'?save.wrapBest:save.towerBest})):C.app.notPlayed):fmt(C.hub.locked,{date:ep.label}))}</span></span>${open?'<span class="arrow">↗</span>':''}</button>`;}
let lastGateState='';
function updateCountdown(){const state=C.episodes.map(ep=>episodeOpen(ep,review)).join()+dateOpen(C.finale.date,review);if(lastGateState&&state!==lastGateState){lastGateState=state;navigate('hub');return;}lastGateState=state;const el=$('#countdown');if(!el)return;const next=nextRelease(trusted.now());el.textContent=!trusted.online?C.hub.offline:next?fmt(C.hub.countdown,countdown(next.date,trusted.now())):C.hub.allOpen;}
function giftView(){return `${heading(C.app.title,C.gift.title,C.gift.intro)}<div class="gift-stage">${gift()}<p class="gift-tag">${esc(C.hub.giftTag)}<small>${esc(C.hub.giftTime)}</small></p></div><ol class="layer-list">${C.episodes.map((ep,i)=>`<li class="${save.layers.includes(ep.id)?'collected':''}"><span class="layer-icon">${save.layers.includes(ep.id)?'✓':ep.id}</span><span><strong>${esc(C.gift.layers[i])}</strong><small>${esc(save.layers.includes(ep.id)?C.gift.earned:!ep.ready&&dateOpen(ep.date,review)?C.gift.notBuilt:fmt(C.gift.waiting,{date:ep.label}))}</small></span></li>`).join('')}<li><span class="layer-icon">✦</span><span><strong>${esc(C.gift.finale)}</strong><small>${esc(C.finale.locked)}</small></span></li></ol>${save.finale?nav(C.finale.showCertificate,'certificate','primary full'):dateOpen(C.finale.date,review)?nav(C.finale.title,'finale','primary full'):nav(C.gift.play,'hub','primary full')}`;}
function unwrapView(){const card=C.treasure.cards.find(c=>c.id===C.treasure.hostIds[episode.id-1]);return `<div class="unwrap-scene" id="unwrap-scene">${gift()}</div>${heading(C.treasure.title,C.treasure.layerWon?fmt(C.treasure.layerWon,{layer:C.gift.layers[episode.id-1]}):'')}<div class="layer-host">${cardView(card,save,{reveal:true})}</div>${boxLink(save)}${nav(C.hub.collection,'collection','primary full')}${nav(C.app.home,'hub','secondary full')}`;}
function collectionView(){return bookView(save,trusted.now(),review,bookTab);}
function welcomeView(){return `${heading(C.treasure.title,C.treasure.welcome,C.treasure.welcomeCopy)}<div class="card-grid welcome-cards">${welcomePulls.map(p=>cardView(C.treasure.cards.find(c=>c.id===p.id),save,{reveal:true})).join('')}</div>${nav(C.app.continue,'hub','primary full')}`;}
function boxesView(){const T=C.treasure;return `${heading(T.title,T.boxTitle)}${lastPull?`<div class="layer-host box-reveal" data-tier="${lastPull.tier}">${cardView(T.cards.find(c=>c.id===lastPull.id),save,{reveal:true})}</div><p role="status">${esc(lastPull.duplicate?fmt(T.duplicate,{count:lastPull.stars}):T.newCard)}</p>${button(T.skip,'skip-reveal','text-button')}`:''}<p>${t(T.boxes,{count:save.collection.boxes.length})}</p>${save.collection.boxes.length?`<div class="reward-box">${gift({open:!!lastPull})}<p>${esc(T.boxNames[save.collection.boxes[0]])}</p></div>${button(T.open,'open-box','primary full')}`:''}${nav(T.next,'collection','secondary full')}`;}
function medalBadge(g,mini=false){const m=wrapMedal([g]);return `<span class="${mini?'mini-grade':'grade-medal'} medal-${m}" aria-label="${esc(C.treasure.medals[m+1])}">${esc(C.treasure.medals[m+1])}${m>=0?` <small>${g}</small>`:''}</span>`;}
function rewardResult(game,medal,best,wonLayer=medal>=0){finishRewards(save,{game,medal,best,wonLayer});persist();navigator.storage?.persist?.().catch(()=>{});}

function wrapView(){return `${heading(C.wrap.eyebrow,C.wrap.title,C.wrap.intro)}<p class="unlock-banner">${esc(C.treasure.wrapGoal)}</p><div class="cast-line">${character('kid')}${character('wrapper')}${character('king')}${character('singer')}</div><section class="instruction-card"><h2>${esc(C.wrap.tutorial)}</h2><ol>${C.wrap.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p>${esc(C.wrap.tutorialEnd)}</p>${nav(C.wrap.practice,'wrapPractice','secondary full')}</section><fieldset class="difficulty"><legend>${esc(C.wrap.choose)}</legend>${C.wrap.difficulty.map(d=>`<label><input type="radio" name="difficulty" value="${d.id}" ${difficulty===d.id?'checked':''}><strong>${esc(d.label)}</strong><small>${esc(d.detail)}</small></label>`).join('')}</fieldset><p class="subtle">${esc(C.wrap.duration)}</p>${button(C.wrap.start,'wrap-start','primary full')}<p class="subtle"><a href="${new URL('./audio/credits.html',import.meta.url)}" target="_blank" rel="noopener">${esc(C.wrap.musicCredits)}</a></p>`;}
function laneButtons(){return `<div class="lane-buttons ${navigator.maxTouchPoints===0?'keyboard-controls':''}">${C.wrap.actions.map((a,i)=>`<button type="button" class="lane-button lane-${i}" data-lane="${i}" aria-label="${esc(a.label)}">${moveIcon(a.id)}<strong>${esc(a.label)}</strong><kbd>${esc(C.wrap.keys[i])}</kbd></button>`).join('')}</div>`;}
function laneField(){return `<div class="rhythm-field" aria-hidden="true"><div class="lane-grid">${C.wrap.actions.map((a,i)=>`<div class="rhythm-lane lane-${i}"><span class="lane-top">${moveIcon(a.id)}</span><span class="target-shape">${moveIcon(a.id)}</span><span class="lane-burst">✦</span></div>`).join('')}</div><div class="hit-line"></div><div id="falling-objects"></div></div>`;}
function practiceView(){
  if(typeof practice!=='object')practice={seen:new Set(),guided:false,complete:false};
  return `${heading(C.wrap.tutorial,C.wrap.practice,practice.guided?'':C.wrap.practiceCopy)}${practice.guided?`${laneField()}${laneButtons()}<p class="practice-prompt" id="practice-prompt"></p>`:`<div class="practice-stage">${character('wrapper')}<div id="practice-object">${moveIcon('fold')}</div></div>${laneButtons()}<p class="practice-prompt" id="practice-prompt"></p>${button(practice.complete?C.wrap.practiceFinish:C.wrap.practiceStart,practice.complete?'go:wrap':'practice-guide','primary full',practice.seen.size<4?'disabled':'')}`}${status()}${nav(C.app.back,'wrap','secondary full')}`;
}
function newWrap(){const d=C.wrap.difficulty.find(d=>d.id===difficulty)||C.wrap.difficulty[1];run={difficulty:d,customer:0,results:[],score:0,combo:0,maxCombo:0,complete:false,paused:false,start:0,round:null};wrapResult=null;}
function orderView(){const customer=C.wrap.customers[run?.customer||0];return `${heading(fmt(C.wrap.customer,{current:(run?.customer||0)+1}),C.cast[customer.cast])}<div class="customer-scene">${character(customer.cast)}${customer.cast==='king'?`<div class="singers">${character('singer')}${character('singer')}</div>`:''}<blockquote>${esc(customer.order)}</blockquote>${customer.cast==='king'?`<p class="echo">${esc(C.wrap.singerEcho)}</p>`:''}</div><div class="move-legend">${C.wrap.actions.map(a=>`<span>${moveIcon(a.id)}${esc(a.label)}</span>`).join('')}</div><p class="subtle">${esc(C.app.mutedTip)}</p>${button(C.wrap.ready,'wrap-ready','primary full')}`;}
function wrapPlayView(){const song=C.wrap.songs[run.customer];return `<div class="play-heading"><div>${eyebrow(C.wrap.title)}<h1 tabindex="-1">${t(C.wrap.round,{current:run.customer+1})}</h1></div>${button(C.app.pause,'pause','small-button')}</div><div class="scorebar"><span>${esc(C.app.score)} <strong id="wrap-score">${run.score}</strong></span><span id="combo">${t(C.wrap.combo,{count:run.combo})}</span><span id="song-time"></span></div><div class="rhythm-cast">${character('wrapper')}<p>${t(C.wrap.songLabel,{title:song.title})}</p>${character(C.wrap.customers[run.customer].cast)}</div>${laneField()}${laneButtons()}<div class="rhythm-feedback">${status()}<span id="beat-count"></span></div><div id="pause-layer"></div>`;}
function wrapGiftView(){const result=preview?{grade:'A',ratio:.85,combo:20}:run.results.at(-1);const i=preview?0:run.customer;return `${heading(fmt(C.wrap.customer,{current:i+1}),C.wrap.giftDone)}${medalBadge(result.grade)}<p class="grade-detail">${t(C.wrap.accuracy,{percent:Math.round(result.ratio*100)})}</p><p>${t(C.wrap.maxCombo,{count:result.combo})}</p><div class="thank-you">${character(C.wrap.customers[i].cast)}<p>${esc(C.wrap.customerThanks[i])}</p></div>${button(preview?C.hub.review:i<2?C.wrap.next:C.wrap.done,preview?'review-menu':'wrap-next','primary full')}`;}
function wrapResultsView(){const result=preview?{score:6240,maxCombo:24,grades:['A','S','B'],best:false}:wrapResult;return `${heading(C.wrap.results,C.wrap.done,C.wrap.resultCopy)}<div class="result-total">${result.score}<small>${esc(C.app.score)}</small></div><div class="grade-row" aria-label="${esc(C.wrap.grades)}">${result.grades.map((g,i)=>`<div class="song-medal"><strong>${esc(C.wrap.songs[i].title)}</strong>${medalBadge(g,true)}</div>`).join('')}</div><p>${t(C.wrap.maxCombo,{count:result.maxCombo})}</p><p class="unlock-banner">${esc(wrapMedal(result.grades)>=0?fmt(C.treasure.layerWon,{layer:C.gift.layers[0]}):C.treasure.wrapNear)}</p>${helper(save.profile,save.collection.equipped)}${preview?'':boxLink(save)}${result.best?`<p class="unlock-banner">${esc(C.app.newBest)}</p>`:''}<p class="subtle">${t(C.app.best,{value:save.wrapBest})}</p>${wrapMedal(result.grades)>=0?button(C.wrap.finish,preview?'go:unwrap':'claim:wrap','primary full'):nav(C.hub.collection,'collection','primary full')}${nav(C.app.playAgain,'wrap','secondary full')}`;}

function towerView(){return `${heading(C.tower.eyebrow,C.tower.title,C.tower.intro)}<p class="unlock-banner">${t(C.treasure.towerGoal,{count:C.treasure.towerMedals[0]})}</p><div class="tower-promo">${gift({small:true,paper:'stars'})}${gift({small:true})}${gift({small:true,paper:'stars'})}</div><p class="instruction-card">${esc(C.tower.steps)}</p><p class="personal-best">${t(C.tower.best,{count:save.towerBest})}</p>${button(C.tower.start,'tower-start','primary full')}`;}
function newTower(){tower={boxes:[],fall:null,held:{x:160,y:26,w:104,color:0},score:0,height:0,phase:0,paused:false,complete:false,streak:0,lastColor:-1};towerResult=null;}
function towerPlayView(){return `${eyebrow(C.tower.title)}<div class="play-heading"><h1 tabindex="-1" id="tower-height">${t(C.tower.height,{count:tower.height})}</h1>${button(C.app.pause,'pause','small-button')}</div><div class="scorebar"><span id="tower-score">${esc(C.app.score)} ${tower.score}</span><span>${t(C.tower.best,{count:save.towerBest})}</span></div><canvas id="tower-canvas" width="320" height="360" role="img" aria-label="${esc(C.tower.sky)}"></canvas>${button(C.tower.drop,'tower-drop','primary full drop-pad')}<p class="subtle">${esc(C.tower.tip)}</p>${status()}<div id="pause-layer"></div>`;}
function towerResultsView(){const result=preview?{height:12,score:1050,best:true}:towerResult;return `${heading(C.tower.title,C.tower.over)}<div class="single-art">${helper(save.profile,save.collection.equipped)}</div><p class="result-detail">${t(C.tower.result,result)}</p>${result.best?`<p class="unlock-banner">${esc(C.app.newBest)}</p>`:''}<p>${t(C.tower.best,{count:save.towerBest})}</p><p>${esc(towerMedal(result.height)>=0?fmt(C.treasure.layerWon,{layer:C.gift.layers[2]}):fmt(C.treasure.towerNear,{count:result.height,goal:C.treasure.towerMedals[0]}))}</p>${preview?'':boxLink(save)}${towerMedal(result.height)>=0?button(C.wrap.finish,preview?'go:unwrap':'claim:tower','primary full'):nav(C.hub.collection,'collection','secondary full')}${button(C.app.playAgain,'tower-start','primary full')}${nav(C.app.home,'hub','secondary full')}`;}
function finaleView(){const open=dateOpen(C.finale.date,review);return `${heading(C.app.title,C.finale.title,C.finale.intro)}<div class="gift-stage">${gift()}</div>${save.finale?nav(C.finale.showCertificate,'certificate','primary full'):open?`<form id="finale-form"><label for="finale-code">${esc(C.finale.label)}</label><input id="finale-code" name="code" maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="${esc(C.finale.placeholder)}"><button type="submit" class="primary full">${esc(C.finale.submit)}</button></form>${status()}`:`<p class="instruction-card">${esc(C.finale.locked)}</p>`}${review?`<p class="subtle">${t(C.review.code,{code:C.finale.code})}</p>`:''}${nav(C.hub.invite,'invitation','secondary full')}`;}
function finalRevealView(){return `<div class="unwrap-scene final" id="unwrap-scene">${gift({open:true})}<span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✦</span><span class="spark s4">✦</span></div>${heading(C.app.title,C.finale.revealTitle,C.finale.revealCopy)}<p class="subtle">${esc(C.finale.placeholderNote)}</p>${nav(C.finale.showCertificate,'certificate','primary full')}`;}
function certificateView(){return `<article class="certificate"><div class="certificate-stars">✦ · ✦ · ✦</div>${eyebrow(C.app.brand)}<h1 tabindex="-1">${esc(C.finale.certificate)}</h1><p>${esc(C.finale.awarded)}</p><strong class="certificate-name">${esc(nickname(save.profile))}</strong><div class="certificate-party">${helper(save.profile,save.collection.equipped)}${character('wrapper')}${character('note')}${character('king')}</div><p>${esc(C.finale.reason)}</p><span class="certificate-stamp">✓</span><p class="certificate-date">${esc(C.invitation.day)}</p></article><p class="table-callout">${esc(C.finale.table)}</p>${nav(C.hub.invite,'invitation','primary full')}${nav(C.app.home,'hub','secondary full')}`;}
function invitationView(){return `<div class="invite-art">${landscape()}${gift()}${character('wrapper')}</div>${heading(C.invitation.eyebrow,C.invitation.title,C.invitation.presenter)}<div class="event-facts"><p><span>▦</span><strong>${esc(C.invitation.day)}</strong><small>${esc(C.invitation.time)}</small></p><p><span>⌖</span><strong>${esc(C.invitation.location)}</strong><small>${esc(C.invitation.address)}<br>${esc(C.invitation.city)}</small></p></div><p class="donation">▣ ${esc(C.invitation.donation)}</p><p class="invite-cta">${esc(C.invitation.cta)}</p><a class="primary full" href="${C.invitation.websiteUrl}" rel="noopener noreferrer" target="_blank">${esc(C.invitation.website)} ↗</a>${nav(C.app.home,'hub','secondary full')}`;}
function reviewView(){return `${heading(C.app.preview,C.review.title,fmt(C.review.intro,{code:C.finale.code}))}${button(review?C.review.disable:C.review.enable,'review-toggle','primary full')}<h2>${esc(C.review.jump)}</h2><div class="review-grid">${C.review.routes.map(([id,label])=>button(label,`jump:${id}`,'secondary',review?'':'disabled')).join('')}</div><hr>${button(C.review.reset,'reset','danger full')}`;}

// Multi-pointer input resolves on pointerdown; click handles assistive/keyboard activation only.
function bindLanes(hit){
  const buttons=all('[data-lane]');
  const down=e=>{if(e.button!==0)return;e.preventDefault();unlockAudio();hit(Number(e.currentTarget.dataset.lane));};
  const click=e=>{if(e.detail===0){unlockAudio();hit(Number(e.currentTarget.dataset.lane));}};
  const keyboard=e=>{const lane={d:0,f:1,j:2,k:3,ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3}[e.key.length===1?e.key.toLowerCase():e.key];if(lane===undefined)return;e.preventDefault();if(!e.repeat){unlockAudio();hit(lane);}};
  const block=e=>{if(document.body.classList.contains('rhythm-active'))e.preventDefault();};
  buttons.forEach(el=>{el.addEventListener('pointerdown',down);el.addEventListener('click',click);});
  document.addEventListener('keydown',keyboard);$('#main').addEventListener('contextmenu',block);$('#main').addEventListener('touchmove',block,{passive:false});
  return ()=>{buttons.forEach(el=>{el.removeEventListener('pointerdown',down);el.removeEventListener('click',click);});document.removeEventListener('keydown',keyboard);};
}
function laneFlash(lane,hit=true){
  const button=$(`[data-lane="${lane}"]`),track=$(`.rhythm-lane.lane-${lane}`);
  for(const el of [button,track]){if(!el)continue;el.classList.remove('hit','wrong');void el.offsetWidth;el.classList.add(hit?'hit':'wrong');}
}
function paintNotes(chart,judged,time,travel){
  const host=$('#falling-objects');
  // Mount a shape once, then move it. Avoid rebuilding SVGs on every phone frame.
  const mounted=new Map([...host.children].map(el=>[Number(el.dataset.note),el]));
  chart.events.forEach((event,index)=>{
    const delta=event.time-time;
    if(judged.has(index)||delta>travel||delta< -450)return;
    let el=mounted.get(index);
    if(!el){el=document.createElement('span');el.className=`falling-object lane-${event.lane}`;el.dataset.note=index;el.style.left=`${event.lane*25}%`;el.innerHTML=moveIcon(C.wrap.actions[event.lane].id);host.append(el);}
    el.style.top=`${84*(1-delta/travel)}%`;mounted.delete(index);
  });
  for(const el of mounted.values())el.remove();
}
function activatePractice(){
  let frame=0,start=performance.now()+3000;
  const chart={events:[0,1,2,3].map((lane,i)=>({time:i*3000,lane,midi:[60,64,67,72][lane]}))},judged=new Set();
  if(practice.guided)$('#practice-prompt').textContent=fmt(C.wrap.practiceNext,{move:C.wrap.actions[0].label});
  const unbind=bindLanes(lane=>{
    music.tone([60,64,67,72][lane],C.wrap.actions[lane].id);laneFlash(lane);
    if(!practice.guided){practice.seen.add(lane);$('#practice-object').innerHTML=moveIcon(C.wrap.actions[lane].id);$('#practice-prompt').textContent=C.wrap.actions[lane].label;$('[data-action="practice-guide"]')?.removeAttribute('disabled');if(practice.seen.size<4)$('[data-action="practice-guide"]').disabled=true;return;}
    const elapsed=performance.now()-start;
    const index=chart.events.findIndex((e,i)=>!judged.has(i)&&e.lane===lane&&Math.abs(e.time-elapsed)<=650);
    if(index>=0){judged.add(index);feedback(C.wrap.perfect);const next=chart.events.find((e,i)=>!judged.has(i));$('#practice-prompt').textContent=next?fmt(C.wrap.practiceNext,{move:C.wrap.actions[next.lane].label}):C.wrap.practiceDone;}
    else feedback(C.wrap.empty);
  });
  const tick=now=>{
    if(practice.guided){
      const time=now-start;
      if(judged.size===4){practice.guided=false;practice.complete=true;dispose();render();return;}
      // A missed practice shape returns slowly. There is no failure or score.
      const missed=chart.events.find((e,i)=>!judged.has(i)&&time>e.time+650);
      if(missed){const remaining=chart.events.filter((e,i)=>!judged.has(i));remaining.forEach((e,i)=>e.time=time+2400+i*3000);}
      paintNotes(chart,judged,time,3000);
    }
    frame=requestAnimationFrame(tick);
  };
  if(practice.guided)frame=requestAnimationFrame(tick);
  dispose=()=>{cancelAnimationFrame(frame);unbind();};
}
function activateWrap(){
  const song=C.wrap.songs[run.customer],chart=song.variants[run.difficulty.id];
  if(!run.round)run.round=createRound(chart,run.difficulty);
  if(!run.start)run.start=performance.now()+run.difficulty.travel;
  const round=run.round,baseScore=run.score,automatic=chart.automatic||[];
  let frame=0;
  run.audioIndex=Math.max(-6,Math.ceil((performance.now()-run.start)/(chart.beat/2)));
  run.autoIndex=0;
  function update(){
    $('#wrap-score').textContent=baseScore+round.score;
    $('#combo').textContent=fmt(C.wrap.combo,{count:round.combo});
    $('#beat-count').textContent=fmt(C.wrap.beat,{current:round.judged.size,total:chart.events.length});
  }
  const unbind=bindLanes(lane=>{
    if(run.paused)return;
    const elapsed=performance.now()-run.start;
    if(elapsed>chart.duration)return;
    const result=judgeTap(round,lane,elapsed);
    if(result.tier){music.tone(result.event.midi,C.wrap.actions[lane].id);feedback(result.tier===2?C.wrap.perfect:C.wrap.good);}
    else feedback(result.stray?C.wrap.empty:C.wrap.wrong);
    if(result.index!==undefined)$(`[data-note="${result.index}"]`)?.remove();
    laneFlash(lane,!!result.tier);update();
  });
  function tick(now){
    if(!run.paused){
      const time=now-run.start;
      if(expireNotes(round,time).length){feedback(C.wrap.miss);update();}
      if(time>=chart.duration+run.difficulty.window){
        run.results.push(roundResult(round));run.score=baseScore+round.score;run.maxCombo=Math.max(run.maxCombo,round.maxCombo);run.combo=0;navigate('wrapGift');return;
      }
      const lookahead=350+music.latency*1000;
      while(run.audioIndex*chart.beat/2<chart.duration&&run.start+run.audioIndex*chart.beat/2-now<lookahead){
        if(run.audioIndex>=0||run.audioIndex%2===0)music.backing(song,chart.beat,run.audioIndex,run.start+run.audioIndex*chart.beat/2);
        run.audioIndex++;
      }
      while(run.autoIndex<automatic.length&&run.start+automatic[run.autoIndex].time-now<lookahead){
        const event=automatic[run.autoIndex++];music.automatic(event,run.start+event.time);
      }
      if(time<0&&time>=-3*chart.beat)feedback(fmt(C.wrap.countIn,{count:Math.ceil(-time/chart.beat)}));
      else if(time>=0&&$('#feedback').textContent.endsWith('…'))feedback('');
      paintNotes(chart,round.judged,time,run.difficulty.travel);
      $('#song-time').textContent=fmt(C.wrap.timeLeft,{seconds:Math.max(0,Math.ceil((chart.duration-Math.max(0,time))/1000))});
    }
    frame=requestAnimationFrame(tick);
  }
  update();feedback(C.wrap.countdown);frame=requestAnimationFrame(tick);
  dispose=()=>{cancelAnimationFrame(frame);unbind();};
}
function pauseGame(){
  const game=view==='wrapPlay'?run:view==='towerPlay'?tower:null;if(!game||game.paused)return;
  game.paused=true;game.pauseAt=performance.now();hush();
  $('#pause-layer').innerHTML=`<div class="pause-backdrop"><section class="pause-card" role="dialog" aria-modal="true" aria-labelledby="pause-title"><h2 id="pause-title">${esc(C.app.paused)}</h2><p>${esc(C.app.pausedCopy)}</p>${button(C.app.resume,'resume','primary full')}${button(save.sound?C.app.soundOn:C.app.soundOff,'sound','secondary full','aria-pressed="'+save.sound+'"')}${nav(C.app.home,'hub','secondary full')}</section></div>`;
  $('#pause-layer button')?.focus();
}
function resumeGame(){
  const game=view==='wrapPlay'?run:tower;if(!game?.paused)return;
  if(view==='wrapPlay'){
    run.start+=performance.now()-run.pauseAt;
    const elapsed=performance.now()-run.start,chart=run.round.chart,automatic=chart.automatic||[];
    run.audioIndex=Math.max(-6,Math.ceil(elapsed/(chart.beat/2)));
    run.autoIndex=automatic.findIndex(e=>e.time>=elapsed);
    if(run.autoIndex<0)run.autoIndex=automatic.length;
  }
  game.paused=false;unlockAudio();$('#pause-layer').innerHTML='';
  (view==='wrapPlay'?$('[data-lane]'):$('[data-action="tower-drop"]'))?.focus();
}

function activateTower(){
  const canvas=$('#tower-canvas'),ctx=canvas.getContext('2d');
  const colours=[['#a82947','#da4962'],['#28655b','#71b5a3'],['#745a87','#b594c1']];
  let frame=0,last=performance.now();
  function sway(i){return Math.sin(tower.phase*.8)*Math.min(tower.height*.5,9)*(i/Math.max(1,tower.height));}
  function camera(){return Math.max(0,(tower.height-8)*24);}
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function box(x,y,w,color){const pair=colours[color];rect(x-w/2-2,y-2,w+4,26,'#29283d');rect(x-w/2,y,w,22,pair[0]);rect(x-w/2,y,w,4,pair[1]);rect(x-4,y,8,22,'#f4c766');rect(x-2,y,2,22,'#fff3d6');}
  function nextBox(){const colors=[0,1,1,1,2,0,0,0,2,2,2,1];tower.held={x:160,y:26,w:Math.max(30,tower.boxes.at(-1)?.w||104),color:colors[tower.height%colors.length]};tower.fall=null;$('[data-action="tower-drop"]').disabled=false;}
  function finish(){tower.complete=true;const replay=save.layers.includes(3);const best=tower.height>save.towerBest;save.towerBest=Math.max(save.towerBest,tower.height);if(episodeOpen(C.episodes[2],review))rewardResult('tower',towerMedal(tower.height),best);persist();towerResult={replay,height:tower.height,score:tower.score,best};navigate('towerResults');}
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

function claim(source){
  const ep=C.episodes.find(ep=>ep.game===source);
  const result=source==='wrap'?wrapResult:source==='sorting'?sortingResult:towerResult;
  if(!ep||!result||preview||!episodeOpen(ep,review))return;
  episode=ep;C=episodeContent(ep);
  if(!save.layers.includes(ep.id))return;
  persist();navigate('unwrap');unlockAudio();if(source==='sorting')music.tone(60,'tape');else note(0,true);
}
function jump(route){
  if(!review||!routes.has(route))return;
  if(!save.profile){save.profile=newProfile();profile=save.profile;persist();}
  if(route.startsWith('wrap')&&['wrapOrder','wrapPlay','wrapGift'].includes(route)){newWrap();if(route==='wrapPlay'){run.start=0;unlockAudio();}}
  if(route==='towerPlay'){newTower();unlockAudio();}
  if(route==='wrapPractice')practice=0;
  const demo=['wrapGift','wrapResults','towerResults','unwrap','finalReveal','certificate'].includes(route);
  navigate(route,{demo});
}
function resetDialog(){
  $('#modal-root').innerHTML=`<div class="pause-backdrop"><section class="pause-card" role="alertdialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">${esc(C.app.resetQuestion)}</h2><p>${esc(C.app.resetDetail)}</p>${button(C.app.cancel,'reset-cancel','primary full')}${button(C.app.yes,'reset-confirm','danger full')}</section></div>`;$('#modal-root button')?.focus();
}

root.addEventListener('click',async event=>{
  const el=event.target.closest('[data-action]');if(!el||el.disabled)return;event.preventDefault();
  const [action,value]=el.dataset.action.split(':');
  if(action==='book-tab'){bookTab=value;render();return;}
  if(action==='open-box'){lastPull=openBox(save,trusted.now(),review);persist();render();return;}
  if(action==='skip-reveal'){$('.card-reveal')?.classList.remove('card-reveal');return;}
  if(action==='exchange'){if(exchangeStars(save,value,trusted.now(),review)){persist();render();}return;}
  if(action==='equip'){const outfit=C.treasure.outfits.find(o=>o.id===value);if(outfit&&save.collection.outfits.includes(value)){save.collection.equipped[outfit.slot]=value;persist();render();}return;}
  if(action==='unequip'){delete save.collection.equipped[value];persist();render();return;}
  if(action==='helper-save'){save.profile={...profile};persist();navigate('hub');return;}
  if(action==='dismiss-home'){save.collection.homePromptAt=Math.floor(trusted.now());persist();render();return;}
  if(action==='copy-code'){try{await navigator.clipboard.writeText($('#save-code').value);feedback(C.treasure.copied);}catch{$('#save-code').select();feedback(C.treasure.copyFailed);}return;}
  if(action==='sleigh-guide'){document.querySelector('#modal-root').innerHTML=`<div class="pause-backdrop"><div class="pause-card road-guide-card" role="dialog" aria-modal="true">${roadGuide({close:C.sleigh.guideSetupClose})}</div></div>`;document.querySelector('#sleigh-guide-close').focus();return;}
  if(action==='sleigh-guide-close'){document.querySelector('#modal-root').innerHTML='';return;}
  if(action==='sleigh-start'||action==='sleigh-practice'){const chosen=review?Number($('#sleigh-stage-select')?.value)||1:1;sleigh=createSleigh({stage:chosen,practice:action==='sleigh-practice'||(!save.sleighPractice&&chosen===1)});unlockAudio();navigate('sleighPlay');return;}
  if(action==='sorting-start'||action==='sorting-practice'){const chosen=review?Number($('#sort-stage-select')?.value)||undefined:undefined;const practice=action==='sorting-practice'||(!save.sortingPractice&&!chosen);sorting=createSorting(sortingDifficulty,chosen,practice);unlockAudio();navigate('sortingPlay');return;}
  if(action==='go'){if(value==='helper')profile={...save.profile};if(value==='boxes')lastPull=null;if(value==='wrapPractice')practice=0;navigate(value,{demo:preview&&['unwrap','certificate'].includes(value)});return;}
  if(action==='jump'){jump(value);return;}
  if(action==='review-menu'){navigate('review');return;}
  if(action==='sound'){
    save.sound=!save.sound;if(save.sound){unlockAudio();if(view.startsWith('sleigh'))music.tone(72,'tape');else if(view.startsWith('sorting'))music.tone(60,'tape');else note(0,true);}else hush();persist();el.textContent=save.sound?C.app.soundOn:C.app.soundOff;el.setAttribute('aria-pressed',String(save.sound));return;
  }
  if(action==='shuffle'){const avatar=profile.avatar;profile={...newProfile(),avatar};$('#nickname').textContent=nickname(profile);return;}
  if(action==='profile'){save.profile={...profile};welcomePulls=welcomePack(save,trusted.now());persist();navigate(welcomePulls.length?'welcome':'hub');return;}
  if(action==='episode'){const next=C.episodes.find(ep=>ep.id===Number(value))||C.episodes[0];if(episodeOpen(next,review)){selectEpisode(next);navigate(next.game);}return;}
  if(action==='first-episode'){selectEpisode(C.episodes[0]);navigate('hub');return;}
  if(action==='practice-guide'){practice.guided=true;unlockAudio();dispose();render();return;}
  if(action==='wrap-start'){newWrap();unlockAudio();navigate('wrapOrder');return;}
  if(action==='wrap-ready'){run.round=null;run.start=0;run.paused=false;unlockAudio();navigate('wrapPlay');unlockAudio();return;}
  if(action==='wrap-next'){
    if(!run||run.complete||run.results.length!==run.customer+1)return;
    if(run.customer<2){run.customer++;navigate('wrapOrder');}
    else{run.complete=true;const replay=save.layers.includes(1);const best=run.score>save.wrapBest;save.wrapBest=Math.max(save.wrapBest,run.score);persist();wrapResult={replay,score:run.score,maxCombo:run.maxCombo,grades:run.results.map(r=>r.grade),best};if(episodeOpen(C.episodes[0],review))rewardResult('wrap',wrapMedal(wrapResult.grades),best);navigate('wrapResults');}return;
  }
  if(action==='pause'){pauseGame();return;}if(action==='resume'){resumeGame();return;}
  if(action==='claim'){claim(value);return;}
  if(action==='tower-start'){newTower();navigate('towerPlay');unlockAudio();return;}
  if(action==='tower-drop'){if(tower&&!tower.paused&&!tower.fall&&!tower.complete){tower.fall={...tower.held,vy:0};el.disabled=true;}return;}
  if(action==='review-toggle'){review=!review;const url=new URL(location.href);if(review)url.searchParams.set('review','1');else url.searchParams.delete('review');history.replaceState(null,'',url);navigate('review');return;}
  if(action==='reset'){resetDialog();return;}if(action==='reset-cancel'){$('#modal-root').innerHTML='';$('[data-action="reset"]')?.focus();return;}
  if(action==='reset-confirm'){
    dispose();save=freshSave();profile=newProfile();run=null;tower=null;sleigh=null;sleighResult=null;wrapResult=null;towerResult=null;practice=0;
    try{storage?.removeItem(SAVE_KEY);}catch{}selectEpisode(C.episodes[0]);persist();navigate('onboard');toast(C.app.resetDone);return;
  }
});
root.addEventListener('change',event=>{if(event.target.name==='sorting-difficulty')sortingDifficulty=event.target.value;if(event.target.name==='avatar'){profile.avatar=event.target.value;if(view==='helper'){$('.helper-preview').innerHTML=helper(profile,save.collection.equipped);}}if(event.target.name==='difficulty')difficulty=event.target.value;});
root.addEventListener('submit',event=>{
  event.preventDefault();
  if(event.target.id==='restore-form'){
    try{const restored=decodeSave($('#restore-code').value);save=restored;profile={...save.profile};persist();navigate('collection');toast(C.treasure.restored);}catch{feedback(C.treasure.badCode);}return;
  }
  if(event.target.id==='finale-form'){
    if(!dateOpen(C.finale.date,review)){feedback(C.finale.locked);return;}
    if($('#finale-code').value.trim().toUpperCase()!==C.finale.code){feedback(C.finale.incorrect);return;}
    save.finale=true;settleCollection(save);persist();navigate('finalReveal');unlockAudio();note(0,true);note(.14);note(.28,true);
  }
});
window.addEventListener('offline',()=>{trusted.freeze();if(view==='hub')updateCountdown();});
window.addEventListener('online',refreshTime);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){trusted.freeze();if(['wrapPlay','towerPlay'].includes(view))pauseGame();hush();}
  else {refreshTime();updates.check();}
});
window.addEventListener('popstate',()=>{const next=C.episodes.find(ep=>ep.id===Number(new URLSearchParams(location.search).get('episode')))||C.episodes[0];if(next.id!==episode.id)selectEpisode(next);navigate(location.hash.slice(1)||'hub');});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if($('#modal-root')?.children.length){$('#modal-root').innerHTML='';$('[data-action="reset"]')?.focus();}else if(['wrapPlay','towerPlay'].includes(view))pauseGame();}
  const dialog=root.querySelector('[role="dialog"], [role="alertdialog"]');
  if(dialog&&event.key==='Tab'){const focusables=[...dialog.querySelectorAll('button')],first=focusables[0],last=focusables.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
if(save.profile&&!save.collection.welcome)welcomePulls=welcomePack(save,trusted.now());
if(save.profile)persist();
navigate(location.hash.slice(1)||'hub');

refreshTime();
if('serviceWorker' in navigator)navigator.serviceWorker.register(new URL('sw.js',SITE_ROOT),{scope:SITE_ROOT.pathname,updateViaCache:'none'}).then(()=>navigator.serviceWorker.ready).then(()=>navigator.serviceWorker.controller?.postMessage({type:'prune-builds',id:BUILD_ID})).catch(()=>{});
updates.check();
setInterval(()=>{if(!document.hidden)updates.check();},C.update.interval);
document.addEventListener('focusout',()=>setTimeout(()=>updates.consider(),0));
new MutationObserver(()=>updates.consider()).observe(root,{childList:true,subtree:true});

function sortingView(){return `${heading(C.sorting.eyebrow,C.sorting.title,C.sorting.intro)}<div class="cast-line">${character('singer')}${character('king')}${character('singer')}</div><fieldset class="difficulty"><legend>${esc(C.sorting.choose)}</legend>${C.sorting.difficulties.map(d=>`<label><input type="radio" name="sorting-difficulty" value="${d.id}" ${d.id===sortingDifficulty?'checked':''}><strong>${esc(d.label)}</strong><small>${esc(d.detail)}</small><small class="sorting-setup-best">${t(C.sorting.scoring.setupBest,{score:sortingNumber(save.sortingBests[d.id])})}</small></label>`).join('')}</fieldset><p class="sorting-score-lesson">${esc(C.sorting.scoring.teach)}</p>${review?`<label>${esc(C.sorting.reviewStage)} <select id="sort-stage-select"><option value="0">—</option>${C.sorting.stages.map(s=>`<option value="${s.stage}">${s.stage}</option>`).join('')}</select></label>`:''}<p>${esc(C.app.mutedTip)}</p><p id="music-loading" class="subtle" role="status" ${music.state==='ready'?'hidden':''}>${esc(music.state==='failed'?C.sorting.music.failed:C.sorting.music.loading)}</p><p class="subtle"><a href="${new URL('./audio/credits.html',import.meta.url)}" target="_blank" rel="noopener">${esc(C.wrap.musicCredits)}</a></p>${button(C.sorting.start,'sorting-start','primary full')}${save.sortingPractice?button(C.sorting.practice,'sorting-practice','secondary full'):''}`;}
function finishSorting(r){if(r.practice){save.sortingPractice=true;persist();navigate('sorting');toast(C.sorting.practiceDone);return;}sortingResult=recordSorting(save,r);if(episodeOpen(C.episodes[1],review))rewardResult('sorting',sortingResult.medals.length-1,sortingResult.best,true);navigate('sortingResults');}
function sortingResultsView(){
 const r=sortingResult,S=C.sorting,L=S.scoring,difficulty=S.difficulties.find(d=>d.id===r.difficulty).label;
 const row=(key,label,value)=>`<div><dt>${esc(label)}</dt><dd data-points="${key}" data-value="${value}">${sortingNumber(value)}</dd></div>`;
 return `<section class="sorting-party" data-celebration="${r.celebration}">${heading(S.title,L.party)}${helper(save.profile,save.collection.equipped)}${boxLink(save)}${r.best?`<p class="sorting-new-best">★ ${esc(L.newBest)}</p>`:''}<div class="sorting-medals">${r.medals.map((id,i)=>`<p class="sorting-medal-stamp" style="--stamp-delay:${i*.18}s">✦ ${t(S.medal,{medal:S.papers.find(p=>p.id===id).medal})}</p>`).join('')}</div><dl class="sorting-breakdown">${row('base',fmt(L.base,{count:r.sorted,points:S.tuning.basePoints}),r.points.base)}${row('quick',L.quickTotal,r.points.quick)}${row('rush',L.rushTotal,r.points.rush)}${row('combo',L.comboTotal,r.points.combo)}</dl><div class="result-total" id="sorting-total" data-value="${r.score}">${sortingNumber(r.score)}<small>${esc(L.total)}</small></div><p class="sorting-personal-best">${t(L.best,{difficulty,score:sortingNumber(r.personalBest)})}</p><p>${t(L.bestRun,{combo:r.bestCombo,stage:r.stage})}</p><p class="unlock-banner">${esc(S.layer)}</p>${r.medals.length?'':`<p>${esc(S.noMedal)}</p>`}${button(S.finish,'claim:sorting','primary full')}${nav(C.app.playAgain,'sorting','secondary full')}</section>${celebration(24+r.celebration*12)}`;
}

function sleighView(){const S=C.sleigh;return `${heading(S.eyebrow,S.title,S.intro)}<div class="single-art">${character('note')}</div><p class="unlock-banner">${t(S.goal,{count:S.medalsAt[0]})}</p><p class="instruction-card">${esc(S.controls)}</p><p>${esc(S.keyboard)}</p><p class="personal-best">${t(S.best,{count:save.sleighBest})}</p>${save.towerBest?`<p>${t(S.pennant,{count:save.towerBest})}</p>`:''}${review?`<label>${esc(S.reviewStage)} <select id="sleigh-stage-select">${S.stages.map(c=>`<option value="${c.stage}">${c.stage}</option>`).join('')}</select></label>`:''}<p>${esc(C.app.mutedTip)}</p><p id="music-loading" class="subtle" role="status" ${music.state==='ready'?'hidden':''}>${esc(music.state==='failed'?S.music.failed:S.music.loading)}</p><p class="subtle"><a href="${new URL('./audio/credits.html',import.meta.url)}" target="_blank" rel="noopener">${esc(C.wrap.musicCredits)}</a></p>${button(S.start,'sleigh-start','primary full')}${button(S.practice,'sleigh-practice','secondary full')}${button(S.guide,'sleigh-guide','secondary full')}`;}
function finishSleigh(r){if(r.practice){save.sleighPractice=true;persist();navigate('sleigh');toast(C.sleigh.practiceDone);return;}
 sleighResult=recordSleigh(save,r);if(episodeOpen(C.episodes[3],review))rewardResult('sleigh',sleighResult.medal,sleighResult.best);persist();navigate('sleighResults');
}
function sleighResultsView(){const r=sleighResult,S=C.sleigh;return `<section class="sorting-party" data-celebration="${r.celebration}">${heading(S.results,S.over)}${boxLink(save)}<div class="single-art">${helper(save.profile,save.collection.equipped)}</div>${r.best?`<p class="sorting-new-best">${esc(S.newBest)}</p>`:''}<div class="result-total">${r.delivered}<small>${t(S.record,{count:r.delivered})}</small></div>${r.medal>=0?`<p class="sorting-medal-stamp">${t(S.medal,{medal:S.medals[r.medal]})}</p><p class="unlock-banner">${esc(S.layer)}</p>`:`<p>${t(S.near,{count:S.medalsAt[0]-r.delivered})}</p>`}<p>${t(S.bonusTotal,{count:r.perfect,points:r.bonusPoints})}</p>${r.cause?`<p class="sleigh-cause">${t(S.objects[r.cause.kind].result,{count:r.cause.count})}</p>`:''}<p>${t(S.distance,{count:r.distance})}</p><p>${t(S.best,{count:r.personalBest})}</p>${nav(S.again,'sleigh','primary full')}${nav(C.app.home,'hub','secondary full')}</section>${celebration(24+r.celebration*12)}`;}
