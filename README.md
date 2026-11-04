# The Tuneville Gift

A phone-browser review prototype for Kids Discover’s **Wrapping All the Way**: Tuneville hub, mystery gift, four weekly game slots: Wrap Station, Sorting Office, Present Tower, and Sleigh-Cart Run.

- [Play the review build](https://jack-chung.github.io/kd-christmas-promo-game/?review=1)
- [Art gallery](https://jack-chung.github.io/kd-christmas-promo-game/art-direction/)
- [Selected cozy pixel style sheet](https://jack-chung.github.io/kd-christmas-promo-game/art-direction/style-sheet.html)

Choose a preset nickname/helper. Review mode bypasses dates; **Review controls** in the footer jumps to every screen and resets device progress. Finale placeholder code: **TUNIE12**. Games unlock cumulatively at Toronto midnight on Nov 13, Nov 20, Nov 27 and Dec 4, 2026. Sorting Office is built; Sleigh-Cart Run stays coming soon until built. Availability uses our host’s verified time; device date changes cannot unlock games. Previously verified games remain playable offline after a successful visit.

Run `npm run dev` to generate an immutable build and serve `docs/`. After editing shipped files, run `npm run build` before committing/publishing; `npm test` rejects stale generated output. Any static HTTP host can serve the generated site. No runtime dependencies. Install test tools with `npm install`; run `npm test` and `npm run test:browser` (installed Chrome required). See [TECHNICAL_PLAN.md](TECHNICAL_PLAN.md) for state, dates, adding game slots, and WebKit checks.

Progress stays on the device. No accounts, typed names, analytics, or trackers. All game art is original. Wrap Station plays our own arrangements of public-domain carols using CC0 instrument samples, decoded only when entering a music game (about 642 KB); the offline worker precaches the release. Sound credits are linked from Wrap Station. Wrap Station uses four falling-shape lanes; tap matching buttons, or use D F J K / arrow keys on desktop. Sorting Office is endless until five oops: tap matching street sacks, or use number keys 1–5. It teaches Fragile and Royal overrides in paused icon cards, awards Ribbon and unlocks shared postmark papers. Review setup has a stage picker. Finale copy/code remain placeholders. This is an unannounced public review preview; `noindex` is requested. GitHub Pages publishes `main:/docs`.
