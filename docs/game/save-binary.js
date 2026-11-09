// TV2 dictionaries are frozen wire IDs: append only; never reorder with UI content.
const cards=['candy','holly','ginger','tinsel'].flatMap(s=>Array.from({length:6},(_,i)=>`${s}-${i}`)).concat(['host-tansy','host-king','host-filbert','host-pip','champion','collector','friendship','opening','buddies']);
const outfits=['wrap-0','wrap-1','wrap-2','sorting-0','sorting-1','sorting-2','tower-0','tower-1','tower-2','sleigh-0','sleigh-1','sleigh-2','set-candy','set-holly','set-ginger','set-tinsel','champion-crown'];
const songs=['deck-the-halls','o-christmas-tree','joy-to-the-world','silent-night','good-king-wenceslas','god-rest-ye','away-in-a-manger','first-noel','hark-the-herald','o-little-town','go-tell-it','angels-on-high'];
const sources=['box','layer','set','friend','show','welcome','stars'],slots=['head','neck','body','held'],bests=['wrapBest','towerBest','sortingBest','sleighBest'],flags=['sound','sortingPractice','sleighPractice','sleighPlayed','finale'],claims=['played:wrap','played:sorting','played:tower','played:sleigh'];
class Bits {
 constructor(bytes){this.bytes=bytes||[];this.pos=0;this.reading=!!bytes;}
 bits(value,n){if(this.reading){if(this.pos+n>this.bytes.length*8)throw Error('Truncated save');let v=0;for(let i=0;i<n;i++,this.pos++)v=v*2+((this.bytes[this.pos>>3]>>(7-this.pos%8))&1);return v;}for(let i=n-1;i>=0;i--,this.pos++){const at=this.pos>>3;this.bytes[at]=(this.bytes[at]||0)|((Math.floor(value/2**i)%2)<<(7-this.pos%8));}return value;}
 int(value){if(this.reading){let v=0,m=1;for(let i=0;i<8;i++){const b=this.bits(0,8);v+=(b%128)*m;if(!Number.isSafeInteger(v))throw Error('Save integer overflow');if(b<128)return v;m*=128;}throw Error('Save integer overflow');}const original=value;if(!Number.isSafeInteger(value)||value<0)throw Error('Invalid save integer');do{const b=value%128;value=Math.floor(value/128);this.bits(b+(value?128:0),8);}while(value);return original;}
 text(value){if(this.reading){const n=this.int();if(n>12000)throw Error('Invalid string length');return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from({length:n},()=>this.bits(0,8)));}const bytes=new TextEncoder().encode(value);this.int(bytes.length);for(const b of bytes)this.bits(b,8);}
 code(value){const hex=this.bits(/^[A-F0-9]{20}$/.test(value)?1:0,1);if(hex){if(this.reading)return Array.from({length:10},()=>this.bits(0,8).toString(16).padStart(2,'0')).join('').toUpperCase();for(let i=0;i<20;i+=2)this.bits(parseInt(value.slice(i,i+2),16),8);}else return this.text(value);}
 list(value,fn){const n=this.reading?this.int():value.length;if(n>12000)throw Error('Invalid list length');if(!this.reading)this.int(n);return Array.from({length:n},(_,i)=>fn(value?.[i]));}
}
export function binarySave(save,bytes){
 const io=new Bits(bytes),read=io.reading,s=read?{version:3,profile:{},collection:{restored:true},wrapSongs:{},sortingBests:{}}:save,c=s.collection;
 const bit=(obj,k,n)=>obj[k]=io.bits(obj[k],n),integer=(obj,k)=>{const v=io.int(obj[k]);if(read)obj[k]=v;};
 for(const [key,n] of [['adjective',3],['noun',3],['number',7]])bit(s.profile,key,n);
 const avatar=io.bits(read?0:Number(s.profile.avatar.split('-')[1]),3);if(read)s.profile.avatar=`helper-${avatar}`;
 const layers=[1,2,3,4].filter(l=>io.bits(read?0:Number(s.layers.includes(l)),1));if(read)s.layers=layers;
 for(const key of flags){const v=io.bits(Number(s[key]),1);if(read)s[key]=!!v;}
 for(const key of bests)integer(s,key);
 // Keep the three retired TV2 record slots in place for existing screenshot backups.
 for(const key of ['easy','tunie','rapper'])if(read)integer(s.sortingBests,key);else io.int(0);
 for(const id of songs)if(io.bits(read?0:Number(!!s.wrapSongs[id]),1)){
  const r=read?{}:s.wrapSongs[id];integer(r,'score');const grade=io.bits(read?0:'CBAS'.indexOf(r.grade),2);if(read)r.grade='CBAS'[grade];
  const speed=io.bits(read?0:Math.round((r.topSpeed-1)*100),6);if(speed>40)throw Error('Invalid speed');if(read)r.topSpeed=(100+speed)/100;if(read)s.wrapSongs[id]=r;
 }
 const owned={};for(const id of cards){const v=io.bits(read?0:(c.cards[id]?sources.indexOf(c.cards[id])+1:0),3);if(v)owned[id]=sources[v-1];}if(read)c.cards=owned;
 const ownedOutfits=outfits.filter(id=>io.bits(read?0:Number(c.outfits.includes(id)),1));
 // Preserve the original display order when outfits were earned out of catalog order.
 const ordered=io.bits(read?0:Number(c.outfits.join()!==ownedOutfits.join()),1);
 if(ordered){const ids=io.list(read?undefined:c.outfits,id=>{const i=io.bits(read?0:outfits.indexOf(id),5);if(!outfits[i])throw Error('Invalid outfit');return outfits[i];});if(read)c.outfits=ids;}else if(read)c.outfits=ownedOutfits;
 if(read)c.equipped={};for(const slot of slots){const i=io.bits(read?0:outfits.indexOf(c.equipped[slot])+1,5);if(i>outfits.length)throw Error('Invalid equipment');if(read&&i)c.equipped[slot]=outfits[i-1];}
 for(const key of ['stars','sinceRare','started','finished','homePromptAt'])integer(c,key);
 const welcome=io.bits(Number(c.welcome),1);if(read)c.welcome=!!welcome;
 const boxes=io.list(read?undefined:c.boxes,v=>io.bits(v,2));if(read)c.boxes=boxes;
 const friendCode=io.code(c.friendCode);if(read)c.friendCode=friendCode;
 const friends=io.list(read?undefined:c.friends,v=>io.code(v));if(read)c.friends=friends;
 const newFriends=io.list(read?undefined:c.newFriends,v=>{const index=io.int(read?0:c.friends.indexOf(v)+1);if(read&&index>c.friends.length)throw Error('Invalid friend reference');return index?c.friends[index-1]:io.code(v);});if(read)c.newFriends=newFriends;
 const broughtBy=io.code(c.broughtBy);if(read)c.broughtBy=broughtBy;
 const claimList=io.list(read?undefined:c.claims,v=>{const index=io.bits(read?0:claims.indexOf(v)+1,3);if(index>claims.length)throw Error('Invalid claim');return index?claims[index-1]:io.text(v);});if(read)c.claims=claimList;
 if(read){if(io.bytes.length*8-io.pos>7||io.bits(0,io.bytes.length*8-io.pos)!==0)throw Error('Trailing save data');return s;}
 return Uint8Array.from(io.bytes);
}
