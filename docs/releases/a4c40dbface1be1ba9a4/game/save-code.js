import {C} from './content.js';
import {normalizeSave} from './engine.js';
const T=C.treasure,sources=Object.keys(T.sources),slots=Object.keys(T.slots);
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
// Three queued qualities per character, preserving reveal order even after many runs.
const packBoxes=boxes=>String(boxes.length%3)+Array.from({length:Math.ceil(boxes.length/3)},(_,i)=>alphabet[(boxes[i*3]||0)*16+(boxes[i*3+1]||0)*4+(boxes[i*3+2]||0)]).join('');
function unpackBoxes(value){if(typeof value!=='string'||! /^[012][A-Za-z0-9_-]*$/.test(value))throw Error('Invalid boxes');const boxes=[];for(const ch of value.slice(1)){const n=alphabet.indexOf(ch);boxes.push(n>>4,(n>>2)&3,n&3);}return Number(value[0])?boxes.slice(0,-(3-Number(value[0]))):boxes;}
const keys=['wrapBest','towerBest','sortingBest','sleighBest'];
const checksum=text=>{let h=2166136261;for(const ch of text)h=Math.imul(h^ch.charCodeAt(0),16777619);return (h>>>0).toString(36).padStart(7,'0');};
// Compact, versioned dictionary encoding; no network, compression API or device clock.
export function encodeSave(save){
 const c=save.collection;
 const data=[1,[save.profile.adjective,save.profile.noun,save.profile.number,Number(save.profile.avatar.split('-')[1])],save.layers,keys.map(k=>save[k]),Object.values(save.sortingBests),[save.sound,save.sortingPractice,save.sleighPractice,save.sleighPlayed,save.finale],T.cards.map(card=>c.cards[card.id]?sources.indexOf(c.cards[card.id])+1:0),c.stars,c.outfits.map(id=>T.outfits.findIndex(o=>o.id===id)),slots.map(slot=>c.equipped[slot]?T.outfits.findIndex(o=>o.id===c.equipped[slot]):-1),packBoxes(c.boxes),c.sinceRare,c.welcome,c.friendCode,c.friends,c.newFriends,c.broughtBy,c.started,c.claims,c.finished,c.homePromptAt,save.wrapSongs];
 const payload=btoa(JSON.stringify(data)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 return `TV1-${payload}-${checksum(payload)}`;
}
export function decodeSave(code){
 const match=String(code).trim().match(/^TV1-([A-Za-z0-9_-]+)-([a-z0-9]{7})$/);
 if(!match||code.length>16000||checksum(match[1])!==match[2])throw Error('Invalid save code');
 const d=JSON.parse(atob(match[1].replace(/-/g,'+').replace(/_/g,'/')));
 if(!Array.isArray(d)||![21,22].includes(d.length)||d[0]!==1||!d[1]||!Array.isArray(d[6])||d[6].length!==T.cards.length)throw Error('Invalid save payload');
 const raw={version:3,wrapSongs:d[21],profile:{adjective:d[1][0],noun:d[1][1],number:d[1][2],avatar:`helper-${d[1][3]}`},layers:d[2],sortingBests:Object.fromEntries(C.sorting.difficulties.map((v,i)=>[v.id,d[4][i]]))};
 keys.forEach((k,i)=>raw[k]=d[3][i]);['sound','sortingPractice','sleighPractice','sleighPlayed','finale'].forEach((k,i)=>raw[k]=d[5][i]);
 raw.collection={cards:Object.fromEntries(T.cards.filter((_,i)=>d[6][i]).map(card=>[card.id,sources[d[6][T.cards.indexOf(card)]-1]])),stars:d[7],outfits:d[8].map(i=>T.outfits[i]?.id),equipped:Object.fromEntries(slots.map((slot,i)=>[slot,T.outfits[d[9][i]]?.id])),boxes:unpackBoxes(d[10]),sinceRare:d[11],welcome:d[12],friendCode:d[13],friends:d[14],newFriends:d[15],broughtBy:d[16],started:d[17],claims:d[18],finished:d[19],homePromptAt:d[20],restored:true};
 const save=normalizeSave(raw);if(!save.profile)throw Error('Invalid profile');return save;
}

export function restoreLink(code,address){
 // Keep this host and its current base path, including a future hosting move.
 const url=new URL(address);
 url.search='';url.hash='restore='+code;
 return url.href;
}
export function saveCodeFromInput(input){
 const value=String(input).trim();
 if(value.startsWith('TV1-'))return value;
 const url=new URL(value);
 if(!['https:','http:'].includes(url.protocol)||!url.hash.startsWith('#restore='))throw Error('Invalid restore link');
 return decodeURIComponent(url.hash.slice(9));
}
export function decodeBackup(input){return decodeSave(saveCodeFromInput(input));}
