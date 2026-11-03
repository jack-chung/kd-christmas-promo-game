# Technical Plan

## Architecture
Static art-direction review hosted on GitHub Pages from `main:/docs`. No gameplay, server, analytics, accounts, or storage.

## Key Components
- `docs/index.html`: self-contained HTML/CSS/JS comparison gallery. Three columns on desktop, horizontally scrollable snap rows at widths up to 650px; image links open original PNGs.
- `docs/art-direction/assets/`: nine original portrait PNG screen mock-ups.
- `docs/art-direction/prompts.md`: common character/constraint brief plus each image's style and screen brief, generated with the built-in image_gen tool.

## Conventions
Keep the same screen content across directions. No licensed artwork, lyrics, script passages, or prohibited story spoilers. Names are isolated in prompts and concept images; production character sheets follow style selection.

## Environment
No package installation or build step. Local preview: `python3 -m http.server 4173 --directory docs`. GitHub Pages branch source is `main`, directory `/docs`. Preview only; this is not a gameplay launch.
