import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
test.use({serviceWorkers:'block'});
async function openWrap(page){const link=page.locator('[data-action="go:wrap"]');if(await link.count())await link.first().click({force:true});else await page.locator('.adventures [data-action="episode:1"]').click({force:true});}
const action=(page,name)=>page.locator(`[data-action="${name}"]`);
async function enter(page,url='/?review=1'){
  await page.clock.install({time:new Date('2026-11-03T17:00:00Z')});
  await page.clock.pauseAt(new Date('2026-11-03T17:00:01Z'));
  await page.route('**/*host-time=*',route=>route.fulfill({status:200,headers:{date:'Tue, 03 Nov 2026 17:00:00 GMT'},body:''}));
  await page.goto(url);
  await page.locator('input[value="helper-1"]').check({force:true});
  const name=await page.locator('#nickname').textContent();
  await action(page,'profile').click({force:true});await action(page,'go:hub').last().click({force:true});return name;
}
async function route(page,id){await page.goto(`/?review=1#${id}`);await expect(page.locator('main')).toHaveClass(new RegExp(`screen-${id}$`));}
test.beforeEach(async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error'&&!msg.location().url.includes('/.update-check/'))errors.push(msg.text());});
  page.__errors=errors;
});
test.afterEach(async({page})=>{expect(page.__errors).toEqual([]);});

test('first run, date guards, review finale code, certificate, invitation, and reset',async({page})=>{
  const name=await enter(page,'/');
  await expect(page.locator('.greeting')).toContainText(name);
  await expect(action(page,'episode:3').first()).toBeDisabled();
  await action(page,'sound').click({force:true});await expect(action(page,'sound')).toHaveAttribute('aria-pressed','true');await action(page,'sound').click({force:true});
  await page.goto('/#wrap');await expect(page.locator('main')).toHaveClass('screen screen-hub');
  await page.goto('/#wrapPlay');await expect(page.locator('main')).toHaveClass('screen screen-hub');
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
  await page.goto('/#wrap');await expect(page.locator('main')).toHaveClass('screen screen-hub');
  await action(page,'go:review').click({force:true});await action(page,'reset').click({force:true});await action(page,'reset-cancel').click({force:true});await expect(page.locator('.pause-backdrop')).toHaveCount(0);
  await action(page,'reset').click({force:true});await action(page,'reset-confirm').click({force:true});
  await expect(page.locator('main')).toHaveClass('screen screen-onboard');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([]);
});

for(const difficulty of C.wrap.difficulty)test(`Wrap Station ${difficulty.id}: three songs, matching taps, pause, grades and layer`,async({page})=>{
  test.setTimeout(120000);
  await enter(page);await openWrap(page);
  await page.locator(`input[value="${difficulty.id}"]`).check({force:true});await action(page,'wrap-start').click({force:true});
  for(let customer=0;customer<3;customer++){
    await action(page,'wrap-ready').click({force:true});
    const chart=C.wrap.songs[customer].variants[difficulty.id];
    await expect(page.locator('.rhythm-cast p')).toHaveText(`♪ ${C.wrap.songs[customer].title}`);
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
    await expect(page.locator('main')).toHaveClass('screen screen-wrapGift');await expect(page.locator('.grade-medal')).toContainText('Gold!');await action(page,'wrap-next').click({force:true});
  }
  await expect(page.locator('main')).toHaveClass('screen screen-wrapResults');await expect(page.locator('.mini-grade')).toHaveText(['Gold! S','Gold! S','Gold! S']);
  await action(page,'claim:wrap').click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-unwrap');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.layers).toEqual([1]);expect(saved.wrapBest).toBeGreaterThan(5000);
});

