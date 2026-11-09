# Sorting Office one ramp calibration

2026-11-08. Raw results: [six thousand seeded shifts](review/sorting-one-ramp-calibration.json). The deterministic controller is in `tests/helpers/sorting-player.js`. Cards are acknowledged without reading time; only active engine time counts. This measures a model, not physical-phone or child acceptance.

## Ramp

Start stage 1, two streets. All promotions require `ceil(stage.gifts × 1.8)` good sorts. Stage arrivals stay 5,200 / 4,200 / 3,300 / 2,800 / 2,400 / 2,000 / 1,650 / 1,300 ms. After stage 8 arrivals fall by 500 ms per stage to a 350 ms floor (stage 10), exceeding the old 450 ms floor. First three good gifts after each card retain the existing 5,200 ms warm-up. Mistakes have no speed relief. Stage rules, four-street card, Royal/decree cards, scoring, immediate parcel replacement, Quick/Rush/streak bonuses and five-oops end remain.

At 1,400 ±300 ms per decision, an error-free slower sorter meets Fragile at median 148.10 seconds. A fast adult taking 650 ±150 ms per decision ends at median 262.84 seconds with 99% accuracy (maximum 270.50), or 263.98 seconds with perfect accuracy (maximum 269.64). This puts the fast model under five minutes. The slower perfect model takes 471.92 seconds to end because promotions depend on sorted gifts, not time. At constant 80–85% accuracy most runs use their five oops before Fragile: the pacing target applies to players who survive the introductory stages.

## Medals

Final content thresholds: Bronze **2,000**, Silver **15,000**, Gold **200,000**. Each was measured without mistake relief.

The unchanged formula gives 12 immediate perfect sorts 2,140 points; 14 slower correct sorts also clear Bronze. With immediate parcel replacement, it takes seconds, not minutes. The suggested starting Silver 6,000 and Gold 15,000 took the perfect fast model only about 13 and 25 seconds. Silver now marks a sustained streak; Gold sits just before the fast model's queue overload. One occasional error resets the multiplier, making Gold demanding.

| Controller (1,000 seeds each) | Bronze wins | Silver wins | Gold wins | Median Bronze time among wins | Median Gold time among wins |
| --- | ---: | ---: | ---: | ---: | ---: |
| Random sack every 100 ms | 16 | 0 | 0 | 1.62s | — |
| 1,400 ±300 ms, 80% accurate | 647 | 3 | 0 | 22.50s | — |
| 1,400 ±300 ms, 85% accurate | 817 | 36 | 0 | 20.64s | — |
| 1,400 ±300 ms, perfect | 1,000 | 1,000 | 0 | 14.14s | — |
| 650 ±150 ms, 99% accurate | 1,000 | 999 | 20 | 6.68s | 259.10s |
| 650 ±150 ms, perfect | 1,000 | 1,000 | 1,000 | 6.64s | 258.14s |

All random shifts end by 2.52 active seconds; Bronze rate 1.6%, under the requested ~3%. The lower accuracy model represents independent mistakes, not learning or improving children. The perfect controllers identify mechanical timings and do not establish real player success rates.

## Acceptance conflict and phone checklist

The task requires Bronze=2,000, ~15 good sorts, unchanged scoring and a phone checklist saying Bronze takes a few minutes. These do not agree under the existing immediate replacement flow. No artificial wait or scoring change was introduced. User/planner acceptance or revised direction is needed for that checklist item.

- First shift feels gentle: check on a phone, including the unchanged practice and cards.
- Bronze takes a few minutes of real sorting: **not met**; expect a few dozen seconds for the trying-player models. Review that target explicitly.
- Gold is hard for an adult: try a full shift; the fast 99%-accurate model wins Gold in 2% of seeds.
