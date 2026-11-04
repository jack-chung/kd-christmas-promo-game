# Update check: review and hosting

Review: https://jack-chung.github.io/kd-christmas-promo-game/?review=1#hub

The review strip shows the running build id. `npm run build` produces a deterministic id from game source bytes and packaging templates/config. `npm test` includes a stale-build gate and a test that intentionally changes a shipped file without regenerating, expecting failure. Each build retains the current and two preceding slim releases, in the newest-first order recorded in releases.json; older directories are removed. Already-open older games retain their complete local worker cache while waiting for a safe update. The build gate rejects non-game files and releases over 3,000,000 bytes.

GitHub Pages automatically uses the generated custom 404. Other static hosts can serve the same directory; configure their custom 404 to use 404.html for the strongest cache bypass. Plain-404 hosts use build.json and must respect no-store/revalidation. No host-specific API is needed. A CDN deliberately ignoring both cache directives and path uniqueness is outside a static site's control.

Every target file is downloaded and checked before the note. Only game modules, styles, audio and source credits are included (about 0.84 MB). The gallery, prompts, review screenshots and this note remain ordinary unversioned review pages, outside releases and precaches. First open adds a small duplicate module transfer while the worker installs; update preparation and worker installation share the verified cache, Measured uncompressed response bodies in both browser fixtures: about 1.01 MB on first open and 0.85 MB on an update (including worker/probes). Compression may reduce network transfer; headers and protocol overhead add a little. Music still decodes and plays only in a music game. The note itself is stationary, including under reduced motion. A failed check/download leaves the game running silently. There is no time guarantee while a phone suspends its browser; visible tabs check about every five minutes, and visibility return checks immediately. Unsafe screens defer indefinitely until the player leaves them.

## Phone checklist

1. Open the review link, note the build id, choose a helper and earn a layer. Record nickname/layers/paper.
2. After the next review deploy, background and return on the hub. Wait for downloads, then the short note and automatic reload. Confirm the id changed and progress survived.
3. Repeat with a deploy during a Wrap song, including pause. Finish the song/results journey; verify no interruption, then go to Town and confirm the update happens there.
4. Repeat offline: return to the tab and play without a reload or error note. Reconnect, return on the hub and confirm the update.
5. Open the keepsakes/gift and check they also accept updates; unwrap and finale celebrations must wait until Town.

Physical phone testing remains human verification; automated Chrome and WebKit runs emulate a portrait phone.

<!-- Revision 1: slim player release and three-release retention. -->
