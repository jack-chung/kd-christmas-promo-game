// iPadOS can use a desktop Mac user agent while retaining touch support.
export function devicePlatform(navigator=globalThis.navigator){
 const ua=navigator?.userAgent||'';
 const touchMac=/Macintosh|MacIntel/i.test(ua+' '+(navigator?.platform||''))&&navigator?.maxTouchPoints>1;
 if(/iPhone|iPad|iPod/i.test(ua)||touchMac)return 'ios';
 if(/Android/i.test(ua))return 'android';
 return 'unknown';
}
export function instructionPlatforms(navigator=globalThis.navigator){
 const platform=devicePlatform(navigator);
 return platform==='unknown'?['ios','android']:[platform];
}
