// All player-facing copy, cast names, dates, and game slots.
export const C = {
  app: { title: 'The Tuneville Gift', subtitle: 'A little town. A very big gift.', brand: 'KIDS DISCOVER PRESENTS', preview: 'UNANNOUNCED REVIEW PREVIEW', episode: 'GAME 01', privacy: 'Just for fun. Your progress stays on this device.', storage: 'This browser cannot save progress. You can still play; keep this tab open.', loading: 'Opening Tuneville…', noscript: 'Please turn on JavaScript to play The Tuneville Gift.', error: 'That page took a wrong turn. Let’s head back to town.', saved: 'Saved on this device', soundOn: '♪ Sound on', soundOff: '♪ Sound off', home: '⌂ Town', back: '← Back', continue: 'Continue →', playAgain: 'Play again', close: 'Close', newBest: 'A new personal best!', best: 'Best: {value}', notPlayed: 'Not played yet', score: 'Score', yes: 'Yes, reset', cancel: 'Keep playing', resetQuestion: 'Reset this device?', resetDetail: 'This clears your nickname, keepsakes, scores, and game progress. You’ll choose a new helper.', pause: 'Ⅱ Pause', resume: '▶ Keep playing', paused: 'Take a breather', pausedCopy: 'Your game is paused. Ready when you are.', mutedTip: 'Turn your sound on for music. You can play by sight, too.', resetDone: 'A fresh start!', },
  profile: { title: 'Every town needs a helper.', intro: 'Pick your look. We’ll make you a nickname.', nameLabel: 'YOUR TUNIE NICKNAME', shuffle: '↻ Try another name', choose: 'Choose your helper', start: 'Let’s go to Tuneville →', adjectives: ['Jolly', 'Bouncy', 'Merry', 'Cosy', 'Dancing', 'Sparkly', 'Zippy', 'Golden'], nouns: ['Ribbon', 'Sprout', 'Mitten', 'Noodle', 'Cocoa', 'Confetti', 'Button', 'Waffle'], avatars: [{id:'wrapper', name:'The wrapper'}, {id:'kid',name:'The thinker'}, {id:'note',name:'The music maker'}], },
  cast: { wrapper:'Tansy', kid:'Filbert', king:'King Dazzlebaum', note:'Pip', singers:'The backup singers' },
  hub: { eyebrow: 'WELCOME TO TUNEVILLE', title: 'A giant gift has arrived!', intro: 'A new game opens each Friday. Play to unwrap the gift, layer by layer.', greeting: 'Hey, {name}!', giftTag: 'DO NOT OPEN UNTIL DECEMBER 12', giftTime: '4 PM', layerCount: '{count} / 4 weekly layers', viewGift: '✦ Visit the mystery gift', choose: 'PICK YOUR NEXT ADVENTURE', wrap: 'Wrap Station', wrapSub: 'Find your rhythm. Make someone’s day.', tower:'Present Tower', towerSub:'One thumb. How high can you go?', play:'▶ Play Wrap Station', locked:'▣ Opens {date}', coming:'Coming soon', house:'House {number}', next:'NEXT GAME', countdown:'{days}d {hours}h {minutes}m', ready:'Wrap Station is open!', finaleReady:'It’s show day! The final layer is ready.', allOpen:'It’s show day! Visit the final gift.', collection:'▤ My keepsakes', invite:'✉ You’re invited', review:'Review controls', gallery:'Art direction gallery ↗', helper:'Your helper', layerOpen:'Layer 1 collected', },
  episodes: [
    {id:1,house:1,game:'wrap',title:'Wrap Station',cast:'wrapper',date:'2026-11-13T05:00:00Z',label:'Nov 13',ready:true},
    {id:2,house:2,game:'sorting',title:'Sorting Office',cast:'king',date:'2026-11-20T05:00:00Z',label:'Nov 20',ready:true},
    {id:3,house:3,game:'tower',title:'Present Tower',cast:'kid',date:'2026-11-27T05:00:00Z',label:'Nov 27',ready:true},
    {id:4,house:4,game:'sleigh',title:'Sleigh-Cart Run',cast:'note',date:'2026-12-04T05:00:00Z',label:'Dec 4',ready:false},
  ],
  finale: { date:'2026-12-12T21:00:00Z', house:12, code:'TUNIE12', title:'One last layer.', intro:'Find the special code at the musical. Then open your gift!', label:'Show-day code', placeholder:'Your code', submit:'Unwrap the final layer →', incorrect:'That code doesn’t fit yet. Try again!', locked:'The final layer opens December 12 at 4 PM.', revealTitle:'The greatest Gift.', revealCopy:'Christmas celebrates God’s greatest Gift: Jesus. You are loved, and there is a place for you here.', placeholderNote:'Review preview · Finale message and code are placeholders.', certificate:'Honorary Tunie', awarded:'This certifies that', reason:'brought curiosity, kindness, and a little wrapping magic to Tuneville.', table:'Show this screen at the Kids Discover table!', showCertificate:'See my certificate →', },
  gift: { title:'A present with a plan.', intro:'Four weekly layers. One final surprise at the musical.', layers:['Paper','Ribbon','Box','Tissue'], finale:'The final layer', earned:'✓ Collected', waiting:'▣ {date}', notBuilt:'Coming soon', play:'Play Wrap Station →', unwrap:'Pull the ribbon →', unwrapTitle:'You earned a little wonder.', unwrapCopy:'Layer 1 is yours. The rest of the mystery can wait!', replayTitle:'A little more wrapping magic.', replayCopy:'Layer 1 is already in your collection. Keep playing to beat your best!', cardTitle:'Wrap-star welcome', cardCopy:'A tiny bow. A big welcome. There’s always room for one more helper in Tuneville.', paper:'★ Star paper unlocked!', collectionTitle:'Pocket-sized treasures.', collectionIntro:'Your keepsakes and wrapping papers live here.', empty:'Your collection starts with Wrap Station. Play a game!', cardLabel:'GAME 1 KEEPSAKE', defaultPaper:'Cranberry paper', starPaper:'Golden star paper', equip:'Use this paper', equipped:'✓ In use', },
  wrap: { title:'Tansy’s Wrap Station', eyebrow:'RHYTHM + RIBBON', intro:'Three customers. Four moves. A whole lot of ribbon.', tutorial:'How to wrap', steps:['Watch the shapes fall.', 'Tap the same shape when it meets its outline.', 'Use two thumbs. Keep your taps on the beat.'], tutorialEnd:'Sound on for music. You can play by sight, too.', practice:'Meet the four moves', practiceCopy:'Tap all four shapes. Each has its own sound!', practiceDone:'You’ve got the moves!', choose:'Choose your rhythm', difficulty:[{id:'easy',label:'Easy',detail:'Slow · Fold + Tape',travel:3600,window:360,perfect:145},{id:'tunie',label:'Tunie',detail:'All four shapes',travel:2700,window:300,perfect:120},{id:'rapper',label:'Rapper',detail:'Fast · two-thumb pairs',travel:2200,window:250,perfect:100}], duration:'3 short songs · about 3 minutes', start:'Meet customer 1 →', customer:'CUSTOMER {current} / 3', ready:'Ready to wrap →', next:'Next customer →', finish:'Collect my layer →', round:'GIFT {current} / 3', beat:'MOVE {current} / {total}', combo:'{count}× combo', maxCombo:'Best combo: {count}', grades:'Gift grades', gradeLabel:'Grade {grade}', tap:'MATCH THE SHAPE', upcoming:'Next: {move}', actions:[{id:'fold',label:'Fold',icon:'fold'},{id:'tape',label:'Tape',icon:'tape'},{id:'ribbon',label:'Ribbon',icon:'ribbon'},{id:'bow',label:'Bow',icon:'bow'}], perfect:'Perfect!', good:'Nice wrap!', miss:'Catch the next one!', early:'Keep the beat!', wrong:'Match the shape!', held:'One tap per move. Ready for the next!', countdown:'Get ready…', done:'That’s a wrap!', giftDone:'One happy customer.', results:'Your wrapping report', resultCopy:'Every gift counts. Try a new rhythm, chase a combo, or explore the town.', accuracy:'{percent}% timing score', customerThanks:['That bow deserves a tiny round of applause.', 'A royal-sized thank-you! The singers agree.', 'My gift has more style than my hat. Excellent.'], customers:[{cast:'kid',order:'Oh, sugarplums! A stripey surprise, please. Make the bow bigger than my beanie!'}, {cast:'king',order:'By my tinsel! Something grand for Tinsel Mania. A royal amount of ribbon!'}, {cast:'note',order:'Great gumdrops! A gift for my best pal. Can you add a little extra bounce?'}], singerEcho:'“Ribbon!”',  },
  tower: { title:'Present Tower', eyebrow:'ONE THUMB. SKY-HIGH AMBITION.', intro:'The crane swings. You tap. Stack a tower for Tinsel Mania!', steps:'Tap Drop when the present is above the stack. Centre it for a perfect drop. Match three colours for a bonus.', start:'Start stacking →', drop:'↓ Drop present', height:'{count} gifts high', best:'Best height: {count}', perfect:'Perfect! +50', landed:'Steady landing!', streak:'Three of a colour! +75', over:'A tumble! A fresh start?', result:'{height} gifts · {score} points', tip:'Watch the stack sway. Aim for its centre.', sky:'Stacking playfield', },
  invitation: { eyebrow:'MAKE A LITTLE ROOM FOR WONDER', title:'Wrapping All the Way', presenter:'Kids Discover invites you to a children’s Christmas musical.', day:'Saturday, December 12, 2026', time:'4 PM', location:'RHCCC · S1', address:'9670 Bayview Avenue', city:'Richmond Hill, ON L4C 9X9', donation:'Bring a canned food item to donate to the food bank.', website:'www.rhccc.ca', websiteUrl:'https://www.rhccc.ca', cta:'Bring your curiosity. Bring a friend.', },
  review: { title:'Review the whole adventure.', intro:'Preview controls bypass dates. Future games are placeholders. The show-day code is {code}.', enable:'Turn on review mode', disable:'Exit review mode', active:'REVIEW MODE · DATE LOCKS BYPASSED', jump:'Jump to a screen', reset:'↻ Reset device progress', preview:'REVIEW PREVIEW · no layer awarded', previewLayer:'Preview layer 1 unwrap', routes:[['onboard','Choose a helper'],['hub','Tuneville hub'],['wrap','Wrap Station setup'],['wrapPractice','Wrap practice'],['wrapOrder','Wrap customer'],['wrapPlay','Wrap gameplay'],['wrapGift','Gift grade'],['wrapResults','Wrap results'],['tower','Tower setup'],['towerPlay','Tower gameplay'],['towerResults','Tower results'],['gift','Mystery gift'],['unwrap','Layer 1 unwrap'],['collection','Keepsakes'],['finale','Final code entry'],['finalReveal','Final unwrap'],['certificate','Certificate'],['invitation','Invitation']], },
};

