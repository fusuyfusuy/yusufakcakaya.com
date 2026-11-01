import type { APIRoute } from "astro";
import { SITE_DOMAIN } from "../config";

export const GET: APIRoute = () => {
  return new Response(`${SITE_DOMAIN}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
