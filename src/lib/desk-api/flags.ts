/**
 * True when the app is built as a static site (GitHub Pages). The desk API is then answered by the
 * simulator running in the visitor's browser tab instead of by the Next.js route handlers.
 * Set at build time by scripts/export-static.mjs.
 */
export const API_IN_BROWSER = process.env.NEXT_PUBLIC_API_IN_BROWSER === "1";
