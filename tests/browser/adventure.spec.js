import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
const action=(page,name)=>page.locator(`[data-action="${name}"]`);
async function enter(page,url='/?review=1'){
  await page.clock.install({time:new Date('2026-11-03T17:00:00Z')});
  await page.clock.pauseAt(new Date('2026-11-03T17:00:01Z'));
  await page.goto(url);
  await page.locator('input[value="kid"]').check({force:true});
  const name=await page.locator('#nickname').textContent();
  await action(page,'profile').click({force:true});return name;
}
async function route(page,id){await page.goto(`/?review=1#${id}`);await expect(page.locator('main')).toHaveClass(new RegExp(`screen-${id}$`));}
test.beforeEach(async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  page.__errors=errors;
});
test.afterEach(async({page})=>{expect(page.__errors).toEqual([]);});

test('first run, date guards, review finale code, certificate, invitation, and reset',async({page})=>{
  const name=await enter(page,'/');
  await expect(page.locator('.greeting')).toContainText(name);
  await action(page,'episode:3').click({force:true});await expect(page.locator('h1')).toContainText('Dec 4');await action(page,'first-episode').click({force:true});
  await action(page,'sound').click({force:true});await expect(action(page,'sound')).toHaveAttribute('aria-pressed','true');await action(page,'sound').click({force:true});
  await action(page,'go:wrap').click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-future');
  await page.goto('/#wrapPlay');await expect(page.locator('main')).toHaveClass('screen screen-future');
  await page.goto('/#certificate');await expect(page.locator('main')).toHaveClass('screen screen-finale');
  await expect(page.locator('#finale-form')).toHaveCount(0);
  await action(page,'go:review').click({force:true});await action(page,'review-toggle').click({force:true});
  await action(page,'jump:finale').click({force:true});await page.locator('#finale-code').fill('NOPE');await page.locator('#finale-form button').click({force:true});
  await expect(page.locator('#feedback')).toContainText('doesn’t fit');
  await page.locator('#finale-code').fill(' tunie12 ');await page.locator('#finale-form button').click({force:true});
  await expect(page.locator('main')).toHaveClass('screen screen-finalReveal');
  await action(page,'go:certificate').click({force:true});await expect(page.locator('.certificate-name')).toHaveText(name);
  await action(page,'go:invitation').first().click({force:true});
  await expect(page.locator('.event-facts')).toContainText('Saturday, December 12, 2026');
  await expect(page.locator('.event-facts')).toContainText('9670 Bayview Avenue');
  await expect(page.locator('.donation')).toContainText('canned food item');
  await action(page,'go:review').click({force:true});await action(page,'review-toggle').click({force:true});
  await page.goto('/#wrap');await expect(page.locator('main')).toHaveClass('screen screen-future');
  await action(page,'go:review').click({force:true});await action(page,'reset').click({force:true});await action(page,'reset-cancel').click({force:true});await expect(page.locator('.pause-backdrop')).toHaveCount(0);
  await action(page,'reset').click({force:true});await action(page,'reset-confirm').click({force:true});
  await expect(page.locator('main')).toHaveClass('screen screen-onboard');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([]);
});

test('Mystery Trail: hints cost once, reload keeps clues, all puzzles earn exactly one layer',async({page})=>{
  await enter(page);await action(page,'go:mystery').click({force:true});await action(page,'case-start').click({force:true});
  await action(page,'go:hidden').click({force:true});await action(page,'parcel:0').click({force:true});await expect(page.locator('#feedback')).toContainText('doesn’t have both');
  await action(page,'hint:hidden').click({force:true});await expect(page.locator('#case-stars')).toHaveText('★ 2');await expect(action(page,'hint:hidden')).toBeDisabled();
  await action(page,'parcel:1').click({force:true});await page.clock.runFor(5000);await page.reload();
  await expect(page.locator('#found-count')).toHaveText('1 / 4 found');await expect(page.locator('#case-stars')).toHaveText('★ 2');
  for(const id of [5,10,14])await action(page,`parcel:${id}`).click({force:true});
  await expect(page.locator('#solved-panel')).toBeVisible();await action(page,'go:cipher').click({force:true});
  await action(page,'cipher:3').click({force:true});await expect(page.locator('#feedback')).toContainText('Move each letter');
  await action(page,'cipher:6').click({force:true});await action(page,'go:riddle').click({force:true});
  await action(page,'riddle:kid').click({force:true});await expect(page.locator('#feedback')).toContainText('Try the clues');
  await action(page,'riddle:note').click({force:true});await action(page,'go:mysteryCode').click({force:true});
  await expect(page.locator('.digit')).toHaveText(['4','6','2']);
  await page.locator('#layer-code').fill('111');await page.locator('#layer-form button').click({force:true});await expect(page.locator('#feedback')).toContainText('house order');
  await page.locator('#layer-code').fill('462');await page.locator('#layer-form button').click({force:true});
  await expect(page.locator('main')).toHaveClass('screen screen-mysteryResults');
  await expect(page.locator('.result-detail')).toContainText('2 ★');
  await action(page,'claim:mystery').click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-unwrap');
  let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.layers).toEqual([1]);expect(saved.paper).toBe('stars');expect(saved.mysteryBest).toBeGreaterThanOrEqual(5000);
  await action(page,'go:collection').click({force:true});await action(page,'paper:cranberry').click({force:true});
  await page.reload();await expect(action(page,'paper:cranberry')).toBeDisabled();
  await route(page,'mysteryCode');await page.locator('#layer-code').fill('462');await page.locator('#layer-form button').click({force:true});await action(page,'claim:mystery').click({force:true});
  saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.layers).toEqual([1]);
});

