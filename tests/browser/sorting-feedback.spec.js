import {test,expect} from '@playwright/test';
import {C} from '../../docs/game/content.js';

async function setup(page){await page.goto('/?review=1');await page.locator('[data-action="profile"]').click();await page.goto('/?review=1#sorting');await page.reload();}
async function start(page){
 await page.locator('#sort-stage-select').selectOption('1');await page.locator('[data-action="sorting-start"]').click();await page.locator('#sort-continue').click();
}
async function tap(page,right=true){
 if(await page.locator('#sort-continue').count())await page.locator('#sort-continue').click();
 const symbol=await page.locator('#sort-spot .street-tag').textContent(),id=C.sorting.streets.find(s=>s.symbol===symbol).id;
 await page.locator('[data-sack]').evaluateAll((els,{id,right})=>els.find(el=>(el.dataset.sack===id)===right).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})),{id,right});
}
async function finish(page){for(let i=0;i<5;i++)await tap(page,false);await expect(page.locator('.screen-sortingResults')).toBeVisible();}
async function again(page){await page.locator('[data-action="go:sorting"]').click();}

for(const viewport of [{width:390,height:844},{width:320,height:568}])test(`quick bar, labelled points and multiplier fit ${viewport.width}×${viewport.height}`,async({page},testInfo)=>{
 await page.setViewportSize(viewport);
 const epoch=Date.now();await page.clock.install({time:epoch});await page.clock.pauseAt(epoch+60000);await setup(page);await start(page);await page.clock.runFor(32);
 const clockBefore=await page.locator('#sort-time').textContent(),secondsBefore=parseFloat((await page.locator('#sort-quick span').textContent()).match(/[\d.]+/)[0]);const before=Number(await page.locator('#sort-quick').getAttribute('aria-valuenow'));await page.clock.runFor(1000);const left=Number(await page.locator('#sort-quick').getAttribute('aria-valuenow'));expect(before-left).toBeGreaterThanOrEqual(8);expect(before-left).toBeLessThanOrEqual(12);expect(left).toBeGreaterThan(0);expect(await page.locator('#sort-time').textContent()).not.toBe(clockBefore);const secondsLeft=parseFloat((await page.locator('#sort-quick span').textContent()).match(/[\d.]+/)[0]);expect(secondsBefore-secondsLeft).toBeGreaterThanOrEqual(.8);expect(secondsBefore-secondsLeft).toBeLessThanOrEqual(1.2);
 await page.locator('#sort-pause').click();const pausedClock=await page.locator('#sort-time').textContent(),pausedLabel=await page.locator('#sort-quick span').textContent();const paused=Number(await page.locator('#sort-quick').getAttribute('aria-valuenow'));await page.clock.runFor(6000);expect(Number(await page.locator('#sort-quick').getAttribute('aria-valuenow'))).toBe(paused);await expect(page.locator('#sort-time')).toHaveText(pausedClock);await expect(page.locator('#sort-quick span')).toHaveText(pausedLabel);await page.locator('#sort-resume').click();
 await tap(page);await expect(page.locator('#sort-points')).toContainText('+100');await expect(page.locator('#sort-points')).toContainText('Quick!');await page.clock.runFor(32);expect(Number(await page.locator('#sort-quick').getAttribute('aria-valuenow'))).toBeGreaterThan(18);
 for(let i=0;i<4;i++)await tap(page);await expect(page.locator('#sort-multiplier')).toHaveText('×2');await expect(page.locator('#sort-points')).toContainText('×2 +100');
 await page.screenshot({path:testInfo.outputPath('points-and-multiplier.png')});
 await tap(page,false);await expect(page.locator('#sort-multiplier')).toHaveText('×1');await expect(page.locator('#sort-multiplier')).toHaveClass(/combo-reset/);await expect(page.locator('#sort-message')).toContainText('Streak reset');
 const bounds=await page.evaluate(()=>{const p=document.querySelector('#sort-points').getBoundingClientRect();return {height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,left:p.left,right:p.right};});expect(bounds.height).toBeLessThanOrEqual(viewport.height);expect(bounds.width).toBeLessThanOrEqual(viewport.width);expect(bounds.left).toBeGreaterThan(0);expect(bounds.right).toBeLessThan(viewport.width);
 await page.clock.runFor(2100);expect(Number(await page.locator('#sort-quick').getAttribute('aria-valuenow'))).toBe(0);await expect(page.locator('#sort-quick span')).toHaveText('Quick 0.0s');await tap(page);await expect(page.locator('#sort-points')).not.toContainText('Quick!');
});

