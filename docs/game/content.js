import {weeklyCarols,arrangeSong} from './wrap-songs.js';
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
];

C.wrap.tiers=[
 {tier:1,id:'easy',beat:900,travel:3600,window:360,perfect:145,spacing:1500,pairs:false},
 {tier:2,id:'tunie',beat:750,travel:2700,window:300,perfect:120,spacing:600,pairs:false},
 {tier:3,id:'rapper',beat:650,travel:2200,window:250,perfect:100,spacing:0,pairs:true},
];
C.wrap.speed={step:.05,hits:6,cap:1.4,lookahead:550};
Object.assign(C.wrap,{intro:'Pick a carol. Wrap a whole song. Win your way up the stars!',choose:'Choose a song',start:'Meet the customer →',customer:'YOUR CUSTOMER',round:'{title}',duration:'One full song per round',resultCopy:'Try another song, chase a medal, or explore the town.',speedLabel:'Speed ×{speed}',speedUp:'Quicker! You’ve got this!',newSong:'New!',tierLock:'Win a {stars} song to unlock',dateLock:'Opens {date}',songBest:'Best {score} · top speed ×{speed}',noBest:'Not played yet',hubWon:'Songs won: {count}',songLength:'About {minutes} min',outfitCap:'This song gives up to a {medal} box and outfit.',bestSpeed:'Top speed ×{speed}'});
// Sorting calibration: milliseconds, gifts per promotion, and all rule order live here.
C.sorting={
 title:'The Royal Sorting Office', eyebrow:'TAG. SACK. THUMP!', intro:'Match each tag to its street. Keep the belt clear! Five oops ends your shift.',
 pointer:'☞', goal:'Win the Ribbon: {score} points', nextGoal:'Next medal: {medal} · {score} points', progress:'{medal}: {score} / {goal}', allMedals:'All medals won!', near:'So close! {score} / {goal}, try again!', start:'Start sorting →', practice:'Try the practice', practiceIntro:'☞ Match the tag to the sack. Three gifts. Try again as often as you like!', practiceDone:'Practice complete! Ready for your shift.', continue:'Got it! →', stage:'Stage {stage}', elapsed:'Time {time}', reviewStage:'Start at stage', score:'{score} points', oops:'Oops {count} / 5', queue:'Belt {count} / {capacity}', sorted:'Sorted!', echo:'Sorted! …orted! …orted!', oopsLines:['Oh, Christmas tree!', 'Great gumdrops!', 'By my tinsel!'], results:'Your royal sorting report', stats:'{sorted} gifts sorted · best combo {combo} · stage {stage}', finish:'Collect my rewards →', layer:'Ribbon won!', medal:'{medal} medal earned!', noMedal:'Keep sorting to earn a medal.', rush:'★ Rush', rushHint:'★ → {seconds}s', fragile:'Fragile shelf', royal:'Royal sack', tag:'Street tag', crown:'Crown', noCrown:'No crown', royalIcon:'♛', withCrown:'WITH a crown', withoutCrown:'WITHOUT a crown', royalFallback:'All other parcels → their street sack. Glass ALWAYS → Fragile.', priority:'Fragile first. Then the decree. Then the street.',
 streets:[{id:'candy',name:'Candy Cane Lane',symbol:'◆',color:'#e5a0ad'},{id:'holly',name:'Holly Hill',symbol:'✚',color:'#79c8b0'},{id:'ginger',name:'Gingerbread Row',symbol:'●',color:'#edc06a'},{id:'tinsel',name:'Tinsel Terrace',symbol:'▲',color:'#8dc7e6'}],
 patterns:[{id:'striped',label:'Striped',icon:'▨'},{id:'dotted',label:'Dotted',icon:'⠿'},{id:'plain',label:'Plain',icon:'■'}],
 rules:{streets:'Match the street tag → matching sack',rush:'Golden tag → sort within 2 seconds for bonus points',fragile:'Glass icon → Fragile shelf, whatever the street',royal:'{pattern} paper {crown} → Royal sack.',switch:'A new royal decree! Check the paper and crown.',shuffle:'New decree! The sacks swap places, too.',speed:'You know the rules. The belt gets quicker!'},
 ramp:{start:1,climb:1.8},
 stages:[
 {stage:1,streets:2,arrival:5200,gifts:14,rule:'streets'},
 {stage:2,streets:3,fourAfter:10,arrival:4200,gifts:24,rule:'streets'},
 {stage:3,streets:4,arrival:3300,gifts:20,rule:'rush',rush:true},
 {stage:4,streets:4,arrival:2800,gifts:22,rule:'fragile',rush:true,fragile:true},
 {stage:5,streets:3,arrival:2400,gifts:24,rule:'royal',rush:true,fragile:true,royal:true},
 {stage:6,streets:3,arrival:2000,gifts:26,rule:'switch',rush:true,fragile:true,royal:true,switch:30000},
 {stage:7,streets:3,arrival:1650,gifts:28,rule:'shuffle',rush:true,fragile:true,royal:true,switch:30000,shuffle:true},
 {stage:8,streets:3,arrival:1300,gifts:30,rule:'speed',rush:true,fragile:true,royal:true,switch:30000,shuffle:true}],
 scoring:{teach:'▣ Sort = points · ⚡ Fast = bonus · ★ Streak = ×2, ×3…',quick:'Quick!',quickBar:'Quick bonus left',quickTimer:'Quick {seconds}s',quickPoints:'Quick! +{points}',rushPoints:'Rush! +{points}',comboPoints:'×{multiplier} +{points}',streak:'{combo} in a row',reset:'Streak reset · ×1',base:'Gifts sorted ({count} × {points})',quickTotal:'Quick bonus',rushTotal:'Rush bonus',comboTotal:'Streak bonus',total:'Total',newBest:'New best!',best:'Your best: {score}',hubBest:'Best: {score}',setupBest:'Best: {score}',party:'Great sorting!',bestRun:'Best streak: {combo} · Stage {stage}'},
 feedback:{pitches:{candy:67,holly:69,ginger:71,tinsel:72,fragile:74,royal:76}},
 music:{title:'Good King Wenceslas',bpm:112,maxBpm:132,stageBpm:2,
 loading:'Getting the sorting band ready…',failed:'The band couldn’t load. You can still sort with sound off.'},
 tuning:{quickWindow:2000,capacity:4,slowGifts:3,slowArrival:5200,minArrival:350,speedStep:500,rushWindow:2000,basePoints:100,speedPoints:20,rushPoints:40,comboEvery:5,maxMultiplier:5,featureChance:.28},
 decrees:[{pattern:'striped',bow:true},{pattern:'dotted',bow:false},{pattern:'plain',bow:true},{pattern:'striped',bow:false}],
 medals:[2000,15000,200000],
 papers:[{id:'postmark-bronze',name:'Bronze parcel paper',medal:'Bronze',color:'#c58b58'},{id:'postmark-silver',name:'Silver snow paper',medal:'Silver',color:'#a9c8d0'},{id:'postmark-gold',name:'Gold crown paper',medal:'Gold',color:'#edc45d'}]
};
C.review.routes.push(['sorting','Sorting Office setup']);

