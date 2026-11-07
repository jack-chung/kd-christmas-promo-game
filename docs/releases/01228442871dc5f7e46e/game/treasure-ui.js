import {C} from './content.js';
import {escapeHTML as e,fmt} from './engine.js';
import {openSets} from './treasure.js';
import {helper,cardArt,outfitArt} from './treasure-art.js';
import {encodeSave} from './save-code.js';
import qrcode from './qrcode.js';
const T=C.treasure;
const b=(text,action,disabled=false)=>`<button type="button" class="secondary" data-action="${action}" ${disabled?'disabled':''}>${e(text)}</button>`;
const f=(text,values)=>e(fmt(text,values));
export function cardView(card,save,{exchange=false,reveal=false}={}){
 const source=save.collection.cards[card.id];
 return `<article class="tunie-card rarity-${card.rarity} ${source?'owned':'missing'} ${reveal?'card-reveal':''}"><span class="rarity-label">${e(T.rarities[card.rarity])}</span><div class="card-portrait">${cardArt(card)}</div><h3>${e(source?card.name:card.set==='mythical'?card.name:T.unknown)}</h3><p>${e(source?card.phrase:card.hint||T.locked)}</p>${source?`<small>${f(T.found,{source:T.sources[source]})}</small>`:exchange&&['common','rare'].includes(card.rarity)?b(T.exchange,`exchange:${card.id}`,save.collection.stars<T.exchangeCost):''}</article>`;
}
export function helperView(save,profile){
 const c=save.collection;
 return `<h1 tabindex="-1">${e(T.helper)}</h1><p>${e(T.helperCopy)}</p><div class="helper-preview">${helper(profile,c.equipped)}</div><div class="nameplate"><strong id="nickname"></strong>${b(C.profile.shuffle,'shuffle')}</div><fieldset class="avatar-picker"><legend>${e(C.profile.choose)}</legend>${C.profile.avatars.map(a=>`<label class="avatar-option"><input type="radio" name="avatar" value="${a.id}" ${profile.avatar===a.id?'checked':''}>${helper({avatar:a.id},c.equipped)}<span>${e(a.name)}</span></label>`).join('')}</fieldset>${b(T.helperSave,'helper-save')}${outfitsView(save)}`;
}
export function outfitsView(save){
 return Object.entries(T.slots).map(([slot,label])=>`<section><h2>${e(label)}</h2>${b(T.none,`unequip:${slot}`,!save.collection.equipped[slot])}<div class="outfit-grid">${T.outfits.filter(o=>o.slot===slot).map(o=>{const owned=save.collection.outfits.includes(o.id),worn=save.collection.equipped[slot]===o.id;return `<article class="outfit-card ${owned?'':'missing'}">${outfitArt(o)}<h3>${e(o.name)}</h3><p>${e(o.hint)}</p>${b(worn?T.equipped:owned?T.equip:T.locked,`equip:${o.id}`,!owned||worn)}</article>`;}).join('')}</div></section>`).join('');
}
export function bookView(save,now,review,tab){
 const c=save.collection,sets=openSets(now,review);
 return `<h1 tabindex="-1">${e(T.title)}</h1><p>${e(T.intro)}</p><p>${f(T.count,{count:Object.keys(c.cards).length,total:T.cards.length})} · ${f(T.stars,{count:c.stars})}</p><div class="book-tabs" role="tablist">${['cards','outfits'].map((id,i)=>`<button type="button" role="tab" aria-selected="${tab===id}" data-action="book-tab:${id}">${e(i?T.outfitsTab:T.cardsTab)}</button>`).join('')}</div>${boxLink(save)}${tab==='outfits'?outfitsView(save):`${T.sets.map(set=>{const cards=T.cards.filter(card=>card.set===set.id),open=sets.includes(set);return `<section><h2>${e(set.name)}</h2><p>${f(T.setCount,{count:cards.filter(card=>c.cards[card.id]).length})}${open?'':` · ${f(T.opens,{date:set.label})}`}</p><p>${f(T.setReward,{outfit:T.outfits.find(o=>o.id===`set-${set.id}`).name})}</p><div class="card-grid">${cards.map(card=>cardView(card,save,{exchange:open})).join('')}</div></section>`;}).join('')}<section><h2>${e(T.hostTitle)}</h2><div class="card-grid">${T.cards.filter(card=>card.set==='layer').map(card=>cardView(card,save)).join('')}</div></section><section><h2>${e(T.mythicalTitle)}</h2><div class="card-grid">${T.cards.filter(card=>card.set==='mythical').map(card=>cardView(card,save)).join('')}</div><p>${f(T.collectorProgress,{count:T.sets.filter(set=>T.cards.filter(card=>card.set===set.id).every(card=>c.cards[card.id])).length})}</p></section><details><summary>${e(T.oddsTitle)}</summary><p>${e(T.oddsCopy)}</p>${T.odds.map((odds,i)=>`<p>${f(T.oddsLine,{box:T.boxNames[i],common:Math.round(odds[0]*100),rare:Math.round(odds[1]*100),super:Math.round(odds[2]*100),mythical:Math.round(odds[3]*100)})}</p>`).join('')}<p>${f(T.pityLabel,{count:c.sinceRare})}</p></details>`}<div class="book-actions">${b(T.helper,'go:helper')}${b(T.saveTitle,'go:backup')}</div>`;
}
export function boxLink(save){return save.collection.boxes.length?`<p>${f(T.boxes,{count:save.collection.boxes.length})}</p>${b(T.open,'go:boxes')}`:'';}
export function backupView(save){
 const code=encodeSave(save),qr=qrcode(0,'M');qr.addData(code);qr.make();
 return `<h1 tabindex="-1">${e(T.saveTitle)}</h1><p>${e(T.saveCopy)}</p><div class="save-qr" role="img" aria-label="${e(T.qrLabel)}">${qr.createSvgTag({cellSize:4,margin:16,scalable:true})}</div><label for="save-code">${e(T.saveCode)}</label><textarea id="save-code" readonly rows="6" spellcheck="false">${e(code)}</textarea>${b(T.copy,'copy-code')}<form id="restore-form"><h2>${e(T.restore)}</h2><p>${e(T.restoreCopy)}</p><label for="restore-code">${e(T.saveCode)}</label><textarea id="restore-code" rows="5" required spellcheck="false" autocapitalize="off"></textarea><button type="submit" class="primary full">${e(T.restoreConfirm)}</button></form><p id="feedback" role="status"></p>`;
}
export function homePrompt(save,now){
 const c=save.collection;if(!c.finished||!now||c.homePromptAt&&now-c.homePromptAt<T.homeReminderDays*86400000||globalThis.navigator?.standalone||globalThis.matchMedia?.('(display-mode: standalone)').matches)return '';
 return `<aside class="home-save"><h2>${e(T.homeTitle)}</h2><p>${e(T.homeCopy)}</p>${[['ios',T.iosSteps],['android',T.androidSteps]].map(([kind,steps])=>`<details><summary>${e(T[kind])}</summary><ol class="install-steps">${steps.map((text,i)=>`<li><span aria-hidden="true">${['□↑','＋','▣'][i]}</span>${e(text)}</li>`).join('')}</ol></details>`).join('')}${b(T.dismiss,'dismiss-home')}</aside>`;
}
export function browserWarning(storageOK){
 const inApp=/MicroMessenger|FBAN|FBAV|Instagram|Line\/|\bwv\b|TikTok|Snapchat|; wv\)/i.test(globalThis.navigator?.userAgent||'');
 return `${inApp?`<p class="storage-notice">${e(T.inApp)}</p>`:''}${!storageOK?`<p class="storage-notice">${e(T.private)}</p>`:''}`;
}
