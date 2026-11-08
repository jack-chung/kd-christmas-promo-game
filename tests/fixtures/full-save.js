import {C} from '../../docs/game/content.js';
import {freshSave,normalizeSave} from '../../docs/game/engine.js';
export function fullSave(){
 const s=freshSave();s.profile={adjective:7,noun:7,number:99,avatar:'helper-5'};s.layers=[1,2,3,4];s.finale=true;s.sound=true;s.sortingPractice=true;s.sleighPractice=true;s.sleighPlayed=true;
 Object.assign(s,{wrapBest:999999,towerBest:999,sortingBest:999999,sleighBest:999,sortingBests:{easy:999999,tunie:999999,rapper:999999},wrapSongs:Object.fromEntries(C.wrap.songs.map(song=>[song.id,{score:999999,grade:'S',topSpeed:1.4}]))});
 Object.assign(s.collection,{cards:Object.fromEntries(C.treasure.cards.map((c,i)=>[c.id,Object.keys(C.treasure.sources)[i%7]])),outfits:C.treasure.outfits.map(o=>o.id),equipped:{head:'champion-crown',neck:'set-candy',body:'set-ginger',held:'set-tinsel'},stars:9999,boxes:[0,1,2,3,0,1,2,3,2,3],sinceRare:4,welcome:true,friendCode:'0123456789ABCDEF0123',started:1794546000000,homePromptAt:1797112800000,finished:999,claims:['played:wrap','played:sorting','played:tower','played:sleigh']});
 return normalizeSave(s);
}