C.update={interval:300000,note:'New things just arrived in Tuneville!'};

C.sleigh={
 title:'Pip’s Sleigh-Cart Run',eyebrow:'THE LAST MILE OF THE GIFT',intro:'Pip has a cart full of kindness. Hop through Tuneville, protect the stack and deliver at glowing doors.',
 goal:'Win the Tissue: deliver {count} gifts',start:'Let’s deliver →',practice:'Try the practice',practiceIntro:'Try each action. Keep trying — practice is safe!',practiceDone:'You know the road. Ready to deliver!',practiceRetry:'Try again — practice is safe!',
 controls:'Tap to hop · Hold for height · Tap again for a double hop',keyboard:'Space / ↑ to hop · Escape to pause',stack:'{count} / {max} gifts',record:'{count} gifts delivered',best:'Best: {count} gifts delivered',distance:'{count} m travelled',progress:'Tissue: {count} / {goal} delivered',stage:'Street {stage}',reviewStage:'Start at stage',continue:'Let’s go →',
 guide:'Road guide',guideIntro:'Look at the shape. Choose your move.',guideClose:'Back to the road',guideSetupClose:'Back to setup',guideCart:'Pip and a full cart fit underneath.',guideTitle:'Pip’s road guide',
 results:'Special delivery!',over:'Oh, sugarplums! The cart needs a rest.',near:'Just {count} more deliveries to win Tissue. Try again!',layer:'Tissue won!',again:'Another delivery round →',medals:['Bronze','Silver','Gold'],medal:'{medal} delivery medal',newBest:'New best!',pennant:'Tower best: {count} high',road:'Tuneville delivery road. Pip rides the gift cart.',
 objects:{fence:{name:'Fence',action:'Hop over!',hint:'Hop!',hit:'Fence! Hop over it.',result:'Fences knocked off {count} gifts. Hop over them next time.'},arch:{name:'Garland',action:'Stay down!',hint:'Stay down!',hit:'Garland! Stay down under it.',result:'Garlands knocked off {count} gifts. Stay down under them next time.'},gift:{name:'Loose gift',action:'Grab it!',hint:'Grab it!'},door:{name:'Delivery door',action:'Hop onto the gold step!',hint:'Hop onto the step!'},gap:{name:'Pothole',action:'Hold for a big hop!',hint:'Hold to hop!',hit:'Pothole! Hold for a big hop.',result:'Potholes knocked off {count} gifts. Hold for a big hop next time.'},moving:{name:'Toboggan',action:'Hop over!',hint:'Hop!',hit:'Toboggan! Hop over it.',result:'Toboggans knocked off {count} gifts. Hop over them next time.'},snowman:{name:'Snowman',action:'Hold + double hop!',hint:'Double hop!',hit:'Snowman! Hold and double hop.',result:'Snowmen knocked off {count} gifts. Hold and double hop next time.'}},
 messages:{hop:'Boing!',catch:'Caught it!',pickup:'One more gift!',hit:'Clear road — hop to catch it back!',lost:'Off it goes!',deliver:'Great gumdrops! +1 delivered',tooSoon:'Too soon!',tooLate:'Too late!',rollMiss:'Hop onto the step!',perfect:'Perfect delivery! +50 points',pattern:'',land:'',crash:'Oh, sugarplums!'},
 tuning:{startingGifts:6,maxGifts:8,gravity:1150,hop:370,doubleHop:450,holdLift:1600,holdDelay:.14,holdTime:.34,catchTime:1.1,catchHeight:142,catchBounce:10,catchDrift:32,catchReach:12,groundCatchSettle:.26,pickupReach:27,fenceClearance:32,movingClearance:20,archUnderside:112,cartHeight:24,pipHeight:66,giftRow:18,gapWidth:100,movingSpeed:12,doorSpeed:220,doorEvery:22,lateDoorEvery:15,doorWidth:60,markerDeliveries:4,perfectFraction:.34,perfectPoints:50,roofline:125,cartHalfWidth:22,playSeconds:18,lateDamageAt:420,lateDamage:3,speedRise:.7,spacingFall:.0008,patternTightenAfter:150,patternTightenRate:.001,patternEvery:10,ceilingSeconds:570,warningFall:.0016,ceilingDistance:200000,ceilingWarning:.08,ceilingSpacing:.01,guidedWarning:1.12,guidedSpeed:180,guidedGarlandSpeed:180,garlandWidth:285,guidedCount:2,lessonGap:[.2,.45],mixedLessonGap:.2,catchRecovery:.15},
 music:{loading:'Getting Pip’s band ready…',failed:'The band couldn’t load. You can still play with sound off.',title:'Go, Tell It on the Mountain',bpm:124,maxBpm:144,stageBpm:2,level:.48,duckLevel:.1},
 practiceSteps:['fence','arch','gift','door'],medalsAt:[4,10,20],
 patterns:[
  {id:'hop-down',name:'Hop, then stay down!',after:0,kinds:['fence','arch'],gap:1.25},
  {id:'big-double',name:'Big hop, double hop!',after:25,kinds:['gap','snowman'],gap:1.4},
  {id:'pair',name:'Two toboggans!',after:50,kinds:['moving','moving'],gap:1.05},
  {id:'high-gift',name:'Reach for a gift!',after:75,kinds:['gap','gift'],gap:.12},
  {id:'door-trial',name:'Special delivery!',after:100,kinds:['fence','door','arch'],gap:1.5},
  {id:'final-mix',name:'Quick choices!',after:150,kinds:['moving','arch','gap','snowman'],gap:1.05}
 ],
 faster:'Faster!',hopHere:'Hop here',bonusTotal:'Perfect landings: {count} · {points} bonus points',
 stages:[
  {stage:1,kind:'fence',clears:2,speed:190,warning:1.12,deliveryWindow:.30,spacing:[1.6,2.2],rule:'Hop over the fence.'},
  {stage:2,kind:'gift',clears:2,speed:196,warning:1.08,deliveryWindow:.30,spacing:[1.6,2.2],rule:'Touch the sparkling gift to grab it.'},
  {stage:3,kind:'door',clears:2,speed:204,warning:1.04,deliveryWindow:.30,spacing:[1.6,2.2],rule:'Hop onto the gold step. Tap at the take-off sparkles!'},
  {stage:4,kind:'arch',clears:2,speed:210,warning:1.02,deliveryWindow:.28,spacing:[1.5,1.8],rule:'Stay down — don’t hop under the garland!'},
  {stage:5,kind:'gap',clears:2,speed:220,warning:.97,deliveryWindow:.26,spacing:[1.5,2.1],rule:'Hold for a big hop over the pothole.'},
  {stage:6,kind:'moving',clears:2,speed:232,warning:.92,deliveryWindow:.24,spacing:[1.5,2],rule:'Hop over the runaway toboggan.'},
  {stage:7,kind:'snowman',clears:2,speed:248,warning:.86,deliveryWindow:.22,spacing:[1.5,1.9],rule:'Double hop over the snowman.'},
  {stage:8,kind:'speed',clears:0,speed:264,warning:.81,deliveryWindow:.18,spacing:[1.4,1.8],rule:'You know the road — watch for combinations!'}
 ]
};
C.episodes.find(ep=>ep.game==='sleigh').ready=true;
C.review.routes.push(['sleigh','Sleigh-Cart Run setup']);

