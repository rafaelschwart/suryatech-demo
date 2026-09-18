# Higgsfield generation plan for the Response Desk

Everything that was planned, blocked or skipped for cost on 2026-09-14, compiled as an executable list.
Costs are the preflight figures from that day (Ultra plan): images 2 to 3 credits, a 5-second Seedance clip 32.5 credits.
Preflight 3D with `get_cost` before running; it was never quoted because the limit refused the call.

Source jobs already rendered (reuse as `medias[].value`, role `image_references` or `image` depending on the model):

| Asset | Job ID | Model |
|---|---|---|
| Charger cutout, transparent 2k | `75146596-632a-4bab-bc18-d574ba81ce2d` | gpt_image_2_5 |
| Energy-flow isometric diagram | `ab58bdd7-8b27-4dbc-ad7c-5afada8f2d1b` | nano_banana_pro |
| Site render, Lowell fuel forecourt | `56478b12-1f97-4d12-baed-20c080c278a4` | gpt_image_2_5 |
| Site render, municipal lot | `c3b56228-d941-429c-8c2b-0373ce391c3e` | gpt_image_2_5 |
| Site render, state park | `7f1e3071-d853-4555-b9f8-c56ce1285449` | gpt_image_2_5 |

Brand constants for every prompt: deep navy `#14284B`, gold `#F2A900`, soft greys, white. No text, letters or numbers inside any image.

## Tier 1 · Blocked last time, finish first (about 25 credits)

### 1. Charger 3D model (GLB)
- Tool `generate_3d`, model `tripo_h3_1_image_to_3d`
- `medias: [{ role: "image_references", value: "75146596-632a-4bab-bc18-d574ba81ce2d" }]`
- `texture: true`, `pbr: true`, `texture_quality: "detailed"`, `geometry_quality: "standard"`, `orientation: "align_image"`
- Save as `public/media/charger.glb`
- Lands: Stations screen, station stage. The stage probes for the file and switches to an interactive `model-viewer` (drag to rotate, auto-rotate) with no code change.

