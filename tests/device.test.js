import {test} from 'node:test';
import assert from 'node:assert/strict';
import {devicePlatform,instructionPlatforms} from '../docs/game/device.js';
import {restoreLink,decodeBackup,encodeSave} from '../docs/game/save-code.js';
import {freshSave,newProfile} from '../docs/game/engine.js';
test('one platform detector covers phones, iPad desktop mode and unknown desktops',()=>{
 for(const [userAgent,platform,maxTouchPoints,expected] of [
  ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)','iPhone',5,'ios'],
  ['Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)','iPad',5,'ios'],
  ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605','MacIntel',5,'ios'],
  ['Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/140 Mobile Safari/537','Linux',5,'android'],
  ['Mozilla/5.0 (iPhone) Instagram','iPhone',5,'ios'],
  ['Mozilla/5.0 (Linux; Android 15; wv) Instagram','Linux',5,'android'],
  ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Chrome/140','MacIntel',0,'unknown'],
  ['Mozilla/5.0 (Windows NT 10.0) Chrome/140','Win32',0,'unknown'],
  ['',undefined,0,'unknown']]){
  const nav={userAgent,platform,maxTouchPoints};assert.equal(devicePlatform(nav),expected);
  assert.deepEqual(instructionPlatforms(nav),expected==='unknown'?['ios','android']:[expected]);
 }
});
test('backup links follow current hosting and round-trip bare or pasted URLs with corruption checks',()=>{
 const save=freshSave();save.profile=newProfile();const code=encodeSave(save);
 for(const base of ['https://jack-chung.github.io/kd-christmas-promo-game/?review=1#backup','https://new.example/game/#backup']){
  const link=restoreLink(code,base);assert.equal(new URL(link).pathname,new URL(base).pathname);assert.equal(new URL(link).search,'');
  assert.deepEqual(decodeBackup(link),decodeBackup(code));
  assert.throws(()=>decodeBackup(link.slice(0,-3)));assert.throws(()=>decodeBackup(link+'x'));
 }
});
