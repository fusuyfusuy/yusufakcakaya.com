# yusufakcakaya.com — `YUSUF(1)` Personal Monograph & CV

Authoritative bilingual (`/` Turkish & `/en/` English) personal Curriculum Vitae, monograph, and `whoami` repository of **M. Yusuf Akçakaya (`@fusuyfusuy`)**.

## Architecture: 3-Ecosystem Scroll-Morphing & Velocity-Warp Monograph

The single-page document is structured into three distinct ecosystems that continuously morph in color space, typography, border geometry, and `Canvas2D` particle topology as the user scrolls:

1. **`[01] ACADEMIC` (The Ivory Monograph)** — Boğaziçi University MIS Ph.D., M.A. (*GPA 3.44/4.00*, Thesis on Agent-Based Modeling of Third-Party Enterprise Cybersecurity), B.Sc. (MITRE ATT&CK Sysmon/Wazuh HIDS), Research Assistantship, and Teaching Coordination.
2. **`[02] HACKER` (The Phosphor Terminal)** — Offensive & Cloud Security, Backend Architecture (`Aposto`, `Bitexen`, `Turkcell`, `PwC Turkey`, `BUCySec`, `Boğaziçi Computer Center`), CyberCamps (`Turkcell CyberCamp 2021 CTF 2nd Place`), and Open-Source Systems (`Mimori`, `Akatsuki`, `map.boun.edu.tr`, `bountools.com`).
3. **`[03] PERSONAL` (The Midnight Sanctuary)** — Handcrafted longform writing (`daginikmasa.com`), autonomous agent computational arena (`fusuycorp.com`), collaborative cultural sanctuary (`hepyeni.net`), languages (`TOEFL iBT 106`), and operating philosophy.

## Machine Endpoints & Print Fidelity

- `/` — Turkish Monograph
- `/en/` — English Monograph
- `/cv.json` — Structured bilingual machine-readable CV
- `/llms.txt` — LLM/Agent orientation summary
- `/sitemap.xml` & `/robots.txt` — Search & crawler indexing
- `Ctrl+P` / `@media print` — Collapses all dark/terminal chrome into a clean 1–2 page black-on-white academic/engineering PDF CV.

## Build & Verification Gate

```bash
pnpm install
pnpm build # Runs astro build && node tests/verify-build.mjs (must exit 0)
```
