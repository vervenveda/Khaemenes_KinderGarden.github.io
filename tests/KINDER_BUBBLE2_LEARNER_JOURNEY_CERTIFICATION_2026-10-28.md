# Kindergarten Bubble 2 Learner-Journey Certification

Status: INDEPENDENT PROTECTIONS COMPLETE; LIVE 255PX/KEYBOARD RUN PENDING; NAIB PLACEMENT INTEGRATION DEFERRED
Branch: main
Date: 2026-10-28

## Protected boundary
No Kindergarten home-page design changes are part of Bubble 2.

## Established protections
1. Existing Preschool -> Kindergarten browser journey preserves the original learner ID and Preschool graduation history.
2. Kindergarten placement does not carry Preschool guardian release into formal Kindergarten.
3. Formal Kindergarten remains locked until its own guardian authorization is completed.
4. Week 1 practice is learner-scoped, survives reload, and does not manufacture formal mastery.
5. Same-tab learner switching prevents writes to the previously active learner.
6. Two authorized siblings can hold different Week 1 practice states; switching and reload must preserve each independently.
7. Revoking guardian authorization re-locks formal learning without deleting saved practice.
8. Formal mastery rejects sub-80 scores, missing essential criteria, and missing adult affirmation.
9. Formal mastery and portfolio writes fail closed when browser storage cannot persist.
10. Continuity migration rejects cross-learner legacy copying and preserves prior persisted state on failed writes.
11. The profile browser regression isolates learner photos, themes, goals, and pinned activities.
12. A dedicated Bubble 2 browser test now targets the Academy 255px viewport and keyboard reachability/activation without modifying the home page.

## Runtime evidence boundary
The 255px/keyboard test and GitHub Actions workflow are installed on main. Until a completed live workflow result is inspected, they remain runtime-pending rather than certified PASS.

## Deferred dependency
NAIB is the Academy administrative AI placement authority. The original NAIB placement assessment/scoring integration is intentionally deferred. No score threshold or substitute placement decision has been invented. The current direct Kindergarten grade selector is not evidence of a NAIB placement decision.

## Bubble 2 disposition
Independent learner-journey protections are complete at source/regression level. Remaining Bubble 2 follow-up is limited to:
- inspect a completed live 255px/keyboard workflow run when available;
- return separately to NAIB placement integration when the deeper Academy/AI administration work is opened.

Do not reopen the Kindergarten home-page design as part of either follow-up.
