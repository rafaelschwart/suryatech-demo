# SuryaTech landing redesign — 2026-09-18

## Result and scope

The landing now presents SuryaTech as a solar, storage and EV-charging company through a clear split hero, practical system explanation, relevant applications and source-backed evidence. It is available for review at `/landing`, with the same composition retained at `/dashboard/landing`.

This is a proposed company website within the existing demo project. It does not replace `suryatechpower.com`, establish product specifications or authorize sharing with the prospect. Dashboard simulation capabilities remain separate from company claims.

## Reference research

The requested sites were scraped with Firecrawl CLI on 2026-09-18. Each returned HTTP 200 and supplied markdown and branding data:

| Reference | Firecrawl scrape ID | Retained research file |
|---|---|---|
| [Nextpower](https://nextpower.com/) | `01a0b769-646d-71ff-8978-65ab64e46cec` | `.firecrawl/landing-nextpower-2026-09-18.json` |
| [Terrasmart](https://www.terrasmart.com/) | `01a0b769-6567-76f8-a9fe-9a21c8b54732` | `.firecrawl/landing-terrasmart-2026-09-18.json` |
| [Array Technologies](https://arraytechinc.com/) | `01a0b769-639c-717a-852a-949f20e19b4a` | `.firecrawl/landing-arraytechinc-2026-09-18.json` |

These research paths refer to `C:\dev\case 012 - surya tech power`, not the public application bundle. Earlier screenshot captures also remain under that case's `research/raw/` directory.

Design takeaways: Nextpower's clear solution hierarchy; Terrasmart's confident product imagery and simple navigation; Array's industrial use of navy, gold and substantial image sections. Reference content, assets, customer claims and metrics were not adopted as SuryaTech content.

The UI/UX Pro Max search tooling was restored in the research workspace from the official `nextlevelbuilder/ui-ux-pro-max-skill` repository at commit `de5f12b400775997d213524ef02a7c7d2746806f`. Its design-system, accessibility, navigation, reduced-motion and typography outputs are retained under `landing-redesign/`. The generic cyan/green category palette was rejected in favor of the user's requirement to preserve SuryaTech's identity.

## Previous iterations reviewed

| Commit | Findings carried into this revision |
|---|---|
| `4dce0f7` — first landing draft | Kept the integrated-energy proposition and assessment action. Removed the generic feature grid and unsupported operating claims. |
| `d57a091` — LifeLabs reference | Kept the emphasis on product/site context. Replaced the rounded collage treatment with a more focused industrial composition. |
| `f9bee7e` — video, tokens and motion | Kept actual logo assets and brand intent. Replaced decorative autoplay media with a readable static opening. |
| `cce24d5` — solar-industry references | Kept stronger navy/gold contrast and substantial sections. Reduced repetition and removed promised timelines, performance and service features. |
| `425417b` — Growmodo section language | Kept the goal of explaining the system. Replaced the mono-label drawing-sheet identity with brand typography and an accessible component explorer. |

## Main changes

- Added a standalone website preview, preserving the embedded dashboard route for context.
- Restored Poppins headings, paired with existing Public Sans body text, and retained the actual SuryaTech navy/gold identity.
- Used a new Higgsfield product hero and the restrained v2 application imagery, with visible illustrative labels. Removed cinematic haze and tiny equipment as the primary opening impression.
- Added solar/storage/charging tabs with keyboard controls, a concept-render annotation and a link to the existing 3D demonstration.
- Replaced repeated benefits and comparison sections with asymmetric applications and a three-stage project-planning explanation.
- Replaced questionable patent/headcount/collaboration counters with linked VEH122 and MassCEC evidence.
- Replaced the inert newsletter with a labelled assessment-email preparation form. The form prepares a draft and explicitly sends nothing automatically.
- Added responsive navigation, native FAQ disclosures, skip/focus behavior, anchor offsets and reduced-motion styling.
- Kept the composition primarily server-rendered with focused interactive components. Updated `PRODUCT.md` and `DESIGN.md` to describe one consistent direction.

## Evidence reviewed

- [MassCEC announcement, July 30, 2024](https://www.masscec.com/press/masscec-awards-4-million-climatetech-companies): $91,000 awarded to test the hybrid solar EV charger and battery. Retained scrape: `.firecrawl/landing-masscec-evidence.md`.
- [VEH122 official guide](https://www.statewidecontractuserguide.mass.gov/CUG/Guide/VEH122): SuryaTech listing in categories 1 and 4, with current scope and purchasing requirements linked for buyers. Retained scrape: `.firecrawl/landing-veh122-evidence.md`.
- [Company brochure](https://ne-expo.com/_data/brochures/suryatech.pdf) and retained company-site evidence support the company overview and published founder contact.

The page does not claim completed installations, guaranteed output, one-day installation, trench-free work, multi-day battery autonomy, patent ownership, manufacturing origin, guaranteed compliance or production telemetry. Equipment and project conditions remain matters for assessment.

## Verification status

Completed during this documentation pass: read the implemented composition, CSS module, interaction components, contact component and both routes; checked the three Firecrawl scrape IDs/statuses; reviewed source evidence and five prior commits. Calculated contrast for the preserved hexadecimal navy/gold pair is approximately 7.28:1.

Browser review completed against the actual Next.js preview at `http://127.0.0.1:3002`:

- Both `/landing` and `/dashboard/landing` render correctly; all images load and internal section links resolve.
- Layouts at 320, 375, 390, 768, 1024, 1440 and 1920px have no horizontal overflow. The page also fits at 200% zoom.
- Keyboard skip link, system tabs (arrows, Home, End), native FAQ, mobile-menu Escape/focus restoration and sticky-header anchor offsets pass.
- Open mobile navigation hides when the viewport changes to desktop width.
- Form validation covers missing fields and whitespace-only required text. The generated email URL contains the correctly encoded project details, and changing a field clears an outdated prepared link. Verification prepared a draft in an isolated headless browser; no email was sent.
- Reduced motion presents static content, and social-image metadata resolves to the demo origin rather than localhost.
- No browser page errors or failing local HTTP responses occurred in the interaction pass.

Evidence and screenshots: `landing-redesign/verified/report.json`, `landing-redesign/verified/dashboard-preview.png`, `landing-redesign/verified/mobile-menu.png`, and `landing-redesign/after/` in the case workspace. This initial pass was a focused browser and code review. Publication was then explicitly requested; the release update below records that follow-up. No prospect outreach was performed.


## Higgsfield hero and demo release

The user requested a high-quality Higgsfield hero integrated into the Landing section at `suryatech.demo.arqentia.com`. The new image was created with the Higgsfield CLI product-photoshoot workflow and the existing `/media/charger-cutout.webp` reference. Two initial courtyard concepts were rejected after reviewing ambiguous charging-cable connections. The selected refinement shows one docked handle and one hanging cable loop, with restrained daylight and the SuryaTech navy/silver product silhouette. It is labelled as an illustrative concept.

- Selected Higgsfield job: `881b22c4-d355-49cd-8250-0550dcf431c9`.
- Deployed asset: `/media/landing-hero-higgsfield-v3.webp`, 1920 × 1086, 265,622 bytes. Three generated candidates consumed 19.5 Higgsfield credits.
- Shared hero appears at `/dashboard/landing` and `/landing`; the standalone social preview uses the same image.
- Removed the extra image headline so it does not cover the battery base on mobile. Added scrolling to the mobile navigation for short landscape viewports.
- Release uses the existing GitHub Pages workflow and existing CNAME; DNS configuration does not change. Production build and deployment results are recorded by the workflow for the release commit.

Generation results, originals, local desktop/mobile captures and release verification evidence remain in the case workspace under `landing-redesign/`. Only the optimized selected image ships in the public application.
