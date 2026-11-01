import type { APIRoute } from "astro";
import { SITE_ORIGIN } from "../config";

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_ORIGIN}/</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE_ORIGIN}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_ORIGIN}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />
  </url>
  <url>
    <loc>${SITE_ORIGIN}/en/</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE_ORIGIN}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_ORIGIN}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />
  </url>
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