test('every finish celebrates, one record survives reload, and breakdown sums to total with sound off',async({page},testInfo)=>{
 await setup(page);await start(page);await finish(page);
 await expect(page.locator('.sorting-party')).toHaveAttribute('data-celebration','0');await expect(page.locator('.confetti i')).toHaveCount(24);await expect(page.locator('.sorting-new-best')).toHaveCount(0);
 await again(page);await start(page);await tap(page);await finish(page);
 await expect(page.locator('.sorting-party')).toHaveAttribute('data-celebration','1');await expect(page.locator('.sorting-new-best')).toHaveText('★ New best!');await expect(page.locator('.sorting-personal-best')).toContainText('Your best:');
 const easy=Number(await page.locator('#sorting-total').getAttribute('data-value'));
 await again(page);await start(page);for(let i=0;i<15;i++)await tap(page);await finish(page);
 await expect(page.locator('.sorting-party')).toHaveAttribute('data-celebration','2');await expect(page.locator('.sorting-medal-stamp')).toHaveCount(1);await expect(page.locator('.confetti i')).toHaveCount(48);
 const sum=await page.locator('[data-points]').evaluateAll(els=>els.reduce((sum,el)=>sum+Number(el.dataset.value),0)),total=Number(await page.locator('#sorting-total').getAttribute('data-value'));expect(sum).toBe(total);expect(total).toBeGreaterThan(easy);
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('.sorting-medal-stamp').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');await expect(page.locator('.sorting-new-best')).toBeVisible();await page.screenshot({path:testInfo.outputPath('medal-results.png')});
 const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuneville-gift-v1')));expect(save.sound).toBe(false);expect(save.sortingBest).toBe(total);expect(save.layers).toEqual([2]);
 await again(page);await page.reload();await expect(page.locator('[name="sorting-difficulty"]')).toHaveCount(0);await expect(page.locator('.sorting-setup-best')).toHaveText(`Best: ${total.toLocaleString('en-US')}`);
 await page.goto('/?review=1#hub');await expect(page.locator('.adventure').nth(1)).toContainText(`Best: ${total.toLocaleString('en-US')}`);
});

test('real tap cues start immediately and results play sampled audio that mutes and stops on navigation',async({page})=>{
 await page.addInitScript(()=>{
  const Native=window.AudioContext||window.webkitAudioContext;window.cueStarts=[];
  window.AudioContext=class extends Native{constructor(...args){super(...args);window.cueContext=this;}createBufferSource(){const source=super.createBufferSource(),start=source.start;source.start=function(at){window.cueStarts.push({delay:at-window.cueContext.currentTime,seconds:source.buffer.duration});return start.call(this,at);};return source;}};
 });
 await setup(page);await expect(page.locator('#music-loading')).toBeHidden();await page.locator('[data-action="sound"]').click();await start(page);
 await page.evaluate(()=>window.cueStarts=[]);await tap(page);const starts=await page.evaluate(()=>window.cueStarts);expect(starts.filter(s=>s.delay<.04).length).toBeGreaterThanOrEqual(3);expect(starts.some(s=>Math.abs(s.seconds-1.4)<.001)).toBe(true);
 await finish(page);await expect.poll(()=>page.evaluate(()=>window.cueStarts.filter(s=>s.delay>1.5).length)).toBeGreaterThan(3);await expect.poll(()=>page.evaluate(()=>window.cueContext.state)).toBe('running');
 await page.locator('[data-action="sound"]').click();await expect.poll(()=>page.evaluate(()=>window.cueContext.state)).toBe('suspended');await again(page);await expect.poll(()=>page.evaluate(()=>window.cueContext.state)).toBe('suspended');
});

test('sampled celebrations have two to four seconds of audible sound and safe output',async({page},testInfo)=>{
 await page.goto('/?review=1');
 const metrics=await page.evaluate(async()=>{
  const {Music}=await import('/game/music.js'),{SortingFeedback}=await import('/game/sorting-feedback.js'),Original=window.AudioContext,results=[];
  try{for(let tier=0;tier<3;tier++){
   const rate=22050,ctx=new OfflineAudioContext(1,rate*4,rate);window.AudioContext=function(){return ctx;};const music=new Music(()=>true);await music.load();new SortingFeedback(music).celebrate(tier);
   const data=(await ctx.startRendering()).getChannelData(0);let peak=0,squares=0,end=0;
   for(let i=0;i<data.length;i++){const v=data[i];peak=Math.max(peak,Math.abs(v));squares+=v*v;if(Math.abs(v)>.001)end=i/rate;}
   results.push({tier,peak,rms:Math.sqrt(squares/data.length),end});
  }return results;}finally{window.AudioContext=Original;}
 });
 await testInfo.attach('celebration-metrics',{body:JSON.stringify(metrics,null,2),contentType:'application/json'});
 for(const m of metrics){expect(m.peak).toBeLessThan(.95);expect(m.rms).toBeGreaterThan(.02);expect(m.end).toBeGreaterThan(2);expect(m.end).toBeLessThan(4);}
});
