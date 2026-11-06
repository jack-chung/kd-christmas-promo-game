import {SortingMusic} from './sorting-music.js';
import {C} from './content.js';

// Traditional chorus, checked against the public-domain notation linked in audio/README.md.
// G-major transposition; new harmony, bass and percussion. No lyrics or recordings of a song.
export const sleighScore={
 phrase:[
  [71,2],[71,.5],[69,.5],[67,.5],[64,.5], [62,2],[67,2],
  [66,.5],[66,1],[66,.5],[64,1],[66,1], [71,.5],[69,.5],[71,.5],[69,.5],[62,2],
  [71,2],[71,.5],[69,.5],[67,.5],[64,.5], [62,2],[67,1],[67,1],
  [64,1],[64,1],[71,.5],[67,.5],[66,1], [62,4]
 ],
 chords:[[43,47,50],[43,47,50],[50,54,57],[50,54,57],[43,47,50],[43,47,50],[48,52,55],[50,54,57]]
};
export class SleighMusic extends SortingMusic {
 constructor(music){super(music,{score:sleighScore,settings:C.sleigh.music});}
}
