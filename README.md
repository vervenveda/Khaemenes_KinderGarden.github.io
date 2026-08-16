# Khaemenes Kinder Garden — A Kinder Place to Learn

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**

Kinder Garden is the Kindergarten learning gateway between Crechè and the wider Khaemenes Academy.

## Access model

**Open without a curriculum account**
- Kinder Garden games, apps, and learning tools
- Crechè bridge activities
- the 36-week roadmap
- Monday–Friday lesson previews
- connected creative and practice resources

**Requires the active Kindergarten learner**
- formal curriculum progression
- learner-scoped mastery records
- personalized Archaemenes mentoring
- assessment and certificate progression

The Academy Family Registry is the identity source for formal learning. Kinder Garden does not create a second learner account.

## Curriculum

- 36 weeks
- 180 daily lessons
- 36 weekly mastery checks
- midyear demonstration
- final readiness demonstration
- portfolio evidence
- 80% mastery progression

The course data covers literacy, mathematics, inquiry/science, social-emotional learning, art/maker work, movement/health, civics/community, and technology.

## Canonical mentor architecture

Archaemenes is the current Khaemenes Academy mentor for Kindergarten learners.

```text
Academy Family Registry
        ↓
active Kindergarten learner
        ↓
NAIB mentor-routing contract
        ↓
Archaemenes
        ↓
Early Scholar presentation
        ↓
lesson-aware resource matching
        ↓
bounded Kindergarten learning experience
```

The page does not choose among local mentor personalities and does not create a custom mentor. Legacy mentor-selection fields are compatibility data only and are not assignment authority.

Archaemenes remains one continuous mentor identity across young-learner stages. Kindergarten uses the **Early Scholar** presentation: clue-first, age-adaptive, encouraging, bounded, and educational. Archaemenes may guide practice and explain next steps, but he does not replace a parent, guardian, educator, formal lesson, or mastery decision.

A future responsible Mentor Adoption / avatar program may add approved custom mentor identities after the platform is stabilized. That program is not active in the current Kinder Garden implementation.

See `ARCHAEMENES_MENTOR_LOGIC.md` for the preserved architecture rule.

## NAIB Living Learning Resource Registry

Mentor identity and resource selection are separate responsibilities.

Archaemenes is the mentor. The Kinder Garden companion engine selects practice resources that fit the learner's current lesson.

Resources live in:

`assets/khaemenes-kinder-resources.js`

Each resource describes:
- title, path, and icon
- learning domain
- specific skills
- useful modes (`learn`, `practice`, `explore`, `create`, `review`, `reset`)
- age bands

The companion engine in:

`assets/khaemenes-kinder-companions.js`

reads the **actual current lesson** and scores resources against:
- week theme
- essential question
- literacy focus
- math focus
- inquiry focus
- SEL focus
- maker project
- the current day's lesson title, objective, and workshop

Monday through Friday may therefore receive different companion recommendations. This lesson-matching logic is intentionally preserved.

### Adding a specialized game

Create the HTML app in `/apps/`, then register its learning metadata in `RESOURCE_DEFINITIONS` inside `assets/khaemenes-kinder-resources.js`.

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

No fixed week-to-game mapping is required. Once a resource is registered, the companion engine can consider it wherever those skills occur.

## Identity and continuity

`assets/khaemenes-kinder-family-adapter.js` bridges the Academy Family Registry into Kindergarten compatibility data. It does not create a family, auto-promote a learner, or assign a mentor.

`assets/khaemenes-kinder-continuity.js` keeps learner-scoped Kindergarten records attached to the active Academy learner and exposes Archaemenes through the NAIB routing boundary. Older local mentor fields are not propagated as active authority.

Formal progress remains learner-scoped. Browser-local compatibility records are not authentication boundaries and should not contain secrets or privileged account material.

## Static-site limitation

GitHub Pages cannot inspect a newly added HTML file and determine what it teaches. New learning apps therefore need a small metadata registration so the lesson companion engine can match them safely and predictably.

## Visual direction

The Kinder Garden root portal keeps its colorful learning tree, open-play tools, lesson previews, Crechè bridge, Family Profile path, and lesson-aware practice tray.

The visual presentation may evolve independently of the mentor authority rule. The stable rule is:

**Archaemenes mentors. NAIB routes. The companion engine matches resources. The curriculum awards mastery according to its own assessment rules.**
