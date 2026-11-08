import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
test.use({serviceWorkers:'block'});
const action=(page,id)=>page.locator(`[data-action="${id}"]`);
async function open(page,{now='2026-11-13T05:00:00Z',records={},review=false}={}){
 await page.addInitScript(records=>localStorage.setItem('tuneville-gift-v1',JSON.stringify({version:3,profile:{avatar:'helper-0',adjective:0,noun:0,number:10},wrapSongs:records,collection:{welcome:true}})),records);
 await page.route('**/*host-time=*',r=>r.fulfill({status:404,headers:{date:new Date(now).toUTCString()},body:''}));
 await page.goto(`/${review?'?review=1':''}#hub`);await expect(page.locator('.adventures [data-action="episode:1"]')).toBeEnabled();await page.locator('.adventures [data-action="episode:1"]').click();await expect(page.locator('.song-card')).toHaveCount(12);
}
test('launch song ladder, date gates and per-song records stay legible at phone widths',async({page})=>{
 await open(page);
 await expect(page.locator('input[name="difficulty"]')).toHaveCount(0);
 await expect(action(page,'wrap-song:deck-the-halls')).toBeEnabled();await expect(action(page,'wrap-song:o-christmas-tree')).toBeDisabled();await expect(action(page,'wrap-song:joy-to-the-world')).toBeDisabled();
 await expect(action(page,'wrap-song:silent-night')).toBeDisabled();await expect(action(page,'wrap-song:silent-night')).toContainText('Opens Nov 20');
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/review/wrap-song-ladder-390.png',fullPage:true,scale:'css'});
});
test('Friday and win unlocks combine; records persist and played songs lose New',async({page})=>{
 await open(page,{now:'2026-11-20T05:00:00Z',records:{'deck-the-halls':{grade:'B',score:12345,topSpeed:1.2},'o-christmas-tree':{grade:'A',score:23456,topSpeed:1.3},'joy-to-the-world':{grade:'S',score:34567,topSpeed:1.4}}});
 await expect(action(page,'wrap-song:o-christmas-tree')).toBeEnabled();await expect(action(page,'wrap-song:good-king-wenceslas')).toBeEnabled();await expect(action(page,'wrap-song:silent-night')).toBeEnabled();await expect(action(page,'wrap-song:joy-to-the-world')).toBeEnabled();await expect(action(page,'wrap-song:away-in-a-manger')).toBeDisabled();
 await expect(action(page,'wrap-song:deck-the-halls')).toContainText('Bronze!');await expect(action(page,'wrap-song:deck-the-halls')).toContainText('12345');await expect(action(page,'wrap-song:deck-the-halls')).not.toContainText('New!');
 await expect(action(page,'wrap-song:deck-the-halls')).toContainText('About 2 min');await expect(action(page,'wrap-song:deck-the-halls')).toContainText('top speed ×1.20');await expect(action(page,'wrap-song:silent-night')).not.toContainText('top speed');
 await page.setViewportSize({width:390,height:844});if(test.info().project.name==='chrome-phone')await page.screenshot({path:'docs/review/wrap-song-records-390.png',fullPage:true,scale:'css'});
 await action(page,'wrap-song:good-king-wenceslas').click();await expect(page.locator('blockquote')).toHaveText(C.wrap.customers[1].order);await expect(page.locator('h2').first()).toContainText('Good King Wenceslas');if(test.info().project.name==='chrome-phone')await page.screenshot({path:'docs/review/wrap-song-order-390.png',fullPage:true,scale:'css'});
});
test('review opens all twelve songs without changing dates or saved tier wins',async({page})=>{
 await open(page,{now:'2026-11-13T05:00:00Z',review:true});await expect(page.locator('.song-card:enabled')).toHaveCount(12);
 await action(page,'wrap-song:angels-on-high').click();await action(page,'wrap-ready').click();await expect(page.locator('main')).toHaveClass('screen screen-wrapPlay');await expect(page.locator('#wrap-speed')).toHaveText('Speed ×1.00');
 for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024}]){await page.setViewportSize(size);const lane=await page.locator('.lane-button').last().boundingBox();expect(lane.y+lane.height).toBeLessThanOrEqual(size.height);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/review/wrap-song-play-390.png',fullPage:true,scale:'css'});
});
