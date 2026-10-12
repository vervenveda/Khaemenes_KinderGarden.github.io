# Dependency Hardening Record

## Current boundary

The learner-facing curriculum is intended to run without third-party JavaScript libraries, remote fonts, remote audio, or direct browser fetches to third-party services. Optional science-enrichment destinations (for example, PhET, PBS Kids, NASA, National Geographic Kids, AMNH, Smithsonian, and Science Bob) are hyperlinks only; they are not needed to open lessons, play local activities, record mastery, or unlock a certificate.

The shared Academy scripts hosted on the Verve N Veda domain are owned-ecosystem resources, not third-party libraries. They remain an origin/service boundary and must not be described as locally bundled or fully sovereign until deployed and resolved inside the chosen local/STOS hosting boundary.

## Three hardening actions

1. **Immutable CI actions.** The validation workflow pins `actions/checkout` to `3d3c42e5aac5ba805825da76410c181273ba90b1` (v7.0.1) and `actions/setup-node` to `949feb2413d6458794dcd2491c4babbbce0c15c1` (v7.1.0). This prevents moving tags from silently changing the workflow code.
2. **Least privilege.** The workflow grants `contents: read` only and sets `persist-credentials: false` for checkout. The CI job cannot push repository changes through the checkout credential.
3. **Truthful sovereignty boundary.** The workflow is explicitly validation-only. It uses GitHub-hosted runner infrastructure and third-party Actions, so CI is a documented development-time external dependency—not learner runtime authority and not a sovereign compute environment.

## Revalidation

The contract is recorded in `contracts/STOS_VALIDATION_PROFILE_v1.json`. The formal-gate validator checks that action references remain full 40-character commit SHAs, the checkout credential is not persisted, and workflow permissions remain read-only.

## Remaining verification limit

Automated repository checks can detect source-level dependency regressions, but they do not prove browser-network isolation by themselves. For a complete offline acceptance test, load the published lesson with network access disabled and verify the local lesson, games, progress state, daily evidence flow, and mastery UI still work. Optional enrichment links may naturally be unavailable offline.


## Regression enforcement added

The active validation workflow also runs `scripts/validate-dependency-boundary.mjs`.
It scans live HTML/JavaScript/CSS sources for unapproved remote runtime resource
tags, literal third-party `fetch()` / dynamic `import()` / XHR calls, remote CSS
imports, remote font providers, and external links opened in a new tab without
`rel=noopener`.

The only approved remote runtime script URLs are the three explicitly listed in
the scanner: the Kinder Garden mastery gate, the shared Beta link, and the Academy
Family Registry. These are owned-ecosystem assets, not third-party libraries;
they remain remote origin/service dependencies and are not locally bundled.
Any new remote script/style/image/audio/frame resource must be reviewed and
explicitly approved rather than silently added.

The workflow triggers on HTML, JavaScript, CSS, dependency-policy, and validator
changes so a dependency regression cannot bypass checks merely because the root
landing page changed outside the original curriculum-only path filter.

The scanner is a source-level guard. It does not claim that every runtime network
request has been observed; offline browser acceptance remains a separate test.
