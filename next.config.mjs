/**
 * STATIC_EXPORT=1 builds the site as static HTML for GitHub Pages (scripts/export-static.mjs sets it).
 * Without it the app runs as a normal Next.js server with the /api route handlers.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  ...(staticExport ? { output: "export", images: { unoptimized: true } } : {}),
};

export default nextConfig;
