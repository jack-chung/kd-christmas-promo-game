# Sleigh Revision 3 calibration — 2026-11-06

Reproduce through `npm test`; deterministic human controller in `tests/helpers/sleigh-player.js`. Raw twenty-seed runs, full event timelines, five perfect-reaction runs and collision sweeps: [calibration JSON](review/sleigh-calibration.json).

The human controller waits 250 ms ±100 ms after seeing a hazard, varies hop timing ±100 ms, and varies delivery tap timing ±100 ms. It does not read future spawns. Cards pause active time. The delivery-only jitter controller also tests five runs with perfect hazard reactions against the numerical ceiling.

## Short-hop phone follow-up — 2026-11-06

The user found the Revision 3 tap still too high and floaty for doorstep delivery. Its 75.67-unit peak and 0.967-second flight are superseded below. A normal press also used to receive hold lift immediately, extending it beyond the released-tap figures.

Tap impulse 370/gravity 1150: peak **58.75 units**, flight **0.642 s** — 22% lower and 34% shorter than the previous released tap. No extra hold lift during the first **140 ms**. Presses released at 0, 50, 100 and 130 ms produce identical peaks and landings. A deliberate hold reaches 130.23 in 1.075 s; released double at 280 ms reaches 145.10 in 1.175 s. All three hops are shorter than Revision 3; only hold/double clear snowman 100. Tap remains below house roofline 125.

Low obstacles now judge the cart centre against their full visible width, allowing the trailing wheels to settle without another hit. Fence clearance stays 32; the visibly lower toboggan uses 20. This intentional landing forgiveness replaces the prior full wheel/body horizontal collision for these two low hazards; gap, snowman and garland retain the full 44-unit footprint. Road sprites keep their readable dimensions. Without this forgiveness, shortening the arc would make low-obstacle timing unnecessarily strict. Actual collision sweeps and no-Bronze mash checks remain enforced.

The take-off road marker automatically moves closer to the door using the shorter flight. The gold-step windows remain 0.30→0.18 s, so the player sees the house closer to landing rather than needing a long airborne lead. The Chrome/WebKit pointer test holds for a realistic 100 ms and verifies a centred perfect delivery. Rolling, outside-step landings and misses retain their existing rules.

## Measured windows

Sweeps use actual collisions at 240 Hz, 5 ms input increments and full visible obstacle widths. Fence/toboggan are released taps; gap is hold; snowman is hold plus second hop at 300 ms. Guided speed 180 (+12 moving): fence 0.250 s; toboggan 0.200 s.

| Stage | Speed | Fence tap | Toboggan tap | Pothole hold | Snowman double | Door tap window |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 190 | 0.265 s | 0.220 s | 0.275 s | 0.705 s | 0.300 s |
| 2 | 196 | 0.275 s | 0.230 s | 0.300 s | 0.720 s | 0.300 s |
| 3 | 204 | 0.285 s | 0.245 s | 0.330 s | 0.735 s | 0.300 s |
| 4 | 210 | 0.290 s | 0.250 s | 0.350 s | 0.750 s | 0.280 s |
| 5 | 220 | 0.305 s | 0.265 s | 0.380 s | 0.765 s | 0.260 s |
| 6 | 232 | 0.315 s | 0.280 s | 0.415 s | 0.785 s | 0.240 s |
| 7 | 248 | 0.330 s | 0.300 s | 0.455 s | 0.810 s | 0.220 s |
| 8 | 264 | 0.330 s | 0.315 s | 0.495 s | 0.835 s | 0.180 s |

Middle 34% of the gold step gives 50 bonus points; delivered count remains the record/medal measure. Take-off line fades across four deliveries. Misses consume no gift. Door approach stays clear except in the named late pattern.

## Human simulation (20 seeds, recalibrated for shorter hop)

The controller centres low-obstacle taps on the new arc while retaining 250 ms ±100 ms observation/reaction delay and ±100 ms tap/delivery jitter. It reads only current road objects.

- Bronze: median 99.66 s; 20/20 earn it.
- Silver: median 216.78 s; 20/20 earn it.
- Gold: median 375.07 s; 20/20 earn it.
- Run end: median 473.00 s; range 427.67–510.23 s.
- Door hit rate: 93.67% (previous 79.96%).
- Longest empty road: 1.242 s.

These simulations are calibration evidence, not physical-phone or child acceptance. Five perfect-reaction/jittered-delivery runs end by 575.37 s.

## Example seed 1 timeline

| Lesson | Start | Play starts |
| --- | ---: | ---: |
| 1 | 0.00 s | 3.95 s |
| 2 | 23.50 s | 26.42 s |
| 3 | 45.43 s | 50.12 s |
| 4 | 68.13 s | 74.90 s |
| 5 | 93.86 s | 98.58 s |
| 6 | 117.54 s | 121.56 s |
| 7 | 140.54 s | 144.77 s |
| 8 | 163.50 s | Combinations |

Two guided successes then 18-second learned-element play stretches remain unchanged. Last lesson/play ends around 2:44. Patterns still unlock at +0, +25, +50, +75, +100 and +150 seconds after lessons; doors recur every 22 seconds during teaching/play, 15 after lessons. Late speed/spacing/warning pressure and the 200,000-unit/570-second numerical ceiling remain unchanged. No timer ends the run.

## Phone review checklist

- [ ] A tap clears a fence but cannot clear a snowman; a double hop does.
- [ ] The lower hop feels brisk and the take-off line makes doorstep timing readable.
- [ ] Miss advice and the perfect sparkle explain the result; a roll gives no delivery.
- [ ] Play between lessons is fun; combinations and tightening late choices keep attention.
- [ ] Bronze in a few attempts, Silver around four minutes, Gold around six to seven; strong adult around six to eight minutes.
- [ ] Music/cues remain pleasant and audible on a physical phone; mute/background/pause stay quiet.

Tune `C.sleigh.stages[].deliveryWindow/speed/warning/spacing`, `tuning.playSeconds/doorEvery/lateDoorEvery/lateDamageAt/lateDamage/speedRise/spacingFall/ceilingDistance/ceilingSeconds`, and `patterns[].after/gap/kinds` in content.js. No other game's gameplay or trusted schedule changes.