C.review.code='Placeholder code: {code}';
C.hub.firstWait='Wrap Station opens November 13. Until then, visit the gift or see your invitation.';

// Slots own their game, release date, and keepsake. Unbuilt games never open.
C.hub.offline='Connect to the internet to check for new games.';
C.hub.play='▶ Play';
C.hub.playEpisode='▶ Play game {number}';
C.hub.selectedEpisode='GAME {number} · {date}';
C.gift.episodeLabel='GAME {number} KEEPSAKE';
for(const ep of C.episodes.slice(1))ep.content={gift:{
  cardTitle:`Placeholder: ${ep.title} keepsake`,
  cardCopy:'Placeholder keepsake — KD leadership will write this message.',
  unwrapCopy:`Layer ${ep.id} is yours!`,
}};
export function episodeContent(episode) {
  const overrides=episode.content||{},result={...C};
  for(const key of ['wrap','gift','hub','app'])result[key]={...C[key],...overrides[key]};
  result.gift.cardLabel=C.gift.episodeLabel.replace('{number}',episode.id);
  return result;
}

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
  // ANTIOCH soprano, Mutopia-2008/01/13-1223, transposed D → C.
  // Double the source's 2/4 values into our four-beat pulse; full 19-bar melody.
  {id:'joy-to-the-world',title:'Joy to the World',meter:4,
    chords:[[48,52,55],[48,52,55],[55,59,62],[48,52,55],[53,57,60],[55,59,62],[48,52,55],
      [48,52,55],[55,59,62],[48,52,55],[55,59,62],[48,52,55],[48,52,55],[55,59,62],
      [55,59,62],[48,52,55],[53,57,60],[55,59,62],[48,52,55]],
    phrase:[[72,2],[71,1.5],[69,.5],[67,3],[65,1],[64,2],[62,2],[60,3],[67,1],
      [69,3],[69,1],[71,3],[71,1],[72,3],[72,1],
      [72,1],[71,1],[69,1],[67,1],[67,1.5],[65,.5],[67,1],[72,1],
      [72,1],[71,1],[69,1],[67,1],[67,1.5],[65,.5],[64,1],[64,1],
      [64,1],[64,1],[64,1],[64,.5],[65,.5],[67,3],[65,.5],[64,.5],
      [62,1],[62,1],[62,1],[62,.5],[64,.5],[65,3],[64,.5],[62,.5],
      [60,1],[72,2],[69,1],[67,1.5],[65,.5],[64,1],[65,1],[64,2],[62,2],[60,4]]},
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

