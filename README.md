# Current STOS-Wired Build

See `CURRENT_BUILD_v1.3.0.md` for the current Academy hierarchy, persistence,
mentor, Beta, mastery, curriculum, dependency, and validation boundaries.

# Khaemenes Kinder Garden — A Kinder Place to Learn

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**

Kinder Garden is the Kindergarten learning gateway between Crechè and the wider Khaemenes Academy.

## Access model

**Open without a curriculum account**
- Kinder Garden games / apps / learning tools
- Crechè bridge activities
- the 36-week roadmap
- Monday–Friday lesson previews
- connected creative / practice resources

**Requires the active Kindergarten learner**
- formal curriculum progression
- learner-scoped mastery records
- personalized Archaemenes Mentor continuity
- assessment / certificate progression

The **Academy Family Registry is the identity authority** for formal learning. Kinder Garden does not create a second learner account and does not maintain a separate Mentor program.

## One Academy Mentor

Kinder Garden now uses the Academy-wide Mentor architecture:

**Archaemenes → Wise Owl expression → Kindergarten learner**

Archaemenes is the single continuous educational Mentor of Khaemenes Academy. In Kindergarten his age-appropriate expression is **Wise Owl**.

The active Mentor doorway is:

`https://vervenveda.com/Khaemenes_Academy.github.io/mentor/`

The identity doorway is:

`https://vervenveda.com/Khaemenes_Academy.github.io/family/`

### What happened to Pip, Miri, Nova, and Sage?

Older Kinder Garden builds treated Pip, Miri, Nova, and Sage as separate visible Mentor identities. They are no longer Mentor authorities.

Their useful differences are preserved only as **communication-style preferences**:
- playful / social
- quiet / curious
- imaginative / expressive
- steady / determined

Existing learner records are migrated non-destructively. A legacy Mentor ID or custom visible presentation can be retained as compatibility metadata while the canonical Family Registry Mentor becomes:

`mentorId: "archaemenes"`

Kinder Garden therefore keeps continuity without creating competing Mentor identities.

### Young-learner boundary

Kindergarten Mentor interaction remains bounded and child-safe. The campus does not provide an unrestricted private child chat. Quick Mentor prompts route into the canonical Academy Archaemenes surface, where Kindergarten uses bounded Wise Owl controls.

Archaemenes may support:
- clues and one-step-at-a-time guidance
- lesson and curriculum navigation
- encouragement and effort reflection
- matched practice suggestions
- healthy off-screen breaks

Archaemenes does **not** replace the parent, guardian, educator, assessment engine, or course mastery authority.

## Mentorship & Family Experience Hardening

Kinder Garden now carries the one-Mentor architecture into the learner's daily and family experience.

### Today with Archaemenes

The child-facing campus includes a shared **Today with Archaemenes** pathway.

The order is deliberate:

1. **Learn** — the actual current formal Kindergarten step.
2. **Practice** — an optional Kinder Garden resource matched to the lesson.
3. **Explore** — a second matched Kinder or Crechè companion when useful.
4. **Reset** — an optional calm / off-screen transition through Aurora.

The formal lesson always remains first. Practice and exploration do not count as mastery and cannot unlock later curriculum.

### Family Learning Snapshot

The Kindergarten Family Curriculum Portal now includes a family snapshot that combines:

- the current formal academic place;
- weeks recorded at 80% mastery;
- recorded weekly average;
- recent support-path activity;
- the current learning focus;
- lesson-matched optional practice;
- the latest optional grown-up observation.

Where five-day formal evidence exists, the family view reads the existing mastery-gate record so it can identify the current daily step rather than only the current week.

### Gentle grown-up observations

Families may optionally record one of three observations:

- **Exploring with support**
- **Growing independence**
- **Explaining confidently**

These notes are complementary family context only.

They do **not**:
- change a score;
- create mastery;
- unlock a lesson;
- satisfy an assessment;
- alter the 80% gate;
- diagnose ability, disability, readiness, or development.

Formal academic evidence remains under the course engine and adult-observed assessment system.

### Archaemenes Kindergarten context bridge

Kinder Garden writes a sanitized browser-local context record:

```text
khaemenes_kindergarten_mentor_context_v1
```

