# Khaemenes Kinder Garden — Current Build v1.3.0 STOS-Wired Candidate

**Date:** 2026-09-09

## Academy hierarchy

**Khaemenes Home is the gateway into Khaemenes Academy.**

```text
Khaemenes Home
  ├─ Family / Enrollment / Placement
  ├─ Student Portal
  ├─ Teacher Administration
  ├─ Preschool / Crechè
  ├─ Kinder Garden
  ├─ Elementary
  ├─ Middle
  ├─ High
  └─ Higher Learning
```

Kinder Garden is a downstream school surface. It does not own Academy identity,
family authority, placement, authentication, or cross-school navigation.

## Protected internal path

```text
Kinder Garden
   ↓
Nexus
   ↓
Buddy
   ↓
Avouch
   ↓
Klik
   ├─ Khaemenes Account Cloud / Storage Fabric
   ├─ STOSCore → NAIB → Archaemenes (Wise Owl)
   └─ Beta evidence service
```

The browser keeps only resilience/cache state when the internal service is
temporarily unavailable.

## Mastery policy

The 80% formal mastery threshold remains unchanged.

The evidence policy is intentionally tiered:

- **Weeks 1–4:** foundation/orientation evidence inside the formal lesson experience.
- **Weeks 5–25:** five learner-scoped daily evidence receipts are required before the weekly mastery demonstration.
- **Weeks 26–36:** synthesis/capstone weekly demonstration plus portfolio evidence.

Participation evidence never substitutes for mastery evidence. Essential
criteria may be required in addition to the numeric threshold.

## Curriculum hardening

The canonical course data now has distinct day-level instructional fields for
all 180 lessons:

- objective;
- morning circle;
- teacher script;
- guided practice;
- independent practice;
- reflection;
- assessment;
- evidence.

Thin formal-content weeks were strengthened with unit-specific five-day
teaching/family notes and mastery safeguards.

## External data

No learner-facing page performs a direct external `fetch()` or dynamic import.

Weather and astronomy now resolve through internal STOS service routes. The
backend may use Floo → Egress for approved outside data.

External science websites that remain in the repository are optional enrichment
links only. They are not curriculum, mastery, family, mentor, or persistence
authority.

## Maintenance and CI dependency boundary

The learner runtime does not depend on GitHub Actions or Node. The repository does retain one GitHub Actions workflow for developer-time validation only; this workflow is not learner, identity, mastery, or persistence authority. Because CI runs on GitHub-hosted infrastructure and uses third-party Actions, it is a development-time external dependency, not a sovereign runtime component.

Hardening applied: `actions/checkout` and `actions/setup-node` are pinned to full commit SHAs, checkout credentials are not persisted, and the workflow grants only `contents: read`. Local/native validation remains the independent acceptance path; the CI result is supporting evidence, not operational authority.

Current validation requirements are declared in:

`contracts/STOS_VALIDATION_PROFILE_v1.json`
