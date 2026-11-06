# Sleigh Revision 3 calibration — 2026-11-06

Reproduce through `npm test`; deterministic human controller in `tests/helpers/sleigh-player.js`. Raw twenty-seed runs, full event timelines, five perfect-reaction runs and collision sweeps: [calibration JSON](review/sleigh-calibration.json).

The human controller waits 250 ms ±100 ms after seeing a hazard, varies hop timing ±100 ms, and varies delivery tap timing ±100 ms. It does not read future spawns. Cards pause active time. The delivery-only jitter controller also tests five runs with perfect hazard reactions against the numerical ceiling.

## Physics and measured windows

Tap peak 75.67 units; hold peak 150.48; released double peak 150.99 (second tap at 280 ms). Fence clearance 32; toboggan sprite top about 20; snowman 100; house roofline 125. Tap flight 0.967 s, hold 1.404 s, double 1.487 s. The cart collision includes its 44-unit wheel/body footprint. Tap height is 49 units below the roofs and 24 below the snowman.

Windows below sweep real collisions in 5 ms input increments at a 240 Hz simulation step. Fence/toboggan use released taps; pothole uses hold; snowman uses hold plus second hop at 300 ms. The snowman window is for the combined input, never a tap. Guided speed is 180 (+12 for moving). Guided minimum across the swept hazards is 0.255 s (toboggan); stage-1 fence exceeds 0.3 s.

| Stage | Speed (unchanged from R2) | Fence tap | Toboggan tap | Pothole hold | Snowman double | Door tap window |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 190 | 0.365 s | 0.275 s | 0.595 s | 0.895 s | 0.30 s |
| 2 | 196 | 0.375 s | 0.290 s | 0.620 s | 0.895 s | 0.30 s |
| 3 | 204 | 0.390 s | 0.310 s | 0.645 s | 0.895 s | 0.30 s |
| 4 | 210 | 0.400 s | 0.320 s | 0.665 s | 0.895 s | 0.28 s |
| 5 | 220 | 0.415 s | 0.340 s | 0.700 s | 0.895 s | 0.26 s |
| 6 | 232 | 0.435 s | 0.355 s | 0.730 s | 0.895 s | 0.24 s |
| 7 | 248 | 0.450 s | 0.375 s | 0.775 s | 0.895 s | 0.22 s |
| 8 | 264 | 0.465 s | 0.400 s | 0.810 s | 0.890 s | 0.18 s |

The gold step width is approach speed × content delivery window. Landing requires the cart's centre inside the step; rolling never delivers. Middle 34% gives 50 bonus points; delivered count remains the sole record/medal measure. Take-off line fades across the first four deliveries. Too-soon, too-late and rolling misses consume no gifts. Doors wait for a clear approach, except the explicitly named late pattern; safe recovery still clears hazards for the entire catch/landing window.

## Human simulation (20 seeds)

- Bronze: median 99.71 s; 20/20 runs earn it. Range 97.88–102.56 s.
- Silver: median 247.17 s; 20/20 runs earn it. Range 215.18–296.42 s.
- Gold: median 408.22 s; 14/20 runs earn it. Range 366.78–445.45 s.
- Run end: median 461.02 s; range 427.36–501.52 s.
- Door hit rate: 79.96%.
- Longest empty road: 1.208 s.

Gold is deliberately difficult: six seeds end without it. Aggregate medal/run timing is gated, rather than requiring every seed to earn Gold on schedule. These simulations are calibration evidence, not physical-phone or child acceptance.

## Example seed 1 timeline

| Lesson | Start | Play starts |
| --- | ---: | ---: |
| 1 | 0.00 s | 3.95 s |
| 2 | 23.50 s | 26.42 s |
| 3 | 45.76 s | 50.45 s |
| 4 | 68.45 s | 75.23 s |
| 5 | 94.51 s | 99.23 s |
| 6 | 118.52 s | 122.53 s |
| 7 | 141.83 s | 146.06 s |
| 8 | 164.39 s | Combinations |

Each lesson has two encounters and an 18-second learned-elements play stretch; road drain adds a small safe transition. Last lesson/play finishes around 2:44. This replaces Revision 2's first-garland-at-30-seconds target: three play stretches necessarily put garlands around 1:08. The task's Revision 3 explicitly requests this new rhythm.

Patterns unlock after the lessons at +0, +25, +50, +75, +100 and +150 seconds: fence/garland, pothole/snowman, toboggan pair, high gift over pothole, door between hazards, then four-shape mixed sequence. Each shows its banner. Full pattern start times are in the JSON. Late spacing tightens, speed grows 0.7 units/s each active second, warning falls 0.0016 s each second; music rises at bar boundaries. Streets change name, ground palette and house arrangement on lessons. At 7 minutes, hits scatter up to three gifts, with one catchable.

Doors recur every 22 seconds during teaching/play, 15 seconds after all lessons; pattern doors add opportunities. The numerical ceiling begins at 200,000 units or 570 active seconds, whichever comes first. It switches to 80 ms warning and alternating snowman/garland every 10 ms. Snowman clearance 100 and garland maximum cart height 46 are incompatible; collision spans overlap. At the ceiling a knocked gift travels at road speed so automatic catch recycling cannot keep an empty cart alive. No timer ends the run. Five perfect-reaction/jittered-delivery runs end by 573.50 s. Human runs usually end earlier through real mistakes.

## Phone review checklist

- [ ] A tap clears a fence but cannot clear a snowman; a double hop does.
- [ ] The lower hop feels brisk and the take-off line makes doorstep timing readable.
- [ ] Miss advice and the perfect sparkle explain the result; a roll gives no delivery.
- [ ] Play between lessons is fun; combinations and tightening late choices keep attention.
- [ ] Bronze in a few attempts, Silver around four minutes, Gold around six to seven; strong adult around six to eight minutes.
- [ ] Music/cues remain pleasant and audible on a physical phone; mute/background/pause stay quiet.

Tune `C.sleigh.stages[].deliveryWindow/speed/warning/spacing`, `tuning.playSeconds/doorEvery/lateDoorEvery/lateDamageAt/lateDamage/speedRise/spacingFall/ceilingDistance/ceilingSeconds`, and `patterns[].after/gap/kinds` in content.js. No other game's gameplay or trusted schedule changes.
