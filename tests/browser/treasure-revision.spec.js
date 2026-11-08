import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';
test.use({serviceWorkers:'block'});
const action=(p,a)=>p.locator(`[data-action="${a}"]`);
const ua={ios:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',android:'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36'};
async function enter(page){
 await page.route('**/*host-time=*',r=>r.fulfill({status:404,headers:{date:'Fri, 13 Nov 2026 06:00:00 GMT'},body:''}));
 await page.goto('/?review=1');await action(page,'profile').click();
}
async function shot(page,name){if(test.info().project.name==='chrome-phone')await page.screenshot({path:`docs/review/treasure-${name}.png`,fullPage:true,scale:'css',animations:'disabled'});}
for(const platform of ['ios','android'])for(const viewport of [{width:320,height:568},{width:390,height:844}])test(`backup card ${platform} ${viewport.width} fits a screenshot and shows only its steps`,async({page})=>{
 await page.addInitScript(userAgent=>Object.defineProperty(navigator,'userAgent',{value:userAgent}),ua[platform]);
 await page.setViewportSize(viewport);await enter(page);await page.goto('/?review=1#backup');
 const card=page.locator('.backup-card');await expect(card).toContainText(platform==='ios'?'Photos.':'Google Photos.');await expect(card).not.toContainText(platform==='ios'?'Lens':'Press and hold');await expect(card).toContainText('camera of the phone you want to restore');
 await page.locator('.screenshot-tip').evaluate(el=>el.scrollIntoView({block:'start'}));
 const box=await card.boundingBox();expect(box.y).toBeGreaterThan(0);expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
 if(test.info().project.name==='chrome-phone')await page.screenshot({path:`docs/review/treasure-backup-${platform}-${viewport.width}.png`,scale:'css',animations:'disabled'});
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('tuneville-gift-v1'));s.collection.finished=1;localStorage.setItem('tuneville-gift-v1',JSON.stringify(s));});
 await page.reload();await page.goto('/?review=1#hub');await expect(page.locator('.home-save details')).toHaveCount(1);await page.locator('.home-save summary').click();
 await expect(page.locator('.install-steps')).toContainText(platform==='ios'?'Share':'Create shortcut');if(platform==='android')await expect(page.locator('.install-steps')).toContainText('Tap Install. No Install? Tap Create shortcut.');else await expect(page.locator('.install-steps')).not.toContainText('Chrome');
});
test('restore links preview on a fresh browser, cancel safely, warn before replacing and clear their hash',async({page,browser})=>{
 await enter(page);await page.goto('/?review=1#backup');const link=await page.locator('#save-link').inputValue();
 const context=await browser.newContext({serviceWorkers:'block'}),other=await context.newPage();
 await other.goto(link);await expect(other.locator('h1')).toHaveText('Restore this collection?');await expect(other.locator('h1 + p')).toHaveText('This puts the collection on this phone.');await expect(other.locator('main')).toContainText('3 / 33 Tunie cards');expect(await other.evaluate(()=>localStorage.getItem('tuneville-gift-v1'))).toBeNull();
 await action(other,'cancel-restore').click();expect(other.url()).not.toContain('restore');await other.reload();await expect(other.locator('.screen-onboard')).toBeVisible();
 await other.goto(link);await action(other,'confirm-restore').click();await expect(other.locator('.screen-collection')).toBeVisible();expect(other.url()).not.toContain('restore');
 await other.evaluate(()=>{const s=JSON.parse(localStorage.getItem('tuneville-gift-v1'));for(let i=0;i<6;i++)s.collection.cards[`candy-${i}`]='box';localStorage.setItem('tuneville-gift-v1',JSON.stringify(s));});
 await other.reload();await other.goto(link);await expect(other.locator('[role="alert"]')).toContainText('more cards');await other.setViewportSize({width:390,height:844});await shot(other,'restore-confirm');await action(other,'cancel-restore').click();expect(await other.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('tuneville-gift-v1')).collection.cards).length)).toBeGreaterThan(3);
 for(const broken of [link.slice(0,-5),link+'!']){await other.goto(broken);await expect(other.locator('[role="alert"]')).toContainText('damaged');await expect(action(other,'confirm-restore')).toHaveCount(0);await action(other,'cancel-restore').click();}
 // A pasted link uses the same preview, including when already on the page.
 await other.goto('/?review=1#backup');await other.locator('#restore-code').fill(link);await other.locator('#restore-form button').click();await expect(other.locator('h1')).toHaveText('Restore this collection?');await action(other,'confirm-restore').click();await other.reload();await expect(other.locator('.screen-collection')).toBeVisible();await context.close();
});
test('book hides unavailable picks and collapses unopened streets',async({page})=>{
 await enter(page);await page.goto('/#collection');await expect(page.locator('[data-action^="exchange:"]')).toHaveCount(0);await expect(action(page,'pick-cards')).toHaveCount(0);await expect(page.locator('.closed-set')).toHaveCount(3);await expect(page.locator('.tunie-card')).toHaveCount(15);
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('tuneville-gift-v1'));s.collection.stars=10;localStorage.setItem('tuneville-gift-v1',JSON.stringify(s));});await page.reload();await expect(page.locator('[data-action^="exchange:"]')).toHaveCount(0);await action(page,'pick-cards').click();await page.locator('[data-action^="exchange:"]').first().click();await expect(page.locator('[data-action^="exchange:"]')).toHaveCount(0);await expect(action(page,'pick-cards')).toHaveCount(0);
});
test('result screen review captures use the normal reward and rendering paths',async({page})=>{
 // Inject result fixtures at the run boundary without adding production debug hooks.
 await page.route('**/game/app.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+`\nglobalThis.reviewResult=(game,grades)=>{if(game==='boxes'){save.collection.cards={};save.collection.boxes=[0,0];persist();navigate('boxes');}if(game==='wrap'){wrapResult={score:3240,maxCombo:12,grades,best:true};rewardResult('wrap',wrapMedal(grades),true);navigate('wrapResults');}if(game==='sorting'){const r=createSorting('easy',5);Object.assign(r,{score:10000,sorted:36,bestCombo:20,points:{base:3600,quick:1800,rush:600,combo:4000}});finishSorting(r);}if(game==='sleigh'){sleighResult={delivered:10,medal:1,best:true,personalBest:10,celebration:2,perfect:3,bonusPoints:300,distance:240,cause:null};rewardResult('sleigh',1,true);navigate('sleighResults');}};`});});
 await page.setViewportSize({width:390,height:844});await enter(page);
 await page.evaluate(()=>reviewResult('wrap',['A','B','C']));await expect(page.locator('main')).toContainText('Keep practising');await expect(page.locator('main')).toContainText('Paper');await shot(page,'wrap-results');
 await page.evaluate(()=>reviewResult('wrap',['C','C','C']));await expect(page.locator('main')).toContainText('Win the Paper: get Bronze on any song');await shot(page,'wrap-c-only');
 for(const game of ['sorting','sleigh']){await page.evaluate(game=>reviewResult(game),game);await expect(page.locator('main')).toContainText('boxes to open');await expect(page.locator('.outfit-reward')).toContainText('Outfits unlocked');await shot(page,`${game}-results`);}
 await page.evaluate(()=>{reviewResult('boxes');Math.random=()=>0;});await action(page,'open-box').click();await expect(page.locator('.box-reveal+ [role="status"]')).toHaveText('A new Tunie!');await shot(page,'box-open');await action(page,'open-box').click();await expect(page.locator('[role="status"]').first()).toContainText('stars');await shot(page,'box-duplicate');
});
