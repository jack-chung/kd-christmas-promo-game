import { C, episodeContent, hiddenTargets } from './content.js';
export const SAVE_KEY = 'tuneville-gift-v1';
export const freshSave = () => ({version:1,profile:null,layers:[],paper:'cranberry',sound:false,wrapBest:0,mysteryBest:null,towerBest:0,mystery:null,episodeData:{},finale:false});
export function validProfile(p) {
  return p && Number.isInteger(p.adjective) && p.adjective >= 0 && p.adjective < C.profile.adjectives.length && Number.isInteger(p.noun) && p.noun >= 0 && p.noun < C.profile.nouns.length && Number.isInteger(p.number) && p.number >= 10 && p.number <= 99 && C.profile.avatars.some(a => a.id === p.avatar);
}
export function newProfile(random = Math.random) { return {adjective:Math.floor(random()*C.profile.adjectives.length),noun:Math.floor(random()*C.profile.nouns.length),number:10+Math.floor(random()*90),avatar:'wrapper'}; }
export function nickname(p) { return validProfile(p) ? `${C.profile.adjectives[p.adjective]} ${C.profile.nouns[p.noun]} ${p.number}` : ''; }
export function normalizeSave(raw) {
  const s=freshSave();
  if (!raw || raw.version!==1) return s;
  s.profile=validProfile(raw.profile)?raw.profile:null;
  s.layers=Array.isArray(raw.layers)?[...new Set(raw.layers.filter(id=>C.episodes.some(ep=>ep.id===id&&ep.ready)))]:[];
  s.paper=raw.paper==='stars'&&s.layers.length>0?'stars':'cranberry';
  s.sound=raw.sound===true;
  for (const k of ['wrapBest','towerBest']) if (Number.isFinite(raw[k])&&raw[k]>=0) s[k]=Math.floor(raw[k]);
  if (Number.isFinite(raw.mysteryBest)&&raw.mysteryBest>=0) s.mysteryBest=raw.mysteryBest;
  s.finale=raw.finale===true;
  for(const ep of C.episodes.filter(ep=>ep.ready)) {
    const data=raw.episodeData?.[ep.id]||(ep.id===1?raw:null);
    if(!data)continue;
    const targets=hiddenTargets(episodeContent(ep).mystery);
    const record={wrapBest:Number.isFinite(data.wrapBest)&&data.wrapBest>=0?Math.floor(data.wrapBest):0,mysteryBest:Number.isFinite(data.mysteryBest)&&data.mysteryBest>=0?data.mysteryBest:null,mystery:null};
    const m=data.mystery;
    if(m&&Array.isArray(m.solved)&&Array.isArray(m.found)&&Array.isArray(m.hints)) {
      record.mystery={solved:[...new Set(m.solved.filter(x=>['hidden','cipher','riddle'].includes(x)))],found:[...new Set(m.found.filter(x=>targets.includes(x)))],hints:[...new Set(m.hints.filter(x=>['hidden','cipher','riddle'].includes(x)))],elapsed:Number.isFinite(m.elapsed)&&m.elapsed>=0?m.elapsed:0};
      if(record.mystery.found.length<targets.length)record.mystery.solved=record.mystery.solved.filter(x=>x!=='hidden');
    }
    s.episodeData[ep.id]=record;
  }
  if(s.episodeData[1])Object.assign(s,s.episodeData[1]);
  return s;
}
export function loadSave(storage) { try {return {save:normalizeSave(JSON.parse(storage.getItem(SAVE_KEY))),ok:true};} catch {return {save:freshSave(),ok:false};} }
export function writeSave(storage,save) {try {storage.setItem(SAVE_KEY,JSON.stringify(save));return true;}catch{return false;}}
export const fmt=(template,values={})=>template.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export const dateOpen=(date,review=false,now=Date.now())=>review||now>=Date.parse(date);
export const episodeOpen=(episode,review=false,now=Date.now())=>episode.ready&&dateOpen(episode.date,review,now);
export function nextRelease(now=Date.now()) { return [...C.episodes,{date:C.finale.date}].find(e=>Date.parse(e.date)>now); }
export function countdown(date,now=Date.now()) {const minutes=Math.max(0,Math.ceil((Date.parse(date)-now)/60000));return {days:Math.floor(minutes/1440),hours:Math.floor(minutes%1440/60),minutes:minutes%60};}
export function clock(ms) {const sec=Math.floor(Math.max(0,ms)/1000);return fmt(C.app.time,{minutes:Math.floor(sec/60),seconds:String(sec%60).padStart(2,'0')});}
export const grade=ratio=>ratio>=.94?'S':ratio>=.78?'A':ratio>=.52?'B':'C';
export const timing=(offset,difficulty)=>Math.abs(offset)<=difficulty.perfect?2:Math.abs(offset)<=difficulty.window?1:0;
export const mysteryCode=(mystery=C.mystery)=>mystery.hiddenDigit+mystery.cipherAnswer+mystery.riddleDigit;
export const mysteryComplete=m=>m && ['hidden','cipher','riddle'].every(id=>m.solved.includes(id));
export const stars=m=>Math.max(0,3-m.hints.length);
export function landing(base,box) {const overlap=Math.min(base.x+base.w/2,box.x+box.w/2)-Math.max(base.x-base.w/2,box.x-box.w/2);const offset=box.x-base.x;return {overlap,offset,stable:overlap>=box.w*.42,perfect:Math.abs(offset)<=7,width:Math.max(27,Math.min(base.w,overlap))};}