It can include:

- the active learner ID;
- Archaemenes / Wise Owl communication style;
- current formal academic position;
- 36-week mastery summary;
- current lesson focus;
- NAIB-matched optional practice;
- recent family observations;
- recent support-path activity.

The Academy Mentor accepts the Kindergarten context only when its learner ID matches the active learner in the Academy Family Registry.

Archaemenes may then explain the current academic place, suggest matched practice after the formal step, provide a smaller clue, or recommend a healthy break.

### Shared experience implementation

The cross-surface experience layer lives in:

`assets/khaemenes-kinder-experience.js`

It is intentionally separate from the large historical root `index.html` so experience upgrades do not rewrite the formal curriculum engine.

---

## NAIB boundary

NAIB remains an academic navigation and delegation layer. NAIB can identify the learner's academic position, match resources to the current lesson, and recommend the appropriate next doorway.

NAIB is **not a second Mentor**.

The Academy authority separation is:

- **Family Registry** → learner identity and placement record
- **NAIB** → navigation, matching, delegation, advisory routing
- **Archaemenes** → educational Mentor
- **Course engine** → mastery, assessment evidence, progression gates
- **Parent / guardian / educator** → human judgment and learner support

## Curriculum

- 36 weeks
- 180 daily lessons
- 36 weekly mastery checks
- midyear demonstration
- final readiness demonstration
- portfolio evidence
- 80% mastery progression

The course data covers literacy, mathematics, inquiry/science, social-emotional learning, art/maker work, movement/health, civics/community, and technology.

The Mentor consolidation does **not** change curriculum scores, lesson data, mastery thresholds, assessment evidence, or certificate requirements.

## NAIB Living Learning Resource Registry

Resources live in:

`assets/khaemenes-kinder-resources.js`

Each resource describes:
- title / path / icon
- learning domain
- specific skills
- useful modes (`learn`, `practice`, `explore`, `create`, `review`, `reset`)
- age bands

The companion engine in:

`assets/khaemenes-kinder-companions.js`

reads the actual current lesson and scores resources against:
- week theme
- essential question
- literacy focus
- math focus
- inquiry focus
- SEL focus
- maker project
- the current day's lesson title / objective / workshop

Monday, Tuesday, Wednesday, Thursday, and Friday may therefore receive different companion recommendations.

### Adding a specialized game

Create the HTML app in `/apps/`, then add one metadata object to `RESOURCE_DEFINITIONS` in `assets/khaemenes-kinder-resources.js`.

Example:

```js
{
  id:"rhyme-rocket",
  title:"Rhyme Rocket",
  icon:"🚀",
  group:"literacy",
  path:"apps/rhyme-rocket_index.html",
  desc:"Focused rhyme and beginning-sound practice.",
  domains:["literacy"],
  skills:["rhyme","syllables","beginning-sounds"],
  modes:["practice","play"],
  ageBands:["5-6"]
}
```

That is enough for NAIB to consider the tool wherever those skills occur. No manual week-to-game mapping is required.

## Important static-site limitation

GitHub Pages cannot privately inspect a folder and infer what a new HTML file teaches. A new file therefore needs a small metadata entry so the lesson-matching layer knows its skills. Once registered, lesson matching is automatic.

## Mentor consolidation files

The active Mentor consolidation is implemented in:

- `assets/khaemenes-kinder-family-adapter.js` — Family Registry migration, Mentor doorway routing, and legacy surface retirement
- `assets/khaemenes-kinder-continuity.js` — canonical Archaemenes / Wise Owl continuity and learner-scoped curriculum compatibility
- `mentor-manifest.json` — published Kinder Garden Mentor authority declaration

The large root `index.html` still contains historical setup markup and inline compatibility functions for older builds. The active adapter retires that setup surface at runtime, rewrites old Mentor doorways to the Academy Mentor, and prevents the historical prompt controls from acting as a separate Mentor program. This preserves old page compatibility without disturbing the curriculum engine.

## Visual design

Kinder Garden retains its colorful, child-friendly garden interface, learning tree, activity bubbles, playful typography, and Crechè continuity while using the same Academy learner and Mentor authority as the rest of Khaemenes Academy.
