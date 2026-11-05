import { C } from './content.js';
export const SAVE_KEY = 'tuneville-gift-v1';
export const freshSave = () => ({version:2,profile:null,layers:[],paper:'cranberry',sound:false,wrapBest:0,towerBest:0,sortingBest:0,sortingBests:{easy:0,tunie:0,rapper:0},sortingPractice:false,sleighPractice:false,sleighPlayed:false,sleighBest:0,papers:[],finale:false});
export function validProfile(p) {
  return p && Number.isInteger(p.adjective) && p.adjective >= 0 && p.adjective < C.profile.adjectives.length && Number.isInteger(p.noun) && p.noun >= 0 && p.noun < C.profile.nouns.length && Number.isInteger(p.number) && p.number >= 10 && p.number <= 99 && C.profile.avatars.some(a => a.id === p.avatar);
}
export function newProfile(random = Math.random) { return {adjective:Math.floor(random()*C.profile.adjectives.length),noun:Math.floor(random()*C.profile.nouns.length),number:10+Math.floor(random()*90),avatar:'wrapper'}; }
export function nickname(p) { return validProfile(p) ? `${C.profile.adjectives[p.adjective]} ${C.profile.nouns[p.noun]} ${p.number}` : ''; }
export function normalizeSave(raw) {
  const s=freshSave();
  if (!raw || raw.version!==2) return s;
  s.profile=validProfile(raw.profile)?raw.profile:null;
  s.layers=Array.isArray(raw.layers)?[...new Set(raw.layers.filter(id=>C.episodes.some(ep=>ep.id===id&&ep.ready)))]:[];
  s.papers=Array.isArray(raw.papers)?[...new Set(raw.papers.filter(id=>C.sorting.papers.some(p=>p.id===id)))]:[];
  s.sortingPractice=raw.sortingPractice===true;
  s.sleighPractice=raw.sleighPractice===true;s.sleighPlayed=raw.sleighPlayed===true;
  s.paper=s.papers.includes(raw.paper)?raw.paper:raw.paper==='stars'&&s.layers.length?'stars':'cranberry';
  s.sound=raw.sound===true;
  for(const k of ['wrapBest','towerBest','sortingBest','sleighBest'])if(Number.isFinite(raw[k])&&raw[k]>=0)s[k]=Math.floor(raw[k]);
  // Older single records have no difficulty attribution. Start the new records fresh.
  for(const {id} of C.sorting.difficulties){const value=raw.sortingBests?.[id];if(Number.isFinite(value)&&value>=0)s.sortingBests[id]=Math.floor(value);}
  s.finale=raw.finale===true;
  return s;
}
export function loadSave(storage) { try {return {save:normalizeSave(JSON.parse(storage.getItem(SAVE_KEY))),ok:true};} catch {return {save:freshSave(),ok:false};} }
export function writeSave(storage,save) {try {storage.setItem(SAVE_KEY,JSON.stringify(save));return true;}catch{return false;}}
export const fmt=(template,values={})=>template.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export const dateOpen=(date,review=false,now=0)=>review||now>=Date.parse(date);
export const episodeOpen=(episode,review=false,now=0)=>episode.ready&&dateOpen(episode.date,review,now);
export function nextRelease(now=0) { return [...C.episodes,{date:C.finale.date}].find(e=>Date.parse(e.date)>now); }
export function countdown(date,now=0) {const minutes=Math.max(0,Math.ceil((Date.parse(date)-now)/60000));return {days:Math.floor(minutes/1440),hours:Math.floor(minutes%1440/60),minutes:minutes%60};}
export const grade=ratio=>ratio>=.94?'S':ratio>=.78?'A':ratio>=.52?'B':'C';
export const timing=(offset,difficulty)=>Math.abs(offset)<=difficulty.perfect?2:Math.abs(offset)<=difficulty.window?1:0;
export function landing(base,box) {const overlap=Math.min(base.x+base.w/2,box.x+box.w/2)-Math.max(base.x-base.w/2,box.x-box.w/2);const offset=box.x-base.x;return {overlap,offset,stable:overlap>=box.w*.42,perfect:Math.abs(offset)<=7,width:Math.max(27,Math.min(base.w,overlap))};}
