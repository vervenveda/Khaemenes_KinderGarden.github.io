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
- personalized Kinder Garden Mentor
- assessment / certificate progression

The Academy Family Registry is the identity source for formal learning. The Kinder Garden page does not create a second local learner account.

## Curriculum

- 36 weeks
- 180 daily lessons
- 36 weekly mastery checks
- midyear demonstration
- final readiness demonstration
- portfolio evidence
- 80% mastery progression

The course data covers literacy, mathematics, inquiry/science, social-emotional learning, art/maker work, movement/health, civics/community, and technology.

## NAIB Living Learning Resource Registry

The important v11 change is that NAIB no longer depends on a fixed week-to-game lookup table.

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

reads the **actual current lesson** and scores resources against:
- week theme
- essential question
- literacy focus
- math focus
- inquiry focus
- SEL focus
- maker project
- the current day's lesson title / objective / workshop

That means Monday, Tuesday, Wednesday, Thursday, and Friday may receive different companion recommendations.

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

That is enough for NAIB to consider the tool anywhere those skills occur. **No manual Week 14 mapping is required.**

For backward compatibility, the registry can also ingest entries from the older root `APPS` array and infer first-pass skill tags from the title, description, and group.

## Important static-site limitation

GitHub Pages cannot privately inspect a folder and infer what a new HTML file teaches. A new file therefore needs a small metadata entry so NAIB knows its skills. Once registered, lesson matching is automatic.

## Mentor architecture

The Kinder Garden Mentor:
- uses the active Academy learner ID
- preserves the learner's Mentor identity
- remains bounded and child-safe
- knows the learner's current academic position
- may recommend matched practice tools
- does not replace the parent, guardian, educator, or formal lesson

## Core files updated in v11

- `index.html`
- `assets/khaemenes-kinder-resources.js`
- `assets/khaemenes-kinder-companions.js`
- `assets/khaemenes-kinder-family-adapter.js`
- `assets/khaemenes-kinder-continuity.js`
- `curriculum/index.html`
- `curriculum/assets/app.js`
- `curriculum/assets/companion-layer.js`
- `README.md`
- `VALIDATION.json`
