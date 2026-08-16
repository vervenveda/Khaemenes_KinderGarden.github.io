# Khaemenes Kinder Garden · Canonical Mentor Logic

This file preserves the current mentor integration rule for Kinder Garden while the platform is being stabilized.

## Current mentor authority

Archaemenes is the current Khaemenes Academy mentor for Kindergarten learners.

Kinder Garden should not locally invent, select, or replace the mentor identity.

The intended public-facing flow is:

```text
Academy Family Registry
        ↓
active Kindergarten learner
        ↓
NAIB mentor-routing boundary
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

### NAIB mentor routing

Owns the public mentor-assignment contract.

For the current Kindergarten stage, NAIB assigns:

```text
mentor: Archaemenes
presentation: Early Scholar
```

The routing call should use only the minimum immediate context necessary for the assignment, such as:

- stage: kindergarten
- broad age band
- broad interests
- current surface
- current educational intent

The public page should not send unnecessary personal identifiers through the mentor-assignment request when they are not required.

### Archaemenes

Archaemenes is the mentor identity that appears to the learner.

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

This is a separate responsibility from mentor assignment.

The companion engine may determine which registered games, Crechè bridge activities, practice tools, or learning resources best match the current week/day/objective.

Archaemenes may then present or recommend those matched resources to the learner.

In short:

```text
NAIB decides WHO mentors.
Archaemenes is the mentor.
The Kinder companion engine helps determine WHAT learning resource fits the lesson.
```

## Legacy mentor fields

Older Kinder Garden code may contain or encounter fields such as:

- `mentorId`
- `mentorIdentity`
- `personality`
- `baseStyle`
- locally embedded mentor tables
- custom visible mentor settings

These fields are compatibility data only during stabilization.

They must not override the current NAIB → Archaemenes assignment.

Legacy values may be read only when required for migration or compatibility, and should not be written back as new mentor authority.

## Current local mentor names to retire

The previous local mentor set — Pip, Miri, Nova, and Sage — should not remain as active mentor identities in Kinder Garden.

If related communication-style data is still needed during migration, it may be translated into neutral presentation preferences without preserving those characters as mentor authorities.

## Future Mentor Adoption / Avatar Program

A future responsible Mentor Adoption program may allow a learner or family to design and adopt an AI avatar/mentor under Academy safety, privacy, identity, continuity, guardian, and governance rules.

That program is intentionally deferred until the platform is stable.

Until the formal adoption program exists:

- Archaemenes remains the Kindergarten mentor.
- Kinder Garden should not expose a local custom-mentor creator.
- Avatar or appearance customization should not silently create a second AI identity.
- No custom mentor should bypass Academy safety, family authority, or NAIB routing.

When the future program is introduced, the Kinder Garden pages should continue calling the same mentor-routing boundary. The implementation behind that boundary may then return an approved adopted mentor instead of Archaemenes when authorized.

This preserves the page contract and prevents another architectural rewrite.

## Fallback behavior

If the public mentor router is temporarily unavailable, Kinder Garden may use a presentation-only Archaemenes fallback so the page does not become blank.

The fallback must not pretend to be a second assignment authority.

Recommended fallback identity:

```text
id: archaemenes
name: Archaemenes
title: Scholar Owl
presentationMode: early-scholar
assignedBy: NAIB
```

The fallback is only a continuity/presentation safeguard for the public child-facing surface.

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

While Kinder Garden is being hardened, preserve this formula consistently:

```text
Family identity → NAIB routing → Archaemenes → lesson-aware resource matching → bounded learner experience
```

Do not merge the future avatar/adoption program into current production logic until that program has its own approved architecture and safety boundary.