test('practice: four free sounds, forgiving guided objects and no failure',async({page})=>{
  await enter(page);await openWrap(page);await action(page,'go:wrapPractice').click({force:true});
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
  await enter(page);await openWrap(page);
  // Let the loading message settle before forced clicks on the short phone viewport.
  // Otherwise WebKit can move the Ready button between pointerdown and pointerup.
  await expect(page.locator('#music-loading')).toBeHidden();
  await action(page,'wrap-start').click({force:true});await action(page,'wrap-ready').click({force:true});
  await page.clock.runFor(2700);await page.locator('[data-lane="3"]').click({force:true});await expect(page.locator('#wrap-score')).toHaveText('0');await expect(page.locator('#feedback')).toHaveText('Match the shape!');
  await page.clock.runFor(C.wrap.songs[0].variants.tunie.events[1].time);await page.locator('[data-lane="1"]').click({force:true});await expect(page.locator('#combo')).toHaveText('1× combo');
  // A moving pointer across the playfield is not a tap target.
  const box=await page.locator('.rhythm-field').boundingBox();await page.mouse.move(box.x+10,box.y+100);await page.mouse.down();await page.mouse.move(box.x+box.width-10,box.y+100);await page.mouse.up();await expect(page.locator('#combo')).toHaveText('1× combo');
  await page.clock.runFor(350);await page.locator('[data-lane="0"]').click({force:true});await expect(page.locator('#combo')).toHaveText('0× combo');
  await page.clock.runFor(48000);await expect(page.locator('.grade-medal')).toHaveText('Keep practising');
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
  await action(page,'jump:unwrap').click({force:true});await action(page,'go:collection').click({force:true});await expect(page.locator('.screen-collection h1')).toHaveText('Treasure Book');await expect(page.locator('.tunie-card.owned')).toHaveCount(3);
});

