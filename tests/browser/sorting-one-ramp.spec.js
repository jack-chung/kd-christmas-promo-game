import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
async function setup(page){await page.goto('/?review=1');await page.locator('[data-action="profile"]').click();await page.goto('/?review=1#sorting');await page.reload();}
async function start(page){await page.locator('#sort-stage-select').selectOption('1');await page.locator('[data-action="sorting-start"]').click();await page.locator('#sort-continue').click();}
async function tap(page,right){const symbol=await page.locator('#sort-spot .street-tag').textContent(),id=C.sorting.streets.find(s=>s.symbol===symbol).id;await page.locator('[data-sack]').evaluateAll((els,{id,right})=>els.find(e=>(e.dataset.sack===id)===right).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})),{id,right});}
for(const width of [320,390])test(`one goal, Bronze win and replay fit ${width}`,async({page},testInfo)=>{
 await page.setViewportSize({width,height:width===320?568:844});await page.clock.install();await setup(page);
 await expect(page.locator('[name="sorting-difficulty"]')).toHaveCount(0);await expect(page.locator('.sorting-goal')).toHaveText('Win the Ribbon: 2,000 points');
 await start(page);await expect(page.locator('#sort-goal-label')).toHaveText('Bronze: 0 / 2,000');await tap(page,true);await page.clock.runFor(20);
 await expect(page.locator('#sort-goal-progress')).toHaveAttribute('max','2000');expect(Number(await page.locator('#sort-goal-progress').getAttribute('value'))).toBeGreaterThan(0);
 for(let i=0;i<5;i++)await tap(page,false);
 await expect(page.locator('.sorting-near')).toContainText('/ 2,000, try again!');await expect(page.locator('.unlock-banner')).toHaveCount(0);
 let save=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(save.layers).toEqual([]);expect(save.collection.cards['host-king']).toBeUndefined();expect(save.collection.boxes.length).toBeGreaterThan(0);
 await page.locator('[data-action="go:sorting"]').click();await start(page);for(let i=0;i<15;i++)await tap(page,true);await page.clock.runFor(20);
 await expect(page.locator('#sort-goal-label')).toContainText('Silver:');
 const geometry=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom};};return {width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,goal:rect('.sort-goal'),belt:rect('.sorting-belt'),targets:rect('#sort-targets')};});
 expect(geometry.width).toBeLessThanOrEqual(width);expect(geometry.height).toBeLessThanOrEqual(width===320?568:844);expect(geometry.goal.bottom).toBeLessThan(geometry.belt.top);expect(geometry.targets.bottom).toBeLessThanOrEqual(width===320?568:844);
 await page.screenshot({path:testInfo.outputPath('bronze-reached.png')});
 for(let i=0;i<5;i++)await tap(page,false);
 await expect(page.locator('.sorting-party h1')).toHaveText('Ribbon won!');await expect(page.locator('.sorting-party')).toHaveAttribute('data-celebration','2');
 save=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(save.layers).toEqual([2]);expect(save.collection.cards['host-king']).toBe('layer');expect(save.collection.outfits).toContain('sorting-0');
 await page.clock.runFor(1000);await page.screenshot({path:testInfo.outputPath('ribbon-results.png')});await page.locator('[data-action="go:sorting"]').click();await expect(page.locator('.sorting-goal')).toHaveText(`Next medal: Silver · ${C.sorting.medals[1].toLocaleString('en-US')} points`);
 await start(page);for(let i=0;i<5;i++)await tap(page,false);await expect(page.locator('.sorting-party h1')).toHaveText('Great sorting!');save=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(save.layers).toEqual([2]);
});
test('legacy difficulty records migrate to one best visible on setup, results and hub',async({page})=>{
 await setup(page);await page.evaluate(()=>{const key='tuneville-gift-v1',s=JSON.parse(localStorage.getItem(key));s.sortingBest=100;s.sortingBests={easy:5240,tunie:4000,rapper:5000};localStorage.setItem(key,JSON.stringify(s));});await page.reload();await expect(page.locator('.sorting-setup-best')).toHaveText('Best: 5,240');await start(page);for(let i=0;i<5;i++)await tap(page,false);await expect(page.locator('.sorting-personal-best')).toHaveText('Your best: 5,240');await page.goto('/?review=1#hub');await expect(page.locator('.adventure').nth(1)).toContainText('Best: 5,240');
});
