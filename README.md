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
