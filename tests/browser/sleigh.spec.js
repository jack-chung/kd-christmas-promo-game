import {test,expect} from '@playwright/test';
const profile={adjective:0,noun:0,number:10,avatar:'wrapper'};
async function seed(page,extra={}){await page.addInitScript(({profile,extra})=>{localStorage.setItem('tuneville-gift-v1',JSON.stringify({version:2,profile,sleighPractice:true,...extra}));},{profile,extra});}
async function enter(page,stage='1'){await page.goto('/?review=1#sleigh');await page.locator('#sleigh-stage-select').selectOption(stage);await page.locator('[data-action="sleigh-start"]').click();await page.locator('#sleigh-continue').click();}
async function cards(page,seconds){for(let i=0;i<seconds;i++){await page.clock.runFor(1000);if(await page.locator('#sleigh-continue').count())await page.locator('#sleigh-continue').click();}}
test('phone tap, hold, keyboard, stage cards and pause freeze the road',async({page})=>{
 await seed(page,{towerBest:17});await page.clock.install();await enter(page);
 const before=await page.locator('#sleigh-canvas').screenshot();await page.keyboard.down('Space');await page.clock.runFor(200);await page.keyboard.up('Space');const hopped=await page.locator('#sleigh-canvas').screenshot();expect(before.equals(hopped)).toBe(false);
 await page.clock.runFor(3000);await expect(page.locator('.sleigh-rule-icon')).toHaveText('▣ +1');await expect(page.locator('.pause-card')).toContainText('Collect loose gifts');await page.locator('#sleigh-continue').click();
 await page.locator('#sleigh-pause').click();await page.clock.runFor(100);const paused=await page.locator('#sleigh-canvas').evaluate(c=>c.toDataURL());await page.clock.runFor(10000);expect(await page.locator('#sleigh-canvas').evaluate(c=>c.toDataURL())).toBe(paused);await page.locator('#sleigh-continue').click();
 await page.locator('#sleigh-canvas').dispatchEvent('pointerdown',{pointerId:1});await page.clock.runFor(200);await page.locator('#sleigh-canvas').dispatchEvent('pointerup',{pointerId:1});await page.clock.runFor(3000);await expect(page.locator('.pause-card')).toContainText('glowing doormat');
});
for(const viewport of [{width:320,height:568},{width:390,height:844}])test(`portrait road fits ${viewport.width} × ${viewport.height}`,async({page})=>{
 await seed(page,{towerBest:25});await page.setViewportSize(viewport);await page.clock.install();await enter(page,'6');await page.clock.runFor(1500);
 const geometry=await page.evaluate(()=>({height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,road:document.querySelector('#sleigh-canvas').getBoundingClientRect().toJSON()}));expect(geometry.height).toBeLessThanOrEqual(viewport.height);expect(geometry.width).toBeLessThanOrEqual(viewport.width);expect(geometry.road.height).toBeGreaterThan(300);
 await page.screenshot({path:`docs/review/sleigh-${viewport.width}x${viewport.height}.png`});await page.emulateMedia({reducedMotion:'reduce'});
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
  await page.goto('/?review=1#sleigh');await page.locator('#sleigh-stage-select').selectOption(String(stage));await page.locator('[data-action="sleigh-start"]').click();await expect(page.locator('.pause-card')).toBeVisible();await expect(page.locator('.sleigh-rule-icon')).not.toBeEmpty();const before=await page.locator('#sleigh-score').textContent();await page.clock.runFor(3000);await expect(page.locator('#sleigh-score')).toHaveText(before);
 }
});
test('phone feedback starts on the gesture and mute prevents hop and wheel sounds',async({page})=>{
 await page.addInitScript(()=>{const Native=window.AudioContext||window.webkitAudioContext;window.cueStarts=0;window.AudioContext=class extends Native{constructor(...args){super(...args);window.sleighAudio=this;}createBufferSource(){const voice=super.createBufferSource(),start=voice.start;voice.start=function(...args){window.cueStarts++;return start.apply(this,args);};return voice;}};});
 await seed(page,{sound:true});await page.clock.install();await enter(page);await expect.poll(()=>page.evaluate(()=>window.sleighAudio?.state)).toBe('running');const before=await page.evaluate(()=>window.cueStarts);await page.locator('#sleigh-canvas').dispatchEvent('pointerdown');expect(await page.evaluate(()=>window.cueStarts)).toBeGreaterThan(before);await page.locator('#sleigh-canvas').dispatchEvent('pointerup');
 await page.locator('#sleigh-pause').click();await page.locator('[data-action="sound"]').filter({visible:true}).click();await page.locator('#sleigh-continue').click();const muted=await page.evaluate(()=>window.cueStarts);await page.locator('#sleigh-canvas').dispatchEvent('pointerdown');await page.locator('#sleigh-canvas').dispatchEvent('pointerup');await page.clock.runFor(500);expect(await page.evaluate(()=>window.cueStarts)).toBe(muted);
});
