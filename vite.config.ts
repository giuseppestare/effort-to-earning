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
    // SPA mode: prerender a single static shell (index.html) that hydrates the
    // client-side router. Produces a fully static bundle in .output/public,
    // which is what Capacitor needs to package the app for Android.
    spa: {
      enabled: true,
      maskPath: "/",
    },
  },
});
