# Khaemenes Kinder Garden · Canonical Mentor Logic

This file preserves the current mentor integration rule for Kinder Garden while the platform is being stabilized.

## Current Academy relationship

Archaemenes is the current **Khaemenes Academy mentor** for Kindergarten learners.

Kinder Garden should not locally invent, select, or replace the mentor identity.

The intended public-facing flow is:

```text
Academy Family Registry
        ↓
active Kindergarten learner
        ↓
NAIB intake / delegation
        ↓
Khaemenes Academy
        ↓
Archaemenes
        ↓
Early Scholar presentation
        ↓
Kinder Garden lesson context and learning tools
```

## Separation of responsibilities

### Family Registry

Owns the active learner context for the formal Kindergarten experience.

It provides only the learner information needed by Kinder Garden, such as learner ID, nickname, stage, broad age band, interests, and guardian/family context.

It does not grant the Kinder Garden page authority to invent a mentor identity.

### NAIB delegation

NAIB is the front-desk administrator / AI Resources Director. It receives a bounded visitor context, interprets the immediate need, and delegates to the appropriate Academy campus, specialist platform, game, knowledge resource, civic resource, communications hub, or other destination.

For a Kindergarten learner entering Khaemenes Academy, NAIB delegates the learner into the Academy environment. **The Academy then provides Archaemenes as its institutional educational mentor.**

The routing call should use only the minimum immediate context necessary for delegation, such as:

- stage: kindergarten
- broad age band
- broad interests
- current surface
- current educational intent

The public page should not send unnecessary personal identifiers through the delegation request.

### Archaemenes

Archaemenes is the Academy mentor identity that appears to the learner.

His Kindergarten presentation may be adapted for the developmental stage, but the identity remains continuous.

Expected Kindergarten presentation principles:

- clue-first
- age-adaptive
- encouraging of effort
- one clear step at a time
- bounded young-learner interaction
- does not award mastery independently
- does not replace parent, guardian, educator, or formal assessment

### Kinder Garden lesson companion engine

`assets/khaemenes-kinder-companions.js` remains responsible for matching learning resources to the actual lesson.

This is separate from NAIB delegation and separate from the Academy's mentor relationship.

The companion engine may determine which registered games, Crechè bridge activities, practice tools, or learning resources best match the current week/day/objective.

Archaemenes may then present or recommend those matched resources to the learner.

In short:

```text
NAIB decides WHERE the visitor should go.
Khaemenes Academy provides Archaemenes.
Archaemenes mentors the learner.
The Kinder companion engine helps determine WHAT learning resource fits the lesson.
```

## Specialist platform boundary

A Khaemenes learner may also enter specialized Verve N Veda platforms. Those platforms may present their own specialist AIs inside their own domains. NAIB may delegate the learner to those destinations without permanently replacing Archaemenes as the Khaemenes Academy mentor.

## Legacy mentor fields

Older Kinder Garden code may contain or encounter fields such as:

- `mentorId`
- `mentorIdentity`
- `personality`
- `baseStyle`
- locally embedded mentor tables
- custom visible mentor settings

These fields are compatibility data only during stabilization. They must not override the current Academy → Archaemenes relationship.

Legacy values may be read only when required for migration or compatibility and should not be written back as new authority.

## Current local mentor names to retire

The previous local mentor set — Pip, Miri, Nova, and Sage — should not remain as active mentor identities in Kinder Garden.

If related communication-style data is still needed during migration, it may be translated into neutral presentation preferences without preserving those characters as mentor authorities.

## Future Mentor Adoption / Avatar Program

A future responsible Mentor Adoption program may allow a learner or family to design and adopt an AI avatar/mentor under Academy safety, privacy, identity, continuity, guardian, and governance rules.

That program is intentionally deferred until the platform is stable.

Until the formal adoption program exists:

- Archaemenes remains the Khaemenes Academy mentor.
- Kinder Garden should not expose a local custom-mentor creator.
- Avatar or appearance customization should not silently create a second AI identity.
- No custom mentor should bypass Academy safety, family authority, or NAIB delegation.

## Runtime compatibility

Current school code may still call the historical `assignMentor()` / `requestMentor()` methods. NAIB v2 keeps those methods as compatibility seams while clients migrate to `delegate()` / `requestDelegation()`.

A compatibility response for Kindergarten must still resolve to Khaemenes Academy and Archaemenes. The compatibility method does not make NAIB the mentor.

## Fallback behavior

If the public NAIB delegation router is temporarily unavailable, Kinder Garden may use a presentation-only Archaemenes fallback so the page does not become blank.

The fallback must not pretend to be a second assignment authority.

Recommended fallback identity:

```text
id: archaemenes
name: Archaemenes
title: Scholar of Khaemenes Academy
presentationMode: early-scholar
relationship: Khaemenes Academy mentor
```

## Child interaction boundary

The Kindergarten mentor should remain bounded rather than becoming unrestricted private child chat.

Appropriate child-facing interactions include:

- What should I do next?
- I feel stuck.
- I finished something.
- I need a break.
- Will you do it with me?
- Read this to me.
- Show me a clue.
- Help me choose practice.

Feelings and frustration may influence immediate wording or resource recommendations but should not become a permanent psychological profile or diagnosis.

Archaemenes must not infer intelligence, academic potential, diagnosis, protected traits, politics, religion, socioeconomic status, or disciplinary risk from appearance, voice, age, interests, or presentation preferences.

## Curriculum authority

Archaemenes may guide, encourage, explain, recommend, and help the learner navigate.

He should not independently change formal mastery, assessment, certification, account permissions, guardian controls, or academic records outside the authorized curriculum logic.

The existing 36-week record remains attached to the learner's formal Kindergarten continuity system.

## Stabilization rule

Preserve this formula consistently:

```text
Family identity → NAIB delegation → Khaemenes Academy → Archaemenes → lesson-aware resource matching → bounded learner experience
```

Do not merge the future avatar/adoption program into current production logic until that program has its own approved architecture and safety boundary.
