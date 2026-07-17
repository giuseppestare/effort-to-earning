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
    // SPA mode with prerendering DISABLED. Prerender requires a headless
    // browser (Chromium) which is not available on Termux/Android build
    // environments and causes `vite build` to hang. We ship a hand-written
    // static index.html shell (public/index.html) instead, which the
    // client-side router hydrates in the Capacitor WebView.
    spa: {
      enabled: true,
      maskPath: "/",
      prerender: {
        enabled: false,
        outputPath: "/index",
      },
    },
    // Global prerender kill-switch: no route is prerendered at build time.
    prerender: { enabled: false },
    // Never crawl links / try to discover static paths — pure SPA.
    pages: [],
  },
  vite: {
    // Capacitor loads assets via the `file://` (or `https://localhost`) scheme
    // from the packaged WebView. Relative asset URLs are required — absolute
    // `/assets/...` paths resolve to the device root and 404.
    base: "./",
    build: {
      outDir: "dist/client",
      emptyOutDir: true,
    },
  },
});
