# Kindergarten Entry Placement Invariant v1

Status: ACTIVE PROTECTION CONTRACT
Branch: main
Date: 2026-10-28

## Purpose
Khaemenes Academy Kindergarten has an entry assessment pathway described by the Academy founder: the beginning assessment directs a learner either to a Kindergarten Preparatory course or directly into Kindergarten according to the assessment result.

The current repository audit did not locate the original diagnostic page or its scoring implementation on main. This contract protects the intended behavior while the original implementation is recovered and verified. It does not invent a replacement score threshold.

## Non-negotiable entry behavior
1. Preserve one stable learner identity across Preschool, placement assessment, Kindergarten Preparatory, Kindergarten, family records, and graduation.
2. The entry assessment is placement evidence, not a diagnosis, ability label, disability screen, or punishment.
3. The two assessment outcomes are Kindergarten Preparatory or direct Kindergarten.
4. Do not invent, change, or infer the assessment cut score until the original scoring authority is located and verified.
5. A Preparatory recommendation remains supportive and reviewable through the Academy placement process.
6. Kindergarten guardian authorization remains separate from placement.
7. Existing Preschool history, keepsakes, learner ID, family permissions, and prior records survive either pathway.
8. No weekly Kindergarten mastery score may be repurposed as the entry-placement score.
9. Any restored placement implementation must store assessment version, result, pathway, timestamp, and learner ID.

## Current forensic finding
Family Registry contains canonical stage/grade placement authority. Academy Enrollment currently permits an adult to select Kindergarten and then routes to separate Kindergarten guardian release. The current Kindergarten main tree does not expose a file named preparatory, placement, readiness, entrance, or diagnostic for the beginning assessment. Repository commit search did not recover a commit explicitly named preparatory or placement assessment. The original diagnostic scoring implementation is therefore UNVERIFIED, not assumed intentionally absent.

## Repair boundary
Until the original assessment is recovered, do not create a substitute scored diagnostic, delete compatibility routes discovered later, describe direct grade selection as having passed the placement assessment, block public exploration behind formal placement, or alter the 80% weekly Kindergarten mastery authority.

## Acceptance test
Preschool or unenrolled learner -> entry assessment -> verified result -> exactly one recommended pathway -> stable learner ID -> appropriate family placement -> Kindergarten guardian authorization only when entering formal Kindergarten -> learner-specific records remain isolated.

A second fictional learner on the same device must be able to receive a different pathway without changing the first learner's result or records.


## Home-page design freeze for Bubble 2
Founder direction recorded 2026-10-28: no design changes are authorized on the Kindergarten home page during the learner-journey/browser-certification pass.

Bubble 2 may test the home page and may repair nonvisual functional defects only when necessary, but must not change its visual/layout/content design, typography, palette, header, toolbar, cards, spacing, or decorative treatment.

## Browser-journey finding
The current end-to-end Preschool -> Kindergarten journey test reaches Academy Enrollment & Placement and programmatically accepts the existing grade prompt with "k". That proves stable identity and downstream Kindergarten authorization behavior, but it does not prove the founder-required scored entry assessment or its Kindergarten Preparatory/direct-Kindergarten branch.

Until the original scoring authority is recovered, direct grade selection must remain classified as an unverified placement bypass rather than evidence that the entry assessment passed.


## Deferred NAIB integration
Founder direction recorded 2026-10-28: NAIB is the Academy administrative AI authority/module responsible for the placement decision. Recovery and certification of NAIB's placement-assessment integration is intentionally deferred because it crosses deeper Academy/AI administration architecture.

This deferral does not waive the entry-placement invariant. During Bubble 2:
- do not invent a cut score;
- do not duplicate NAIB decision authority inside Kindergarten;
- do not treat the current direct grade selector as NAIB evidence;
- do not block independent learner-journey hardening on the deferred integration;
- preserve the home-page design freeze.

Bubble 2 may close its independent browser, storage, learner-isolation, guardian-authorization, reload, and mastery-protection work with NAIB placement integration explicitly listed as deferred follow-up.
