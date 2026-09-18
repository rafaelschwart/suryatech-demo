# Dashboard visual refresh — 2026-09-17

The previous isometric radar, floating folders, gold energy tubes and product-video overlays added visual noise and pushed the working tables below the first screen. This pass keeps the existing SuryaTech theme and dashboard functionality while giving each visual a specific purpose.

## Changes

- Overview: replaced the large process render and floating icon tiles with a compact five-step workflow; all sample-document links remain.
- Opportunities and Evidence: removed decorative illustration banners so search, amendments, reporting dates and evidence tables appear earlier.
- Stations: added three consistent, realistic site-context images. Each is explicitly illustrative and is not evidence of a deployed station or its hardware.
- Power distribution: replaced the fixed illustration/video with a native schematic and readings from the selected station. Battery direction follows the simulator's sign convention. Motion stops under reduced motion. On narrow phones the readable values and flow explanation take priority over the detailed drawing.
- Login: one restrained infrastructure image, a quiet overlay and task-specific copy replace the stacked image/video hero.
- Concurrent API migration and new station engineering model were preserved. `station-stage.tsx` and `station-model.ts` were not changed by this pass.

## Higgsfield asset record

Generated using the installed Higgsfield CLI 1.1.25, model `gpt_image_2_5`, `quality=high`, `resolution=2k`, opaque background. Three landscape images and one 2:3 portrait. Quoted cost: 3 credits each, 12 total. Four jobs submitted once; no rerolls.

| Runtime asset | Job ID |
| --- | --- |
| `public/media/site-commercial-v2.webp` | `6f15bbec-041d-4a39-a898-60f668b43f9b` |
| `public/media/site-municipal-v2.webp` | `97d238b3-fd55-44a4-bfac-e5c63744bb92` |
| `public/media/site-park-v2.webp` | `bca440a1-0c19-4af9-8ca0-7e00fb484ea4` |
| `public/media/login-infrastructure-v2.webp` | `1971c402-3f4a-4a92-92b4-81f1b61497ff` |

Images were inspected and encoded as WebP, maximum 1800 pixels per side, quality 86. The original generated PNGs, exact prompts, job responses, before/after screenshots and code backups are retained in `C:\dev\case 012 - surya tech power\dashboard-visual-review\`. Prior media assets were retained for rollback, but removed from the refreshed page compositions.

## Review

Reviewed the actual app at `http://127.0.0.1:3002`. The first probe on port 3000 was another application and was not treated as dashboard evidence.

- Overview, Opportunities, Evidence, Stations and Login return HTTP 200 with no browser page errors.
- New station images load; login hero visually inspected.
- Station selection updates the panel; simulated power check and opportunity-search replay still work.
- Dark theme and reduced-motion behavior reviewed.
- Overview and Stations reviewed at 390-pixel mobile width with no horizontal page overflow.

This was a focused browser review, not a production build or whole-repository lint run. No publication or deployment was performed.