for(const difficulty of C.wrap.difficulty)test(`Wrap Station ${difficulty.id}: three songs, matching taps, pause, grades and layer`,async({page})=>{
  test.setTimeout(120000);
  await enter(page);await action(page,'go:wrap').click({force:true});
  await page.locator(`input[value="${difficulty.id}"]`).check({force:true});await action(page,'wrap-start').click({force:true});
  for(let customer=0;customer<3;customer++){
    await action(page,'wrap-ready').click({force:true});
    const chart=C.wrap.songs[customer].variants[difficulty.id];
    await expect(page.locator('.rhythm-lane')).toHaveCount(4);await expect(page.locator('.lane-button')).toHaveCount(4);
    expect(await page.locator('kbd').first().isVisible()).toBe(false);
    if(customer===0){
      await action(page,'pause').click({force:true});await page.clock.runFor(20000);await expect(page.locator('#beat-count')).toHaveText(`MOVE 0 / ${chart.events.length}`);await action(page,'resume').click({force:true});
      await page.clock.runFor(1800);expect(await page.locator('.falling-object').count()).toBeGreaterThan(1);
      await page.clock.runFor(difficulty.travel-1800);
    }else await page.clock.runFor(difficulty.travel);
    let elapsed=0;
    for(const time of [...new Set(chart.events.map(e=>e.time))]){
      if(time>elapsed)await page.clock.runFor(time-elapsed);elapsed=time;
      const notes=chart.events.filter(e=>e.time===time);
      if(notes.length>1){
        // Independent simultaneous touch pointers, including a non-primary second thumb.
        await page.evaluate(lanes=>lanes.forEach((lane,i)=>{const el=document.querySelector(`[data-lane="${lane}"]`);el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:i+11,isPrimary:i===0,button:0}));}),notes.map(e=>e.lane));
      }else await page.locator(`[data-lane="${notes[0].lane}"]`).click({force:true});
    }
    await page.clock.runFor(chart.duration-elapsed+difficulty.window+32);
    await expect(page.locator('main')).toHaveClass('screen screen-wrapGift');await expect(page.locator('.grade-medal')).toHaveText('S');await action(page,'wrap-next').click({force:true});
  }
  await expect(page.locator('main')).toHaveClass('screen screen-wrapResults');await expect(page.locator('.mini-grade')).toHaveText(['S','S','S']);
  await action(page,'claim:wrap').click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-unwrap');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.layers).toEqual([1]);expect(saved.wrapBest).toBeGreaterThan(10000);
});

test('practice: four free sounds, forgiving guided objects and no failure',async({page})=>{
  await enter(page);await action(page,'go:wrap').click({force:true});await action(page,'go:wrapPractice').click({force:true});
  await expect(action(page,'practice-guide')).toBeDisabled();
  for(let lane=0;lane<4;lane++)await page.locator(`[data-lane="${lane}"]`).click({force:true});
  await expect(action(page,'practice-guide')).toBeEnabled();await action(page,'practice-guide').click({force:true});
  await page.clock.runFor(10000); // Misses repeat the shape instead of failing.
  await expect(page.locator('main')).toHaveClass('screen screen-wrapPractice');
  await page.clock.runFor(2400);
  for(let lane=0;lane<4;lane++){await page.locator(`[data-lane="${lane}"]`).click({force:true});if(lane<3)await page.clock.runFor(3000);}
  await page.clock.runFor(32);await expect(action(page,'go:wrap').first()).toContainText('Ready for a song');
});

