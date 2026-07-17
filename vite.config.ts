// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Capacitor target: no server runtime — produce a purely static SPA bundle.
  nitro: false,
  tanstackStart: {
    // SPA mode: emit a static index.html shell (no per-route prerender crawl).
    // Capacitor's Android WebView serves this shell from webDir and the
    // TanStack Router hydrates client-side. Setting spa.prerender.outputPath
    // to "/" produces `index.html` at the root of the client output rather
    // than a nested `/index/index.html`, which is what Capacitor expects.
    spa: {
      enabled: true,
      maskPath: "/",
      prerender: {
        enabled: false,
        outputPath: "/index",
        crawlLinks: false,
        concurrency: 1,
        timeout: 5000,
      },
    },
    // Kill the global prerender pass — no route is prerendered at build time.
    prerender: { enabled: false },
    pages: [],
  },
  vite: {
    // Relative asset URLs are required when Android WebView serves files from
    // the Capacitor app bundle instead of a web server origin.
    base: "./",
    build: {
      // Flat output at dist/client so Capacitor (webDir: "dist/client") finds
      // index.html + assets/ at the WebView root.
      outDir: "dist/client",
      emptyOutDir: true,
      sourcemap: false,
    },
  },
});
