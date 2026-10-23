# Kinder Garden Instructional-Depth Review · Weeks 31–36

Date: 2026-10-23  
Branch: `main`  
Standard: `curriculum/CURRICULUM_DEPTH_STANDARD.md`  
Scope: 30 daily lesson sections, week-specific mastery rubrics, and six printable packets.

## Summary

A source-level pass found that the six weeks already contain substantial teaching structure: all 30 day sections have an observable daily target, an explicit adult model, three varied guided examples, a fresh independent-transfer task, corrective feedback, teacher-observable evidence, and accessible/differentiated response options. This does **not** replace the standard's final reviewer score or a rendered browser/print inspection.

The clearest recurring opportunity was to make prior-knowledge retrieval and key vocabulary explicit at the start of each daily lesson. Thirty topic-specific `Recall & vocabulary` prompts have been added, one per day, with language appropriate to the weekly content.

A print-evidence inconsistency was also found in Week 34: its packet used a different layout/heading system and did not give the same explicit daily grade/week metadata as its neighboring packets. Week 34's printable was rebuilt to match the five actual lesson targets; explicit Kindergarten grade metadata was also added to each day-page identity for Weeks 31–33 and 35–36.

## Week-by-week alignment notes

| Week | Theme | Rubric evidence emphasized | Printable alignment |
|---|---|---|---|
| 31 | Bugs, Gardens, and Tiny Worlds | Observable features; observation vs. inference; humane observation; classification/counting; habitat evidence; revision | Five pages cover observation, sorting/graphing, habitats, a field guide, and fresh transfer/revision. Grade label added. |
| 32 | Water Worlds | Habitat needs; pond/river/ocean comparisons; rule-based sorting/counting/graphing; model limitations; water safety | Five pages cover water environments, sorting/counting, habitat evidence, a habitat guide, and an unfamiliar comparison. Grade label added. |
| 33 | Space, Moon, and Day/Night | Sky observation; day/night sequence; Sun/Moon distinction; model limits; observation vs. story; Sun safety | Five pages cover day/night, Moon appearance, rotation/orbit, sky journal, and an unfamiliar sky example. Grade label added. |
| 34 | Tools, Technology, and Digital Citizenship | Tool/task fit; algorithm sequence; direction/grid; debugging; digital privacy; ask-before-use safety; test/revise | Rebuilt as a cover plus five day pages aligned to tools, first/next/last algorithms, a paper-robot grid, testing/revision, and a fictional privacy scenario. Never asks the learner to enter real private data. |
| 35 | My Big Question Capstone | Focused question; evidence plan; inquiry observation; tool selection; revision from evidence; capstone explanation | Five pages cover testable questions, planning, observations, visual models/graphs, and explanation/reflection. Grade label added. |
| 36 | Kindergarten Review and Final Celebration | Fresh literacy/story evidence; counting/cardinality; number composition; inquiry; problem solving/revision; portfolio evidence; next learning target | Five pages cover growth, story/sounds, numbers/observation, showcase, and reflection/goal-setting. Grade label added. |

## Repairs made

1. Added five targeted prior-knowledge and vocabulary prompts to each of Weeks 31–36. These prompts are distinct by week and day; they do not replace the lesson target, teach the answer to the independent task, or count as mastery.
2. Rebuilt `curriculum/printables/unit-34-packet.html` using the same cover-plus-five-day structure, with student name, date, Kindergarten grade, week, lesson/day, adult observation, drawing/writing evidence space, print/PDF action, and a boundary statement that practice is not formal mastery.
3. Added an explicit `Grade: Kindergarten` line to the top identity area and each daily identity block in printable packets for Weeks 31–33 and 35–36.
4. Added `tests/instructional-depth-week-31-36.cjs` and wired it into the Kindergarten regression workflow. It checks the daily instructional block structure, five recall prompts per week, grade identity on printables, five daily printable sheets, and Week 34 topic alignment.

## Preservation boundaries

- Do not change any lesson ID, day sequence, route/gate key, learner record schema, or formal assessment rubric authority as part of these content changes.
- Daily lesson completion and these recall prompts remain practice/evidence only, not mastery.
- Week-specific rubrics in `curriculum/data/a-plus-mastery.js` remain the assessment authority; the 80% threshold, required essential criteria, and applicable adult affirmation are unchanged.
- A static file check cannot confirm the generated print/PDF pagination or actual focus/keyboard behavior. Browser and rendered-print inspection remain outstanding.

## Status

**Source-structure review: repaired and regression-covered.**  
**Full seven-dimension reviewer scoring: still required.**  
**Rendered print/PDF and real-browser checks: still required.**

The adopted standard requires a criterion-level 0–2 score for every dimension/day and an overall score of at least 12/14 with no zero in explicit modeling, guided practice, independent demonstration, or evidence. The structural test intentionally does not manufacture these pedagogical scores from word counts.