test('wrong shapes miss, swipes do not score, empty taps break combos and unattended songs finish',async({page})=>{
  await enter(page);await action(page,'go:wrap').click({force:true});await action(page,'wrap-start').click({force:true});await action(page,'wrap-ready').click({force:true});
  await page.clock.runFor(2700);await page.locator('[data-lane="3"]').click({force:true});await expect(page.locator('#wrap-score')).toHaveText('0');await expect(page.locator('#feedback')).toHaveText('Match the shape!');
  await page.clock.runFor(750);await page.locator('[data-lane="1"]').click({force:true});await expect(page.locator('#combo')).toHaveText('1× combo');
  // A moving pointer across the playfield is not a tap target.
  const box=await page.locator('.rhythm-field').boundingBox();await page.mouse.move(box.x+10,box.y+100);await page.mouse.down();await page.mouse.move(box.x+box.width-10,box.y+100);await page.mouse.up();await expect(page.locator('#combo')).toHaveText('1× combo');
  await page.clock.runFor(350);await page.locator('[data-lane="0"]').click({force:true});await expect(page.locator('#combo')).toHaveText('0× combo');
  await page.clock.runFor(48000);await expect(page.locator('.grade-medal')).toHaveText('C');
});

test('review can reach every screen and preview rewards do not alter progression',async({page})=>{
  await enter(page);await action(page,'go:review').click({force:true});
  const routes=await page.locator('[data-action^="jump:"]').evaluateAll(els=>els.map(el=>el.dataset.action.slice(5)));
  for(const id of routes){
    await action(page,'jump:'+id).click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-'+id);
    if(id==='onboard')await action(page,'profile').click({force:true});
    await page.locator('.review-strip [data-action="review-menu"]').click({force:true});
  }
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([]);
  await action(page,'jump:unwrap').click({force:true});await action(page,'go:collection').click({force:true});await expect(page.locator('.empty-state')).toBeVisible();
});

