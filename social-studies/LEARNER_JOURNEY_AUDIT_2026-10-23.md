# Khaemenes Academy Social Studies · Kindergarten–Grade 5 Learner-Journey Forensic Audit
## 2026-10-23

### Scope
This audit used synthetic test learner IDs only. No real learner records were modified.

For each Social Studies course from Kindergarten through Grade 5, the regression journey exercised:
1. Academy learner-scoped record creation/selection.
2. Two isolated test learners (A and B).
3. Week 1 failed attempt followed by fresh retake and passing best score.
4. Progression through Week 18.
5. Week 19 locked before midterm mastery.
6. Failed midterm attempt followed by fresh passing attempt.
7. Week 19 unlock only after midterm score reached the Academy 80% threshold.
8. State-pack change (Generic ↔ Florida) and state/local label persistence.
9. Localization evidence saved at the first required checkpoint and recovered after reload.
10. Weekly teacher-review transitions (revise/observed → meets).
11. Midterm review-state persistence.
12. Scoped JSON export and same-learner restore.
13. Deliberate cross-learner import attempt.
14. Verification that learner A and learner B remained in distinct storage scopes.

### Certification result

| Grade | Scoped identity | Retake/best score | Midterm boundary | Localization reload | Teacher review | Same-learner restore | Cross-learner reject | Result |
|---|---|---|---|---|---|---|---|---|
| Kindergarten | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Grade 1 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Grade 2 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Grade 3 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Grade 4 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Grade 5 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

### Defects found and repaired

#### 1. Kindergarten / Grade 1 legacy whole-database cloning
The prior first-run migration copied an entire legacy Social Studies database into a learner-scoped Academy key. If the legacy database contained multiple learner records, unrelated records could be cloned into the active learner's scope.

**Repair:** automatic whole-database legacy cloning was removed. Academy mode now starts from the active learner's own scoped key. Legacy data can still be restored through the protected import path.

#### 2. Kindergarten–Grade 4 Academy identity duplication
Grades K–4 could use a learner-scoped key while still requiring or permitting a second manually created Social Studies identity inside that scoped record.

**Repair:** an active Academy learner now auto-creates/selects the matching subject record using `academyLearnerId`, and manual learner controls are disabled in Academy mode. Grade 5 already used this stronger pattern and served as the model.

#### 3. Unprotected JSON restore across K–5
Teacher Tools previously wrote parsed JSON directly into the current storage key. A backup from another learner could overwrite the active learner's scoped record.

**Repair:** backups now use schema `khaemenes-social-studies-backup-v2` with course ID, grade, subject, export time, and learner scope. In Academy mode:
- a backup explicitly scoped to another learner is rejected;
- a matching scoped backup restores only the matching learner;
- a legacy single-learner unscoped backup requires explicit confirmation before binding to the active Academy learner;
- a legacy multi-learner backup cannot overwrite a scoped Academy profile;
- backups from a different course are rejected.

#### 4. Teacher review parity
Grade 5 exposed weekly and cumulative review states, while earlier grades stored review fields without consistent teacher controls.

**Repair:** Kindergarten through Grade 5 Teacher Tools now expose weekly review and midterm/final review states. Review remains evidence metadata and does not replace the 80% objective mastery gate.

#### 5. Localization persistence and state-pack separation
All grades now expose learner-level state/local context, available state packs, state/local label, and checkpoint evidence. The audit verified that learner A could use the Florida pack while learner B remained Generic without cross-record contamination.

### Invariants verified
- 80% Academy mastery threshold preserved.
- Week 19 does not unlock until Week 18 is mastered and the midterm reaches 80%.
- Failed attempts remain in attempt history; best score is retained.
- State/local evidence is learner-specific.
- Teacher review states are learner-specific.
- State localization does not alter national-core mastery gates.
- Course backups are course-specific.
- Academy learner-scoped keys include learner identity.
- No synthetic learner A record appeared in learner B's storage scope, or vice versa.

### Commits in this hardening pass
- Kindergarten isolation/protected restore: `5316078021a304382d4beba49faeb923d15f3ec5`
- Kindergarten context-path/restore compatibility fix: `533362e73804f929eadfe133c26f09a4bd9f5e91`
- Grades 1–3 isolation/protected restore: `16348689e5e2e0f7930f80959b79080052463c3a`
- Grades 4–5 isolation/protected restore: `f55f1a4d87b7b2db472b608e48bc02bdd1f3edb0`
- Grades 1–5 restore compatibility cleanup: `10d07705db750a09325b147871d7bf6c692e11e3`

### Regression checklist for future changes
Any future Social Studies learner/storage change should re-run these minimum checks:
- two Academy learner IDs produce different scoped keys;
- each scope exposes only the matching Academy learner;
- fail → correction → fresh retake preserves attempt history and best score;
- Week 19 remains locked below 80% midterm;
- localization pack, label, and checkpoint evidence survive reload;
- weekly and cumulative teacher-review states survive reload;
- scoped export restores to the same learner;
- cross-learner scoped import is rejected;
- legacy multi-learner import is rejected in Academy mode;
- course-mismatched import is rejected.

**Audit outcome: K–5 Social Studies learner isolation and restore safety certified PASS at the code/data-model level against live main-branch implementations.**
