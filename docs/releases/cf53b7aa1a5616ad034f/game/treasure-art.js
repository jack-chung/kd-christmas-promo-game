import {C} from './content.js';
import {character} from './art.js';
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const svg=body=>`<svg class="pixel character helper-art" viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="crispEdges">${body}</svg>`;
const ink='#29283d',snow='#fff3d6';
function piece(o){
 const c=o.color,n=o.shape;
 if(o.slot==='head')return n===4?rect(10,6,28,6,c)+rect(10,0,5,8,c)+rect(22,0,5,8,c)+rect(33,0,5,8,c)+rect(22,7,4,3,'#dc7185'):n===1?rect(8,12,5,12,c)+rect(35,12,5,12,c)+rect(10,7,28,3,c):rect(12,5,24,9,c)+rect(9,12,30,4,c)+rect(n===2?29:20,2,7,4,c);
 if(o.slot==='neck')return rect(11,29,26,5,c)+rect(29,32,6,14,c)+rect(29,38,6,2,snow)+rect(13,30,8,1,snow);
 if(o.slot==='body')return rect(11,33,26,14,c)+rect(10,33,5,7,c)+rect(33,33,5,7,c)+(n===1?rect(21,36,7,7,snow):rect(23,33,2,14,snow))+rect(13,43,22,2,snow);
 if(o.id==='sorting-2')return rect(33,25,14,12,ink)+rect(34,26,12,10,snow)+rect(36,28,2,2,c)+rect(38,30,2,2,c)+rect(40,28,2,2,c);
 if(o.id==='tower-2')return rect(36,38,11,8,c)+rect(34,30,11,8,'#86b5c9')+rect(36,22,9,8,'#dc7185')+rect(38,24,2,6,snow)+rect(38,32,2,6,snow);
 if(o.id==='set-tinsel')return rect(38,22,7,4,ink)+rect(34,26,13,16,c)+rect(37,28,7,12,'#f4c766')+rect(38,41,5,3,ink);
 return rect(39,29,2,22,'#be833b')+(n===0?rect(34,24,12,8,c)+rect(38,32,4,5,c):n===1?rect(34,24,12,15,c)+rect(36,26,8,2,snow):rect(33,27,14,12,c)+rect(39,24,3,15,snow)+rect(33,31,14,3,snow));
}
export function helper(profile,equipped={}){
 const i=Math.max(0,Number(profile?.avatar?.split('-')[1])||0)%6;
 const skin=['#eeb88d','#ad7453','#7a4b39','#f2ca9a','#c38b68','#9d6048'][i],hair=['#734d45','#29283d','#623f42','#be833b','#ece1bd','#423449'][i],shirt=['#28655b','#745a87','#75bcd4','#a82947','#c58b58','#4f8a93'][i];
 let s=rect(10,11,28,20,ink)+rect(13,12,22,18,skin)+rect(10,8,28,6,hair)+rect(10,12,5,i%2?19:11,hair)+rect(33,12,5,i%2?19:8,hair);
 if(i===0||i===5)s+=rect(8,7,8,9,hair)+rect(32,7,8,9,hair);if(i===2||i===4)s+=rect(14,5,22,6,hair)+rect(15,12,10,4,hair);
 s+=rect(17,19,3,3,ink)+rect(28,19,3,3,ink)+rect(21,25,7,2,ink)+rect(10,32,28,16,ink)+rect(12,33,24,13,shirt)+rect(6,34,6,11,skin)+rect(36,34,6,11,skin)+rect(13,48,8,6,ink)+rect(28,48,8,6,ink);
 for(const slot of ['body','neck','head','held']){const o=C.treasure.outfits.find(o=>o.id===equipped[slot]);if(o)s+=piece(o);}
 return svg(s);
}
export function outfitArt(o){return svg(piece(o));}
export function cardArt(card){
 if(card.cast)return character(card.cast);
 const i=card.art,c=['#75bcd4','#dc7185','#71b5a3','#bd96cd','#edc06a','#e79964'][i%6],trim=['#a82947','#28655b','#745a87','#734d45'][Math.floor(i/6)%4];
 let s=rect(12,14,25,25,ink)+rect(8,20,33,14,ink)+rect(13,16,23,20,c)+rect(10,22,29,10,c)+rect(17,23,3,4,ink)+rect(29,23,3,4,ink)+rect(21,31,8,2,ink)+rect(13,38,24,4,trim)+rect(29,40,5,9,trim)+rect(15,42,6,9,c)+rect(28,44,6,7,c)+rect(12,51,10,3,ink)+rect(28,51,10,3,ink);
 const style=i%6;
 if(style===0)s+=rect(21,4,4,12,ink)+rect(25,4,11,3,ink)+rect(32,7,4,7,ink);
 if(style===1)s+=rect(10,12,29,5,trim)+rect(14,7,21,6,trim)+rect(20,3,8,4,snow);
 if(style===2)s+=rect(7,20,6,13,trim)+rect(36,20,6,13,trim)+rect(11,10,27,4,trim);
 if(style===3)s+=rect(11,21,26,2,trim)+rect(14,21,9,8,trim)+rect(26,21,9,8,trim)+rect(15,23,5,2,snow);
 if(style===4)s+=rect(13,8,23,6,trim)+rect(14,4,5,6,c)+rect(30,4,5,6,c);
 if(style===5)s+=rect(22,6,4,11,ink)+rect(26,6,12,3,ink)+rect(34,9,4,7,ink)+rect(13,11,6,5,trim);
 if(card.rarity==='mythical')s+=rect(4,5,4,12,'#f4c766')+rect(0,9,12,4,'#f4c766')+rect(40,40,3,10,'#f4c766')+rect(37,43,9,3,'#f4c766');
 return svg(s);
}
