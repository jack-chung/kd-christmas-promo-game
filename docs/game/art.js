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
  const postmark={'postmark-bronze':'#c58b58','postmark-silver':'#a9c8d0','postmark-gold':'#edc45d'}[paper];
  const color=postmark||(paper==='stars'?'green':'red');
  let s=r(6,28,52,32,'ink')+r(8,30,48,28,color)+r(8,30,48,5,postmark?'cream':paper==='stars'?'mint':'redLight')+r(8,55,48,3,postmark?'brown':paper==='stars'?'#1c4d46':'#7f233c');
  s+=`<g class="gift-lid">${r(0,24,64,8,'ink')}${r(2,25,60,5,color)}</g>`+r(27,25,10,33,'gold')+r(29,25,3,33,'cream');
  if(postmark)for(const [x,y] of [[12,35],[40,45]]){
    if(paper==='postmark-gold')s+=r(x,y,2,7,'ink')+r(x+5,y-2,2,9,'ink')+r(x+10,y,2,7,'ink')+r(x,y+5,12,4,'ink');
    else if(paper==='postmark-silver')s+=r(x,y+4,12,2,'ink')+r(x+5,y,2,10,'ink')+r(x+2,y+1,2,2,'ink')+r(x+8,y+7,2,2,'ink');
    else s+=r(x,y,12,10,'cream')+r(x+3,y+3,6,4,'ink');
  }
  if(paper==='stars') for(const [x,y] of [[13,37],[44,40],[16,49],[46,52]])s+=r(x,y,6,2,'gold')+r(x+2,y-2,2,6,'gold');
  else if(!postmark)for(const [x,y] of [[13,38],[44,38],[13,49],[44,49]])s+=r(x,y,3,3,'redLight');
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
  const c='currentColor';
  if(id==='fold')return svg(32,32,r(2,7,28,21,'ink')+r(4,9,24,17,c)+`<path d="M4 9H28L16 21Z" fill="#fff3d6"/><path d="M4 26L12 18M28 26L20 18" stroke="#29283d" stroke-width="2"/>`,'move-art');
  if(id==='tape')return svg(32,32,r(5,3,18,3,'ink')+r(2,6,24,18,'ink')+r(5,6,18,18,c)+r(8,9,12,12,'ink')+r(11,12,6,6,'cream')+r(17,23,13,6,'ink')+r(19,23,9,3,c),'move-art');
  if(id==='ribbon')return svg(32,32,r(5,2,22,5,'ink')+r(7,7,18,18,'ink')+r(5,25,22,5,'ink')+r(7,3,18,2,'cream')+r(9,7,14,18,c)+r(9,11,14,2,'cream')+r(9,17,14,2,'cream')+r(7,26,18,2,'cream'),'move-art');
  return svg(32,32,`<path d="M2 5H10V8H13V12H19V8H22V5H30V21H22V18H19V21H21V30L16 27L11 30V21H13V18H10V21H2Z" fill="#29283d"/><path d="M4 7H9V10H12V15H9V19H4ZM28 7H23V10H20V15H23V19H28ZM13 21H15V26H13ZM17 21H19V26H17Z" fill="${c}"/>`+r(13,12,6,7,c),'move-art');
}

// A complete, lightweight, original pixel environment, rendered behind the game UI.
export function scene(kind='town') {
  let s=r(0,0,240,400,'#87c7d4')+r(0,165,240,235,'#edf5e6');
  for(const [x,y] of [[4,30],[100,16],[196,52]])s+=r(x,y,28,4,'snow')+r(x+5,y-4,16,4,'snow');
  s+=r(196,13,18,18,'#ffe4a4')+r(200,9,10,26,'#ffe4a4');
  // Snowy evergreens behind the houses.
  for(const [x,y] of [[0,110],[35,95],[180,88],[221,114]]){
    s+=r(x+8,y+10,4,58,'brown');
    for(let i=0;i<4;i++)s+=r(x+8-i*4,y+i*12,4+i*8,15,'green')+r(x+8-i*4,y+i*12,4+i*8,3,'snow');
  }
  for(const [x,y,color] of [[-20,102,'#bb6c62'],[34,80,'#478783'],[158,88,'#a483b5'],[206,110,'#be8957']]){
    s+=r(x,y+23,49,71,'ink')+r(x+3,y+25,43,66,color);
    for(let i=0;i<5;i++)s+=r(x-4+i*5,y+22-i*5,57-i*10,7,'ink')+r(x-4+i*5,y+20-i*5,57-i*10,3,'snow');
    for(const wx of [x+8,x+31])s+=r(wx,y+38,11,16,'ink')+r(wx+2,y+40,7,12,'gold')+r(wx+5,y+40,1,12,'brown')+r(wx+2,y+46,7,1,'brown');
    s+=r(x+20,y+67,11,27,'ink')+r(x+22,y+69,7,25,'red')+r(x-2,y+94,53,4,'snow');
  }
  s+=`<path d="M102 169H139L192 400H40Z" fill="#dfcda8"/><path d="M111 169H128L162 400H73Z" fill="#eddfbd"/>`;
  for(let y=207;y<400;y+=29)s+=r(82-(y-207)/5,y,76+(y-207)/3,2,'#c7b88e');
  // Foreground fence and gift stalls.
  for(let x=0;x<240;x+=14)s+=r(x,331,5,48,'#b78960')+r(x,330,5,4,'snow');
  s+=r(0,342,240,5,'#946647')+r(0,365,240,5,'#946647');
  if(kind!=='town'){
    s+=r(0,0,240,400,'#b14c58');
    for(let x=0;x<240;x+=20)s+=r(x,0,2,400,'#983e50');
    s+=r(0,233,240,167,'#b78356');
    for(let y=241;y<400;y+=23)s+=r(0,y,240,2,'#95643f');
    for(const x of [16,154]){
      s+=r(x,38,70,119,'ink')+r(x+4,42,62,111,'cream')+r(x+8,46,54,103,'#87c7d4');
      s+=r(x+8,114,54,35,'snow')+r(x+32,46,5,103,'brown')+r(x+8,87,54,5,'brown');
      s+=r(x-4,151,78,7,'brown')+r(x,150,70,3,'gold');
    }
    s+=r(5,186,230,18,'ink')+r(9,188,222,7,'goldShade')+r(9,204,10,39,'brown')+r(221,204,10,39,'brown');
    {
      for(let x=0;x<240;x+=24)s+=r(x,0,24,25,(x/24)%2?'cream':'red')+r(x,25,24,5,'ink');
      s+=r(4,190,232,210,'red');
      for(let x=12;x<240;x+=24)s+=r(x,203,3,197,'#93374d');
    }
  }
  // Evergreen garland, golden bulbs and red bows frame every scene.
  for(let x=0;x<240;x+=12){let y=5+(Math.floor(x/12)%4)*2;s+=r(x,y,16,8,'green')+r(x+2,y,10,2,'mint')+r(x+5,y+8,3,4,'gold');}
  for(const x of [20,116,212])s+=r(x,8,5,5,'redLight')+r(x+8,8,5,5,'redLight')+r(x+5,11,3,7,'red');
  s+=r(0,393,240,7,'snow');
  return svg(240,400,s,'world-scene').replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ');
}
