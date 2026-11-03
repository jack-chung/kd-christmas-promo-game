// All player-facing copy, cast names, dates, puzzle content, and episode data.
export const C = {
  app: { title: 'The Tuneville Gift', subtitle: 'A little town. A very big mystery.', brand: 'KIDS DISCOVER PRESENTS', preview: 'UNANNOUNCED REVIEW PREVIEW', episode: 'EPISODE 01', privacy: 'Just for fun. Your progress stays on this device.', storage: 'This browser cannot save progress. You can still play; keep this tab open.', loading: 'Opening Tuneville…', noscript: 'Please turn on JavaScript to play The Tuneville Gift.', error: 'That page took a wrong turn. Let’s head back to town.', saved: 'Saved on this device', soundOn: '♪ Sound on', soundOff: '♪ Sound off', home: '⌂ Town', back: '← Back', continue: 'Continue →', playAgain: 'Play again', close: 'Close', newBest: 'A new personal best!', best: 'Best: {value}', score: 'Score', stars: '★ {count}', time: '{minutes}:{seconds}', yes: 'Yes, reset', cancel: 'Keep playing', resetQuestion: 'Reset this device?', resetDetail: 'This clears your nickname, keepsakes, scores, and puzzle progress. You’ll choose a new helper.', pause: 'Ⅱ Pause', resume: '▶ Keep playing', paused: 'Take a breather', pausedCopy: 'Your game is paused. Ready when you are.', mutedTip: 'Turn your sound on for music. You can play by sight, too.', resetDone: 'A fresh start!', minutes: '{count} min', },
  profile: { title: 'Every town needs a helper.', intro: 'Pick your look. We’ll make you a nickname.', nameLabel: 'YOUR TUNIE NICKNAME', shuffle: '↻ Try another name', choose: 'Choose your helper', start: 'Let’s go to Tuneville →', adjectives: ['Jolly', 'Bouncy', 'Merry', 'Cosy', 'Dancing', 'Sparkly', 'Zippy', 'Golden'], nouns: ['Ribbon', 'Sprout', 'Mitten', 'Noodle', 'Cocoa', 'Confetti', 'Button', 'Waffle'], avatars: [{id:'wrapper', name:'The wrapper'}, {id:'kid',name:'The thinker'}, {id:'note',name:'The music maker'}], },
  cast: { wrapper:'Tansy', kid:'Filbert', king:'King Dazzlebaum', note:'Pip', singers:'The backup singers' },
  hub: { eyebrow: 'WELCOME TO TUNEVILLE', title: 'A giant gift has arrived!', intro: 'Who sent that giant present? Play, collect clues, and peel back the mystery.', greeting: 'Hey, {name}!', giftTag: 'DO NOT OPEN UNTIL DECEMBER 12', giftTime: '4 PM', layerCount: '{count} / 4 weekly layers', viewGift: '✦ Visit the mystery gift', choose: 'PICK YOUR NEXT ADVENTURE', wrap: 'Wrap Station', wrapSub: 'Find your rhythm. Make someone’s day.', mystery:'Mystery Trail', mysterySub: 'Three houses. Three clues. One code.', tower:'Present Tower', towerSub:'One thumb. How high can you go?', play:'▶ Play Episode 1', locked:'▣ Opens {date}', coming:'Coming soon', future:'This house is still being built. Try Episode 1 while you wait!', house:'House {number}', next:'NEXT EPISODE', countdown:'{days}d {hours}h {minutes}m', ready:'Episode 1 is open!', finaleReady:'It’s show day! The final layer is ready.', allOpen:'All weekly dates have arrived. More games are coming soon.', collection:'▤ My keepsakes', invite:'✉ You’re invited', review:'Review controls', gallery:'Art direction gallery ↗', helper:'Your helper', layerOpen:'Layer 1 collected', },
  episodes: [
    {id:1,house:1,date:'2026-11-20T05:00:00Z',label:'Nov 20',ready:true},
    {id:2,house:2,date:'2026-11-27T05:00:00Z',label:'Nov 27',ready:false},
    {id:3,house:3,date:'2026-12-04T05:00:00Z',label:'Dec 4',ready:false},
    {id:4,house:4,date:'2026-12-11T05:00:00Z',label:'Dec 11',ready:false},
  ],
  finale: { date:'2026-12-12T21:00:00Z', house:12, code:'TUNIE12', title:'One last layer.', intro:'Find the special code at the musical. Then open your gift!', label:'Show-day code', placeholder:'Your code', submit:'Unwrap the final layer →', incorrect:'That code doesn’t fit yet. Try again!', locked:'The final layer opens December 12 at 4 PM.', revealTitle:'The greatest Gift.', revealCopy:'Christmas celebrates God’s greatest Gift: Jesus. You are loved, and there is a place for you here.', placeholderNote:'Review preview · Finale message and code are placeholders.', certificate:'Honorary Tunie', awarded:'This certifies that', reason:'brought curiosity, kindness, and a little wrapping magic to Tuneville.', table:'Show this screen at the Kids Discover table!', showCertificate:'See my certificate →', },
  gift: { title:'A present with a plan.', intro:'Four weekly layers. One final surprise at the musical.', layers:['Paper','Ribbon','Box','Tissue'], finale:'The final layer', earned:'✓ Collected', waiting:'▣ {date}', notBuilt:'Coming soon', play:'Play Episode 1 →', unwrap:'Pull the ribbon →', unwrapTitle:'You earned a little wonder.', unwrapCopy:'Layer 1 is yours. The rest of the mystery can wait!', replayTitle:'A little more wrapping magic.', replayCopy:'Layer 1 is already in your collection. Keep playing to beat your best!', cardTitle:'Wrap-star welcome', cardCopy:'A tiny bow. A big welcome. There’s always room for one more helper in Tuneville.', paper:'★ Star paper unlocked!', collectionTitle:'Pocket-sized treasures.', collectionIntro:'Your keepsakes and wrapping papers live here.', empty:'Your collection starts with Episode 1. Pick either adventure!', cardLabel:'EPISODE 1 KEEPSAKE', defaultPaper:'Cranberry paper', starPaper:'Golden star paper', equip:'Use this paper', equipped:'✓ In use', },
  wrap: { title:'Tansy’s Wrap Station', eyebrow:'RHYTHM + RIBBON', intro:'Three customers. Four moves. A whole lot of ribbon.', tutorial:'How to wrap', steps:['Watch the shapes fall.', 'Tap the same shape when it meets its outline.', 'Use two thumbs. Keep your taps on the beat.'], tutorialEnd:'Sound on for music. You can play by sight, too.', practice:'Meet the four moves', practiceCopy:'Tap all four shapes. Each has its own sound!', practiceDone:'You’ve got the moves!', choose:'Choose your rhythm', difficulty:[{id:'easy',label:'Easy',detail:'Slow · Fold + Tape',travel:3600,window:360,perfect:145},{id:'tunie',label:'Tunie',detail:'All four shapes',travel:2700,window:300,perfect:120},{id:'rapper',label:'Rapper',detail:'Fast · two-thumb pairs',travel:2200,window:250,perfect:100}], duration:'3 short songs · about 3 minutes', start:'Meet customer 1 →', customer:'CUSTOMER {current} / 3', ready:'Ready to wrap →', next:'Next customer →', finish:'Collect my layer →', round:'GIFT {current} / 3', beat:'MOVE {current} / {total}', combo:'{count}× combo', maxCombo:'Best combo: {count}', grades:'Gift grades', gradeLabel:'Grade {grade}', tap:'MATCH THE SHAPE', upcoming:'Next: {move}', actions:[{id:'fold',label:'Fold',icon:'fold'},{id:'tape',label:'Tape',icon:'tape'},{id:'ribbon',label:'Ribbon',icon:'ribbon'},{id:'bow',label:'Bow',icon:'bow'}], perfect:'Perfect!', good:'Nice wrap!', miss:'Catch the next one!', early:'Keep the beat!', wrong:'Match the shape!', held:'One tap per move. Ready for the next!', countdown:'Get ready…', done:'That’s a wrap!', giftDone:'One happy customer.', results:'Your wrapping report', resultCopy:'Every gift counts. Try a new rhythm, chase a combo, or explore the town.', accuracy:'{percent}% timing score', customerThanks:['That bow deserves a tiny round of applause.', 'A royal-sized thank-you! The singers agree.', 'My gift has more style than my hat. Excellent.'], customers:[{cast:'kid',order:'Oh, sugarplums! A stripey surprise, please. Make the bow bigger than my beanie!'}, {cast:'king',order:'By my tinsel! Something grand for Tinsel Mania. A royal amount of ribbon!'}, {cast:'note',order:'Great gumdrops! A gift for my best pal. Can you add a little extra bounce?'}], singerEcho:'“Ribbon!”',  },
  mystery: { title:'The Tuneville Mystery', eyebrow:'A CASE FOR CURIOUS MINDS', intro:'Who sent the giant gift? Follow three clues to crack the first layer.', duration:'Take your time · 3 puzzle houses', start:'Follow the trail →', stars:'Start with 3 stars. Each hint costs 1.', timer:'Your solve time', hint:'? Hint · costs 1 ★', hintUsed:'Hint already used here', noStars:'No stars left. You can still solve it!', hintReveal:'A little nudge', houses:['The cluttered workshop', 'The secret post', 'The parcel parade'], houseNumber:'CLUE HOUSE {current} / 3', found:'{count} / 4 found', hiddenTitle:'Something’s hiding in plain sight.', hiddenCopy:'Find all FOUR bows on STRIPED parcels. Leave the dotted and plain parcels alone.', hiddenHint:'Look for parallel stripes on the paper. Then look for a bow on top. There are four.', hiddenWrong:'That one doesn’t have both stripes and a bow. Keep looking!', hiddenFound:'Good eye! One stripey bow found.', hiddenSolved:'Four stripey bows! Your first code digit is 4.', hiddenDigit:'4', cipherTitle:'A note in the post.', cipherCopy:'Each letter has moved ONE place forward in the alphabet. Move it back to read the message.', cipherKey:'POST: B → A · C → B · D → C · … · A → Z', cipherMessage:'DPVOU UIF TJY TUBST', cipherPrompt:'What number does the decoded message tell you?', cipherOptions:['3','5','6','8'], cipherAnswer:'6', cipherHint:'DPVOU becomes COUNT. UIF becomes THE. TJY becomes SIX.', cipherWrong:'Move each letter back one place. You can use the hint.', cipherSolved:'COUNT THE SIX STARS. Your second code digit is 6.', riddleTitle:'Who has the blue parcel?', riddleCopy:'Three helpers. Three parcels. Read the clues, then tap the helper with BLUE.', clues:['Tansy has the red parcel.', 'Filbert does not have the blue parcel.', 'Pip has one parcel. Each colour is used once.'], riddleOptions:['wrapper','kid','note'], riddleAnswer:'note', riddleHint:'Tansy has red. Filbert cannot have blue, so Filbert has green. Who is left?', riddleWrong:'Try the clues one at a time. Who cannot have blue?', riddleSolved:'Pip has blue! Pip’s door number is 2. Your final code digit is 2.', riddleDigit:'2', next:'Next clue house →', clueCollected:'Clue collected', digits:'YOUR CLUE DIGITS', codeTitle:'Three clues. One little lock.', codeCopy:'Put the digits in house order. Then try the lock!', codeLabel:'Layer 1 code', codePlaceholder:'3 digits', codeSubmit:'Try the lock →', codeWrong:'Check your three clue digits. Keep them in house order.', complete:'Case beautifully cracked.', result:'{stars} ★ · Solve time {time}', best:'Fastest solve: {time}', resume:'Continue my case →', restart:'Start a fresh case', houseMap:'Choose a clue house', visit:'Visit house {number}', },
  tower: { title:'Present Tower', eyebrow:'ONE THUMB. SKY-HIGH AMBITION.', intro:'The crane swings. You tap. Stack a tower for Tinsel Mania!', steps:'Tap Drop when the present is above the stack. Centre it for a perfect drop. Match three colours for a bonus.', start:'Start stacking →', drop:'↓ Drop present', height:'{count} gifts high', best:'Best height: {count}', perfect:'Perfect! +50', landed:'Steady landing!', streak:'Three of a colour! +75', over:'A tumble! A fresh start?', result:'{height} gifts · {score} points', tip:'Watch the stack sway. Aim for its centre.', sky:'Stacking playfield', },
  invitation: { eyebrow:'MAKE A LITTLE ROOM FOR WONDER', title:'Wrapping All the Way', presenter:'Kids Discover invites you to a children’s Christmas musical.', day:'Saturday, December 12, 2026', time:'4 PM', location:'RHCCC · S1', address:'9670 Bayview Avenue', city:'Richmond Hill, ON L4C 9X9', donation:'Bring a canned food item to donate to the food bank.', website:'www.rhccc.ca', websiteUrl:'https://www.rhccc.ca', cta:'Bring your curiosity. Bring a friend.', },
  review: { title:'Review the whole adventure.', intro:'Preview controls bypass dates. Future episodes are placeholders. The show-day code is {code}.', enable:'Turn on review mode', disable:'Exit review mode', active:'REVIEW MODE · DATE LOCKS BYPASSED', jump:'Jump to a screen', reset:'↻ Reset device progress', preview:'REVIEW PREVIEW · no layer awarded', previewLayer:'Preview layer 1 unwrap', future:'Preview a future house', routes:[['onboard','Choose a helper'],['hub','Tuneville hub'],['wrap','Wrap Station setup'],['wrapPractice','Wrap practice'],['wrapOrder','Wrap customer'],['wrapPlay','Wrap gameplay'],['wrapGift','Gift grade'],['wrapResults','Wrap results'],['mystery','Mystery setup'],['mysteryMap','Mystery house map'],['hidden','Hidden-object house'],['cipher','Cipher house'],['riddle','Logic house'],['mysteryCode','Layer code lock'],['mysteryResults','Mystery results'],['tower','Tower setup'],['towerPlay','Tower gameplay'],['towerResults','Tower results'],['gift','Mystery gift'],['unwrap','Layer 1 unwrap'],['collection','Keepsakes'],['future','Future episode'],['finale','Final code entry'],['finalReveal','Final unwrap'],['certificate','Certificate'],['invitation','Invitation']], },
};
C.mystery.parcelLabel='{pattern} parcel {number}, {bow}';
C.mystery.patterns=['Plain','Striped','Dotted'];
C.mystery.bowStates=['no bow','with a bow'];
C.mystery.hiddenCheck='✓ Found';
C.mystery.notYet='Solve the three clue houses first.';

