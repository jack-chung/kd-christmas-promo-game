import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
import {character} from '../../docs/game/art.js';
for(const ep of C.episodes)test(`host boundary ${ep.label}, device dates cannot unlock`,async({page})=>{
  let server=Date.parse(ep.date)-1000;
  await page.route('**/*host-time=*',route=>route.fulfill({status:200,headers:{date:new Date(server).toUTCString()},body:''}));
  await page.clock.install({time:new Date('2040-01-01')});
  await page.goto('/');await page.locator('[data-action="profile"]').click();
  await page.goto('/#tower');
  await expect(page.locator('main')).toHaveClass(ep.id===4?'screen screen-tower':'screen screen-hub');
  server=Date.parse(ep.date);
  await page.clock.setSystemTime(new Date('2000-01-01'));
  await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.goto('/#hub');
  const cards=page.locator('.adventures .adventure');
  await expect(cards.locator('strong')).toHaveText(C.episodes.map(ep=>ep.title));
  if(ep.id>=2)await expect(cards.nth(1)).toBeEnabled();else await expect(cards.nth(1)).toBeDisabled();if(ep.id===4)await expect(cards.nth(3)).toBeEnabled();else await expect(cards.nth(3)).toBeDisabled();
  await expect(cards.nth(0)).toContainText('Not played yet');
  if(ep.id>=3)await expect(cards.nth(2)).toContainText('Not played yet');
  else await expect(cards.nth(2)).toContainText('Opens Nov 27');
});
test('offline reload retains verified games and freezes future unlocks',async({page,context})=>{
  await page.route('**/*host-time=*',route=>route.fulfill({status:200,headers:{date:'Fri, 13 Nov 2026 05:00:00 GMT'},body:''}));
  await page.goto('/');await page.locator('[data-action="profile"]').click();await page.locator('[data-action="go:hub"]').last().click();
  await expect(page.locator('.adventures .adventure').first()).toContainText('Not played yet');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await page.unroute('**/*host-time=*');await context.setOffline(true);
  await page.reload();await expect(page.locator('#countdown')).toContainText('Connect');
  await page.goto('/#wrap');await expect(page.locator('main')).toHaveClass('screen screen-wrap');
  await page.goto('/#tower');await expect(page.locator('main')).toHaveClass('screen screen-hub');
  await page.goto('/#finale');await expect(page.locator('#finale-form')).toHaveCount(0);
});
test('C-only Wrap and zero-height Tower earn basic boxes without layers',async({page})=>{
  await page.clock.install({time:new Date('2040-01-01')});
  await page.clock.pauseAt(new Date('2040-01-01T00:00:01Z'));
  await page.goto('/?review=1');await page.locator('[data-action="profile"]').click({force:true});
  await page.goto('/?review=1#wrap');
  await page.locator('[data-action="wrap-song:deck-the-halls"]').click({force:true});
  await page.locator('[data-action="wrap-ready"]').evaluate(el=>el.click());
  await expect(page.locator('main')).toHaveClass('screen screen-wrapPlay');
  await page.clock.fastForward(160000);
  await expect(page.locator('main')).toHaveClass('screen screen-wrapResults');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([]);
  await expect(page.locator('[data-action="go:boxes"]')).toBeVisible();
  await page.goto('/?review=1#hub');await expect(page.locator('.adventures .adventure').nth(0)).toContainText('Songs won: 0');
  for(let i=0;i<2;i++){
    await page.goto('/?review=1#tower');
    await page.locator('[data-action="tower-start"]').click({force:true});
    await page.clock.runFor(800);await page.locator('[data-action="tower-drop"]').click({force:true});await page.clock.runFor(2000);
    await expect(page.locator('.result-detail')).toHaveText('0 gifts · 0 points');
    await expect(page.locator('[data-action="go:boxes"]')).toBeVisible();
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')).layers)).toEqual([]);
    await page.goto('/?review=1#hub');await expect(page.locator('.adventures .adventure').nth(2)).toContainText('Best: 0');
  }
});

test('hub cards disable unavailable games, show distinct hosts and distinguish unplayed from bests',async({page})=>{
  await page.route('**/*host-time=*',route=>route.fulfill({status:200,headers:{date:'Fri, 13 Nov 2026 05:00:00 GMT'},body:''}));
  await page.goto('/');await page.locator('[data-action="profile"]').click();await page.locator('[data-action="go:hub"]').last().click();
  const cards=page.locator('.adventures .adventure');
  await expect(cards.nth(0)).toBeEnabled();await expect(cards.nth(0)).toContainText('Not played yet');
  await expect(cards.nth(2)).toContainText('Opens Nov 27');
  for(const i of [1,2,3]){
    await expect(cards.nth(i)).toBeDisabled();await expect(cards.nth(i).locator('.arrow')).toHaveCount(0);
    await expect(cards.nth(i)).toHaveCSS('opacity','0.52');
    await cards.nth(i).click({force:true});await expect(page).toHaveURL(/#hub$/);
    await cards.nth(i).dispatchEvent('click');await expect(page).toHaveURL(/#hub$/);
    await expect(page.locator(`.village-houses [data-action="episode:${i+1}"]`)).toBeDisabled();
  }
  await expect(cards.nth(1)).toContainText('Opens Nov 20');await expect(cards.nth(3)).toContainText('Opens Dec 4');
  const hosts=['wrapper','king','kid','note'];expect(C.episodes.map(ep=>ep.cast)).toEqual(hosts);
  for(let i=0;i<4;i++){
    const expected=await page.evaluate(html=>{const el=document.createElement('div');el.innerHTML=html;return el.firstElementChild.outerHTML;},character(hosts[i]));
    expect(await cards.nth(i).locator('.character').evaluate(el=>el.outerHTML)).toEqual(expected);
  }
  await page.goto('/?review=1#hub');await expect(cards.nth(2)).toBeEnabled();await expect(cards.nth(2)).toContainText('Not played yet');await expect(cards.nth(2).locator('.arrow')).toHaveCount(1);
  await expect(cards.nth(1)).toBeEnabled();await expect(cards.nth(3)).toBeEnabled();await expect(cards.nth(3)).toContainText('Not played yet');
  await page.evaluate(()=>{const key='tuneville-gift-v1',s=JSON.parse(localStorage.getItem(key));s.layers=[1,3];s.wrapBest=321;s.wrapSongs={'deck-the-halls':{grade:'B',score:321,topSpeed:1.1}};s.towerBest=7;localStorage.setItem(key,JSON.stringify(s));});
  await page.reload();await expect(cards.nth(0)).toContainText('Songs won: 1');await expect(cards.nth(2)).toContainText('Best: 7');
});
