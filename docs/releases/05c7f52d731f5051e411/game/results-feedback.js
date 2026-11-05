import {GameFeedback} from './game-feedback.js';
export const celebration=(count=24)=>`<div class="confetti" aria-hidden="true">${Array.from({length:count},(_,i)=>`<i style="--x:${(i*37)%100}%;--delay:${i%6*.08}s;--turn:${i*53}deg;--colour:${['#f4c766','#cc79a7','#56b4e9','#009e73'][i%4]}"></i>`).join('')}</div>`;
export function activateResults(music,result){
 let disposed=false;music.unlock();music.load().then(()=>{if(!disposed&&!document.hidden)new GameFeedback(music).celebrate(result.celebration);});
 return ()=>{disposed=true;music.hush();};
}
