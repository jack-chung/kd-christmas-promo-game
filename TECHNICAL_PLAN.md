# Technical Plan

## Architecture
Buildless front-end mobile game: native ES modules, HTML/CSS, original SVG pixel sprites, Canvas 2D Tower, and lazy-loaded CC0 sampled Wrap instruments and original Web Audio accompaniment. No runtime dependencies, server, accounts, analytics, cookies, CDN fonts, or network saves. GitHub Pages serves `main:/docs`: an unannounced public review preview, not the campaign launch.

## Key Components
- `docs/index.html`: game entry; game title and copy come from the content module.
- `docs/game/content.js`: **all player-facing copy and character names**, preset identities, episode release dates, puzzles, difficulty settings, placeholder finale code/message.
- `docs/game/engine.js`: save schema/validation, date gates, grading/timing, puzzle completion, stacking collision rules; no DOM.
- `docs/game/rhythm.js`: pure lane/timing judgement, penalties, combos and customer grades.
- `docs/game/music.js`: lazy CC0 sample bank, sampled lane instruments, original bass/chord/kit/pad backing and output-latency-aware scheduling. `docs/game/audio/` holds the bank, pinned sources, full CC0 licence and reachable credits.
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
- Wrap: 3 customers × 41–48-second public-domain carols, plus a falling-object lead-in. Four lanes in Fold/Tape/Ribbon/Bow order. Easy uses Fold/Tape at least 1500 ms apart, Tunie uses four lanes, and Rapper speeds up the same melody with occasional two-lane octave pairs. Quarter-note beats are 750 ms (Easy/Tunie) or 650 ms (Rapper); melody rhythms include half beats. Windows are ±360/300/250 ms; perfect windows ±145/120/100 ms. Pointerdown handles each thumb independently; desktop D/F/J/K and Left/Down/Up/Right keys mirror the buttons. Wrong lanes consume one nearby object; empty/wrong taps break combos and deduct score and accuracy. Missing never ends the song. Free instrument play leads to four slow, retrying guided shapes.
- Sound: successful Wrap taps play chart MIDI pitches through real recorded marimba (Fold), pizzicato strings (Tape), harp (Ribbon), and glockenspiel (Bow). Missed chart notes stay silent. Easy quietly fills only uncharted notes; Tunie/Rapper have no automatic melody. Deck the Halls, O Christmas Tree and Up on the Housetop use public-domain melodies, with our own sampled bass/chord accompaniment and generated kit/warm pad. O Christmas Tree is arranged in common time. The 642,224-byte PCM bank is fetched/decoded only on entering Wrap (including direct practice/play links), with a friendly non-blocking loading/failure message. Bank failure leaves visual play available. Sound credits/source paths/licence are in game/audio/. Other game cues retain original synthesis. Wrap samples run through conservative gains and a compressor; melody sits above backing. Visual and judgement clocks share performance.now(). Backing/fill/count-in attacks compensate measured getOutputTimestamp latency or baseLatency + outputLatency. Hit sounds start immediately on pointerdown; unavoidable hardware/Bluetooth delay still requires physical-phone assessment. Three count-in clicks/visible numbers fit inside existing travel lead-in, ending at time zero. Audio unlocks on gestures and stops on pause/navigation/backgrounding; resume resets both backing and fill cursors so cancelled scheduled notes can be rescheduled. Sound is optional; all gameplay is visual. Wrap/Tower pause on hiding and require explicit resume.
- Mystery: 16-parcel rule-based search, shift-back-one cipher, and three-person parcel deduction. Hints cost one of 3 stars, once per house. Clue code `462`. Active solve time/clues survive navigation/reload; background time is excluded. Either Episode 1 path awards layer 1 exactly once and unlocks star paper.
- Tower: moving crane, gravity, overlap collision, height-based sway, perfect/colour-streak bonuses, local height best. Bonus game; no weekly-layer reward.
- Finale placeholder `TUNIE12`; message in content.js. Certificate uses the preset nickname. Code and date checks are not security boundaries.

