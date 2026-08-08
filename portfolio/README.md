# Khaemenes Kinder Garden Portfolio Builder 🌱

A Kindergarten-specific version of the Khaemenes Portfolio Builder.

## Purpose
This app turns the Kindergarten year into a gentle local learning story rather than a score-driven record.

It collects:
- early literacy work
- number and math activities
- science noticing
- history/community work
- art and music
- movement
- self-regulation and life skills
- drawings
- photos
- child reflections
- parent/teacher observations
- favorite learning adventures

## Learning Adventures
The launcher is centered on the current `Khaemenes_KinderGarden.github.io/apps` collection, with selected Preschool review resources, Bazaar Art enrichment, and a few Elementary K–1 enrichment tools.

Apps open in a scalable modal with:
- upper-right X
- Print
- Favorite
- Open in New Tab
- responsive iframe
- Escape-key close

## Profiles
The current child profile includes:
- child name
- Kindergarten
- school year
- favorite adventures
- chosen portfolio memories

A local parent/guardian profile stores display name and private local notes.

## NAIB Kindergarten Mentor
NAIB can:
- summarize the portfolio
- notice missing learning areas
- suggest gentle reflection prompts
- suggest possible representative memories
- discuss growth in context

NAIB cannot:
- choose official evidence
- exclude work
- complete or certify the year record

Those decisions remain with a parent, teacher, or mentor.

## Growth model
The sidebar emphasizes:
- Literacy
- Math
- Creative
- Whole Child

It deliberately avoids ranking Kindergarten children.

## Sovereign Grade Vault
Approved/chosen evidence can be mirrored to IndexedDB:

Database:
`KhaemenesKinderGardenPortfolioVault`

Portfolio state key:
`khaemenes_kindergarten_portfolio_builder_v1`

## Browser limitation
Apps on another origin cannot share localStorage directly. Cross-repository work should be imported through JSON/file export. Remote apps may also block iframe embedding or in-frame printing; Open in New Tab remains available.

## Repository placement
Recommended:
`Khaemenes_KinderGarden.github.io/portfolio/index.html`

## Validation
JavaScript validated with Node `--check`.

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
