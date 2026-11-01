#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

let passed = 0;

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    process.exit(1);
  }
}

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

console.log("=== YUSUF(1) DETERMINISTIC BUILD VERIFICATION GATE ===");

// 1. Required static artifacts exist and are non-empty
const requiredArtifacts = [
  "index.html",
  "en/index.html",
  "cv.json",
  "llms.txt",
  "robots.txt",
  "sitemap.xml",
  "CNAME",
];

check("1a. All required static artifacts exist in dist/", () => {
  assert.ok(fs.existsSync(DIST), "dist/ directory does not exist");
  for (const rel of requiredArtifacts) {
    const abs = path.join(DIST, rel);
    assert.ok(fs.existsSync(abs), `Missing artifact: dist/${rel}`);
    const stat = fs.statSync(abs);
    assert.ok(stat.size > 0, `Empty artifact: dist/${rel}`);
  }
});

// 2. Domain single-source invariant
const siteConfig = JSON.parse(
  fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8")
);

check("1b. CNAME and canonical origin match site.config.json", () => {
  const cname = fs.readFileSync(path.join(DIST, "CNAME"), "utf8").trim();
  assert.equal(cname, siteConfig.domain);
  assert.equal(siteConfig.domain, "yusufakcakaya.com");
  assert.equal(siteConfig.origin, "https://yusufakcakaya.com");
});

// 3. Bilingual cv.json structural & item-count parity
const cvJson = JSON.parse(
  fs.readFileSync(path.join(DIST, "cv.json"), "utf8")
);

check("2a. Bilingual TR/EN structural parity in /cv.json", () => {
  const { tr, en } = cvJson.locales;
  assert.ok(tr && en, "Both tr and en locales must exist in cv.json");

  assert.equal(
    tr.identity.contacts.length,
    en.identity.contacts.length,
    "Contact link count mismatch"
  );
  assert.equal(
    tr.academic.education.length,
    en.academic.education.length,
    "Education count mismatch"
  );
  assert.equal(
    tr.academic.appointment.coursesAssisted.length,
    en.academic.appointment.coursesAssisted.length,
    "Courses assisted count mismatch"
  );
  assert.equal(
    tr.academic.interests.length,
    en.academic.interests.length,
    "Interests count mismatch"
  );
  assert.equal(
    tr.hacker.experience.length,
    en.hacker.experience.length,
    "Experience count mismatch"
  );
  assert.equal(
    tr.hacker.camps.length,
    en.hacker.camps.length,
    "CyberCamps count mismatch"
  );
  assert.equal(
    tr.hacker.projects.length,
    en.hacker.projects.length,
    "Projects count mismatch"
  );
  assert.equal(
    tr.hacker.skills.length,
    en.hacker.skills.length,
    "Skill group count mismatch"
  );
  assert.equal(
    tr.personal.venues.length,
    en.personal.venues.length,
    "Personal venues count mismatch"
  );
  assert.equal(
    tr.personal.languages.length,
    en.personal.languages.length,
    "Languages count mismatch"
  );
});

// 4. 3-Ecosystem DOM markers & bilingual HTML integrity
const trHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const enHtml = fs.readFileSync(path.join(DIST, "en/index.html"), "utf8");

check("3a. Both / and /en/ render all 3 ecosystems (#academic, #hacker, #personal) & canvas", () => {
  for (const [label, html] of [
    ["TR (/)", trHtml],
    ["EN (/en/)", enHtml],
  ]) {
    assert.ok(
      html.includes('id="ecosystem-canvas"'),
      `${label} missing #ecosystem-canvas`
    );
    assert.ok(
      html.includes('id="academic"') &&
        html.includes('data-ecosystem="academic"'),
      `${label} missing #academic ecosystem section`
    );
    assert.ok(
      html.includes('id="hacker"') && html.includes('data-ecosystem="hacker"'),
      `${label} missing #hacker ecosystem section`
    );
    assert.ok(
      html.includes('id="personal"') &&
        html.includes('data-ecosystem="personal"'),
      `${label} missing #personal ecosystem section`
    );
  }
});

check("3b. Canonical, hreflang, and JSON-LD Person schema present in both locales", () => {
  assert.ok(
    trHtml.includes('<link rel="canonical" href="https://yusufakcakaya.com/"'),
    "TR canonical link missing or invalid"
  );
  assert.ok(
    enHtml.includes(
      '<link rel="canonical" href="https://yusufakcakaya.com/en/"'
    ),
    "EN canonical link missing or invalid"
  );

  for (const [label, html] of [
    ["TR", trHtml],
    ["EN", enHtml],
  ]) {
    assert.ok(
      html.includes('hreflang="tr" href="https://yusufakcakaya.com/"'),
      `${label} missing hreflang="tr"`
    );
    assert.ok(
      html.includes('hreflang="en" href="https://yusufakcakaya.com/en/"'),
      `${label} missing hreflang="en"`
    );
    assert.ok(
      html.includes('hreflang="x-default" href="https://yusufakcakaya.com/"'),
      `${label} missing hreflang="x-default"`
    );

    const ldMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );
    assert.ok(ldMatch, `${label} missing JSON-LD script block`);
    const parsedLd = JSON.parse(ldMatch[1]);
    assert.equal(parsedLd["@type"], "Person");
    assert.equal(parsedLd.name, "M. Yusuf Akçakaya");
  }
});

check("3c. Verbatim CV credentials present in compiled pages", () => {
  const requiredTokens = [
    "M. Yusuf Akçakaya",
    "AGENT BASED MODELING OF THIRD-PARTY ENTERPRISE CYBERSECURITY",
    "3.44 / 4.00",
    "Aposto",
    "Bitexen",
    "Turkcell",
    "PwC Turkey",
    "Mimori",
    "Akatsuki",
    "map.boun.edu.tr",
    "Wazuh",
    "daginikmasa.com",
    "fusuycorp.com",
    "106",
  ];
  for (const token of requiredTokens) {
    assert.ok(trHtml.includes(token), `TR HTML missing verbatim token: ${token}`);
    assert.ok(enHtml.includes(token), `EN HTML missing verbatim token: ${token}`);
  }
});

// 5. Privacy Gate: Phone number redaction across all dist/ files
check("4a. Privacy gate: phone number never leaks into dist/ artifacts", () => {
  const allDistFiles = walkFiles(DIST);
  const bannedPatterns = [/554\s*656/, /656\s*61\s*94/, /\+90\s*554/];
  for (const file of allDistFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const pat of bannedPatterns) {
      assert.ok(
        !pat.test(content),
        `Phone number leaked in ${path.relative(ROOT, file)}`
      );
    }
  }
});

// 6. Accessibility CSS gate
check("5a. prefers-reduced-motion rules exist in compiled CSS/HTML", () => {
  const allDistFiles = walkFiles(DIST).filter(
    (f) => f.endsWith(".css") || f.endsWith(".html")
  );
  const combinedCssAndHtml = allDistFiles
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");

  assert.ok(
    combinedCssAndHtml.includes("prefers-reduced-motion"),
    "Compiled output missing prefers-reduced-motion rules"
  );
});

console.log(`\nALL ${passed} VERIFICATION BATTERIES PASSED (EXIT 0).`);