// Sorting calibration: milliseconds, gifts per promotion, and all rule order live here.
C.sorting={
 title:'The Royal Sorting Office', eyebrow:'TAG. SACK. THUMP!', intro:'Match each tag to its street. Keep the belt clear! Five oops ends your shift.',
 pointer:'☞', choose:'Choose your shift', start:'Start sorting →', practice:'Try the practice', practiceIntro:'☞ Match the tag to the sack. Three gifts. Try again as often as you like!', practiceDone:'Practice complete! Ready for your shift.', continue:'Got it! →', stage:'Stage {stage}', elapsed:'Time {time}', reviewStage:'Start at stage', score:'{score} points', oops:'Oops {count} / 5', queue:'Belt {count} / {capacity}', sorted:'Sorted!', echo:'Sorted! …orted! …orted!', oopsLines:['Oh, Christmas tree!', 'Great gumdrops!', 'By my tinsel!'], results:'Your royal sorting report', stats:'{sorted} gifts sorted · best combo {combo} · stage {stage}', finish:'Collect my Ribbon →', layer:'Ribbon collected!', medal:'{medal} postmark earned!', noMedal:'Keep sorting to earn a postmark.', rush:'★ Rush', rushHint:'★ → {seconds}s', fragile:'Fragile shelf', royal:'Royal sack', tag:'Street tag', crown:'Crown', noCrown:'No crown', royalIcon:'♛', withCrown:'WITH a crown', withoutCrown:'WITHOUT a crown', royalFallback:'All other parcels → their street sack. Glass ALWAYS → Fragile.', priority:'Fragile first. Then the decree. Then the street.',
 streets:[{id:'candy',name:'Candy Cane Lane',symbol:'◆',color:'#e5a0ad'},{id:'holly',name:'Holly Hill',symbol:'✚',color:'#79c8b0'},{id:'ginger',name:'Gingerbread Row',symbol:'●',color:'#edc06a'},{id:'tinsel',name:'Tinsel Terrace',symbol:'▲',color:'#8dc7e6'}],
 patterns:[{id:'striped',label:'Striped',icon:'▨'},{id:'dotted',label:'Dotted',icon:'⠿'},{id:'plain',label:'Plain',icon:'■'}],
 rules:{streets:'Match the street tag → matching sack',rush:'Golden tag → sort within 2 seconds for bonus points',fragile:'Glass icon → Fragile shelf, whatever the street',royal:'{pattern} paper {crown} → Royal sack.',switch:'A new royal decree! Check the paper and crown.',shuffle:'New decree! The sacks swap places, too.',speed:'You know the rules. The belt gets quicker!'},
 difficulties:[{id:'easy',label:'Easy',detail:'Gentle start · slow climb',start:1,climb:1.8},{id:'tunie',label:'Tunie',detail:'Three streets · steady climb',start:2,climb:1},{id:'rapper',label:'Rapper',detail:'Fragile first · quick climb',start:4,climb:.6}],
 stages:[
 {stage:1,streets:2,arrival:5200,gifts:14,rule:'streets'},
 {stage:2,streets:3,fourAfter:10,arrival:4200,gifts:24,rule:'streets'},
 {stage:3,streets:4,arrival:3300,gifts:20,rule:'rush',rush:true},
 {stage:4,streets:4,arrival:2800,gifts:22,rule:'fragile',rush:true,fragile:true},
 {stage:5,streets:3,arrival:2400,gifts:24,rule:'royal',rush:true,fragile:true,royal:true},
 {stage:6,streets:3,arrival:2000,gifts:26,rule:'switch',rush:true,fragile:true,royal:true,switch:30000},
 {stage:7,streets:3,arrival:1650,gifts:28,rule:'shuffle',rush:true,fragile:true,royal:true,switch:30000,shuffle:true},
 {stage:8,streets:3,arrival:1300,gifts:30,rule:'speed',rush:true,fragile:true,royal:true,switch:30000,shuffle:true}],
 scoring:{teach:'▣ Sort = points · ⚡ Fast = bonus · ★ Streak = ×2, ×3…',quick:'Quick!',quickBar:'Quick bonus left',quickTimer:'Quick {seconds}s',quickPoints:'Quick! +{points}',rushPoints:'Rush! +{points}',comboPoints:'×{multiplier} +{points}',streak:'{combo} in a row',reset:'Streak reset · ×1',base:'Gifts sorted ({count} × {points})',quickTotal:'Quick bonus',rushTotal:'Rush bonus',comboTotal:'Streak bonus',total:'Total',newBest:'New best!',best:'Your {difficulty} best: {score}',hubBest:'Best: {score} · {difficulty}',setupBest:'Best: {score}',party:'Great sorting!',bestRun:'Best streak: {combo} · Stage {stage}'},
 feedback:{pitches:{candy:67,holly:69,ginger:71,tinsel:72,fragile:74,royal:76}},
 music:{title:'Good King Wenceslas',bpm:112,maxBpm:132,stageBpm:2,
 loading:'Getting the sorting band ready…',failed:'The band couldn’t load. You can still sort with sound off.'},
 tuning:{quickWindow:2000,capacity:4,slowGifts:3,slowArrival:5200,minArrival:450,speedStep:120,mistakeEase:.16,maxEase:.5,rushWindow:2000,basePoints:100,speedPoints:20,rushPoints:40,comboEvery:5,maxMultiplier:5,featureChance:.28},
 decrees:[{pattern:'striped',bow:true},{pattern:'dotted',bow:false},{pattern:'plain',bow:true},{pattern:'striped',bow:false}],
 medals:{easy:[800,3000,7500],tunie:[1200,4500,10000],rapper:[1600,6000,14000]},
 papers:[{id:'postmark-bronze',name:'Bronze parcel paper',medal:'Bronze',color:'#c58b58'},{id:'postmark-silver',name:'Silver snow paper',medal:'Silver',color:'#a9c8d0'},{id:'postmark-gold',name:'Gold crown paper',medal:'Gold',color:'#edc45d'}]
};
C.review.routes.push(['sorting','Sorting Office setup']);

