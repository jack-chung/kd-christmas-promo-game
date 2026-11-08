import {C} from './content.js';
export const songOpen=(song,records,now,review=false)=>review||(now>=Date.parse(song.release)&&(song.tier===1||C.wrap.songs.some(s=>s.tier===song.tier-1&&['B','A','S'].includes(records[s.id]?.grade))));
export const songMedal=(song,grade)=>Math.min(song.tier-1,({B:0,A:1,S:2}[grade]??-1));
export function recordSong(save,song,result){
 const old=save.wrapSongs[song.id],best=result.score>(old?.score??0),rank={C:0,B:1,A:2,S:3};
 save.wrapSongs[song.id]={score:Math.max(old?.score??0,result.score),grade:rank[old?.grade]>rank[result.grade]?old.grade:result.grade,topSpeed:Math.max(old?.topSpeed??1,result.topSpeed)};
 save.wrapBest=Math.max(save.wrapBest,result.score);
 return {best,medal:songMedal(song,result.grade)};
}
// Piecewise mapping from immutable chart time to performance time. Both audio and
// judgement use these segments. Future attacks are never retimed after scheduling.
export class SongClock {
 constructor(start,bar,settings=C.wrap.speed){this.bar=bar;this.settings=settings;this.segments=[{at:0,wall:start,speed:1}];this.streak=0;this.topSpeed=1;}
 segmentAt(time){return this.segments.findLast(s=>s.at<=time)||this.segments[0];}
 wall(time){const s=this.segmentAt(time);return s.wall+(time-s.at)/s.speed;}
 time(wall){const s=this.segments.findLast(s=>s.wall<=wall)||this.segments[0];return s.at+(wall-s.wall)*s.speed;}
 speed(wall){return this.segmentAt(this.time(wall)).speed;}
 change(direction,wall){
  const safe=this.time(wall+this.settings.lookahead),at=(Math.floor(Math.max(0,safe)/this.bar)+1)*this.bar;
  const speed=Math.round(Math.max(1,Math.min(this.settings.cap,this.segmentAt(at).speed+direction*this.settings.step))*100)/100;
  const existing=this.segments.find(s=>s.at===at),when=this.wall(at);
  if(existing)existing.speed=speed;else this.segments.push({at,wall:when,speed});
  // Recalculate later anchors (normally there is at most one pending bar).
  for(let i=1;i<this.segments.length;i++){const prev=this.segments[i-1],s=this.segments[i];s.wall=prev.wall+(s.at-prev.at)/prev.speed;}
 }
 hit(wall){if(++this.streak>=this.settings.hits){this.streak=0;this.change(1,wall);}}
 miss(wall,count=1){this.streak=0;for(let i=0;i<count;i++)this.change(-1,wall);}
 shift(ms){this.segments.forEach(s=>s.wall+=ms);}
}