## Adding an episode
For drops using existing rules, edit only content.js. Each C.episodes slot has a stable id, house, Toronto release date, label, ready flag, and optional content object. Supply content.wrap (orders, thanks, difficulty or wording), content.mystery (cipher, answers, clues, hints, parcel layout), and content.gift (layer wording and keepsake) overrides; omitted fields inherit the shared defaults. A parcel layout specifies count, striped indices and bows; their intersection defines the targets. Keep four targets and three one-digit puzzle answers for the existing Episode 1 templates. Set ready:true only when that week's content is complete. Selecting its house switches games, weekly reward, and persistent case/scores automatically; ?episode=2 preserves selection on reload. Collection renders each earned week's keepsake. Review mode bypasses dates but never ready:false. The browser suite verifies a second week delivered by content-file changes alone. New mechanics or save-schema changes require code, migration where needed, and browser tests. Do not ship placeholder weeks by changing only their ready flag.

## Authoring Wrap songs
`C.wrap.songs` in content.js supplies three songs in customer order. Each song has `{id, title, meter, chords, phrase, variants}`. `phrase` contains `[MIDI pitch, quarter-note duration]` pairs (pitch 0 = rest). `chords` contains one low-register MIDI triad per measure; `meter` is the number of quarter beats per measure. Harmony must never double the melody as an independent line. Only verified public-domain melodies with recorded provenance may be used; no modern recording, arrangement or lyrics.

The content module derives each variant `{duration, beat, events, automatic}` in milliseconds from the same complete phrase. `events` are sorted `{time, lane, midi}` objects. Time zero is the first hit arrival after existing visual travel. Lane 0/1/2/3 means Fold/Tape/Ribbon/Bow. Easy charts notes at least 1500 ms apart on two lanes, putting only omitted melody notes in `automatic` (quiet harp fills). Tunie charts the whole melody; Rapper charts it faster with occasional simultaneous octave pairs on different lanes. Keep same-lane arrivals more than two judgement windows apart. Pitch belongs to the event, so missing does not shift the tune. A weekly `content.wrap.songs` override replaces the songs through the existing content mechanism; provide fully resolved variants when overriding. `automatic` may be omitted on literal charts (defaults to no fills).

The backing scheduler uses half-beat steps, scheduling 350 ms plus reported latency ahead. Negative steps -6/-4/-2 are the three count-in clicks; nonnegative steps play bass, chord stabs, pad and kit. Automatic fills have a separate cursor. Neither cursor advances from taps. No full-song recording needs downloading or synchronizing. Keep total new music assets under ~2 MB and fetch only inside Wrap. Source samples are mono PCM16 at 22050 Hz, trimmed/faded and peak normalized to -1 dB; sources.json pins the upstream commit and individual source files. Root MIDI values refer to measured sounding pitches, since source octave naming varies. Playback chooses the nearest root and transposes using playbackRate. Generated pad/kit sounds and original non-Wrap cues require no files.

Run `npm test` after chart/audio changes. Checks cover complete melody preservation, Easy fills, spacing, bank size/provenance, all nine legal charts, perfect runs and backing separation. Browser checks cover Chrome/WebKit journeys, touch/keyboard, mute/resume, loading failure, lazy requests, count-in, distinct decoded instrument buffers and an OfflineAudioContext mix render (audible backing, melody RMS above backing, no clipping). Physical phone listening remains required for recognisability, speaker balance, silent switch and output timing.

## Environment
Runtime needs no npm installation or build. `npm run dev` serves docs/ on port 4173. `npm install` installs test tools only. `npm test` runs Node checks. `npm run test:browser` runs headless installed Chrome with phone emulation. To include WebKit, install its Playwright browser and set TUNEVILLE_WEBKIT=1 (plus PLAYWRIGHT_BROWSERS_PATH if installed in a custom cache). Tests reuse or start a local server. Emulation is not physical iPhone/Android/iPad certification.

## Review and publication
- Game: https://jack-chung.github.io/kd-christmas-promo-game/
- Reviewer shortcut: https://jack-chung.github.io/kd-christmas-promo-game/?review=1
- Gallery: https://jack-chung.github.io/kd-christmas-promo-game/art-direction/
- Style sheet: https://jack-chung.github.io/kd-christmas-promo-game/art-direction/style-sheet.html

After checks, commit/push to main triggers the authorized preview publication from /docs. Verify the matching Pages build and live assets. No other hosting service is used.