test('Tower drops, pause, high score persistence; gallery and mobile/tablet layouts',async({page})=>{
  await enter(page);await page.goto('/?review=1#tower');await action(page,'tower-start').click({force:true});
  await action(page,'pause').click({force:true});await page.clock.runFor(10000);await expect(page.locator('#tower-height')).toHaveText('0 gifts high');await action(page,'resume').click({force:true});
  await action(page,'tower-drop').click({force:true});await page.clock.runFor(1500);
  await expect(page.locator('#tower-height')).toHaveText('1 gifts high');
  // Follow the moving crane for a few attempts, then a miss ends the round.
  for(let i=0;i<12;i++){
    // A tall fall can outlast the fixed landing delay in WebKit. Advance the
    // paused test clock until the next drop is available, as a player waits.
    for(let wait=0;wait<20&&await action(page,'tower-drop').count()&&!await action(page,'tower-drop').isEnabled();wait++)await page.clock.runFor(250);
    if(await action(page,'tower-drop').count()===0)break;
    await page.clock.runFor(350);await action(page,'tower-drop').click({force:true});await page.clock.runFor(1500);
  }
  await expect(page.locator('.screen-towerResults')).toHaveCount(1);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.towerBest).toBeGreaterThanOrEqual(1);expect(saved.layers).toEqual([]);
  await route(page,'tower');await page.reload();await expect(page.locator('.personal-best')).toContainText(String(saved.towerBest));
  await route(page,'hub');
  for(const size of [{width:320,height:740},{width:390,height:844},{width:768,height:1024}]){
    await page.setViewportSize(size);
    for(const id of ['hub','wrap','tower','invitation']){
      await route(page,id);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id} at ${size.width}px`).toBeTruthy();
    }
  }
  await page.goto('/art-direction/');await expect(page.locator('figure')).toHaveCount(9);
  expect(await page.locator('img').evaluateAll(imgs=>imgs.every(img=>new URL(img.src).pathname.includes('/art-direction/assets/')))).toBeTruthy();
});

test('storage denial and malformed saves still allow first-run play',async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}});});
  await enter(page);await expect(page.locator('#storage-notice')).toBeVisible();await openWrap(page);await expect(page.locator('h1')).toHaveText('Tansy’s Wrap Station');
});

test('desktop keys, touch-only labels, portrait fit and reduced-motion feedback',async({browser})=>{
  const context=await browser.newContext({viewport:{width:1100,height:850},hasTouch:false,isMobile:false,reducedMotion:'reduce'}),page=await context.newPage();
  await enter(page);await openWrap(page);await action(page,'wrap-start').click();await action(page,'wrap-ready').click();
  await expect(page.locator('kbd').first()).toBeVisible();await page.clock.runFor(2700);await page.keyboard.press('d');await expect(page.locator('#combo')).toHaveText('1× combo');
  const firstNotes=C.wrap.songs[0].variants.tunie.events.slice(0,4);
  for(let i=1;i<4;i++){await page.clock.runFor(firstNotes[i].time-firstNotes[i-1].time);await page.keyboard.press(['d','ArrowDown','j','k'][i]);}
  await expect(page.locator('#combo')).toHaveText('4× combo');
  const field=await page.locator('main').boundingBox();expect(field.width).toBeLessThanOrEqual(480);expect(Math.abs(field.x+field.width/2-550)).toBeLessThan(2);
  for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024}]){
    await page.setViewportSize(size);const button=await page.locator('.lane-button').last().boundingBox();expect(button.y+button.height).toBeLessThanOrEqual(size.height);expect(button.width).toBeGreaterThan(50);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  expect(await page.locator('.character').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');await context.close();
});

test('sound: sampled instruments, matching melody, count-in, mute and resume',async({page})=>{
  await page.addInitScript(()=>{
    window.played=[];
    const Audio=window.AudioContext||window.webkitAudioContext,create=Audio.prototype.createBufferSource;
    Audio.prototype.createBufferSource=function(){const source=create.call(this),start=source.start;
      source.start=function(...args){window.played.push({length:source.buffer.length,rate:source.playbackRate.value});return start.apply(this,args);};return source;};
  });
  await enter(page);await action(page,'sound').click({force:true});await openWrap(page);
  await expect(page.locator('#music-loading')).toBeHidden();
  await action(page,'go:wrapPractice').click({force:true});await page.evaluate(()=>window.played=[]);
  for(let lane=0;lane<4;lane++)await page.locator(`[data-lane="${lane}"]`).click({force:true});
  const sounds=await page.evaluate(()=>window.played);expect(sounds).toHaveLength(4);
  expect(new Set(sounds.map(s=>s.length)).size).toBe(4);
  await openWrap(page);await action(page,'wrap-start').click({force:true});await action(page,'wrap-ready').click({force:true});
  await page.clock.runFor(500);await expect(page.locator('#feedback')).toHaveText('3…');
  await page.clock.runFor(750);await expect(page.locator('#feedback')).toHaveText('2…');
  await page.clock.runFor(750);await expect(page.locator('#feedback')).toHaveText('1…');
  await page.clock.runFor(700);
  await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="3"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBe(0);
  const chart=C.wrap.songs[0].variants.tunie;
  await page.clock.runFor(chart.events[1].time);await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="1"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBe(1);
  await action(page,'pause').click({force:true});await action(page,'sound').filter({visible:true}).click({force:true});await action(page,'resume').click({force:true});
  await page.clock.runFor(chart.events[2].time-chart.events[1].time);await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="2"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBe(0);
  await action(page,'pause').click({force:true});await action(page,'sound').filter({visible:true}).click({force:true});await action(page,'resume').click({force:true});
  await page.clock.runFor(chart.events[3].time-chart.events[2].time);await page.evaluate(()=>window.played=[]);await page.locator('[data-lane="3"]').click({force:true});expect(await page.evaluate(()=>window.played.length)).toBe(1);
});

test('audio assets load only inside Wrap; a failed bank leaves visual play and practice available',async({page})=>{
  const requests=[];page.on('request',request=>{if(request.url().includes('/audio/'))requests.push(request.url());});
  await enter(page);expect(requests).toEqual([]);
  let release;
  const gate=new Promise(resolve=>release=resolve);
  await page.route('**/audio/sources.json',async route=>{await gate;await route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  await openWrap(page);await expect(page.locator('#music-loading')).toHaveText(C.wrap.musicLoading);
  release();await expect(page.locator('#music-loading')).toHaveText(C.wrap.musicFailed);
  await action(page,'go:wrapPractice').click({force:true});
  for(let lane=0;lane<4;lane++)await page.locator(`[data-lane="${lane}"]`).click({force:true});
  await expect(action(page,'practice-guide')).toBeEnabled();
  await openWrap(page);await action(page,'wrap-start').click({force:true});await action(page,'wrap-ready').click({force:true});
  await page.clock.runFor(2700);await page.locator('[data-lane="0"]').click({force:true});await expect(page.locator('#combo')).toHaveText('1× combo');
  await page.clock.runFor(50000);await expect(page.locator('.grade-medal')).toHaveText('Keep practising');
});
