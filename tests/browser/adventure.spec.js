import {test,expect} from '@playwright/test';
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

test('Wrap Station: full three-customer round, generous timing, pause, swipe, grades and reward',async({page})=>{
  await enter(page);await action(page,'go:wrap').click({force:true});await action(page,'go:wrapPractice').click({force:true});
  for(let i=0;i<4;i++)await action(page,'practice-hit').click({force:true});
  await expect(page.locator('.unlock-banner')).toContainText('got the moves');await action(page,'go:wrap').click({force:true});
  await action(page,'wrap-start').click({force:true});
  for(let customer=0;customer<3;customer++){
    await action(page,'wrap-ready').click({force:true});
    if(customer===0){
      await action(page,'pause').click({force:true});await page.clock.runFor(20000);await expect(page.locator('#beat-count')).toHaveText('MOVE 1 / 36');await action(page,'resume').click({force:true});
    }
    await page.clock.runFor(2000);
    for(let beat=0;beat<36;beat++){
      // Click a real input target; the test clock advances scoring and animation together.
      if(customer===0&&beat===0){
        const b=await page.locator('#beat-pad').boundingBox();await page.mouse.move(b.x+b.width*.7,b.y+50);await page.mouse.down();await page.mouse.move(b.x+b.width*.3,b.y+50);await page.mouse.up();
      }else await page.locator('#beat-pad').click({force:true});
      if(beat<35)await page.clock.runFor(1100);
    }
    await page.clock.runFor(20);await expect(page.locator('main')).toHaveClass('screen screen-wrapGift');
    await expect(page.locator('.grade-medal')).toHaveText('S');await action(page,'wrap-next').click({force:true});
  }
  await expect(page.locator('main')).toHaveClass('screen screen-wrapResults');
  await expect(page.locator('.mini-grade')).toHaveText(['S','S','S']);
  await action(page,'claim:wrap').click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-unwrap');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(saved.layers).toEqual([1]);expect(saved.wrapBest).toBeGreaterThan(10000);
});

test('review can reach every screen and preview rewards do not alter progression',async({page})=>{
  await enter(page);await action(page,'go:review').click({force:true});
  const routes=await page.locator('[data-action^="jump:"]').evaluateAll(els=>els.map(el=>el.dataset.action.slice(5)));
  for(const id of routes){
    await action(page,'jump:'+id).click({force:true});await expect(page.locator('main')).toHaveClass('screen screen-'+id);
    if(id==='onboard')await action(page,'profile').click({force:true});
    await action(page,'go:review').click({force:true});
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
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
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
