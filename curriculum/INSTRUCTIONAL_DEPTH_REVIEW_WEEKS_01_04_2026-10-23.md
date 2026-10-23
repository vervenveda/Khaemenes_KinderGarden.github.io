# Kinder Garden Instructional-Depth Review · Weeks 01–04

Date: 2026-10-23  
Branch: `main`  
Standard: `curriculum/CURRICULUM_DEPTH_STANDARD.md`  
Scope: 20 custom-structured daily lessons, original interactive activities, four printable packets, and existing week-specific mastery rubric definitions.

## Summary

Weeks 01, 03, and 04 use bespoke interactive lesson cards; Week 02 uses a workshop-oriented day structure. These designs are useful and have been preserved. The targeted issue was not a lack of activities: it was inconsistent explicit teacher-facing instruction beside those activities. In particular, several custom lesson cards showed the interaction prompt but did not provide a complete adult model, three varied guided examples, an uncued fresh transfer task, a corrective-feedback cue, an explicit evidence/reflection step, and accessible response options in one easy-to-find location.

A topic-specific `Recall & key words` prompt and a day-specific teaching scaffold have now been added to all 20 daily lesson articles. They supplement the original interactive activities and completion controls; they do not replace those activities or grant mastery.

## Week-by-week review and repairs

### Week 01 — Welcome to the Learning Garden
- Preserved: name/letter and feeling activity, one-to-one seed counting, classroom-item sorting, routine sequence, classroom map, helpful job choice, audio controls, and day-completion controls.
- Added: privacy-preserving name/letter prompt, counting model and new counter set, clear sorting rule, routine sequencing model, symbol/map example, evidence-based end-of-week reflection, three guided examples, fresh independent task, corrective feedback, observable evidence, and accessible alternatives for each day.
- Printable: explicit `Grade: Kindergarten` identity added to the cover and each daily sheet.

### Week 02 — Names, Letters, and Stories
- Preserved: five existing workshop-based lesson sections, targets, workshop descriptions, center recommendations, and current mastery rubric.
- Added: explicit recall/vocabulary and a consistent adult model, three guided examples, independent fresh transfer, corrective feedback, evidence/reflection, and accessible participation guidance per day.
- Printable: explicit Kindergarten grade identity added to the cover and each daily sheet.

### Week 03 — Feelings, Friendship, and Voice
- Preserved: feelings check-in, voice phrase builder, kind-word matching, rhyme practice, comparing groups, repair language, friendship bracelet pattern, and portfolio reflection.
- Added: fictional-scenario prompts to avoid pressuring children to disclose personal feelings; explicit teaching and feedback for rhyme, comparing quantities, respectful boundaries, repair language, patterning, evidence, and reflection.
- Printable: explicit Kindergarten grade identity added to the cover and each daily sheet.

### Week 04 — The Five Senses
- Preserved: sense explorer, counting seeds, sense-card sorting, sensory-trail sequence, observation map, and helpful-role activity.
- Preserved the existing safety boundary: tasting is never required; touch and smell remain optional.
- Added: concrete observation-versus-inference model, guided examples, independent picture-based transfer, feedback prompts, evidence capture, and alternatives using adult description, pointing, drawing, sign, AAC, or observer/listener roles.
- Printable: explicit Kindergarten grade identity added to the cover and each daily sheet.

## Validation added

`tests/instructional-depth-week-01-04.cjs` is wired into `.github/workflows/kindergarten-regression.yml`. It checks:
- Exactly five original daily lesson articles per week.
- The existing five day-completion controls remain present.
- Exactly one instructional scaffold exists in each daily lesson.
- Recall/key vocabulary, three guided examples, independent transfer, feedback/evidence, and accessible response directions are present.
- The printable retains one cover plus five daily sheets, Academy heading, student/date fields, and explicit Kindergarten grade identity.
- Week-specific formal mastery rubric definitions remain present in `curriculum/data/a-plus-mastery.js`.

## Preservation boundaries

- Existing interactive games and day-completion handlers are retained.
- No lesson routes, lesson IDs, local-storage schema, Family Registry authority, or formal-gate code were changed.
- No rubric criteria, mastery thresholds, or evidence-to-mastery authority was changed. The week-specific formal mastery rules remain the authority.
- The new teaching scaffolds and daily completion remain instructional/practice support, not official mastery receipts.
- Static checks cannot certify keyboard focus behavior, screen-reader announcements, or rendered print pagination; browser and rendered-print inspection remain a separate verification step.

## Status

**Source-level structural upgrades:** implemented.  
**Automated regression suite:** added and wired; use the current main-branch Actions run to confirm its final result.  
**Seven-dimension instructional scoring:** still requires human criterion-level scoring for each day, not a keyword or scaffold count.  
**Live browser and rendered print inspection:** still outstanding.
