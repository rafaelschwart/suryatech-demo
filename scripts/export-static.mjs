/**
 * Static export for GitHub Pages.
 *
 * Route handlers cannot be part of a static export, so src/app/api is parked outside the app tree for
 * the duration of the build and restored afterwards, whatever happens. The build runs with
 * STATIC_EXPORT=1 (output: "export", unoptimized images) and NEXT_PUBLIC_API_IN_BROWSER=1 (the desk
 * API is answered by the simulator in the browser; see src/lib/desk-api).
 *
 * Usage: npm run build:static  →  ./out
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const api = resolve(root, "src/app/api");
const parked = resolve(root, ".export-parked-api");
const require = createRequire(import.meta.url);

if (existsSync(parked)) {
  console.error(`Refusing to run: ${parked} already exists. Restore it to src/app/api first.`);
  process.exit(2);
}

// Copy then delete instead of rename: on Windows a directory rename fails while an editor or a file
// watcher holds a handle inside it, and a copy does not.
function move(from, to) {
  cpSync(from, to, { recursive: true });
  rmSync(from, { recursive: true, force: true });
}

rmSync(resolve(root, "out"), { recursive: true, force: true });
move(api, parked);
let status = 1;
try {
  const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_API_IN_BROWSER: "1" },
  });
  status = result.status ?? 1;
} finally {
  move(parked, api);
}

if (status === 0) {
  for (const file of ["CNAME", ".nojekyll", "index.html", "404.html"]) {
    if (!existsSync(resolve(root, "out", file))) {
      console.error(`Export finished but out/${file} is missing.`);
      status = 3;
    }
  }
}
process.exit(status);
