# Kindergarten Student Profile: Ten-Point Readiness Audit
Date: 2026-11-09
Baseline: `upgrade/profile-photo-editor-parity-2026-11-09` (not live/main).
Candidate: `upgrade/kindergarten-profile-readiness-2026-11-09`.
Evidence: user screenshot of live page, code inspection of the actual profile, and source-level regression. No real student data read, modified, or migrated.

## Findings and disposition
| # | Student experience | Audit finding | Candidate remedy / further scope | Status |
|---|---|---|---|---|
| 1 | Desktop canvas width | Screenshot shows extremely narrow central content and expansive background; stylesheet uses inherited width constraints. Browser zoom could contribute and must be independently checked. | Explicit 94% up to 1240px shell, spacious 12-column card grid, mobile reflow. | PATChED; browser screenshot pending |
| 2 | Visual hierarchy | Vibrant full-screen ocean draws attention away from activities, contrast/typography lacks Academy's measured hierarchy. | Calm charcoal, cream/parchment, modest gold, Cinzel/Nunito, toned-down decorative background, reduced motion honored. | PATCHED; visual browser review pending |
| 3 | Picture Editor position | Native photo card sits after several scroll-heavy daily/progress cards. | Move Picture & Colors + Garden Colors to first card row, preserve every existing ID/handler/backup key. | PATCHED |
| 4 | Student navigation | Only four hero controls; picture, favorites, sticker and grown-ups are deep scrolls. | Eight consistent hero shortcuts, direct link under portrait, keyboard focus and menu dismissal. | PATCHED |
| 5 | Accessible interactions | Small pill text, gradients, varied corner radii and some controls below preferred touch area. | Minimum 16px navigation labels/44px targets; 7px radii; clearer visible focus and neutral backgrounds. | PATCHED; full screen-reader/keyboard audit pending |
| 6 | Learner identity + family access | Family helper check is a browser acknowledgement, not verified legal guardian status. Guest preview has limited guidance. | Preserve learner-only writes; introduce clear visitor/family door and protected account-state integration when T03 is commissioned; do not claim authentication today. | OPEN |
| 7 | Day planning | Today’s Next Step and 36-week progress exist but there is no unified Kindergarten Daily Lessons/weekly checklist visual comparable to other campuses. | One age-appropriate Daily Lessons view, week card, readiness cues, and optional family checklist without inventing mastery status. | OPEN |
| 8 | Personalization + Yearbook | New Yearbook selector and native frames exist on review branches but live deployment and image workflow have not been browser-tested. | Opt-in chooser, backup privacy, photo crop/frames, student-specific tests. | SOURCE WIRED; LIVE BROWSER PENDING |
| 9 | Portfolio and rewards | Flower Garden and Sticker Meadow present, but portfolio artifacts, achievements and daily reward presentation lack the depth of upper-grade student profiles. | Add a child-facing My Creations/Portfolio and parent-confirmed reward display, never awarding grades via decorative stickers. | OPEN |
| 10 | Family studio and Grade 1 bridge | Grown-Ups tools are collapsed, progress summary and promotion pathways are dispersed. | Clear family-dashboard doorway, optional reports, kindergarten readiness checklist and Lantern Bridge with verified mastery only. | OPEN |

## Code-level acceptance
- The new review branch retains the canonical learner data keys, photo import, Kindergarten backup validation, Yearbook picker, family profile studio, Favorites, Garden 36-week mastery listener, Sticker Meadow and Grade 1 links.
- New `student-profile/kindergarten-readiness.test.cjs` passed in isolated JavaScript harness and checks the moved editor, 17 preserved IDs, key shortcuts, stored schema, script syntax and learner-bound backup verification.
- The existing repository remains unchanged on main; no deployment or migrations occurred.
- Critical next test: real browser at **100% zoom** (Cmd+0) in desktop, tablet and mobile viewports, with fictional or test-only learner identities. Check 8 toolbar buttons, copy lengths, keyboard Escape, photo import and Yearbook pop-up, learning record boundaries and localStorage reset/refresh.

## Recommended next tranche
1. Browser review the new first-row picture/color editor and desktop width; fix layout regressions.
2. Build a Kindergarten-specific **Daily Lessons/Today** panel with genuine week-gated data only.
3. Add child-facing My Creations and guardian-assisted Portfolio entry without changing mastery.
4. Add accessible family-status and restricted visitor touring doorway, pending protected account authority.
5. Expand child-friendly checkpoints and Grade 1 readiness summary with existing verified records.