C.review.code='Placeholder code: {code}';
C.hub.firstWait='Episode 1 opens November 20. Until then, visit the gift or see your invitation.';

// Existing mechanics can be reused by supplying per-episode content overrides.
// Keep IDs stable; future slots remain unavailable until ready:true.
C.hub.playEpisode='▶ Play Episode {number}';
C.hub.selectedEpisode='EPISODE {number} · {date}';
C.gift.episodeLabel='EPISODE {number} KEEPSAKE';
C.mystery.parcels={count:16,striped:[1,3,5,8,10,14],bows:[0,1,5,6,10,11,14]};
C.episodes[0].content={};
export function episodeContent(episode) {
  const overrides=episode.content||{};
  const result={...C};
  for(const key of ['wrap','mystery','gift','hub','app'])result[key]={...C[key],...overrides[key]};
  result.hub.play=overrides.hub?.play||C.hub.playEpisode.replace('{number}',episode.id);
  result.gift.cardLabel=overrides.gift?.cardLabel||C.gift.episodeLabel.replace('{number}',episode.id);
  return result;
}
export const hiddenTargets=(mystery=C.mystery)=>mystery.parcels.striped.filter(id=>mystery.parcels.bows.includes(id));

// Public-domain melody transcriptions. No lyrics or modern arrangements.
// Pairs are MIDI pitch / duration in quarter-note beats; 0 is a rest.
C.wrap.keys=['D','F','J','K'];
C.wrap.songLabel='♪ {title}';
C.wrap.timeLeft='{seconds}s';
C.wrap.practiceGuide='Ready? Try four slow shapes.';
C.wrap.practiceStart='Try the falling shapes';
C.wrap.practiceFree='Play with the sounds';
C.wrap.practiceFinish='Ready for a song!';
C.wrap.practiceNext='Next: {move}';
C.wrap.empty='Wait for your shape!';
C.wrap.musicLoading='Warming up the band…';
C.wrap.musicFailed='The band couldn’t load. Follow the shapes and keep wrapping!';
C.wrap.musicCredits='Music & sound credits';
C.wrap.countIn='{count}…';
C.wrap.songs=[
  {id:'deck-the-halls',title:'Deck the Halls',meter:4,
    chords:[[48,52,55],[48,52,55],[55,59,62],[48,52,55],[48,52,55],[48,52,55],[55,59,62],[48,52,55],
      [55,59,62],[48,52,55],[55,59,62],[48,52,55],[48,52,55],[53,57,60],[55,59,62],[48,52,55]],
    phrase:[[67,1.5],[65,.5],[64,1],[62,1],[60,1],[62,1],[64,1],[60,1],
      [62,.5],[64,.5],[65,.5],[62,.5],[64,1.5],[62,.5],[60,2],[0,2],
      [67,1.5],[65,.5],[64,1],[62,1],[60,1],[62,1],[64,1],[60,1],
      [62,.5],[64,.5],[65,.5],[62,.5],[64,1.5],[62,.5],[60,2],[0,2],
      [62,1.5],[64,.5],[65,1],[62,1],[64,1.5],[65,.5],[67,1],[62,1],
      [64,.5],[66,.5],[67,1],[69,.5],[71,.5],[72,1],[71,1],[69,1],[67,2],
      [67,1.5],[65,.5],[64,1],[62,1],[60,1],[62,1],[64,1],[60,1],
      [69,.5],[69,.5],[69,.5],[69,.5],[67,1.5],[65,.5],[64,1],[62,1],[60,2]]},
  {id:'o-christmas-tree',title:'O Christmas Tree',meter:4,
    chords:[[48,52,55],[48,52,55],[55,59,62],[48,52,55],[48,52,55],[48,52,55],[55,59,62],[48,52,55],
      [48,52,55],[53,57,60],[55,59,62],[48,52,55],[48,52,55],[48,52,55],[55,59,62],[48,52,55]],
    phrase:[[67,1],[72,1.5],[72,.5],[72,1],[74,1],[76,1.5],[76,.5],[76,2],
      [76,.5],[74,.5],[76,1],[77,1],[71,1],[74,1],[72,2],
      [67,1],[72,1.5],[72,.5],[72,1],[74,1],[76,1.5],[76,.5],[76,2],
      [76,.5],[74,.5],[76,1],[77,1],[71,1],[74,1],[72,2],
      [79,1],[79,.5],[76,.5],[81,1.5],[79,.5],[79,1],[77,1],[77,1],[77,1.5],
      [77,.5],[74,1],[79,1.5],[77,.5],[77,1],[76,1],[76,1],[67,1],
      [72,1.5],[72,.5],[72,1],[74,1],[76,1.5],[76,.5],[76,2],
      [76,.5],[74,.5],[76,1],[77,1],[71,1],[74,1],[72,2],[0,1]]},
  {id:'up-on-the-housetop',title:'Up on the Housetop',meter:4,
    chords:[[48,52,55],[48,52,55],[53,57,60],[48,52,55],[48,52,55],[48,52,55],[55,59,62],[48,52,55],
      [53,57,60],[48,52,55],[55,59,62],[48,52,55],[48,52,55],[53,57,60],[55,59,62],[48,52,55]],
    phrase:[[67,1],[67,.5],[67,.5],[69,1],[67,1],[64,1],[60,2],[0,1],
      [64,1],[64,1],[62,1],[62,1],[60,1],[62,1],[64,2],
      [67,1],[67,.5],[67,.5],[69,1],[67,1],[64,1],[60,2],[0,1],
      [64,1],[64,1],[62,1],[62,1],[60,1],[62,1],[60,2],
      [72,1],[72,1],[69,2],[67,1],[67,1],[64,2],
      [65,1],[65,1],[69,1],[69,1],[67,3],[0,1],
      [67,1],[67,.5],[67,.5],[72,1],[72,1],[71,1],[69,1],[67,2],
      [69,1],[69,1],[67,1],[65,1],[64,1],[62,1],[60,2]]},
].map(song=>{
  // One full melody at each tempo: difficulties never rearrange its pitches.
  const beats=song.phrase.reduce((n,[,length])=>n+length,0);
  return {...song,variants:Object.fromEntries(['easy','tunie','rapper'].map(id=>{
    const beat=id==='rapper'?650:750,events=[],automatic=[];
    let position=0,last=-Infinity,note=0;
    for(const [midi,length] of song.phrase){
      const time=position*beat;position+=length;
      if(!midi)continue;
      const lane=id==='easy'?note%2:note%4;
      if(id==='easy'&&time-last<1500)automatic.push({time,midi,lane});
      else {events.push({time,midi,lane});last=time;
        if(id==='rapper'&&note%12===7)events.push({time,midi:midi-12,lane:(lane+2)%4});
      }
      note++;
    }
    return [id,{duration:beats*beat,beat,events,automatic}];
  }))};
});
