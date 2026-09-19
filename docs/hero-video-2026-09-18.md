# SuryaTech Higgsfield hero video

The user requested a production-quality Higgsfield video for the existing hero. The shared landing now plays a restrained product film at both `/dashboard/landing` and `/landing`, while preserving the original SuryaTech identity, headline and assessment action.

## Source and direction

- Higgsfield CLI, Seedance 2.5 image-to-video, high bitrate, 1080p, audio disabled.
- Reference: the selected Higgsfield product still, retained as `/media/landing-hero-higgsfield-v3.webp`.
- Generation job: `dd4154ea-b301-4599-af1c-ee0af36ad04f`.
- One slow lateral camera movement, consistent soft daylight, a rigid solar panel/cabinet/battery unit and a single docked handle and cable loop. No text or narrative audio in the film.
- Sampled frames were reviewed for product geometry, cable continuity, crop safety and lighting. A small background discontinuity at the raw loop boundary was smoothed in the delivery encode.

## Delivery

`/media/landing-hero-higgsfield-v4.mp4`: 1920 × 1080, 24fps, exactly 8 seconds, silent H.264/yuv420p with fast-start metadata, 2,557,333 bytes. The 18.1 MB HEVC master is retained in the private case workspace. Delivery uses a half-second cyclic blend and slight retiming to preserve an eight-second duration.

The video is a versioned self-hosted static asset. A still extracted from the finished video's first frame (`/media/landing-hero-higgsfield-v4-poster.webp`) remains underneath it, avoiding a double-image transition when playback starts. The approved v3 still continues to supply social preview metadata. The visible illustrative-concept label remains in place; the video is not evidence of a completed installation.

## Playback behavior

- A small client component attaches the source only when the hero is visible and playback is permitted.
- Playback is muted, inline and looping; video becomes visible only after a successful playing event.
- A 44px keyboard-accessible Pause/Play control appears after hydration. Manual Pause is preserved across scrolling and tab visibility changes.
- Offscreen and hidden-tab playback is suspended. Reduced-motion or data-saver visitors receive the still without an automatic video download; explicit Play opts into playback.
- Blocked autoplay preserves the poster and offers Play. Failed video requests preserve the still. Without JavaScript, the still and page content remain usable and no inert playback button appears.

## Verification

Focused local browser checks cover muted inline HD playback, keyboard controls, manual pause persistence, offscreen pause/resume, looping, runtime reduced motion, fresh reduced-motion/data-saver loads, explicit Play, blocked autoplay recovery, failed requests and JavaScript-disabled rendering. Local checks reported no page errors.

Generation JSON, master/delivery metadata, frame samples, loop-boundary images, playback review and live release evidence are retained under the case workspace's `hero-video/` directory. Publishing uses the existing GitHub Pages workflow and `suryatech.demo.arqentia.com` CNAME.