### 2. Process-flow isometric diagram
- Tool `generate_image`, model `nano_banana_pro`, `aspect_ratio: "21:9"`, `resolution: "2k"` (about 2 credits)
- Prompt: *Isometric 3D diagram on a clean white background of a five-step process arranged left to right on floating navy-blue platforms connected by a glowing gold path. Step one: a public notice board with a pinned document. Step two: a small radar dish scanning. Step three: seven stacked folder tabs being assembled into one binder. Step four: a sealed navy box with a gold seal. Step five: a hand placing that box into a slot in the facade of a small government building. Deep navy (#14284B), gold (#F2A900), soft greys and white. No text, no letters, no numbers, no words anywhere. Clean technical illustration, matte materials, soft shadows, product-visualization quality, wide panoramic composition.*
- Save as `public/media/process-flow.webp` (1800 px wide)
- Lands: Deadline board, above the "How the desk works" strip, as the illustration the strip labels. The strip stays; it carries the links to the sample documents.

## Tier 2 · The animations skipped for cost (65 credits for two)

Both are image-to-video on `seedance_2_5`, 5 seconds, `aspect_ratio: "16:9"`, muted, meant to loop. Pass the source job as `medias: [{ role: "image", value: <job> }]` (confirm the role with `models_explore action:get model_id:seedance_2_5`).

### 3. Energy-flow loop
- Source: `ab58bdd7-8b27-4dbc-ad7c-5afada8f2d1b`
- Prompt: *Locked camera, no camera movement. The gold energy path pulses slowly from the solar panel into the battery cabinet, from the cabinet into the charger, and from the charger into the white car, as soft light travelling along the tube. Sunlight on the solar panel shimmers gently. The small indicator on the charger glows. Everything else perfectly still. Seamless loop, clean white background, no text.*
- Save as `public/media/energy-flow-loop.mp4` (H.264, muted)
- Lands: Stations screen, "How the unit moves power" panel, replacing the still with a muted autoplay loop; the still stays as the poster frame.

### 4. Charger hero loop
- Source: `75146596-632a-4bab-bc18-d574ba81ce2d`
- Prompt: *The charging station stands still on a dark navy studio floor. A slow, soft light sweep moves across the brushed metal edges from left to right. The gold lightning emblem glows and fades gently. Faint gold particles rise slowly around the unit. Camera locked, no zoom, no rotation. Seamless loop, no text.*
- Save as `public/media/charger-loop.mp4`
- Lands: Stations screen, station stage, as the background layer of the tilt stage when the GLB is absent, and as the side panel of the login screen at `/auth/v1/login`.

## Tier 3 · Cheap stills that finish the set (about 10 credits)

### 5. Compliance calendar diagram
- `nano_banana_pro`, `16:9`, `2k`
- Prompt: *Isometric 3D diagram on a clean white background: a navy desk calendar block showing four quarter markers, beside it a stack of navy document folders with gold tabs, a small clock, and a gold ribbon seal on the top folder. A faint gold path links the calendar to the folders. Deep navy (#14284B), gold (#F2A900), soft greys and white. No text, no letters, no numbers, no words anywhere. Clean technical illustration, matte materials, soft shadows.*
- Save as `public/media/compliance.webp`. Lands: Evidence register, beside the SDP report clock.

### 6. Watcher diagram
- `nano_banana_pro`, `16:9`, `2k`
- Prompt: *Isometric 3D diagram on a clean white background: a small navy radar dish on a floating platform sweeping a soft gold beam across a wide public notice board pinned with blank white documents; one document lifts slightly and glows gold. Deep navy (#14284B), gold (#F2A900), soft greys and white. No text, no letters, no numbers, no words anywhere. Clean technical illustration, matte materials, soft shadows.*
- Save as `public/media/watcher.webp`. Lands: Opportunities screen, beside the watcher card.

### 7. Login hero
- `gpt_image_2_5`, `9:16` or `2:3`, `quality: "high"`, `resolution: "2k"`
- Prompt: *Realistic render, vertical composition, of a single navy-blue solar-and-battery EV fast charger with a gold lightning bolt emblem standing in a quiet New England municipal lot at dawn, tilted solar panel catching first light, mist over the trees behind, no power lines, no cars, no text, no signs with letters. Calm, cinematic, muted colors.*
- Save as `public/media/login-hero.webp`. Lands: `/auth/v1/login` side panel, replacing the template's placeholder.

### 8. Site renders at higher quality (optional, about 9 credits)
- Rerun the three site prompts on `gpt_image_2_5` at `quality: "high"`, `resolution: "2k"` and replace `site-lowell.webp`, `site-municipal.webp`, `site-park.webp`. Current cards use 1k medium renders, which are adequate at card size.

### 9. Social preview (optional, about 3 credits)
- `gpt_image_2_5`, `16:9`, then crop to 1200×630. The charger on navy with the gold bolt, no text. Save as `public/og.png` and reference it in `src/app/layout.tsx` metadata. Lands: link previews when the URL is shared.

## Budget

| Tier | Items | Credits, approximate |
|---|---|---|
| 1 | GLB, process diagram | 2 plus the 3D quote |
| 2 | Two 5-second loops | 65 |
| 3 | Three stills, optional upgrades and social | 10 to 22 |
| Total, everything | | about 80 to 110 |

## Run order

1. `balance`, then `get_cost` on the 3D job.
2. Tier 1, both items; drop the files in; reload `/dashboard/stations` and `/dashboard/overview`.
3. Tier 2, energy-flow loop first (it is the one visitors stare at). Review the clip before running the second.
4. Tier 3 as budget allows.

Every asset that lands on screen keeps the "Illustration" label. Nothing here is a photograph of a real Suryatech station.

## The quality cut, for a 3,210-credit balance

Spend on fidelity and on the few moving pieces a visitor actually watches, not on volume. About 700 credits; the rest stays in reserve for re-rolls.

| # | Piece | Model and settings | Credits |
|---|---|---|---|
| Q1 | Charger GLB, detailed geometry and textures | `tripo_h3_1_image_to_3d`, `geometry_quality: "detailed"`, `texture_quality: "detailed"`, `pbr: true`, `face_limit: 400000` | quote first |
| Q2 | Charger hero film, 10 s | `seedance_2_5`, `duration: 10`, 16:9, from the cutout job. Slow light sweep, glowing emblem, rising particles, locked camera, seamless loop | about 65 |
| Q3 | Energy-flow loop, 10 s | `seedance_2_5`, `duration: 10`, 16:9, from the diagram job. Energy pulses along the path, panel shimmer, locked camera, seamless loop | about 65 |
| Q4 | Three site ambient loops, 5 s each | `seedance_2_5`, from the three site jobs. Clouds drift, leaves move, light shifts, camera locked. Play muted on the station cards on hover | about 98 |
| Q5 | Opening film for the demo, 20 to 30 s, multi-shot | `kling3_0` multi-shot: dawn on the park site, the unit waking, the energy path, the board on a screen, the pack going out, hold on the wordmark. No narration, no on-screen text | about 130 to 200, run once, then re-roll only the weakest shot |
| Q6 | Four 4k stills | `nano_banana_pro` at 4k: process-flow (21:9), watcher (16:9), compliance (16:9), login hero (2:3 on `gpt_image_2_5`, `quality: "xhigh"`) | about 16 |
| Q7 | Site renders re-shot at 2k high | `gpt_image_2_5`, `quality: "high"`, `resolution: "2k"`, same three prompts | about 9 |
| Q8 | Social preview | `gpt_image_2_5`, 16:9, cropped to 1200 by 630 | about 3 |

File names the app already watches for, no code change needed when they land:

| File | Lights up |
|---|---|
| `public/media/charger.glb` | Station stage becomes a rotatable 3D model |
| `public/media/charger-loop.mp4` | Plays behind the tilt stage and behind the login panel |
| `public/media/energy-flow-loop.mp4` | Replaces the still in "How the unit moves power" |
| `public/media/process-flow.webp` | Appears above the five-step strip on the board |
| `public/media/watcher.webp` | Appears above the watcher on Opportunities |
| `public/media/compliance.webp` | Appears above the SDP clock on the Evidence register |
| `public/media/login-hero.webp` | Fills the login side panel |

Run order for the quality cut: Q1, Q3, Q2, Q6, then review, then Q5 and Q4 if the first pass holds. Every asset keeps the Illustration label on screen.
