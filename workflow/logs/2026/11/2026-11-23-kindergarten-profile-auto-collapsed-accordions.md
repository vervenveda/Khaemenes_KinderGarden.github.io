# 2026-11-23 · Kindergarten Student Profile collapsed accordions

- Type: upgrade / layout repair
- Repository: `vervenveda/Khaemenes_KinderGarden.github.io`
- Page: `student-profile/index.html`
- Commit: `c7ae0ebff5eeec15156acfcd2628248ea9b49b56`
- Source blob: `17af77271d59bf04f965cd1c824f9c7b4439889a`
- Status: **Committed, source-verified; live-browser visual/interaction review pending.**

## Scope and changes

1. Converted seven existing learning/achievement cards into native `<details>` + `<summary>` accordions, all closed by default: My Next Little Step, Today I Explore!, My Learning Garden, My Little Basket, Sticker Meadow, Grade 1 Readiness and Graduation Bridge.
2. Left the protected Grown-Ups Learning Record & Profile Studio and Personalize My Garden as existing closed native accordions.
3. Preserved the daily-learning and growth dashboard group headings and 2-column desktop / 1-column mobile layout.
4. Retained each original content element, IDs, action controls and data render targets; moved section headings into accordion summaries with medium-bright kindergarten colors, 24px title lettering and 7px corners.
5. Added a small scoped deep-link handler so existing profile-hero navigation anchors such as `#garden`, `#stickerCard`, `#kinderDailyAdventure` and `#grownups` open their target accordion (and any enclosing accordion) before scrolling. Repeated same-hash clicks also trigger reveal.
6. Left all previously existing learner/photo, colors, favorites, mastery, assessment and parent logic JavaScript byte-for-byte unchanged in its original scripts.

## Verification and holds

- Source fetched after commit; SHA matches `17af77271d59bf04f965cd1c824f9c7b4439889a`.
- All seven converted cards have exactly one summary and no `open` attribute.
- Main region markup balance checked: 9 opening details / 9 closing details (7 new + 2 existing).
- Searched current source for `section#todayCard`, `section#garden`, `section#favorites`, `querySelector("section` and `querySelectorAll("section`; none appear.
- **Not browser certified**: confirm desktop/mobile rendering, accordion open/close, scrolling under sticky header, full learner records, native profile studio, and child/parent consent paths.
- No academic grade/progress logic changed. No student data or personal information is stored in this workflow record.

## Decision

Approved request: all functional profile sections begin collapsed. Group labels stay visible for orientation and the hero remains the page identity. Do not introduce separate accordions or duplicate components that compete with the canonical header, translator or learner engines.
