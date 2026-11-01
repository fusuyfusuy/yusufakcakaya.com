import type { APIRoute } from "astro";
import { SITE_DOMAIN, SITE_ORIGIN } from "../config";
import { CV_DATA } from "../data/cv";

export const GET: APIRoute = () => {
  const payload = {
    schema: "https://yusufakcakaya.com/cv.json#v1",
    domain: SITE_DOMAIN,
    origin: SITE_ORIGIN,
    generatedBy: "Astro Static Monograph Compiler",
    locales: {
      tr: CV_DATA.tr,
      en: CV_DATA.en,
    },
  };

  return new Response(JSON.stringify(payload, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
