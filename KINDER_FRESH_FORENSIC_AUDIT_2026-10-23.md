# Kinder Garden — Fresh Forensic Audit

Date: 2026-10-23  
Branch: `main`  
Scope: learner-scoped experience context, local learning activity history, formal-course validation coverage, end-to-end learner journey coverage, and 36-week instructional depth.

## Five additional bubbles

### 1. Stale Mentor context could outlive the active learner — FIXED

**Finding:** the shared Mentor-context cache is a derived snapshot, but the previous `syncContext()` only wrote when a learner context existed. When no active learner could be resolved, it left the prior snapshot in local storage. Its reader also returned the snapshot without confirming that its learner ID still matched the active learner.

**Repair:** `assets/khaemenes-kinder-experience.js` now clears the derived cache when no learner context exists and `getContext()` returns a snapshot only when its `learnerId` matches the active learner. Core family, enrollment, and mastery records are not deleted.

**Regression coverage:** tests verify that a prior learner's context is hidden for another learner and that the cache is removed when no learner is active.

### 2. Failed learning-activity writes were ignored — FIXED

**Finding:** `logActivity()` ignored the result of `writeJSON()` and immediately refreshed the derived Mentor context. Under storage quota or unavailable-storage conditions, this could leave the context updated without the corresponding activity-history record.

**Repair:** `logActivity()` now returns `false` when the activity record cannot be persisted and only refreshes context after a successful activity write. The learner-facing activity card announces the failure via an accessible status message and offers a clear option to continue without saving, rather than blocking the activity.

**Regression coverage:** tests simulate a storage failure and verify that context sync is not requested; the success case verifies the event is saved first.

### 3. Formal-gate workflow missed JavaScript syntax checks for some active client layers — FIXED

**Finding:** the formal-gate workflow syntax-checked the mastery engine and curriculum app, but did not syntax-check the root `assets/app.js` or the new experience and continuity layers.

**Repair:** `.github/workflows/kindergarten-formal-gate-rollout.yml` now runs `node --check` against `assets/app.js`, `assets/khaemenes-kinder-mastery-gates.js`, `curriculum/assets/app.js`, `assets/khaemenes-kinder-experience.js`, and `assets/khaemenes-kinder-continuity.js`.

**Verification boundary:** syntax checks prevent parse failures; they do not prove those scripts behave correctly together in a real browser.

### 4. Complete real-browser learner journey is not certified — OPEN

**Finding:** the repository's regression suite has strong isolated tests for mastery authority, learner-scoped storage, legacy migration, observation storage failure, and printables. The formal-gate workflow checks route coverage and local links. These do not replace a browser journey that signs into/selects a learner, switches between two learners, navigates previews/formal lessons, records evidence, revisits the Family Snapshot, and checks recovery after reload.

**Next action:** add a dedicated Playwright workflow using disposable test profiles to verify both children stay isolated across root home, curriculum, lesson, assessment, family snapshot, and certificate/print flow. Include a 255px viewport, keyboard-only navigation, reduced-motion preference, timer/reload recovery where applicable, and browser storage failures. Do not use a real child's records for the test.

**Status:** not yet certified by this code change.

### 5. Instructional-depth review is still in progress — OPEN

**Finding:** `curriculum/CURRICULUM_DEPTH_INVENTORY_2026-10-19.md` explicitly says its structural inventory is complete but pedagogical scoring across all 36 weeks remains in progress. It notes the teaching UI is not uniform, Weeks 1–4 use custom structures, and Weeks 31–36 do not include the exact phrase “independent practice.” The phrase count alone is not evidence of missing instruction.

**Next action:** complete the seven-dimension review from `curriculum/CURRICULUM_DEPTH_STANDARD.md` against all five days of all 36 weeks. Begin with Weeks 31–36 and the custom Weeks 1–4, inspect actual examples/tasks/teacher directions/printables/rubrics, and repair only verified gaps while preserving the 80% mastery authority and existing learner records.

**Status:** not yet certified by this code change.

## Protected invariants

- Formal Kindergarten advancement remains learner-scoped and requires at least 80% computed mastery plus any required core criteria and adult affirmation.
- Daily completion evidence does not independently qualify as weekly mastery.
- Legacy percentages do not unlock formal progression.
- Family Registry remains the learner identity/placement authority; Archaemenes remains the canonical Mentor; NAIB remains the navigation authority.
- Local browser storage is not cross-device cloud synchronization. Do not describe it as such.

## Verification

The code changes have triggered the repository's Kindergarten regression, formal-gate validation, and GitHub Pages deployment workflows. Use the live [Kindergarten Actions runs](https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions) to distinguish completed PASS results from runs still in progress. Do not call the full beta journey or 36-week pedagogical review certified until their specific open checks are completed.
