# Khaemenes Kinder Garden — Forensic Hardening Report v1.3.0

## Starting point

The uploaded Kinder Garden repository already contained a substantial 36-week
Kindergarten curriculum, formal weekly assessments, midterm/final, mentor
continuity, games, printables, and an 80% mastery model.

This pass preserves that work and repairs/wires the repository rather than
replacing it.

## Repairs completed

### Functional
- repaired the Week 4 invalid inline JSON/JavaScript fallback;
- repaired every genuine static relative-route error found in the audit;
- removed the missing `boppi.png` dependency by using an accessible text mascot;
- added the missing early-week `naib-mentor-adapter.js` and `lesson.js` compatibility seams;
- verified all operational JavaScript and inline scripts syntactically;
- verified zero broken relative routes.

### Academy / STOS
- established **Khaemenes Home** as the Academy gateway;
- added a same-origin Kinder Garden STOS bridge;
- family, enrollment, student and teacher-admin routes are internal;
- mentor requests route toward STOSCore → NAIB → Archaemenes / Wise Owl;
- assessment and daily evidence changes emit persistence events;
- Beta is internal and present on every HTML page;
- browser storage is treated as resilience/cache rather than canonical authority.

### Curriculum
- retained all 36 weeks and 180 daily lessons;
- daily objectives, teacher scripts, guided practice, independent practice,
  reflection, assessment and evidence are now distinct at lesson level;
- all thin formal weeks identified in the audit were strengthened with
  unit-specific five-day teacher/family notes;
- no week or assessment was removed.

### Mastery
The 80% threshold is unchanged.

The mixed evidence model is now explicit policy rather than an unexplained code
range:

- Weeks 1–4: foundation/orientation evidence;
- Weeks 5–25: strict five-day evidence sequence before weekly mastery;
- Weeks 26–36: synthesis/capstone weekly demonstration + portfolio evidence.

Participation evidence remains separate from mastery.

### Dependencies
- removed direct external fetch/import from learner runtime;
- weather/geocoding/astronomy now use internal STOS broker routes;
- removed remote Google audio/font runtime dependencies;
- internalized owned Academy/Verve N Veda navigation routes;
- preserved external science websites only as optional enrichment links;
- moved obsolete maintenance scripts to historical evidence;
- one GitHub Actions workflow remains active for validation only, not learner/runtime authority;
- CI Actions are SHA-pinned, checkout credentials are disabled after checkout, and token permissions are read-only;
- GitHub-hosted CI remains an explicitly acknowledged development-time third-party dependency, not part of the sovereign learner runtime.

## Verification summary

- ZIP input CRC: PASS
- formal weeks present: 36/36
- weekly formal assessments present: 36/36
- midterm: present
- final: present
- daily lessons: 180
- 80% mastery threshold: present
- mastery evidence tiers: explicit
- operational JS syntax errors: 0
- inline JS syntax errors: 0
- broken relative routes: 0
- Beta missing pages: 0
- direct external fetch/import: 0
- public Khaemenes Academy/Kinder Garden operational URLs: 0
- GitHub Actions operational authority: no
- Node maintenance operational authority: no

## Remaining external links

The remaining third-party domains are optional enrichment destinations such as
PhET, PBS Kids, NASA, National Geographic Kids, AMNH, Smithsonian and Science
Bob. They are hyperlinks only; they are not required for curriculum delivery,
mastery, mentor support, persistence, family identity, or Beta.

## Commissioning boundary

This repository is a **STOS-wired candidate**.

Canonical persistence and live mentor/Beta/weather services require the
corresponding internal STOS services to be commissioned. The browser gracefully
keeps resilience state when those services are temporarily unavailable.
