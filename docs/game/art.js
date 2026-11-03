// Original code-native pixel artwork. Integer coordinates, no licensed assets.
const P={ink:'#29283d',cream:'#fff3d6',snow:'#f4fbff',red:'#a82947',redLight:'#da4962',gold:'#f4c766',goldShade:'#be833b',green:'#28655b',mint:'#71b5a3',skin:'#eeb88d',skinShade:'#cf8b68',brown:'#734d45',pink:'#eea0b5',blue:'#75bcd4'};
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P[c]||c}"/>`;
const svg=(w,h,body,cls='')=>`<svg class="pixel ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${body}</svg>`;
export function character(id='wrapper',cls='') {
  let s='';
  if(id==='note') {
    s+=r(23,1,4,10,'ink')+r(27,1,6,3,'ink')+r(27,4,3,4,'gold');
    s+=r(10,11,18,23,'ink')+r(6,16,26,14,'ink')+r(4,24,4,5,'ink')+r(30,23,5,4,'ink');
    s+=r(10,15,18,15,'blue')+r(8,18,22,10,'blue')+r(12,12,12,3,'blue');
    s+=r(12,19,3,3,'ink')+r(23,19,3,3,'ink')+r(16,25,7,3,'ink')+r(18,28,3,2,'pink');
    s+=r(10,31,19,4,'red')+r(23,33,4,7,'red')+r(13,35,5,5,'blue')+r(23,37,4,4,'blue')+r(11,40,7,3,'ink')+r(23,41,6,2,'ink');
  } else if(id==='king') {
    s+=r(8,7,24,25,'ink')+r(12,4,16,5,'ink')+r(11,9,18,18,'skinShade');
    s+=r(8,1,4,8,'gold')+r(18,0,4,9,'gold')+r(28,1,4,8,'gold')+r(9,6,22,5,'gold')+r(18,7,3,2,'red');
    s+=r(8,14,24,3,'ink')+r(10,15,8,6,'ink')+r(22,15,8,6,'ink')+r(11,16,3,1,'snow')+r(23,16,3,1,'snow');
    s+=r(14,23,13,3,'ink')+r(17,25,7,2,'cream');
    s+=r(6,29,28,12,'ink')+r(8,30,24,10,'red')+r(17,29,6,12,'gold')+r(7,29,6,4,'cream')+r(27,29,6,4,'cream');
    s+=r(3,29,5,8,'skinShade')+r(32,27,5,8,'skinShade')+r(10,41,8,3,'ink')+r(24,41,8,3,'ink');
  } else if(id==='singer') {
    s+=r(8,7,25,22,'ink')+r(12,3,18,6,'ink')+r(13,9,16,17,'skinShade');
    s+=r(13,14,3,2,'ink')+r(24,14,3,2,'ink')+r(17,21,8,3,'cream');
    s+=r(8,29,24,11,'red')+r(12,26,16,6,'gold')+r(13,39,5,5,'ink')+r(24,39,5,5,'ink');
    s+=r(5,22,4,11,'skinShade')+r(32,23,4,10,'skinShade')+r(10,18,3,5,'gold')+r(29,18,3,5,'gold');
  } else {
    s+=r(10,8,23,23,'ink')+r(7,13,5,14,'ink')+r(31,14,4,14,'ink')+r(12,12,19,15,'skin')+r(11,19,3,5,'skinShade');
    s+=r(15,16,3,4,'ink')+r(25,16,3,4,'ink')+r(19,23,7,3,'ink')+r(20,25,4,2,'pink');
    if(id==='kid') {
      s+=r(10,5,23,9,'green')+r(14,2,15,4,'green')+r(12,10,21,4,'mint')+r(23,0,5,4,'gold');
      s+=r(12,15,9,1,'ink')+r(12,15,1,7,'ink')+r(20,15,1,7,'ink')+r(12,21,9,1,'ink')+r(23,15,9,1,'ink')+r(23,15,1,7,'ink')+r(31,15,1,7,'ink')+r(23,21,9,1,'ink')+r(21,17,2,1,'ink');
      s+=r(8,29,25,11,'ink')+r(10,29,21,10,'green')+r(10,28,21,3,'red')+r(24,31,4,7,'red');
    } else {
      s+=r(9,6,24,8,'red')+r(13,2,16,5,'red')+r(10,5,18,2,'redLight')+r(17,12,19,3,'ink')+r(17,11,18,2,'redLight');
      s+=r(6,30,29,10,'ink')+r(8,29,25,10,'red')+r(15,29,13,12,'gold')+r(14,28,3,10,'goldShade')+r(27,28,3,12,'goldShade')+r(18,34,7,5,'goldShade');
    }
    s+=r(5,32,5,6,'skin')+r(32,32,5,6,'skin')+r(12,40,7,4,'ink')+r(25,40,7,4,'ink');
  }
  return svg(40,46,s,`character ${cls}`);
}
export function gift({paper='cranberry',open=false,small=false}={}) {
  const color=paper==='stars'?'green':'red';
  let s=r(6,28,52,32,'ink')+r(8,30,48,28,color)+r(8,30,48,5,paper==='stars'?'mint':'redLight')+r(8,55,48,3,paper==='stars'?'#1c4d46':'#7f233c');
  s+=`<g class="gift-lid">${r(0,24,64,8,'ink')}${r(2,25,60,5,color)}</g>`+r(27,25,10,33,'gold')+r(29,25,3,33,'cream');
  if(paper==='stars') for(const [x,y] of [[13,37],[44,40],[16,49],[46,52]])s+=r(x,y,6,2,'gold')+r(x+2,y-2,2,6,'gold');
  else for(const [x,y] of [[13,38],[44,38],[13,49],[44,49]])s+=r(x,y,3,3,'redLight');
  if(!open)s+=`<g class="gift-bow">${r(28,17,8,9,'goldShade')}${r(9,10,15,5,'gold')}${r(6,14,7,8,'gold')}${r(12,20,16,5,'gold')}${r(21,14,6,8,'gold')}${r(40,10,15,5,'gold')}${r(51,14,7,8,'gold')}${r(36,20,16,5,'gold')}${r(37,14,6,8,'gold')}${r(28,17,8,8,'gold')}</g>`;
  else s+=r(18,3,4,5,'gold')+r(40,5,4,6,'gold')+r(30,0,3,4,'cream');
  return svg(64,64,s,`gift-art ${small?'small':''}`);
}
export function house(index=0,locked=false) {
  const body=['#a82947','#28655b','#745a87','#ad744d'][index%4];
  let s=r(9,29,46,34,'ink')+r(12,29,40,31,body)+r(6,62,52,4,'ink')+r(4,65,56,3,'snow');
  for(let i=0;i<5;i++)s+=r(2+i*6,27-i*5,60-i*12,6,'ink')+r(3+i*6,25-i*5,58-i*12,3,'snow');
  s+=r(17,39,9,13,'ink')+r(18,40,7,11,'gold')+r(21,40,1,11,'brown')+r(18,45,7,1,'brown');
  s+=r(37,39,10,13,'ink')+r(38,40,8,11,'gold')+r(42,40,1,11,'brown')+r(38,45,8,1,'brown');
  s+=r(27,43,10,19,'ink')+r(29,45,6,17,'redLight')+r(33,52,1,2,'gold');
  if(locked)s+=r(26,46,12,11,'gold')+r(28,42,8,5,'gold')+r(30,44,4,3,'ink')+r(31,50,2,4,'ink');
  return svg(64,70,s,'house-art');
}
export function landscape() {
  let s=r(0,0,240,80,'#d8eff1')+r(0,60,240,20,'snow');
  for(const [x,y] of [[6,20],[54,5],[176,10],[213,28]])s+=r(x,y,19,3,'snow')+r(x+4,y-3,10,3,'snow');
  for(const [x,y,size] of [[10,30,1],[42,41,.7],[197,25,1.2],[222,38,.8]]){
    s+=`<g transform="translate(${x} ${y}) scale(${size})">${r(9,27,4,12,'brown')}${r(2,20,18,8,'green')}${r(5,12,12,9,'green')}${r(8,5,6,8,'green')}${r(0,20,20,3,'snow')}${r(4,12,13,3,'snow')}${r(7,5,7,2,'snow')}</g>`;
  }
  s+=r(83,72,75,4,'#c7d7cf')+r(91,68,59,4,'#e2d2ad');
  return svg(240,80,s,'landscape');
}
export function moveIcon(id) {
  if(id==='fold')return svg(24,24,r(2,5,20,15,'red')+r(2,5,20,3,'cream')+r(5,8,14,3,'cream')+r(8,11,8,3,'cream')+r(11,14,2,3,'cream'));
  if(id==='tape')return svg(24,24,r(3,4,15,15,'gold')+r(6,7,9,9,'cream')+r(9,10,3,3,'ink')+r(14,16,8,5,'gold'));
  if(id==='ribbon')return svg(24,24,r(4,2,16,4,'gold')+r(6,6,12,12,'red')+r(4,18,16,4,'gold')+r(7,10,10,2,'redLight'));
  return svg(24,24,r(2,5,6,11,'gold')+r(8,8,3,6,'gold')+r(10,10,5,5,'goldShade')+r(16,5,6,11,'gold')+r(14,8,3,6,'gold')+r(8,15,3,6,'gold')+r(15,15,3,6,'gold'));
}
export function parcel(index,data) {
  const striped=data.striped.includes(index),bow=data.bows.includes(index);
  let s=r(3,8,26,22,'ink')+r(5,10,22,18,index%3===0?'green':index%3===1?'red':'blue');
  if(striped)for(let x=7;x<27;x+=6)s+=r(x,10,2,18,'cream');
  else if(index%2)for(let x=8;x<26;x+=7)s+=r(x,14,2,2,'gold')+r(x,23,2,2,'gold');
  if(bow)s+=r(6,3,7,4,'gold')+r(19,3,7,4,'gold')+r(11,6,10,4,'gold')+r(14,8,4,20,'gold');
  return svg(32,32,s,'parcel-art');
}
