import { defineConfig } from "astro/config";
import siteConfig from "./site.config.json" with { type: "json" };

export default defineConfig({
  site: siteConfig.origin,
  output: "static",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  server: {
    allowedHosts: true,
  },
});
