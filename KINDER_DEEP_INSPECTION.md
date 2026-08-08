# Khaemenes Kinder Garden — Deep Inspection & Curriculum Portal Repair

## Repository findings

The repository already has a strong curriculum foundation:

- 36 lesson-unit folders;
- 36 unit assessments plus weekly assessment hub, midterm, and final;
- 36 curriculum printable packets;
- a curriculum dashboard;
- curriculum record and certificate logic;
- 20 Kinder Garden applications;
- local learner continuity adapters;
- Crechè profile/catalog bridges.

## Problems found and repaired in this package

### 1. Teacher Tools route mismatch

The landing page and curriculum pages point to:

`curriculum/teacher-tools/index.html`

but the repository tree currently contains:

`teacher-tools/index.html`

The existing root Teacher Tools file was also written with relative paths that make sense *inside* `curriculum/teacher-tools/`, not at the repository root.

**Repair:** this package creates `curriculum/teacher-tools/index.html`, so the existing curriculum links, lesson links, assessment links, certificate links, and stylesheet references resolve consistently.

### 2. Missing Kindergarten-specific family portal

The shared Academy already has a master Family Profile, but Kinder Garden did not have its own curriculum-facing `family/index.html`.

**Repair:** this package adds a stage-specific Family Curriculum Portal that:
- reads the shared family registry;
- shows and switches local learner accounts;
- reads learner-scoped Kindergarten progress;
- shows the next open week;
- links the unit, printable, and weekly assessment;
- shows a matched Kinder Garden practice app;
- shows a matched age-appropriate Crechè companion;
- exports a combined local family + Kindergarten backup;
- links to the Academy master Family Profile for adult/permission management.

### 3. Games/apps were separate from the curriculum

The root page displayed 36 units, 20 Kinder apps, and Crechè apps as separate directories. The formal unit cards did not tell families which app was relevant to the lesson.

**Repair:** `assets/khaemenes-kinder-companions.js` now maps all 36 weeks to curriculum-appropriate practice. Both the root landing page and formal curriculum dashboard surface those companions *inside the weekly learning flow*.

The rule is explicit: **the unit is the lesson; the app is practice.**

### 4. Newly created Kinder profiles did not immediately synchronize back into the shared family registry

The landing page wrote the legacy/shared learner profile and the Kinder continuity record. The family adapter migrates that information when it loads, but a newly created profile could require a later reload before the shared registry reflected the change.

**Repair:** the updated landing page synchronizes the learner to the shared family registry immediately after a successful Kinder learner setup and refreshes learner/mentor views when family-registry events fire.

### 5. Mobile menu placement

The header sits below a utility strip at the top of the page while the mobile menu used a fixed top value.

**Repair:** the menu now measures the actual sticky-header bottom whenever it opens, scrolls, or resizes, reducing overlap on small screens.

### 6. Unit 01 stylesheet compatibility route

Unit 01 references `curriculum/assets/lesson.css`; that file is not present in the repository tree, while later units use `curriculum/assets/styles.css`.

**Repair:** this package adds a local `lesson.css` compatibility layer that inherits the existing curriculum stylesheet.

## Curriculum architecture after repair

```text
Family Portal
     ↓
Active learner → stable learner ID
     ↓
36-week Curriculum Dashboard
     ↓
Week 01 … Week 36
     ├── 5 daily lessons
     ├── printable packet
     ├── weekly assessment
     ├── matched Kinder Garden practice
     └── matched Crechè practice
```

The 80% completion/certification rules remain unchanged.

## Privacy boundary

The new files do not add advertising, third-party analytics, or a cloud learner database. Family and curriculum records remain browser-local under the existing Khaemenes continuity architecture. Cross-repository localStorage continuity still depends on opening the portals through the shared `vervenveda.com` origin.

## Files in this package

- `index.html`
- `assets/khaemenes-kinder-companions.js`
- `family/index.html`
- `curriculum/index.html`
- `curriculum/assets/companion-layer.js`
- `curriculum/assets/lesson.css`
- `curriculum/teacher-tools/index.html`
- `UPLOAD_MAP.md`
- `validation.json`
