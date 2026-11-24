# 2026-11-23 · Kindergarten Student Profile translator relocated into header rail

- Type: repair / interface refinement
- File: `student-profile/index.html`
- Commit: `b2684cc5eb9f0f635f5d8f8edc85f33a92627a5e`
- Verified blob: `c5ca9aafdc5fa3973972c2fa3ff9e33d30f423c7`
- State: committed and source-verified; live browser validation pending.

## Work completed
1. Diagnosed empty charcoal language band: the canonical `vnv-language.js` can append `#vnv-language-switch` directly before `main` rather than to an existing `#vnv-language-rail` on the student profile.
2. Added a narrow page-specific mount adapter using a `MutationObserver` to **move**, not recreate, the existing translator group into the one existing charcoal rail. The observer disconnects after success; no additional translator or alternate implementation introduced.
3. Styled language label, selector, coverage indicator, Translate remaining text and Translation audit buttons as a single horizontal row, with cream lettering on charcoal and cream controls. On small viewports the rail scrolls horizontally rather than wrapping actions.
4. Preserved existing 24px learner welcome immediately below the translator, profile card, seven learning accordions, parent tools, 88px bubbles and learner/assessment scripts.

## Checks
- GitHub fetched final file and verified the blob.
- Exactly one `id="vnv-language-rail"` and one canonical Kindergarten language loader reference.
- Original learner and accordion IDs retained.
- No browser live-rendering, translation-function, or mobile interaction test has yet been performed.
- No learner data or credentials in this log.
