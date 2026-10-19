# Khaemenes Academy · Kinder Garden Regression Protocol
Date: 2026-10-19 · Source baseline: main · No real student records should be used in tests.

## Test environment
Use a temporary browser profile with fabricated Family Registry records only. Export and preserve existing evidence before testing; never reset real learner records. Tests are pending execution in a browser with the Academy registry available. Separate *activity completion* from adult-verified mastery.

## Required regression cases
| ID | Setup | Action | Expected |
|---|---|---|---|
| G01 | No profile | Open a formal lesson URL | Formal access denied; preview and free games remain accessible |
| G02 | Linked learner without guardian authorization | Open Week 1 | Formal access denied |
| G03 | Authorized Kindergarten learner, no Week 1 evidence | Open Day 2 of Week 5 directly | Denied until Day 1 evidence and prior weeks mastered |
| G04 | Eligible Week 5 learner | Record Day 1 and refresh | Only learner's Day 1 receipt persists, Day 2 opens |
| G05 | Week with 5 daily receipts | Submit 7/10 met with adult affirmation | 70% recorded; next week remains locked |
| G06 | Week with 5 daily receipts | Submit 8/10 met but required essential criterion unmet | Not mastered, next week remains locked |
| G07 | Week with 5 daily receipts | Submit 8/10 met, required essentials satisfied, adult affirmed | Week mastered; subsequent week eligible |
| G08 | Learner A has mastery; learner B none | Switch active linked learner | Learner B must not inherit A's receipts |
| G09 | Mastered learner, reload page | Refresh and reopen curriculum | Existing mastery and daily receipts persist |
| G10 | Weeks 1–18 mastered, midterm incomplete | Open Week 19 directly | Denied until 80% qualifying midterm mastery |
| G11 | Weeks 1–36 mastered, final unmastered | Open certificate | Locked |
| G12 | All weeks and milestones mastered, portfolio pending | Open certificate | Locked |
| G13 | All canonical requirements complete for authorized learner | Open certificate | Only locally evidenced provisional record renders; official issuance requires independent verification |
| G14 | Legacy typed scores alone | Open formal week, milestone and certificate | No unlock or graduation |
| G15 | Failed localStorage write (test profile only) | Record daily evidence | Clear failure, no false saved receipt |
| G16 | Game played without daily evidence | Open next day's curriculum | Game activity does not unlock formal lesson or count as mastery |

## Source-level invariants checked
- `assets/khaemenes-kinder-mastery-gates.js`: `canOpenWeek`, `canOpenDay`, `canAssessWeek`, `canAssessMilestone`, `recordDayEvidence`, `updateReceipt`, `certificationReady`.
- `curriculum/assets/certificate.js`: canonical gate, learner-scoped weekly completion and milestone checks.
- `curriculum/assets/companion-layer.js`: unlocked daily recommendation and optional-game disclaimer.

## Print quality acceptance
For Weeks 1, 5, 11, 18, 24, 30, 31, 34 and 36, print to Letter at 100% and check: (1) no blank pages; (2) every sheet's Khaemenes Academy heading is visible and centered; (3) student name and date lines visible; (4) one daily exercise per page, no overflow; (5) 12-point or larger body text where practical; (6) usable writing space; (7) navigation hidden in print. Log screenshots/page counts, not merely the CSS source.

**Status:** This is an executable manual regression protocol, not evidence of a completed browser run.
