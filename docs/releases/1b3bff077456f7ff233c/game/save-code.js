import {binarySave} from './save-binary.js';
import {C} from './content.js';
import {normalizeSave} from './engine.js';
const T=C.treasure,sources=Object.keys(T.sources),slots=Object.keys(T.slots);
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
// Three queued qualities per character, preserving reveal order even after many runs.
function unpackBoxes(value){if(typeof value!=='string'||! /^[012][A-Za-z0-9_-]*$/.test(value))throw Error('Invalid boxes');const boxes=[];for(const ch of value.slice(1)){const n=alphabet.indexOf(ch);boxes.push(n>>4,(n>>2)&3,n&3);}return Number(value[0])?boxes.slice(0,-(3-Number(value[0]))):boxes;}
const keys=['wrapBest','towerBest','sortingBest','sleighBest'];
const checksum=text=>{let h=2166136261;for(const ch of text)h=Math.imul(h^ch.charCodeAt(0),16777619);return (h>>>0).toString(36).padStart(7,'0');};
// Compact, versioned dictionary encoding; no network, compression API or device clock.
export function encodeSave(save){
 const payload=btoa(String.fromCharCode(...binarySave(save))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 return `TV2-${payload}-${checksum(payload)}`;
}
export function decodeSave(code){
 const match=String(code).trim().match(/^TV([12])-([A-Za-z0-9_-]+)-([a-z0-9]{7})$/);
 if(!match||code.length>16000||checksum(match[2])!==match[3])throw Error('Invalid save code');
 const decoded=atob(match[2].replace(/-/g,'+').replace(/_/g,'/'));
 if(match[1]==='2'){const save=normalizeSave(binarySave(null,Uint8Array.from(decoded,ch=>ch.charCodeAt(0))));if(!save.profile)throw Error('Invalid profile');return save;}
 const d=JSON.parse(decoded);
 if(!Array.isArray(d)||![21,22].includes(d.length)||d[0]!==1||!d[1]||!Array.isArray(d[6])||d[6].length!==T.cards.length)throw Error('Invalid save payload');
 const raw={version:3,wrapSongs:d[21],profile:{adjective:d[1][0],noun:d[1][1],number:d[1][2],avatar:`helper-${d[1][3]}`},layers:d[2],sortingBests:Object.fromEntries(['easy','tunie','rapper'].map((id,i)=>[id,d[4][i]]))};
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
 if(/^TV[12]-/.test(value))return value;
 const url=new URL(value);
 if(!['https:','http:'].includes(url.protocol)||!url.hash.startsWith('#restore='))throw Error('Invalid restore link');
 return decodeURIComponent(url.hash.slice(9));
}
export function decodeBackup(input){return decodeSave(saveCodeFromInput(input));}
