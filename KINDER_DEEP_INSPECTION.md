# Khaemenes Kinder Garden — Deep Inspection & Current Architecture

## Current status

Kinder Garden has a strong curriculum foundation and is now aligned with the Academy-wide learner and Mentor authority model.

Verified repository structure includes:

- 36 curriculum weeks / units;
- 36 unit assessments plus weekly assessment hub, midterm, and final;
- 36 curriculum printable packets;
- curriculum dashboard, records, and certificate logic;
- 20 Kinder Garden learning applications;
- Crechè resource continuity;
- Family Registry integration;
- learner-scoped Kindergarten records;
- lesson-aware companion matching;
- one Academy Mentor: Archaemenes.

The 80% mastery rule remains unchanged.

---

## 1. Family and learner authority

Formal learner identity comes from the shared Khaemenes Academy Family Registry:

`https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js`

Kinder Garden does not maintain a second formal learner account.

The Kindergarten Family Curriculum Portal reads the active Family Registry learner, allows learner switching through the shared family state, and presents learner-scoped curriculum progress.

---

## 2. Mentor consolidation

Earlier Kinder Garden builds contained a local Mentor model with Pip, Miri, Nova, Sage, and optional custom visible Mentor identities.

That model has been retired as an active authority.

The canonical Mentor is now:

**Archaemenes · Wise Owl**

Active Mentor URL:

`https://vervenveda.com/Khaemenes_Academy.github.io/mentor/`

Family Registry records normalize the learner to:

```json
{
  "mentorId": "archaemenes"
}
```

The former Pip / Miri / Nova / Sage distinctions survive only as communication-style metadata. Former custom visible Mentor choices may survive as legacy presentation-preference metadata. Neither creates a second Mentor identity or application.

### Active compatibility boundary

The root `index.html` is a large established campus surface with historical Mentor setup markup and inline compatibility functions. Rather than rewrite that monolith while changing Mentor authority, the current adapter:

- hides and inerts the old setup overlay;
- disables the old setup save control;
- rewrites legacy Mentor links to Academy Archaemenes;
- capture-routes child Mentor prompt actions to the Academy Mentor;
- rewrites visible Mentor copy to Archaemenes / Wise Owl;
- prevents the historical prompt handler from operating as a separate Mentor program.

This leaves old source code as compatibility residue, but not as the active Mentor authority.

The relevant files are:

- `assets/khaemenes-kinder-family-adapter.js`
- `assets/khaemenes-kinder-continuity.js`
- `mentor-manifest.json`

---

## 3. NAIB boundary

NAIB remains the academic navigation, lesson-matching, and delegation layer.

NAIB may:

- identify the learner's academic position;
- match practice resources to the current lesson;
- recommend the next academic doorway;
- help route to a specialist or resource.

NAIB is not a second Mentor and does not replace Archaemenes.

---

## 4. Curriculum and practice relationship

The formal unit remains the lesson. Apps and Crechè activities are practice companions.

`assets/khaemenes-kinder-companions.js` reads the actual lesson context and scores resources against:

- week theme;
- essential question;
- literacy focus;
- mathematics focus;
- inquiry focus;
- SEL focus;
- maker project;
- lesson title, objective, and workshop context.

This allows different Monday–Friday practice recommendations without changing the formal lesson or mastery record.

---

## 5. Family Curriculum Portal

The stage-specific `family/index.html` remains useful as a curriculum-facing family surface. It:

- reads the shared Family Registry;
- shows and switches learners;
- reads learner-scoped Kindergarten progress;
- shows the next open week;
- links unit, printable, and weekly assessment materials;
- surfaces matched Kinder and Crechè companions;
- exports local family + Kindergarten backup information;
- links to the Academy Family Profile for account and permission management.

Any historical `#mentor` doorway on that page is rewritten by the Family Adapter to the canonical Academy Archaemenes Mentor.

---

## 6. Teacher Tools compatibility route

The formal curriculum expects:

`curriculum/teacher-tools/index.html`

That compatibility route exists so curriculum, lesson, assessment, certificate, and stylesheet references resolve consistently.

---

## 7. Mobile and stylesheet repairs retained

Earlier repairs remain in place:

- dynamic mobile menu placement avoids fixed-header overlap;
- `curriculum/assets/lesson.css` provides Unit 01 stylesheet compatibility;
- curriculum and companion links remain locally resolvable according to the existing validation record.

---

## Authority map

```text
Family Registry
     ↓
Active Kindergarten learner
     ├── identity / placement
     ├── mentorId: archaemenes
     └── learner-scoped records

NAIB
     ├── navigation
     ├── lesson matching
     └── delegation

Archaemenes · Wise Owl
     ├── clues
     ├── encouragement
     ├── learning guidance
     └── bounded young-learner support

Course Engine
     ├── lessons
     ├── assessments
     ├── 80% mastery gates
     └── certificate progression
```

No one layer silently takes authority from another.

---

## Privacy boundary

Family and curriculum records remain browser-local under the current public architecture. Cross-campus continuity depends on using the shared `vervenveda.com` origin. Learner and family IDs are not placed in the Mentor URL.

No new advertising, third-party analytics, or public cloud learner database was introduced by the Mentor consolidation.

---

## Validation boundary

The current source inspection verifies repository structure, authority contracts, registry normalization, and route policy. It does not substitute for a full live-browser test of deployment timing, keyboard behavior, localStorage migration, learner switching, and cross-page interactions.

Current validation records:

- `VALIDATION.json`
- `validation.json`

Both now describe the post-consolidation Archaemenes architecture rather than the former multi-Mentor model.
