# Update check: review and hosting

Review: https://jack-chung.github.io/kd-christmas-promo-game/?review=1#hub

The review strip shows the running build id. `npm run build` produces a deterministic id from shipped source bytes and packaging templates. `npm test` includes a stale-build gate and a test that intentionally changes a shipped file without regenerating, expecting failure. Keep published immutable release directories. Intermediate unpublished local release directories may be removed before committing.

GitHub Pages automatically uses the generated custom 404. Other static hosts can serve the same directory; configure their custom 404 to use 404.html for the strongest cache bypass. Plain-404 hosts use build.json and must respect no-store/revalidation. No host-specific API is needed. A CDN deliberately ignoring both cache directives and path uniqueness is outside a static site's control.

Every target file is downloaded and checked before the note. This includes the archived art gallery (~25 MB); a first visit/update can take longer on mobile data. Music still decodes and plays only in a music game. The note itself is stationary, including under reduced motion. A failed check/download leaves the game running silently. There is no time guarantee while a phone suspends its browser; visible tabs check about every five minutes, and visibility return checks immediately. Unsafe screens defer indefinitely until the player leaves them.

## Phone checklist

1. Open the review link, note the build id, choose a helper and earn a layer. Record nickname/layers/paper.
2. After the next review deploy, background and return on the hub. Wait for downloads, then the short note and automatic reload. Confirm the id changed and progress survived.
3. Repeat with a deploy during a Wrap song, including pause. Finish the song/results journey; verify no interruption, then go to Town and confirm the update happens there.
4. Repeat offline: return to the tab and play without a reload or error note. Reconnect, return on the hub and confirm the update.
5. Open the keepsakes/gift and check they also accept updates; unwrap and finale celebrations must wait until Town.

Physical phone testing remains human verification; automated Chrome and WebKit runs emulate a portrait phone.

<!-- Review deployment marker: second-build live update acceptance, November 3, 2026. -->
