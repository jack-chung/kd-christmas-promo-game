import {test,expect} from '@playwright/test';
// Fault injection at the engine boundary must bypass service-worker responses.
test.use({serviceWorkers:'block'});
const profile={adjective:0,noun:0,number:10,avatar:'wrapper'};
async function seed(page,extra={}){await page.addInitScript(({profile,extra})=>{localStorage.setItem('tuneville-gift-v1',JSON.stringify({version:2,profile,sleighPractice:true,...extra}));},{profile,extra});}
async function enter(page,stage='1'){await page.goto('/?review=1#sleigh');await page.locator('#sleigh-stage-select').selectOption(stage);await page.locator('[data-action="sleigh-start"]').click();await page.locator('#sleigh-continue').click();}
async function cards(page,seconds){for(let i=0;i<seconds;i++){await page.clock.runFor(1000);if(await page.locator('#sleigh-continue').count())await page.locator('#sleigh-continue').click();}}
test('phone tap, hold, keyboard, stage cards and pause freeze the road',async({page})=>{
 await seed(page,{towerBest:17});await page.clock.install();await enter(page);
 const before=await page.locator('#sleigh-canvas').screenshot();await page.keyboard.down('Space');await page.clock.runFor(200);await page.keyboard.up('Space');const hopped=await page.locator('#sleigh-canvas').screenshot();expect(before.equals(hopped)).toBe(false);
 await page.locator('#sleigh-pause').click();await page.clock.runFor(100);const paused=await page.locator('#sleigh-canvas').evaluate(c=>c.toDataURL());await page.clock.runFor(10000);expect(await page.locator('#sleigh-canvas').evaluate(c=>c.toDataURL())).toBe(paused);
 await page.locator('#sleigh-guide').click();await expect(page.locator('.sleigh-guide-grid figure')).toHaveCount(7);await expect(page.locator('.sleigh-guide')).toContainText('Stay down!');await page.locator('#sleigh-guide-close').click();await page.locator('#sleigh-continue').click();
 await page.locator('#sleigh-canvas').dispatchEvent('pointerdown',{pointerId:1});await page.clock.runFor(200);await page.locator('#sleigh-canvas').dispatchEvent('pointerup',{pointerId:1});

});
for(const viewport of [{width:320,height:568},{width:390,height:844}])test(`portrait road fits ${viewport.width} × ${viewport.height}`,async({page})=>{
 await seed(page,{towerBest:25});await page.setViewportSize(viewport);await page.clock.install();
 // A stage-7 road reached through earlier lessons already knows every shape.
 await page.route('**/game/sleigh.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('return {stage,practice,random,',"if(stage===7){let i=0;random=()=>[.42,.5,.7,.5][i++%4];}return globalThis.__sleighRun={stage,practice,random,").replace('seen:{},',"seen:stage===7?{fence:2,gift:2,door:2,arch:2,gap:2,moving:2,snowman:2}:{},")});});
 await page.goto('/?review=1#sleigh');await page.locator('[data-action="sleigh-guide"]').click();await expect(page.locator('.sleigh-guide-grid figure')).toHaveCount(7);
 const guide=await page.locator('.sleigh-guide').boundingBox();expect(guide.y+guide.height).toBeLessThanOrEqual(viewport.height);await page.screenshot({scale:'css',path:`docs/review/sleigh-road-sheet-${viewport.width}x${viewport.height}.png`});
 for(const stage of ['4','7']){await enter(page,stage);
 if(stage==='7'){
  const mixed=()=>page.evaluate(()=>{const r=globalThis.__sleighRun;return r?.objects.some(o=>o.kind==='snowman'&&o.x-o.width/2<260);});
  for(let step=0;step<200&&!await mixed();step++)await page.clock.runFor(25);
  expect(await mixed()).toBe(true);
 }else await page.clock.runFor(2400);
 const geometry=await page.evaluate(()=>({height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,road:document.querySelector('#sleigh-canvas').getBoundingClientRect().toJSON()}));expect(geometry.height).toBeLessThanOrEqual(viewport.height);expect(geometry.width).toBeLessThanOrEqual(viewport.width);expect(geometry.road.height).toBeGreaterThan(300);
 await page.screenshot({scale:'css',path:`docs/review/sleigh-stage-${stage}-${viewport.width}x${viewport.height}.png`});}
 await page.emulateMedia({reducedMotion:'reduce'});

});
for(const count of [0,3,4,10,20])test(`finished ${count}-delivery run persists best, celebration and Bronze-only layer`,async({page})=>{
 await seed(page);await page.clock.install();
 // Inject a finished-run score at the engine boundary; the genuine collision,
 // app completion, save, result rendering and audio lifecycle still execute.
 await page.route('**/game/sleigh.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('delivered:0,','delivered:'+count+',').replace('gifts:T.startingGifts','gifts:0')});});
 await enter(page);await cards(page,8);await expect(page.locator('.screen-sleighResults')).toBeVisible();await expect(page.locator('.result-total small')).toHaveText(`${count} gifts delivered`);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.sleighBest).toBe(count);expect(saved.sleighPlayed).toBe(true);expect(saved.layers.includes(4)).toBe(count>=4);
 await expect(page.locator('.sorting-party')).toHaveAttribute('data-celebration',count>=4?'2':count?'1':'0');await expect(page.locator('.confetti i')).toHaveCount(count>=4?48:count?36:24);await expect(page.locator('.sorting-new-best')).toHaveCount(count?1:0);await expect(page.locator('.sorting-medal-stamp')).toHaveCount(count>=4?1:0);
 await page.locator('[data-action="go:hub"]').filter({visible:true}).first().click();await expect(page.locator('[data-action="episode:4"] .availability')).toHaveText(`Best: ${count} gifts delivered`);
});
test('first visit practice cannot end from hits and launch stays date locked',async({page})=>{
 await seed(page,{sleighPractice:false});await page.clock.install();await page.goto('/?review=1#sleigh');await page.locator('[data-action="sleigh-start"]').click();await expect(page.locator('.pause-card')).toContainText('practice is safe');await page.locator('#sleigh-continue').click();await page.clock.runFor(30000);await expect(page.locator('.screen-sleighPlay')).toBeVisible();await expect(page.locator('#sleigh-stack')).toHaveText('6 / 8 gifts');
 await page.route('**/.host-time/**',route=>route.fulfill({status:404,headers:{date:'Wed, 04 Nov 2026 19:00:00 GMT'}}));await page.goto('/#sleigh');await expect(page.locator('.screen-hub')).toBeVisible();await expect(page.locator('[data-action="episode:4"] .availability')).toHaveText('▣ Opens Dec 4');await expect(page.locator('#sleigh-stage-select')).toHaveCount(0);
});
test('all eight review cards teach their element before motion',async({page})=>{
 await seed(page);await page.clock.install();for(let stage=1;stage<=8;stage++){
  await page.goto('/?review=1#sleigh');await page.locator('#sleigh-stage-select').selectOption(String(stage));await page.locator('[data-action="sleigh-start"]').click();await expect(page.locator('.pause-card')).toBeVisible();await expect(page.locator('.sleigh-rule-picture svg').first()).toBeVisible();const before=await page.locator('#sleigh-score').textContent();await page.clock.runFor(3000);await expect(page.locator('#sleigh-score')).toHaveText(before);
 }
});
test('phone feedback starts on the gesture and mute prevents hop and backing music',async({page})=>{
 await page.addInitScript(()=>{const Native=window.AudioContext||window.webkitAudioContext;window.cueStarts=0;window.AudioContext=class extends Native{constructor(...args){super(...args);window.sleighAudio=this;}createBufferSource(){const voice=super.createBufferSource(),start=voice.start;voice.start=function(...args){window.cueStarts++;return start.apply(this,args);};return voice;}};});
 await seed(page,{sound:true});await page.clock.install();await enter(page);await expect.poll(()=>page.evaluate(()=>window.sleighAudio?.state)).toBe('running');const before=await page.evaluate(()=>window.cueStarts);await page.locator('#sleigh-canvas').dispatchEvent('pointerdown');expect(await page.evaluate(()=>window.cueStarts)).toBeGreaterThan(before);await page.locator('#sleigh-canvas').dispatchEvent('pointerup');
 await page.locator('#sleigh-pause').click();await page.locator('[data-action="sound"]').filter({visible:true}).click();await page.locator('#sleigh-continue').click();const muted=await page.evaluate(()=>window.cueStarts);await page.locator('#sleigh-canvas').dispatchEvent('pointerdown');await page.locator('#sleigh-canvas').dispatchEvent('pointerup');await page.clock.runFor(500);expect(await page.evaluate(()=>window.cueStarts)).toBe(muted);
});

test('safe practice displays each real picture and saves completion only after the door landing',async({page})=>{
 await seed(page,{sleighPractice:false});await page.clock.install();
 await page.route('**/game/sleigh.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('return {stage,practice,random,','return globalThis.__sleighRun={stage,practice,random,')});});
 await page.goto('/?review=1#sleigh');await page.locator('[data-action="sleigh-start"]').click();
 for(const [kind,name] of [['fence','Fence'],['arch','Garland'],['gift','Loose gift'],['door','Delivery door']]){
  await expect(page.locator('.sleigh-rule-picture svg')).toHaveAttribute('aria-label',name);await page.locator('#sleigh-continue').click();
  await page.evaluate(kind=>{const r=globalThis.__sleighRun;r.next=99;r.objects=[{kind,x:kind==='fence'||kind==='arch'?38:80,width:kind==='door'?78:26,y:kind==='gift'?12:0}];if(kind==='door'){r.y=1;r.vy=-100;}},kind);await page.clock.runFor(400);
 }
 await expect(page.locator('.screen-sleigh')).toBeVisible();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).sleighPractice)).toBe(true);
});
test('results explain which hazard cost the most gifts',async({page})=>{
 await seed(page);await page.clock.install();await page.route('**/game/sleigh.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('hits:{},','hits:{arch:3,fence:1},').replace('gifts:T.startingGifts','gifts:0')});});
 await enter(page);await cards(page,8);await expect(page.locator('.sleigh-cause')).toHaveText('Garlands knocked off 3 gifts. Stay down under them next time.');
});
test('a real pointer tap lands on the taught gold step, shows perfect feedback and fades the marker',async({page})=>{
 await seed(page);await page.clock.install({time:new Date('2026-11-06T12:00:00Z')});await page.clock.pauseAt(new Date('2026-11-06T12:01:00Z'));
 await page.route('**/game/sleigh.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('return {stage,practice,random,','return globalThis.__sleighRun={stage,practice,random,')});});
 await enter(page,'3');
 await page.clock.runFor(250);expect(await page.evaluate(()=>globalThis.__sleighRun.objects.find(o=>o.kind==='door')?.marker)).toBe(true);
 await page.evaluate(()=>{const r=globalThis.__sleighRun;r.next=99;r.door=Infinity;r.objects=[{kind:'door',x:80+180*(2*315/650-1/120),width:54,speed:180,marker:true}];});
 await page.locator('#sleigh-canvas').dispatchEvent('pointerdown');await page.locator('#sleigh-canvas').dispatchEvent('pointerup');await page.clock.runFor(1050);
 await expect(page.locator('#sleigh-score')).toHaveText('1 gifts delivered');await expect(page.locator('#sleigh-message')).toContainText('Perfect delivery!');
 expect(await page.evaluate(()=>globalThis.__sleighRun.bonusPoints)).toBe(50);
 await page.screenshot({scale:'css',path:`docs/review/sleigh-perfect-${test.info().project.name}.png`});
 await page.evaluate(()=>{const r=globalThis.__sleighRun;r.delivered=4;r.giftAfterDoor=false;r.objects=[];r.seen.door=0;r.next=0;});await page.clock.runFor(50);
 expect(await page.evaluate(()=>globalThis.__sleighRun.objects.find(o=>o.kind==='door')?.marker)).toBe(false);
});
