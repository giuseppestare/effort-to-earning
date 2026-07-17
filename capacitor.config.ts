import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.effortToEarning",
  appName: "Ore Lavoro",
  // TanStack Start's SPA build emits the client bundle + index.html into this
  // nested folder (server/ sibling contains no runtime code and is unused by
  // Capacitor). Point the WebView at the client-only subtree.
  webDir: "dist/client/client",
};

export default config;