test('Tower drops, pause, high score persistence; gallery and mobile/tablet layouts',async({page})=>{
  await enter(page);await action(page,'go:tower').click({force:true});await action(page,'tower-start').click({force:true});
  await action(page,'pause').click({force:true});await page.clock.runFor(10000);await expect(page.locator('#tower-height')).toHaveText('0 gifts high');await action(page,'resume').click({force:true});
  await action(page,'tower-drop').click({force:true});await page.clock.runFor(1500);
  await expect(page.locator('#tower-height')).toHaveText('1 gifts high');
  // Follow the moving crane for a few attempts, then a miss ends the round.
  for(let i=0;i<12;i++){
    if(await action(page,'tower-drop').count()===0)break;
    await page.clock.runFor(350);await action(page,'tower-drop').click({force:true});await page.clock.runFor(1500);
  }
  await expect(page.locator('.screen-towerResults')).toHaveCount(1);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.towerBest).toBeGreaterThanOrEqual(1);
  await route(page,'tower');await page.reload();await expect(page.locator('.personal-best')).toContainText(String(saved.towerBest));
  await route(page,'hub');
  for(const size of [{width:320,height:740},{width:390,height:844},{width:768,height:1024}]){
    await page.setViewportSize(size);
    for(const id of ['hub','wrap','hidden','cipher','riddle','invitation']){
      await route(page,id);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id} at ${size.width}px`).toBeTruthy();
    }
  }
  await page.goto('/art-direction/');await expect(page.locator('figure')).toHaveCount(9);
  expect(await page.locator('img').evaluateAll(imgs=>imgs.every(img=>new URL(img.src).pathname.includes('/art-direction/assets/')))).toBeTruthy();
});

test('storage denial and malformed saves still allow first-run play',async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}});});
  await enter(page);await expect(page.locator('#storage-notice')).toBeVisible();await action(page,'go:wrap').click({force:true});await expect(page.locator('h1')).toHaveText('Tansy’s Wrap Station');
});

test('a content-only weekly configuration can launch, solve, save and award a separate layer',async({page})=>{
  // Simulate a future content delivery without changing runtime code.
  await page.route('**/game/content.js',async route=>{
    const response=await route.fetch();
    await route.fulfill({response,body:(await response.text())+"\nC.episodes[1].ready=true;C.episodes[1].content={mystery:{title:'Another town mystery'},gift:{cardTitle:'Second keepsake',unwrapCopy:'Layer 2 is yours.'}};"});
  });
  await enter(page);await action(page,'go:mystery').click({force:true});await action(page,'case-start').click({force:true});await action(page,'go:hidden').click({force:true});await action(page,'parcel:1').click({force:true});await action(page,'go:hub').first().click({force:true});
  await action(page,'episode:2').click({force:true});await action(page,'go:mystery').click({force:true});await expect(page.locator('h1')).toHaveText('Another town mystery');await action(page,'case-start').click({force:true});await action(page,'go:hidden').click({force:true});
  await expect(page.locator('#found-count')).toHaveText('0 / 4 found');
  for(const id of [1,5,10,14])await action(page,`parcel:${id}`).click({force:true});
  await action(page,'go:cipher').click({force:true});await action(page,'cipher:6').click({force:true});await action(page,'go:riddle').click({force:true});await action(page,'riddle:note').click({force:true});await action(page,'go:mysteryCode').click({force:true});await page.locator('#layer-code').fill('462');await page.locator('#layer-form button').click({force:true});await action(page,'claim:mystery').click({force:true});
  await expect(page.locator('.keepsake h2')).toHaveText('Second keepsake');await page.reload();await expect(page.locator('.keepsake h2')).toHaveText('Second keepsake');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([2]);
  await action(page,'go:hub').first().click({force:true});await action(page,'episode:1').click({force:true});await action(page,'go:mystery').click({force:true});await action(page,'go:mysteryMap').click({force:true});await action(page,'go:hidden').click({force:true});await expect(page.locator('#found-count')).toHaveText('1 / 4 found');
});

test('desktop keys, touch-only labels, portrait fit and reduced-motion feedback',async({browser})=>{
  const context=await browser.newContext({viewport:{width:1100,height:850},hasTouch:false,isMobile:false,reducedMotion:'reduce'}),page=await context.newPage();
  await enter(page);await action(page,'go:wrap').click({force:true});await action(page,'wrap-start').click({force:true});await action(page,'wrap-ready').click({force:true});
  await expect(page.locator('kbd').first()).toBeVisible();await page.clock.runFor(2700);await page.keyboard.press('d');await expect(page.locator('#combo')).toHaveText('1× combo');
  await page.clock.runFor(750);await page.keyboard.press('ArrowDown');await expect(page.locator('#combo')).toHaveText('2× combo');
  await page.clock.runFor(750);await page.keyboard.press('j');await page.clock.runFor(750);await page.keyboard.press('k');await expect(page.locator('#combo')).toHaveText('4× combo');
  const field=await page.locator('main').boundingBox();expect(field.width).toBeLessThanOrEqual(480);expect(Math.abs(field.x+field.width/2-550)).toBeLessThan(2);
  for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024}]){
    await page.setViewportSize(size);const button=await page.locator('.lane-button').last().boundingBox();expect(button.y+button.height).toBeLessThanOrEqual(size.height);expect(button.width).toBeGreaterThan(50);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  expect(await page.locator('.character').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');await context.close();
});

test('sound: four instruments, melody only on a matching hit, mute and resume',async({page})=>{
  await page.addInitScript(()=>{
    window.played=[];
    const Audio=window.AudioContext||window.webkitAudioContext,create=Audio.prototype.createOscillator;
    Audio.prototype.createOscillator=function(){const osc=create.call(this),start=osc.start,set=osc.frequency.setValueAtTime;osc.frequency.setValueAtTime=function(hz,...args){osc.scheduledHz=hz;return set.call(this,hz,...args);};osc.start=function(...args){window.played.push({type:osc.type,hz:osc.scheduledHz});return start.apply(this,args);};return osc;};
  });
  await enter(page);await action(page,'sound').click({force:true});await action(page,'go:wrap').click({force:true});await action(page,'go:wrapPractice').click({force:true});
  await page.evaluate(()=>window.played=[]);
  for(let lane=0;lane<4;lane++)await page.locator(`[data-lane="${lane}"]`).click({force:true});
  const sounds=await page.evaluate(()=>window.played);expect([...new Set(sounds.map(s=>s.type))].sort()).toEqual(['sawtooth','sine','triangle']);
  expect(sounds.some(s=>Math.abs(s.hz-261.6256)<1)).toBe(true);
  await action(page,'go:wrap').click({force:true});await action(page,'wrap-start').click({force:true});await action(page,'wrap-ready').click({force:true});await page.clock.runFor(2700);
  await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="3"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBe(0);
  await page.clock.runFor(750);await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="1"]').click({force:true});expect(await page.evaluate(()=>window.played.some(s=>Math.abs(s.hz-329.6276)<1))).toBe(true);
  await action(page,'pause').click({force:true});await action(page,'sound').filter({visible:true}).click({force:true});await action(page,'resume').click({force:true});await page.clock.runFor(750);await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="2"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBe(0);await action(page,'pause').click({force:true});await action(page,'sound').filter({visible:true}).click({force:true});await action(page,'resume').click({force:true});await page.clock.runFor(750);await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="3"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBeGreaterThan(0);
});
