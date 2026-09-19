# Design system, landing surface (revised 2026-09-18 after growmodo.com)

## Color strategy: Restrained on paper, committed ink bands

Paper surfaces carry the page; navy ink carries the problem band and the footer; gold is the only signal (drawings, active steps, one label). No pure black or white as surfaces.

- paper: #f5f3ec · paper-soft: #faf8f2 · paper-2: #edeae0 · paper-3: #e2dfd5
- ink: #0e1a33 · ink-2: #16213b · ink-mute: #4b5468 · ink-fade: #8a8f9c
- signal: #F2A900 · signal-deep: #c98c00 · beacon: #14284B
- rule: rgb(14 26 51 / 0.10) · rule-strong: rgb(14 26 51 / 0.22)

## Typography

- Display and body: Geist. Display weight 500, tracking -0.02em. Body 400, 1rem / 1.55.
- Labels: JetBrains Mono, 0.6875rem, tracking 0.06em, uppercase. Used for eyebrows, captions, figure notes, drawing labels, roles.
- Scale: display-xxl clamp(2.75rem, 7vw, 6.75rem) / 0.98; display-xl clamp(2.25rem, 4.5vw, 3.75rem) / 1.08; h2 2rem / 1.12; lead 1.375rem / 1.32; small 0.875rem / 1.5.

## Layout

- Container 1320px, padding 64px at desktop, 20px at phone.
- Section padding 80 to 128px. Every section starts on a hairline rule. Eyebrow with a 10px square mark above each headline.
- Radius 4px on controls, 6 to 8px on panels. Corner crosshairs on drawing panels.
- Sequences are numbered 01 to 04 with a signal rule over the completed steps.

## Drawings

- Technical drawings, not renders: isometric line work, white faces, hairline ink strokes, mono labels on the objects, dotted sheet, FIG. and SHEET captions. One signal color for flows and leaders. Reduced motion stops the dashed flow.

## Motion

- One hero sequence on load, sections reveal once on scroll with a safety timer. Ease-out quart. No layout properties animated.

## Bans

Side-stripe borders, gradient text, glass cards, hero metric templates, identical icon-card grids, modals, em dashes, renders where a drawing is meant.
