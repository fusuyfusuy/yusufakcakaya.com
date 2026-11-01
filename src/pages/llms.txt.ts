import type { APIRoute } from "astro";
import { SITE_ORIGIN } from "../config";
import { CV_DATA } from "../data/cv";

export const GET: APIRoute = () => {
  const en = CV_DATA.en;
  const lines: string[] = [
    `# ${en.identity.fullName} (${en.identity.handle})`,
    "",
    `> ${en.identity.institution} · ${en.identity.role} · ${en.identity.degreeTrack}`,
    "",
    en.identity.summary,
    "",
    "## Canonical Routes & Machine Endpoints",
    `- Turkish Monograph (Root): ${SITE_ORIGIN}/`,
    `- English Monograph: ${SITE_ORIGIN}/en/`,
    `- Structured JSON CV: ${SITE_ORIGIN}/cv.json`,
    `- XML Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    "",
    "## [01] Academic (Education, Research & Teaching)",
    ...en.academic.education.map(
      (e) =>
        `- **${e.degree}** — ${e.institution} (${e.period})${e.gpa ? ` · GPA ${e.gpa}` : ""}${e.thesis ? ` · Thesis: "${e.thesis}"` : ""}`
    ),
    `- **${en.academic.appointment.role}** — ${en.academic.appointment.institution}, ${en.academic.appointment.department} (${en.academic.appointment.period})`,
    "",
    "## [02] Hacker (Experience, Security & Open-Source Systems)",
    ...en.hacker.experience.map(
      (x) => `- **${x.company} — ${x.role}** (${x.period}): ${x.summary}`
    ),
    ...en.hacker.camps.map(
      (c) => `- **${c.title}** (${c.organization}): ${c.distinction}`
    ),
    ...en.hacker.projects.map(
      (p) =>
        `- **${p.name}** (${p.category}): ${p.summary}${p.href ? ` [${p.href}]` : ""}${p.repoHref ? ` [${p.repoHref}]` : ""}`
    ),
    "",
    "## [03] Personal (Independent Venues & Languages)",
    ...en.personal.venues.map(
      (v) => `- **${v.name}** (${v.href}): ${v.description}`
    ),
    ...en.personal.languages.map(
      (l) =>
        `- **${l.language}**: ${l.proficiency}${l.certification ? ` (${l.certification})` : ""}`
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
