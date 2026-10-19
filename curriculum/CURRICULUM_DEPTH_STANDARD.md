# Kinder Garden — Curriculum Depth Standard (v1)

Owner: Khaemenes Academy · Jennifer Kay Pearl
Scope: 36 weeks / 180 daily experiences · canonical main branch
Status: adopted as a review standard; **not** evidence that all weeks currently comply.

## Non-negotiable preservation
- Preserve existing unit themes, lesson IDs, day-gate sequence, saved evidence, Family Registry, Archaemenes/Wise Owl routing, and learner-scoped mastery authority.
- Daily activity completion is **not** mastery. Formal advancement requires >=80% on an appropriate observed rubric, plus designated essential-core criteria.
- Local browser data is provisional; do not describe it as independently server-verified.
- Keep all preview/game access distinctions and age-appropriate accessibility. Do not place STOS implementation details on public learning pages.
- Develop on `main` only; audit and test before updating any formal content.

## Minimum daily instructional contract (seven dimensions)
1. **Target and prerequisites** — one observable skill, prior-knowledge retrieval, and clear vocabulary.
2. **Explicit model** — adult-facing talk track, at least one worked concrete example, and a common error with corrective language.
3. **Guided practice** — at least three varied examples with prompts and feedback; increase complexity gradually.
4. **Independent demonstration** — a *new*, uncued task showing transfer, not a copied model.
5. **Multisensory application** — accessible play, manipulatives, movement, oral language, arts, or investigation aligned to the target.
6. **Evidence and reflection** — specific learner work/response to collect, observable success indicators, and child-friendly reflection.
7. **Differentiation** — reteach using another representation, extension for secure learners, language supports, and nonwriting accessible demonstration.

## Whole-week requirements
- Five meaningfully distinct days with a coherent teach → practice → apply → transfer → retrieve progression.
- Reading/listening texts, number sets, examples, printable prompts and necessary materials must be present or linked to a verified, actually available resource.
- Each week's assessment criteria must identify taught skills and specify *observable* performance; at least one fresh example must establish transfer.
- Weekly essential-core skills cannot be passed through participation or enrichment alone.
- A portfolio artifact or adult observation anchors claims where appropriate.
- Family-facing explanation and teacher procedure are sufficiently specific to use without writing new teaching material.
- All learning and assessment pathways support age-appropriate, multilingual and accessibility accommodations without changing measured skill.

## Reviewer rubric (0–2 for each of 7 dimensions, 14 possible points/day)
0 = absent or only a vague topic label.
1 = present but missing actual examples, evidence, or enough instructions.
2 = complete, executable, varied, and age-appropriate.
`PASS` = 12+/14 AND no zero in dimensions 2, 3, 4, or 6.
`REPAIR` = below threshold or any critical zero.
`UNREVIEWED` = content not inspected yet. Do not substitute file size for lesson quality.

## 36-week audit workflow
For each week inspect `curriculum/lessons/unit-NN/formal-content.html`, the printable packet, the corresponding curriculum data, and the current formal mastery rubric. Sample each of five distinct days, record the seven scores with evidence anchors, and write a prioritized repair list. Inspect the live gate wrapper as a separate technical test.

After a repair, verify: all five days readable; content/printable alignment; same gate keys and storage schema; observed evidence does not directly mint mastery; suitable accommodations; no inaccessible or missing resources. Only then mark a week PASS.

## Baseline sampled findings (2026-10-19)
- Weeks 05, 12, 18, 24: richer instructional material found; full criterion-level review still required.
- Week 01: interactive introductory experience; evaluate each individual day against the contract.
- Weeks 30 and 36: daily targets and activities exist; explicit worked modeling and exercises should be expanded/verified.
- Every other week: UNREVIEWED in this baseline. No assumption of failure or success.
- Generic fallback assessment rubric in `curriculum/mastery/index.html` warrants a week-by-week alignment review; specialized rubrics may override it.

## Repair order
A. Verify all 36 weeks against the daily contract, without confusing unreviewed with deficient.
B. Start with missing explicit teaching, concrete resources, and independent demonstrations.
C. Align each week's mastery rubric and task bank to taught material.
D. Re-audit and validate student, family and adult pathways.
