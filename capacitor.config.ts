import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.effortToEarning",
  appName: "Ore Lavoro",
  // TanStack Start (SPA mode, nitro disabled) emits the fully-static site here.
  webDir: "dist/client",
};

export default config;