# Khaemenes Kinder Garden — Forensic Remediation Log

**Date:** 2026-10-22  
**Branch:** `main`  
**Scope:** Follow-through on the ten-item source-level audit supplied for `Khaemenes_KinderGarden.github.io`.

This log separates confirmed source changes and CI checks from live STOS deployment verification, which requires an explicitly configured base URL.

## Findings and disposition

### 1. Formal dependency-boundary validation
**Status: repaired; formal validation passed.**

Copied the owned ecosystem assets into this repository:
- `assets/khaemenes-global-header.css`
- `assets/khaemenes-global-header.js`
- `assets/vnv-ecosystem-menu.css`
- `assets/vnv-ecosystem-menu.js`

Changed the eight affected pages to local relative references: home, curriculum index, mastery, teacher tools, family, portfolio builder, social studies, and root teacher tools. The dependency-boundary validator then passed with no unapproved remote runtime resource tags. The formal workflow also passed on commit `c1e37efb5d05962b62ee50865405a2efc89c4a98`.

### 2. Legacy lesson aliases
**Status: repaired and covered by CI.**

All 36 root-level `lessons/unit-XX/index.html` aliases now use a self-contained, noindex redirect to `../../curriculum/lessons/unit-XX/index.html`, with meta-refresh and JavaScript fallbacks, preservation of query/hash, and a visible manual link if scripting is unavailable. They do not write or migrate learner records.

The route validator checks the redirect marker, target URL, and query/hash preservation for all 36 units.

### 3. Legacy assessment aliases
**Status: matcher and route-presence checks passed; direct browser verification remains open.**

The shared mastery router recognizes the root-level unit assessment aliases and the legacy weekly hub, midterm, and final routes, and sends them through the current learner-scoped mastery gate rather than directly awarding scores. The validator confirms all 36 old and canonical assessment paths exist and checks that the router contains these route patterns. The gate's runtime assets still depend on the STOS mount; that mount is not yet live-verified in this log.

### 4. Legacy progress migration
**Status: repaired and covered by regression tests.**

The continuity bridge no longer automatically copies an unowned legacy record into a different learner's scoped record. Matching learner IDs may be copied. Unowned historical records remain untouched until an adult-confirmed import; conflicting ownership and already-present scoped progress block migration.

### 5. Portfolio learner isolation
**Status: repaired and covered by regression tests.**

The portfolio builder now uses learner-specific storage keys. The legacy shared portfolio remains untouched and is never silently loaded into a selected learner's portfolio. Imports compare owner IDs, same-origin scans skip non-matching/unowned sources, exports carry the learner ID, and saving pauses if the active learner changes.

### 6. Formal mastery in family summaries
**Status: repaired and covered by regression tests.**

The continuity summary calculates formal completion and averages from qualified, learner-scoped mastery receipts. Raw legacy scores remain available as history but are not counted as mastered outcomes. Midterm/final mastery and portfolio status come from the formal mastery authority.

### 7. Optional family observation saves
**Status: repaired and covered by regression tests.**

The experience storage writer returns failure when localStorage is missing, disabled, or throws. Observation save propagates a failed write before context sync and rendering, and the interface says “Not saved — retry” rather than displaying success.

### 8. Continuity persistence failures
**Status: canonical save/clear checked; tests added.**

The canonical learner-scoped write is checked by `saveCurriculumState`; failed writes return `false` instead of a saved-looking state. `clearActiveCurriculumRecord` checks the canonical write and removal results. Regression tests simulate write failures and confirm the prior persisted record stays intact.

### 9. Essential mastery criteria
**Status: repaired and covered by regression and formal validators.**

`recordWeekEvidence` and `recordMilestoneEvidence` no longer default `essentialSatisfied` to true. Only an explicit Boolean `true` qualifies a result. The numeric 80% threshold remains unchanged, but a raw 80% or higher score with omitted/failed essential criteria cannot qualify mastery.

### 10. STOS route readiness
**Status: static classification implemented; live probe pending.**

Added `contracts/STOS_DEPLOYMENT_REQUIREMENTS_v1.json`, a static route classifier, and `scripts/validate-stos-deployment-readiness.mjs`. The regular formal workflow classifies literal `/stos/` references as required or optional. Unknown references fail the static audit. A separate manual workflow, `.github/workflows/stos-deployment-readiness.yml`, requires the repository variable `STOS_DEPLOYMENT_BASE_URL` and probes required pages/assets without submitting learner data.

The live readiness check has **not** been completed because `STOS_DEPLOYMENT_BASE_URL` is not configured in the checked environment. Do not label STOS commissioned or live-verified until the manual workflow passes against the intended deployment origin.

## Automation results checked

- **Kindergarten Regression:** passed on commit `7f0d028a8bf870efccab3e9b34f79dd0b2f34ed0`, including isolated mastery tests, legacy migration, portfolio scope, observation storage-failure handling, and printable packet checks.
- **Kindergarten Formal Gate Validation:** passed on commit `c1e37efb5d05962b62ee50865405a2efc89c4a98`, including route coverage, static STOS classification, dependency-boundary checks, mastery-contract validation, and whitespace checks.
- **Pages deployment:** still in progress when this log was prepared: [run 39869446670](https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions/runs/39869446670). The route/formal validator passing is not the same as confirming the latest Pages deployment finished successfully.

## Remaining acceptance work

1. Confirm the latest Pages build/deployment succeeds.
2. Configure `STOS_DEPLOYMENT_BASE_URL` as an Actions repository variable, then manually run `STOS Deployment Readiness (Manual)`.
3. In real browsers, test legacy lesson and assessment entry links, two learner profiles on one device, portfolio import/export, local-storage quota/unavailable cases, keyboard flow, and screen-reader feedback.
4. Keep the release classified as a **STOS-wired candidate** until required live STOS route probes and hands-on learner flows pass.

No learner records were intentionally migrated, overwritten, or cleared by these code changes.
