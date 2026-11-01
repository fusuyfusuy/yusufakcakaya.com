import siteConfig from "../site.config.json" with { type: "json" };

export const SITE_DOMAIN: string = siteConfig.domain;
export const SITE_ORIGIN: string = siteConfig.origin;
export type Locale = "tr" | "en";
export const LOCALES: readonly Locale[] = ["tr", "en"] as const;
