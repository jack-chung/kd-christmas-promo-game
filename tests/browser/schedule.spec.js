import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
for(const ep of C.episodes)test(`host boundary ${ep.label}, device dates cannot unlock`,async({page})=>{
  let server=Date.parse(ep.date)-1000;
  await page.route('**/*host-time=*',route=>route.fulfill({status:200,headers:{date:new Date(server).toUTCString()},body:''}));
  await page.clock.install({time:new Date('2040-01-01')});
  await page.goto('/');await page.locator('[data-action="profile"]').click();
  await page.goto('/#tower');
  await expect(page.locator('main')).toHaveClass(ep.id===4?'screen screen-tower':'screen screen-future');
  server=Date.parse(ep.date);
  await page.clock.setSystemTime(new Date('2000-01-01'));
  await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.goto('/#hub');
  const cards=page.locator('.adventures .adventure');
  await expect(cards.locator('strong')).toHaveText(C.episodes.map(ep=>ep.title));
  await expect(cards.nth(1)).toBeDisabled();await expect(cards.nth(3)).toBeDisabled();
  await expect(cards.nth(0)).toContainText('Best:');
  if(ep.id>=3)await expect(cards.nth(2)).toContainText('Best:');
  else await expect(cards.nth(2)).toContainText('Opens Nov 27');
});
test('offline reload retains verified games and freezes future unlocks',async({page,context})=>{
  await page.route('**/*host-time=*',route=>route.fulfill({status:200,headers:{date:'Fri, 13 Nov 2026 05:00:00 GMT'},body:''}));
  await page.goto('/');await page.locator('[data-action="profile"]').click();
  await expect(page.locator('.adventures .adventure').first()).toContainText('Best:');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await page.unroute('**/*host-time=*');await context.setOffline(true);
  await page.reload();await expect(page.locator('#countdown')).toContainText('Connect');
  await page.goto('/#wrap');await expect(page.locator('main')).toHaveClass('screen screen-wrap');
  await page.goto('/#tower');await expect(page.locator('main')).toHaveClass('screen screen-future');
  await page.goto('/#finale');await expect(page.locator('#finale-form')).toHaveCount(0);
});
test('zero-score completions earn each built game’s own layer exactly once',async({page})=>{
  await page.clock.install({time:new Date('2040-01-01')});
  await page.clock.pauseAt(new Date('2040-01-01T00:00:01Z'));
  await page.goto('/?review=1');await page.locator('[data-action="profile"]').click({force:true});
  await page.goto('/?review=1#wrap');
  await page.locator('[data-action="wrap-start"]').click({force:true});
  for(let i=0;i<3;i++){
    await page.locator('[data-action="wrap-ready"]').click({force:true});
    await page.clock.fastForward(65000);
    await expect(page.locator('main')).toHaveClass('screen screen-wrapGift');
    await page.locator('[data-action="wrap-next"]').click({force:true});
  }
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([1]);
  await page.locator('[data-action="claim:wrap"]').click({force:true});
  for(let i=0;i<2;i++){
    await page.goto('/?review=1#tower');
    await page.locator('[data-action="tower-start"]').click({force:true});
    await page.clock.runFor(800);await page.locator('[data-action="tower-drop"]').click({force:true});await page.clock.runFor(2000);
    await expect(page.locator('.result-detail')).toHaveText('0 gifts · 0 points');
    await page.locator('[data-action="claim:tower"]').click({force:true});
    await expect(page.locator('.keepsake h2')).toHaveText('Placeholder: Present Tower keepsake');
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([1,3]);
  }
});
