import {C} from './content.js';
import {escapeHTML as e} from './engine.js';
const ink='#29283d',danger='#c84b62';
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
export function present(x,y,size=20,index=0){const colours=['#d64968','#5676b8','#3d9e97','#b96dba','#e88b4d','#75a54c'];return rect(x,y,size,size,ink)+rect(x+2,y+2,size-4,size-4,colours[index%colours.length])+rect(x+size*.43,y,3,size,'#f4c766')+rect(x,y+size*.42,size,3,'#f4c766')+`<path d="M${x+size/2} ${y}l-6 -4v4h12v-4z" fill="#f4c766"/>`;}
const sparkle=(x,y)=>`<path d="M${x} ${y-6}v12m-6 -6h12" stroke="#f4c766" stroke-width="3"/>`;
function shapes(kind){
 if(kind==='fence')return rect(47,132,26,7,ink)+rect(47,145,26,5,danger)+[47,58,69].map(x=>`<path d="M${x} 160v-29l2 -5 2 5v29z" fill="#fff3d6" stroke="${danger}" stroke-width="2"/>`).join('');
 if(kind==='arch')return rect(28,22,4,138,'#936b4f')+rect(88,22,4,138,'#936b4f')+`<path d="M30 32l8 5 10 4h24l10 -4 8 -5" fill="none" stroke="${ink}" stroke-width="12"/><path d="M30 32l8 5 10 4h24l10 -4 8 -5" fill="none" stroke="#388861" stroke-width="8"/>`+[37,49,70,82].map((x,i)=>rect(x,26+(i%2)*6,4,4,'#8fc47b')).join('')+`<path d="M60 42l-9 -5v10l9 -3 9 3V27z" fill="#d64968"/>`;
 if(kind==='gift')return sparkle(43,137)+sparkle(78,128)+present(50,140,20,2);
 if(kind==='door')return `<path d="M15 69l45 -29 45 29v87H15z" fill="#e4aa66" stroke="${ink}" stroke-width="4"/><path d="M10 70l50 -35 50 35" fill="none" stroke="#a94f42" stroke-width="9"/>`+rect(46,91,29,65,'#8a514c')+rect(50,96,21,60,'#fff3d6')+rect(23,90,16,22,'#95cad0')+rect(24,99,14,3,ink)+rect(30,92,3,18,ink)+`<path d="M80 147v-24l4 -7h10l4 7v24z" fill="#75bcd4" stroke="${ink}" stroke-width="3"/>`+rect(85,124,3,3,ink)+rect(93,124,3,3,ink)+rect(82,146,5,10,ink)+rect(95,146,5,10,ink)+`<path d="M98 133l8 -8" stroke="#75bcd4" stroke-width="5"/>`+rect(21,156,78,7,'#f4c766')+rect(26,158,68,3,'#fff3d6')+sparkle(13,148)+sparkle(107,149);
 if(kind==='gap')return `<path d="M10 160l8 -4 10 4 9 -5 10 5 9 -3 11 3 9 -4 11 4 9 -4 14 4-5 14-11 6H23l-9 -6z" fill="#714a36"/><path d="M16 163h88l-9 10H25z" fill="${ink}"/><path d="M10 159h17m12 0h13m13 0h12m15 0h18" stroke="${danger}" stroke-width="4"/>`;
 if(kind==='moving')return `<path d="M36 142h39l8 7-4 6H39z" fill="#9b6bba" stroke="${ink}" stroke-width="3"/><path d="M34 158h47l7 -6" fill="none" stroke="${danger}" stroke-width="4"/>`+rect(45,147,4,9,ink)+rect(71,147,4,9,ink)+`<path d="M31 139h-9m8 7H17" stroke="#9b6bba" stroke-width="3"/>`;
 if(kind==='snowman')return `<path d="M43 157l-3 -10v-24l5 -9 6 -4-4 -6V82l5 -7v-9l7 -6h7l7 6v9l7 7v22l-4 6 6 4 4 9v24l-4 10z" fill="#d7edf5" stroke="${ink}" stroke-width="3"/>`+rect(51,103,25,6,danger)+rect(69,108,5,14,danger)+rect(57,81,3,4,ink)+rect(68,81,3,4,ink)+`<path d="M61 89l-11 4 11 3z" fill="#e88b4d"/>`+rect(62,124,4,4,ink)+rect(62,140,4,4,ink)+`<path d="M44 120l-12 -10m49 10 11 -10" stroke="#936b4f" stroke-width="4"/>`;
 return '';
}
const crops={fence:'38 117 44 48',arch:'-85 15 290 150',gift:'31 117 58 50',door:'1 27 118 140',gap:'2 144 116 42',moving:'12 128 83 38',snowman:'27 54 70 110'};
export function roadObject(kind,{card=false}={}){
 let body=shapes(kind);
 if(kind==='arch')body=`<g transform="translate(60 0) scale(${C.sleigh.tuning.garlandWidth/64} 1) translate(-60 0)">${body}</g>`;
 if(card&&kind==='arch')body+=rect(42,145,36,12,'#a2a49d')+[0,1,2,3,4,5,6,7].map(i=>present(43+(i%2)*17,128-Math.floor(i/2)*18,16,i)).join('')+rect(45,157,6,6,ink)+rect(70,157,6,6,ink);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${card?crops[kind]:kind==='arch'?`${60-(C.sleigh.tuning.garlandWidth+124)/2} 0 ${C.sleigh.tuning.garlandWidth+124} 180`:'0 0 120 180'}" role="img" aria-label="${e(C.sleigh.objects[kind].name)}" shape-rendering="crispEdges">${body}</svg>`;
}
export function roadGuide({close=C.sleigh.guideClose}={}){const S=C.sleigh;return `<section class="sleigh-guide" aria-labelledby="road-guide-title"><h2 id="road-guide-title">${e(S.guideTitle)}</h2><p>${e(S.guideIntro)}</p><div class="sleigh-guide-grid">${Object.entries(S.objects).map(([kind,o])=>`<figure data-road-kind="${kind}">${roadObject(kind,{card:true})}<figcaption><strong>${e(o.name)}</strong><span>${e(o.action)}</span></figcaption></figure>`).join('')}</div><p class="subtle">${e(S.guideCart)}</p><button id="sleigh-guide-close" data-action="sleigh-guide-close" class="primary full">${e(close)}</button></section>`;}
