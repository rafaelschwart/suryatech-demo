# SuryaTech landing design system

Updated 2026-09-18. Applies to `/landing` and `/dashboard/landing`.

## Direction

A grounded, image-led industrial website in SuryaTech navy and gold. Use a split hero with clear copy on navy and an illustrative product scene alongside it. Subsequent sections alternate light surfaces, large application imagery and a navy project-planning section. Strong hierarchy and useful content provide the character.

This replaces the previous Growmodo-inspired specification. Mono eyebrows, figure-sheet borders, corner crosshairs, dotted drawing backgrounds and oversized decorative wordmarks are not design requirements.

## Color and logos

Use the actual logo assets at `/media/suryatech-logo.png` and `/media/suryatech-logo-light.png`, preserving their proportions. Define colors once in the scoped CSS module, then reference semantic variables.

| Token | Value | Use |
|---|---|---|
| `--st-navy` | `oklch(28.079% 0.06971 260.772)`; brand `#14284B` | Hero, project band, primary text |
| `--st-gold` | `oklch(78.489% 0.16385 77.582)`; brand `#F2A900` | Primary CTA, selected accents, municipal application |
| `--st-navy-deep` | `oklch(22% 0.058 260)` | Footer, text on gold, stronger hover states |
| `--st-paper` | `oklch(98.7% 0.003 255)` | Main light surface and light text |
| `--st-surface` | `oklch(96.1% 0.005 255)` | Secondary sections and product stage |
| `--st-muted` | `oklch(47% 0.025 260)` | Secondary text on light surfaces |
| `--st-line` | `oklch(87% 0.014 260)` | Decorative separators and grouping |
| `--st-control-line` | `oklch(62% 0.025 260)` | Visible form-control boundaries |
| `--st-light-muted` | `oklch(83% 0.021 255)` | Supporting copy on navy |

Use dark navy text on gold buttons. For the exact hexadecimal brand pair, contrast is approximately 7.28:1; white on gold is only 2.01:1. Avoid small gold text on light surfaces. Focus indicators use navy on light surfaces and gold within navy regions.

## Typography

- Display: Poppins, primarily weight 600, loaded through `next/font` with swap behavior. Use short headings with deliberate line breaks and balanced wrapping.
- Body: the existing Public Sans family, 16px baseline with approximately 1.65 line height.
- Headings use responsive scales and tight tracking; body text keeps comfortable measure and natural spacing.
- Eyebrows use the body family in small uppercase with restrained tracking. No extra mono family.
- Mobile body copy and form inputs remain readable; labels, captions and secondary metadata are subordinate without disappearing.

## Composition and spacing

- The landing is a scoped CSS-module surface rather than a new global dashboard theme.
- Container queries respond to the available landing width, including the narrower dashboard preview. The standalone route is the primary full-width presentation.
- Responsive gutters range from approximately 24px to 80px. Major desktop sections use approximately 76–116px vertical spacing; smaller layouts tighten the rhythm.
- Desktop hero is an approximately 47/53 copy/image split. Mobile stacks copy and image, retaining the proposition and assessment CTA before secondary content.
- Applications use one dominant photograph beside a smaller photograph and gold text panel. Do not normalize every section into identical cards.
- Product tabs sit beside a contained concept render. Source-backed proof uses concise linked articles instead of animated counters.
- Borders clarify component grouping. Mostly square controls and panels suit the industrial identity; do not add pill controls, glass effects or gradient typography.

## Imagery and product explanation

- Hero: `/media/landing-hero-higgsfield-v3.webp`, generated through Higgsfield product photoshoot using the existing charger cutout as a reference. Restrained daylight, navy cabinet, brushed metal and a single docked charging cable in a quiet architectural courtyard. Keep the complete canopy and base visible.
- Applications: `/media/site-commercial-v2.webp` and `/media/site-park-v2.webp`.
- System: `/media/charging-station-poster.png`, labelled as a concept rendering. Link to the existing interactive 3D concept instead of loading a second WebGL scene into the landing.
- Every illustrative site image has visible provenance and descriptive alternative text. Do not caption a concept as a completed customer installation.
- Reserve image dimensions/aspect ratios, prioritize the hero, and lazy-load lower imagery. Image crops should keep equipment recognizable at each breakpoint.
- The landing uses a static hero. Existing cinematic videos remain available in the project but do not drive the redesigned page.

## Interaction and accessibility

- Navigation includes a working mobile menu, an announced expanded state and Escape-to-close with focus restored to the toggle. Close the menu after choosing a destination.
- Provide a skip link, visible focus indicators, logical landmarks and a single page h1. Sticky navigation must not obscure anchor headings or focused controls.
- System tabs use tablist/tab/tabpanel semantics, selected states, arrow-key navigation and Home/End support. Selection updates the explanatory panel and render annotation.
- FAQs use native `details` and `summary` so disclosure behavior remains simple and keyboard accessible.
- The assessment form has explicit labels, native validation and clear required-field instructions. Its action is “Prepare assessment email”; explain that nothing is sent automatically. Announce the prepared state and retain a retry link.
- Prefer comfortable 44px or larger touch targets. Do not rely on hover alone or color alone for interactive meaning.
- Reduced motion disables entrance/hover movement and transitions. Important content is server-rendered and visible without scroll-triggered JavaScript.

## Implementation boundaries

`site-landing.tsx` remains the primarily server-rendered page composition. Navigation, system tabs and contact preparation are small client components. Keep landing CSS scoped. Reuse installed libraries and existing assets; avoid unnecessary dependencies and preserve `src/components/ui/`, calendar components, dashboard functionality and static-export compatibility.

Preview metadata remains `noindex`. Form behavior does not introduce data storage or automatic outbound messages. Source, privacy and prospect-sharing boundaries in `PRODUCT.md` continue to apply.
