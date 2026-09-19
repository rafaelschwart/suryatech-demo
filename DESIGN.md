# Design system, landing surface

## Color strategy: Committed

Navy carries the hero and two bands (30 to 40 percent of the surface). Gold is the single accent: primary buttons, one rule, the emblem. Paper between the bands.

- navy: oklch(0.28 0.07 261) (#14284B)
- ink (deep navy): oklch(0.20 0.05 262) (#0E1A33)
- gold: oklch(0.79 0.16 78) (#F2A900)
- paper: oklch(0.97 0.004 80) (#f6f5f1)
- sand: oklch(0.94 0.012 80) (#f1ebe3)
- text: oklch(0.27 0.02 250) (#1f2a2e)
- muted text: oklch(0.50 0.01 250) (#5b5b5b)
- hairline: rgb(0 0 0 / 0.10)

No pure black or white as surfaces.

## Typography

- Display: Barlow Condensed 600/700, uppercase for the hero and band headlines, tight tracking. Industrial signage voice, in the family Array Technologies uses without copying it.
- Body: Public Sans 400/500. The typeface of Massachusetts and federal civic sites, which is who reads this.
- Scale: hero clamp(3rem, 8vw, 7.5rem); section headline clamp(2.25rem, 4.5vw, 4rem); body 1.0625rem; captions 0.8125rem. Ratio at least 1.25 between steps.
- Body line length 65 to 75 characters.

## Layout

- Full-bleed sections, no page container for photo rows. Text columns cap at 60ch.
- Asymmetric: hero copy bottom-left; product tiles offset; split rows alternate image side.
- Spacing scale: 8, 16, 24, 40, 64, 96, 128. Section padding clamp(4rem, 8vw, 8rem).
- Cards only for the product tiles (photo tiles with one word). No icon-title-text grids, no nested cards.

## Motion

- One page-load sequence on the hero (headline lines, then buttons). Sections reveal once on scroll. Ease-out quart. Reduced motion respected.
- No animation of layout properties.

## Bans

Side-stripe borders, gradient text, glass cards, hero metric templates, identical card grids, modals, em dashes.
