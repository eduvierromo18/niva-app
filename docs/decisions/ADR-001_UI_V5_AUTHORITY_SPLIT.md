# ADR-001: UI v5 Authority Split

## Status

Accepted

## Date

2026-07-12

## Context

Niva's approved product manual and approved identity system define related but distinct visual responsibilities. Earlier implementation mixed warm product tokens, generic brand marks and legacy Aurora styles, matching neither authority consistently.

## Decision

- Niva Design Manual v4 governs every product surface.
- Niva Meridian Identity v1 governs the mark and wordmark.
- Product UI uses cool neutrals, evergreen `#1E7A4E`, Inter, Manrope and IBM Plex Mono.
- Meridian retains its sanctioned ultramarine crossing only inside the mark.
- The Niva wordmark uses Archivo Light with approved tracking.
- Navigation, information architecture, screen grids and financial behavior are preserved unless an approved Product Spec says otherwise.

## Consequences

- Warm legacy tokens and Aurora components must leave active routes.
- Brand assets need ground-specific light and dark variants.
- Product and brand accents intentionally differ.
- New UI decisions cannot be introduced during compliance remediation without a governed RFC.

## Sources

- Niva Design Governance v1.0
- Niva Design Manual v4.0
- Niva Meridian Identity v1.0
- Niva UI v5.0 Compliance Report

