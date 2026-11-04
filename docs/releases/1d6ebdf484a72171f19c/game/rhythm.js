// Pure chart judgement. DOM, input and audio all use the same target times.
import {timing,grade} from './engine.js';
export function createRound(chart,difficulty){return {chart,difficulty,judged:new Set(),score:0,points:0,combo:0,maxCombo:0,strays:0,hits:0};}
export function judgeTap(round,lane,time){
  const {chart,difficulty,judged}=round;
  const candidates=chart.events.map((event,index)=>({event,index,offset:time-event.time})).filter(x=>!judged.has(x.index)&&Math.abs(x.offset)<=difficulty.window);
  const match=candidates.filter(x=>x.event.lane===lane).sort((a,b)=>Math.abs(a.offset)-Math.abs(b.offset))[0];
  if(!match){
    // A wrong lane consumes one nearby object; an empty tap costs points and combo.
    const wrong=candidates.sort((a,b)=>Math.abs(a.offset)-Math.abs(b.offset))[0];
    if(wrong)judged.add(wrong.index);
    round.combo=0;round.strays++;round.score=Math.max(0,round.score-60);round.points=Math.max(0,round.points-.35);
    return {tier:0,index:wrong?.index,stray:!wrong};
  }
  judged.add(match.index);const tier=timing(match.offset,difficulty);
  round.hits++;round.combo++;round.maxCombo=Math.max(round.maxCombo,round.combo);
  round.points+=tier===2?1:.72;round.score+=(tier===2?100:65)+Math.min(40,round.combo*2);
  return {...match,tier};
}
export function expireNotes(round,time){
  const missed=[];
  round.chart.events.forEach((event,index)=>{if(!round.judged.has(index)&&time>event.time+round.difficulty.window){round.judged.add(index);missed.push(index);}});
  if(missed.length)round.combo=0;
  return missed;
}
export function roundResult(round){const ratio=Math.max(0,round.points/round.chart.events.length);return {ratio,grade:grade(ratio),combo:round.maxCombo};}
