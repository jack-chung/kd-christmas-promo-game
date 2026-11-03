# Technical Plan

## Architecture
Buildless front-end mobile game: native ES modules, HTML/CSS, original SVG pixel sprites, Canvas 2D Tower, and original synthesized Web Audio percussion. No runtime dependencies, server, accounts, analytics, cookies, CDN fonts, or network saves. GitHub Pages serves `main:/docs`: an unannounced public review preview, not the campaign launch.

## Key Components
- `docs/index.html`: game entry; game title and copy come from the content module.
- `docs/game/content.js`: **all player-facing copy and character names**, preset identities, episode release dates, puzzles, difficulty settings, placeholder finale code/message.
- `docs/game/engine.js`: save schema/validation, date gates, grading/timing, puzzle completion, stacking collision rules; no DOM.
- `docs/game/app.js`: guarded hash navigation, screens, input, saves, review controls, game loops, audio lifecycle, pause/resume.
- `docs/game/art.js`: original integer-grid SVG sprites, houses, gift, parcels. No licensed assets.
- `docs/game/style.css`: portrait-first UI, pixel presentation, reduced motion.
- `docs/art-direction/index.html`: preserved comparison gallery.
- `docs/art-direction/assets/`: nine original portrait PNG screen mock-ups.
- `docs/art-direction/prompts.md`: common character/constraint brief plus each image's style and screen brief, generated with the built-in image_gen tool.
- `docs/art-direction/style-sheet.html`: selected cozy pixel palette, outline/grid rules, helper + two customers, supporting cast, production limits.
- `tests/engine.test.js`: date boundaries, save resilience, timing, puzzle consistency, stacking checks.
- `tests/browser/adventure.spec.js`: full game journeys, review/date guards, hints, persistence, mobile/tablet layouts.

## Conventions
Cozy pixel art selected by user November 3, 2026. Preserve the red-cap apron wrapper, green-beanie glasses kid, sunglasses King, singers, and note-creature Tunies. Use original small sprites rather than concept-image crops. No licensed artwork, lyrics, script passages, or prohibited story spoilers. Names and text live in content.js.

## State and privacy
Only `tuneville-gift-v1` localStorage is used. Schema v1 stores preset nickname indices/avatar, layers, paper, sound preference, best scores, puzzle clues/hints/active solve time, and finale completion. Per-episode records keep clues and scores separate; legacy Episode 1 fields are retained for compatibility. No typed names, contact details, or identifiers. Normalize loaded state. Storage failure leaves a playable in-memory session with a notice. Reset clears all progress. Review mode uses explicit `?review=1`, not permanent storage. Direct hashes cannot bypass date gates or award a layer; reviewer result/unwrap previews do not award progress.

## Dates and availability
Dates are absolute UTC instants matching Toronto time: weekly episodes at midnight EST Nov 20/27 and Dec 4/11; finale Dec 12, 2026 at 4 PM EST (`2026-12-12T21:00:00Z`). Device time is sufficient for this promo. The content-ready flag is independent of the date: Episodes 2–4 remain coming soon even in review mode.

## Game rules
- Wrap: 3 customers × 36 actions; Easy/Tunie/Rapper intervals 1400/1100/900 ms and windows ±360/290/220 ms. Visual cue and scoring share performance.now(). Audio schedules ahead after a user gesture; all play works muted. Swipe left to fold/right for ribbon, or tap for every action. Active games pause on hiding the page and require explicit resume. Per-gift grades, combos, and local best score.
- Mystery: 16-parcel rule-based search, shift-back-one cipher, and three-person parcel deduction. Hints cost one of 3 stars, once per house. Clue code `462`. Active solve time/clues survive navigation/reload; background time is excluded. Either Episode 1 path awards layer 1 exactly once and unlocks star paper.
- Tower: moving crane, gravity, overlap collision, height-based sway, perfect/colour-streak bonuses, local height best. Bonus game; no weekly-layer reward.
- Finale placeholder `TUNIE12`; message in content.js. Certificate uses the preset nickname. Code and date checks are not security boundaries.

## Adding an episode
For drops using existing rules, edit only content.js. Each C.episodes slot has a stable id, house, Toronto release date, label, ready flag, and optional content object. Supply content.wrap (orders, thanks, difficulty or wording), content.mystery (cipher, answers, clues, hints, parcel layout), and content.gift (layer wording and keepsake) overrides; omitted fields inherit the shared defaults. A parcel layout specifies count, striped indices and bows; their intersection defines the targets. Keep four targets and three one-digit puzzle answers for the existing Episode 1 templates. Set ready:true only when that week's content is complete. Selecting its house switches games, weekly reward, and persistent case/scores automatically; ?episode=2 preserves selection on reload. Collection renders each earned week's keepsake. Review mode bypasses dates but never ready:false. The browser suite verifies a second week delivered by content-file changes alone. New mechanics or save-schema changes require code, migration where needed, and browser tests. Do not ship placeholder weeks by changing only their ready flag.

## Environment
Runtime needs no npm installation or build. `npm run dev` serves docs/ on port 4173. `npm install` installs test tools only. `npm test` runs Node checks. `npm run test:browser` runs headless installed Chrome with phone emulation. To include WebKit, install its Playwright browser and set TUNEVILLE_WEBKIT=1 (plus PLAYWRIGHT_BROWSERS_PATH if installed in a custom cache). Tests reuse or start a local server. Emulation is not physical iPhone/Android/iPad certification.

## Review and publication
- Game: https://jack-chung.github.io/kd-christmas-promo-game/
- Reviewer shortcut: https://jack-chung.github.io/kd-christmas-promo-game/?review=1
- Gallery: https://jack-chung.github.io/kd-christmas-promo-game/art-direction/
- Style sheet: https://jack-chung.github.io/kd-christmas-promo-game/art-direction/style-sheet.html

After checks, commit/push to main triggers the authorized preview publication from /docs. Verify the matching Pages build and live assets. No other hosting service is used.
