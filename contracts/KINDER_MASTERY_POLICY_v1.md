# Kinder Garden Mastery Policy v1

Formal advancement requires **80% or higher** on the authoritative weekly
mastery rubric plus any essential criteria declared for that week.

Evidence tiers are intentional:

1. Weeks 1–4 — foundation/orientation evidence.
2. Weeks 5–25 — five sequential daily evidence receipts before weekly mastery.
3. Weeks 26–36 — synthesis/capstone demonstration + portfolio evidence.

Daily attendance, compliance, speech volume, eye contact, speed, handwriting
appearance, accent/dialect, or willingness to perform publicly are not mastery
criteria.

Children may demonstrate learning through speech, AAC, signing, pointing,
drawing, building, movement, selection, or adult dictation where the rubric
allows it.

The course engine remains mastery authority. Archaemenes/NAIB may coach and
guide but cannot alter mastery.

## Browser evidence versus trusted verification (Issue 2)

The existing browser mastery engine stores learner-scoped evidence in localStorage
and calculates the provisional learning path. This supports offline continuity,
but client-side checks, browser storage, UI locks, and adult-affirmation checkboxes
are not secure authentication or independent verification.

**Until the trusted Academy service confirms a receipt, local scores and visible
unlocks must be treated as provisional.** A successful network POST or a queued
sync event is not sufficient evidence of acceptance.

Requirements for the trusted STOS authority before official advancement:

- Independently establish the currently authorized learner and guardian/educator
  identity; do not trust learner IDs, roles or claimed affirmation in browser JSON.
- Validate each activity/criterion set, score numerator and denominator,
  essential requirements, evidence type, week order, daily prerequisite sequence,
  midterm/final prerequisites, and the 80% threshold on the trusted side.
- Deduplicate retries using stable event IDs and reject replay or cross-learner
  submissions; protect against conflicting updates and unauthorized resets.
- Return explicit per-event accepted/rejected/pending status with a trusted
  receipt identifier, learner scope and authoritative revision. Never infer
  acceptance from a generic HTTP 200 or `ok:true` response.
- Certificate eligibility must be computed from verified authoritative records,
  not browser-local `certificationReady()` or legacy compatible scores.
- Preserve old local evidence and recovery data non-destructively; migrate
  against trusted records only after the authority protocol has been verified.

Current status: **client-facing disclosure added; authoritative endpoint behavior
not verified in this repository**. No claim is made that these server-side controls
are already implemented.
