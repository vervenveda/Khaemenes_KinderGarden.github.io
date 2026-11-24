# 2026-11-23 · Kindergarten Profile full-width accordions and 88px bubbles

- Type: upgrade / design refinement
- File: `student-profile/index.html`
- Commit: `c2e5ec64fc77b3c652cf3bc865b98d2dcd00b8d4`
- Verified source blob: `21191495f01a46ddebc171d07b51a295c9a4e61c`
- Status: **Committed/source-verified; live visual QA pending.**

## Itemized change log

1. Kept all existing learning and growth `<details>` accordions and original IDs, but changed their parent grids to one column so every bar extends the full available page-content width, like Preschool and Kindergarten Home.
2. Standardized the closed bars at a minimum 66px height, 24px heading type and 33px summary icon sizes. Kept the approved medium-bright colors and 7px rounded corners.
3. Applied matching full-width treatment to the existing Grown-Ups and Personalize My Garden accordion summary rows.
4. Changed all 16 decorative floating bubble size assignments from varying values to exactly **88px**; also added an 88×88px CSS safeguard. Kept positions, colors, animations, durations and drift unchanged.
5. Left learner records, profile controls, assessments, mastery gates, navigation, translator and all other scripts unchanged.

## Verification

- GitHub refetched and matched blob `21191495f01a46ddebc171d07b51a295c9a4e61c`.
- Seven learner feature accordions retained; main section opening/closing details counts balance.
- All original learning details continue to lack the `open` attribute and therefore start collapsed.
- Bubble JavaScript now sets `--size` to `88px` for every decorative bubble, with matching scoped CSS.
- **Live-browser check not run:** verify widths, bubble motion and mobile views at 100% zoom before final design lock.

No actual learner records, photos or personal information were recorded here.