C.update={interval:300000,note:'New things just arrived in Tuneville!'};

C.sleigh={
 title:'Pip’s Sleigh-Cart Run',eyebrow:'THE LAST MILE OF THE GIFT',intro:'Pip has a cart full of kindness. Hop through Tuneville, protect the stack and deliver at glowing doors.',
 goal:'Win the Tissue: deliver {count} gifts',start:'Let’s deliver →',practice:'Try the practice',practiceIntro:'Tap to hop over three fences. Then collect a gift. Keep trying — practice is safe!',practiceDone:'Ready for the delivery round!',
 controls:'Tap to hop · Hold for height · Tap again for a double hop',keyboard:'Space / ↑ to hop · Escape to pause',stack:'{count} / {max} gifts',record:'{count} gifts delivered',best:'Best: {count} gifts delivered',distance:'{count} m travelled',progress:'Tissue: {count} / {goal} delivered',stage:'Street {stage}',reviewStage:'Start at stage',continue:'Let’s go →',
 results:'Special delivery!',over:'Oh, sugarplums! The cart needs a rest.',near:'Just {count} more deliveries to win Tissue. Try again!',layer:'Tissue won!',again:'Another delivery round →',medals:['Bronze','Silver','Gold'],medal:'{medal} delivery medal',newBest:'New best!',pennant:'Tower best: {count} high',road:'Tuneville delivery road. Pip rides the gift cart.',
 messages:{hop:'Boing!',catch:'Caught it!',pickup:'One more gift!',hit:'Hop to catch it back!',lost:'Off it goes!',deliver:'Great gumdrops! +1 delivered',land:'',crash:'Oh, sugarplums!'},
 tuning:{startingGifts:6,maxGifts:8,gravity:1050,hop:310,doubleHop:340,holdLift:650,holdTime:.24,catchTime:1.1,doorFirst:22,doorEvery:24,doorWidth:78,ceilingDistance:150000,ceilingWarning:.08,ceilingSpacing:.09},
 medalsAt:[4,10,20],
 stages:[
  {stage:1,at:0,speed:112,warning:2.12,spacing:[1.25,1.9],icon:'▥ ↑',rule:'Tap to hop over fences. Hold to go higher. Tap again for a double hop.'},
  {stage:2,at:3,speed:116,warning:2.05,spacing:[1.2,1.8],icon:'▣ +1',rule:'Collect loose gifts. Some need a hop. Your cart holds eight.'},
  {stage:3,at:6,speed:120,warning:1.98,spacing:[1.25,1.9],icon:'▣ → ▱',rule:'Land on a glowing doormat to deliver. Each delivery uses the top gift. Skipping a door is fine.'},
  {stage:4,at:9,speed:124,warning:1.9,spacing:[.65,.9],icon:'⌒ →',rule:'Stay on the road under garlands. Don’t hop!'},
  {stage:5,at:30,speed:132,warning:1.78,spacing:[1.1,1.7],icon:'▰ ↑↑',rule:'Wide gingerbread pothole! Hold for height or double hop across.'},
  {stage:6,at:55,speed:142,warning:1.65,spacing:[1.05,1.6],icon:'▰ ↔',rule:'Runaway toboggans move toward you. Watch their approach and hop.'},
  {stage:7,at:80,speed:154,warning:1.52,spacing:[.95,1.5],icon:'▥ ⌒',rule:'Watch each obstacle. Fences, garlands and gaps arrive in mixed patterns.'},
  {stage:8,at:110,speed:164,warning:1.42,spacing:[.9,1.4],icon:'→ →',rule:'You know the road. The cart keeps getting faster!'}
 ]
};
C.episodes.find(ep=>ep.game==='sleigh').ready=true;
C.review.routes.push(['sleigh','Sleigh-Cart Run setup']);
