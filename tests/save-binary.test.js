import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeSave,decodeSave,restoreLink} from '../docs/game/save-code.js';
import {normalizeSave} from '../docs/game/engine.js';
import {fullSave} from './fixtures/full-save.js';
const address='https://jack-chung.github.io/kd-christmas-promo-game/';
const expected=s=>({...s,collection:{...s.collection,restored:true}});
test('TV2 full campaign backup stays within 450 characters and preserves every field',()=>{
 const s=fullSave(),code=encodeSave(s),link=restoreLink(code,address);
 assert.match(code,/^TV2-/);assert.ok(link.length<=450,`Full-save restore link is ${link.length} characters`);assert.deepEqual(decodeSave(code),expected(s));
 // Future friend records have room for ten permanent IDs, including new-friend references.
 s.collection.friends=Array.from({length:10},(_,i)=>i.toString(16).padStart(20,'0').toUpperCase());s.collection.newFriends=s.collection.friends.slice(0,3);s.collection.broughtBy=s.collection.friends[0];
 assert.ok(restoreLink(encodeSave(s),address).length<=450);assert.deepEqual(decodeSave(encodeSave(s)),expected(s));
});
test('extended 22-field TV1 restores song records',()=>{
 const code='TV1-WzEsWzMsMiw5OSwwXSxbXSxbMCwwLDAsMF0sWzAsMCwwXSxbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdLFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sMCxbXSxbLTEsLTEsLTEsLTFdLCIwIiwwLGZhbHNlLCIiLFtdLFtdLCIiLDAsW10sMCwwLHsiZGVjay10aGUtaGFsbHMiOnsiZ3JhZGUiOiJBIiwic2NvcmUiOjk4NzY1LCJ0b3BTcGVlZCI6MS4yNX19XQ-1r8qzu2';
 assert.deepEqual(decodeSave(code).wrapSongs,{'deck-the-halls':{grade:'A',score:98765,topSpeed:1.25}});
});
test('TV2 preserves large safe integers, arbitrary reward claims and earned outfit order',()=>{
 const s=fullSave();s.collection.finished=Number.MAX_SAFE_INTEGER;s.collection.claims.push('friend:ABCDEF-1234','show:opening-night');s.collection.outfits.reverse();s.collection.friends=['ABCDEF-1234'];s.collection.newFriends=['OTHER-1234','ABCDEF-1234'];s.collection.broughtBy='FRIEND-1234';
 assert.deepEqual(decodeSave(encodeSave(s)),expected(s));
});
test('TV2 rejects checksummed truncated and trailing binary payloads',()=>{
 const code=encodeSave(fullSave()),payload=code.slice(4,-8),bytes=Buffer.from(payload,'base64url');
 for(const changed of [bytes.subarray(0,-1),Buffer.concat([bytes,Buffer.from([0])])]){
  const p=changed.toString('base64url');let hash=2166136261;for(const ch of p)hash=Math.imul(hash^ch.charCodeAt(0),16777619);
  assert.throws(()=>decodeSave(`TV2-${p}-${(hash>>>0).toString(36).padStart(7,'0')}`));
 }
});
test('TV2 round trips sparse progress across bit and varint boundaries',()=>{
 let seed=421;const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
 for(let i=0;i<40;i++){
  const s=fullSave();s.profile.number=10+random(90);s.layers=s.layers.filter(()=>random(2));s.finale=!!random(2);s.sound=!!random(2);s.collection.boxes=Array.from({length:random(60)},()=>random(4));s.collection.stars=random(2**24);s.collection.homePromptAt=random(2)?1797112800000:0;
  for(const id of Object.keys(s.wrapSongs)){if(random(3)===0)delete s.wrapSongs[id];else s.wrapSongs[id]={score:random(2**24),grade:'CBAS'[random(4)],topSpeed:(100+random(41))/100};}
  // Normalize derived layer/set rewards before comparing transferable state.
  s.collection.cards=Object.fromEntries(Object.entries(s.collection.cards).filter(()=>random(2)));s.collection.outfits=s.collection.outfits.filter(()=>random(2));s.collection.equipped={};
  const normalized=normalizeSave(s);assert.deepEqual(decodeSave(encodeSave(normalized)),expected(normalized));
 }
});