// Launch collection data. IDs and order are stable: save codes use these indices.
C.profile.avatars=[{id:'helper-0',name:'Cocoa curls'},{id:'helper-1',name:'Mint braids'},{id:'helper-2',name:'Plum waves'},{id:'helper-3',name:'Golden crop'},{id:'helper-4',name:'Snowy swoop'},{id:'helper-5',name:'Berry buns'}];
C.hub.collection='▤ Treasure Book';
C.app.resetDetail='This clears your nickname, cards, outfits, scores and game progress. You’ll choose a new helper.';
C.sorting.medal='{medal} outfit earned!'; C.sorting.noMedal='Keep sorting to earn a medal outfit.';
C.treasure={
 title:'Treasure Book',intro:'Win layers, meet Tunies, and dress your helper.',cardsTab:'Tunie cards',outfitsTab:'Outfits',helper:'My helper',helperCopy:'A look of your own. Change it whenever you like!',helperSave:'Save my helper',slots:{head:'Head',neck:'Neck',body:'Body',held:'Held item'},none:'Take off',equip:'Wear it',equipped:'Wearing',locked:'Still to find',unknown:'Mystery Tunie',count:'{count} / {total} Tunie cards',setCount:'{count} / 6 collected',opens:'Opens {date}',found:'Found: {source}',rarities:{common:'Common',rare:'Rare',super:'Super Rare',mythical:'Mythical'},sources:{box:'Gift box',layer:'Won gift layer',set:'Street set collection',friend:'Friend scan',show:'Show code',welcome:'Welcome pack',stars:'Star exchange'},
 welcome:'Your welcome pack!',welcomeCopy:'Three new friends, including a Rare. They’re saved in your Treasure Book.',boxTitle:'A gift for playing!',open:'Open a box',skip:'Show my card now',next:'Keep collecting',boxes:'{count} boxes to open',boxNames:['Basic box','Bronze box','Silver box','Gold box'],duplicate:'A familiar friend! +{count} stars',newCard:'A new Tunie!',stars:'★ {count} stars',exchange:'Choose for 10 stars',oddsTitle:'What’s inside?',oddsCopy:'No purchases, ads or timers. Every fifth box without a Rare guarantees a Rare. Duplicates become stars.',oddsLine:'{box}: Common {common}%, Rare {rare}%, Super Rare {super}%, Champion {mythical}%',pityLabel:'Boxes since a Rare: {count} / 5',setReward:'Complete this street to earn {outfit}.',layerWon:'{layer} won! Your host card is in the book.',wrapGoal:'Win the Paper: grade B on any song',wrapNear:'Win the Paper: grade B on any song',towerGoal:'Win the Box: stack {count} high',towerNear:'So close! {count} / {goal} high. Try again!',medals:['Keep practising','Bronze!','Silver!','Gold!'],
 outfitReward:'Outfits unlocked · {names}',spend:'Spend 10 stars',stopPicking:'Stop choosing',backupTitle:'My Tuneville Gift backup',saveLink:'Backup link',restoreContinue:'Check backup',restoreQuestion:'Restore this collection?',restoreDestination:'This puts the collection on this phone.',moreCards:'This phone has more cards than the backup.',restoreReplace:'Restoring replaces this browser’s collection.',cancelRestore:'Cancel',scanFallback:'Picture on another screen? Scan it with the camera of the phone you want to restore.',platformHeadings:{ios:'On iPhone',android:'On Android'},backupSteps:{ios:['Open this picture in Photos.','Press and hold the QR code.','Tap the link, then tap Restore.'],android:['Open this picture in Google Photos.','Tap More (⋮), then Lens and the link.','Tap Restore.']},inAppByPlatform:{ios:'Open in Safari to keep your collection',android:'Open in Chrome to keep your collection',unknown:'Open in Safari/Chrome to keep your collection'},saveTitle:'Keep your collection safe',saveCopy:'Take a screenshot of this card.',saveCode:'Save code',restore:'Restore from code',restoreCopy:'Paste a backup link or your whole save code. You can check it before restoring.',restoreConfirm:'Restore',restored:'Collection restored!',badCode:'That code is incomplete or damaged. Try copying the whole code again.',codeLoading:'Making your save code…',copy:'Copy backup link',copied:'Backup link copied',copyFailed:'Select the backup link to copy it.',qrLabel:'QR code containing your full collection',
 homeTitle:'Keep your Tunies safe',homeCopy:'Add Tuneville to your Home Screen to help keep your collection safe. Keep a save-code screenshot too.',iosSteps:['Tap the Share button (□↑) in Safari.','Choose Add to Home Screen (＋).','Tap Add, then play from your new icon.'],androidSteps:['Tap ⋮, then Add to Home screen or Install and create shortcut.','Tap Install. No Install? Tap Create shortcut.','Follow the prompts, then use your new icon.'],ios:'iPhone · Safari',android:'Android · Chrome',dismiss:'Got it — remind me next week',inApp:'Open in Safari/Chrome to keep your collection',private:'Private or restricted browsing may erase your collection when you close it. Use a regular browser and keep a save code.',
 rareEvery:5,exchangeCost:10,duplicateStars:{common:1,rare:3,super:5,mythical:10},
 odds:[[.90,.09,.01,0],[.78,.17,.05,0],[.60,.30,.10,0],[.40,.40,.19,.01]],
 hostIds:['host-tansy','host-king','host-filbert','host-pip'],towerMedals:[12,25,40],
 sets:[{id:'candy',name:'Candy Cane Lane',date:'2026-11-13T05:00:00Z',label:'Nov 13'},{id:'holly',name:'Holly Hill',date:'2026-11-20T05:00:00Z',label:'Nov 20'},{id:'ginger',name:'Gingerbread Row',date:'2026-11-27T05:00:00Z',label:'Nov 27'},{id:'tinsel',name:'Tinsel Terrace',date:'2026-12-04T05:00:00Z',label:'Dec 4'}],
 cards:[],outfits:[]
};
const streetPeople=[
 [['Sugarplum Sid','Oh, sugarplums!'],['Peppermint Pippa','Mint to meet you!'],['Cocoa Cleo','Warm wishes!'],['Ribbon Remy','Tie a little joy!'],['Marzipan Mabel','Sweet as can be!'],['Angelina','A little sparkle goes a long way!']],
 [['Holly Hattie','By my holly!'],['Mistletoe Mo','Make room for a friend!'],['Ivy Iggy','Stick together!'],['Fir Fern','Ever so green!'],['Cranberry Cuthbert','Great gumdrops!'],['Brianca','Shine in your own way!']],
 [['Ginger Jem','Snap to it!'],['Nutmeg Nell','A pinch of cheer!'],['Biscuit Bo','Crumbs of comfort!'],['Clove Clover','Spice up the day!'],['Pudding Pearl','Oh, figgy pudding!'],['Sparky','Ready, set, sparkle!']],
 [['Tinsel Tilly','Twinkle on!'],['Glitter Gus','Glimmers for everyone!'],['Bauble Bea','Round up your friends!'],['Twinkle Ty','Bright idea!'],['Starry Stella','Reach for a star!'],['The Harmony Helpers','Better together!']]
];
streetPeople.forEach((people,set)=>people.forEach(([name,phrase],i)=>C.treasure.cards.push({id:`${C.treasure.sets[set].id}-${i}`,name,phrase,rarity:i<4?'common':i===4?'rare':'super',set:C.treasure.sets[set].id,art:set*6+i})));
[['Tansy','Every bow begins with a fold!','wrapper'],['King Dazzlebaum','Royally ready!','king'],['Filbert','One more on top!','kid'],['Pip','Special delivery!','note']].forEach(([name,phrase,cast],i)=>C.treasure.cards.push({id:C.treasure.hostIds[i],name,phrase,rarity:'super',set:'layer',cast,art:24+i}));
C.treasure.hostTitle='Gift-layer hosts'; C.treasure.mythicalTitle='Five Mythical wonders';
[['champion','Champion','A golden performance!','A small chance in Gold boxes.'],['collector','Collector','Every street, every friend!','Complete all four street sets.'],['friendship','Friendship','Room for three more!','Bring three new friends (coming soon).'],['opening','Opening Night','Let the curtain rise!','Enter the show code on December 12.'],['buddies','Show Buddies','A show to share!','Scan a show friend after 4 PM December 12 (coming soon).']].forEach(([id,name,phrase,hint],i)=>C.treasure.cards.push({id,name,phrase,hint,rarity:'mythical',set:'mythical',art:28+i}));
const medalPieces=[['wrap','head','Patchwork beanie','neck','Rhythm scarf','held','Ribbon wand'],['sorting','body','Parcel waistcoat','head','Postroom earmuffs','held','Royal letter'],['tower','neck','Builder scarf','body','Star sweater','held','Tiny tower'],['sleigh','head','Delivery cap','body','Winter cape','held','Golden gift']];
medalPieces.forEach(([game,...pieces])=>{for(let i=0;i<3;i++)C.treasure.outfits.push({id:`${game}-${i}`,slot:pieces[i*2],name:pieces[i*2+1],hint:`${C.treasure.medals[i+1]} · ${C.episodes.find(e=>e.game===game).title}`,shape:i,color:['#bd8050','#86b5c9','#f4c766'][i]});});
['Candy stripe scarf','Holly leaf beanie','Gingerbread sweater','Tinsel lantern'].forEach((name,i)=>C.treasure.outfits.push({id:`set-${C.treasure.sets[i].id}`,slot:['neck','head','body','held'][i],name,hint:`Complete ${C.treasure.sets[i].name}`,shape:3,color:['#dc7185','#71b5a3','#be833b','#ac8bd4'][i]}));
C.treasure.outfits.push({id:'champion-crown',slot:'head',name:'Champion’s gold crown',hint:'Find Champion in a Gold box',shape:4,color:'#f4c766'});

C.treasure.collectorProgress='{count} / 4 streets complete toward Collector';

C.treasure.homeReminderDays=7;
C.treasure.cards.filter(c=>c.set==='layer').forEach((card,i)=>card.hint=`Win the ${C.gift.layers[i]} in ${C.episodes[i].title}.`);

C.wrap.songs=[...C.wrap.songs,...weeklyCarols].map((song,i)=>arrangeSong(song,i,C.wrap.tiers));
