import {C} from './content.js';
const T=C.treasure;
export const freshCollection=()=>({cards:{},stars:0,outfits:[],equipped:{},boxes:[],sinceRare:0,welcome:false,friendCode:'',friends:[],newFriends:[],broughtBy:'',restored:false,started:0,claims:[],finished:0,homePromptAt:0});
const unique=(items,valid)=>Array.isArray(items)?[...new Set(items.filter(valid))]:[];
const integer=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export function normalizeCollection(raw={}){
 const c=freshCollection(); if(!raw||typeof raw!=='object')return c;
 for(const card of T.cards)if(T.sources[raw.cards?.[card.id]])c.cards[card.id]=raw.cards[card.id];
 c.stars=integer(raw.stars);c.outfits=unique(raw.outfits,id=>T.outfits.some(o=>o.id===id));
 for(const slot of Object.keys(T.slots))if(c.outfits.includes(raw.equipped?.[slot])&&T.outfits.find(o=>o.id===raw.equipped[slot])?.slot===slot)c.equipped[slot]=raw.equipped[slot];
 c.boxes=Array.isArray(raw.boxes)?raw.boxes.filter(n=>Number.isInteger(n)&&n>=0&&n<=3):[];
 c.sinceRare=Math.min(T.rareEvery-1,integer(raw.sinceRare));
 for(const key of ['welcome','restored'])c[key]=raw[key]===true;
 const code=v=>typeof v==='string'&&/^[A-Z0-9-]{4,48}$/.test(v);
 c.friendCode=code(raw.friendCode)?raw.friendCode:'';c.broughtBy=code(raw.broughtBy)?raw.broughtBy:'';
 for(const key of ['friends','newFriends'])c[key]=unique(raw[key],code);
 c.claims=unique(raw.claims,id=>typeof id==='string'&&id.length<=100);
 for(const key of ['started','finished','homePromptAt'])c[key]=integer(raw[key]);
 return c;
}
export const openSets=(now,review=false)=>T.sets.filter(s=>review||now>=Date.parse(s.date));
export const wrapMedal=grades=>Math.max(-1,...grades.map(g=>({B:0,A:1,S:2}[g]??-1)));
export const towerMedal=height=>T.towerMedals.reduce((m,n,i)=>height>=n?i:m,-1);
export function addCard(save,id,source){
 const card=T.cards.find(c=>c.id===id);if(!card||!T.sources[source])return null;
 const c=save.collection,duplicate=!!c.cards[id],stars=duplicate?T.duplicateStars[card.rarity]:0;
 if(duplicate)c.stars+=stars;else c.cards[id]=source;
 return {id,duplicate,stars};
}
export function settleCollection(save){
 const c=save.collection;
 for(const id of save.layers)if(!c.cards[T.hostIds[id-1]])addCard(save,T.hostIds[id-1],'layer');
 for(const set of T.sets)if(T.cards.filter(card=>card.set===set.id).every(card=>c.cards[card.id]))unlockOutfit(save,`set-${set.id}`);
 if(T.cards.filter(card=>T.sets.some(s=>s.id===card.set)).every(card=>c.cards[card.id])&&!c.cards.collector)addCard(save,'collector','set');
 if(c.cards.champion)unlockOutfit(save,'champion-crown');
 if(save.finale&&!c.cards.opening)addCard(save,'opening','show');
}
export function unlockOutfit(save,id){if(T.outfits.some(o=>o.id===id)&&!save.collection.outfits.includes(id))save.collection.outfits.push(id);}
// All future external sources share one idempotent entry point. Persist after each call.
export function award(save,{source,key,card,box,outfit}){
 if(!['box','layer','set','friend','show'].includes(source)||typeof key!=='string'||key.length>80)return false;
 const claim=`${source}:${key}`;if(save.collection.claims.includes(claim))return false;
 if(card&&!T.cards.some(c=>c.id===card)||outfit&&!T.outfits.some(o=>o.id===outfit)||box!==undefined&&![0,1,2,3].includes(box))return false;
 save.collection.claims.push(claim);if(card)addCard(save,card,source);if(box!==undefined)save.collection.boxes.push(box);if(outfit)unlockOutfit(save,outfit);settleCollection(save);return true;
}
export function finishRewards(save,{game,medal=-1,best=false,wonLayer=medal>=0}){
 const ep=C.episodes.find(e=>e.game===game);if(!ep)return;
 const c=save.collection;if(!c.claims.includes(`played:${game}`))c.claims.push(`played:${game}`);c.finished++;c.boxes.push(medal+1);if(best)c.boxes.push(medal+1);
 for(let i=0;i<=medal;i++)unlockOutfit(save,`${game}-${i}`);
 if(wonLayer&&!save.layers.includes(ep.id))save.layers.push(ep.id);
 settleCollection(save);
}
function pick(pool,random){return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];}
export function openBox(save,now,review=false,random=Math.random){
 const c=save.collection;if(!c.boxes.length)return null;
 const tier=c.boxes[0],sets=openSets(now,review);
 // Candy Cane Lane is the welcome/launch pool even before the first game date.
 const ids=sets.length?sets.map(s=>s.id):[T.sets[0].id];
 const weights=T.odds[tier];let roll=random(),rarity='common';
 for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<0){rarity=['common','rare','super','mythical'][i];break;}}
 if(c.sinceRare>=T.rareEvery-1&&rarity==='common')rarity='rare';
 const pool=rarity==='mythical'?[T.cards.find(c=>c.id==='champion')]:T.cards.filter(card=>ids.includes(card.set)&&card.rarity===rarity);
 c.boxes.shift();c.sinceRare=rarity==='common'?c.sinceRare+1:0;
 const result=addCard(save,pick(pool,random).id,'box');settleCollection(save);return {...result,tier};
}
export function welcomePack(save,now,random=Math.random){
 const c=save.collection;if(c.welcome)return [];
 c.welcome=true;c.started=Math.floor(now||0);
 if(!c.friendCode){const bytes=new Uint8Array(10);if(globalThis.crypto?.getRandomValues)crypto.getRandomValues(bytes);else bytes.forEach((_,i)=>bytes[i]=Math.floor(random()*256));c.friendCode=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();}
 const pool=T.cards.filter(card=>card.set===T.sets[0].id),commons=pool.filter(c=>c.rarity==='common');
 const first=pick(commons,random),second=pick(commons.filter(c=>c.id!==first.id),random);
 const results=[first,second,pool.find(c=>c.rarity==='rare')].map(card=>addCard(save,card.id,'welcome'));settleCollection(save);return results;
}
export function exchangeStars(save,id,now,review=false){
 const c=save.collection,card=T.cards.find(card=>card.id===id);
 if(!card||!['common','rare'].includes(card.rarity)||!openSets(now,review).some(s=>s.id===card.set)||c.cards[id]||c.stars<T.exchangeCost)return false;
 c.stars-=T.exchangeCost;addCard(save,id,'stars');settleCollection(save);return true;
}
