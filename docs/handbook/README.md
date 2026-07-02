---
title: Niva Handbook
version: 0.1.0
status: Review
owner: Product Team
last_updated: 2026-07-02
related_chapters:
  - 00-the-constitution/README.md
  - 01-brand/README.md
  - 03-design-system/README.md
related_product_specs: []
---

# Niva Handbook

The Niva Handbook is the official source of truth for the product.

It defines what Niva is, how it behaves, how it looks, how it speaks, how it is built, and how decisions become software. Code implements the Handbook. The Handbook does not document code after the fact.

## Purpose

Niva is a personal financial control center. The Handbook keeps the product coherent as it grows: brand, product, design, engineering, roadmap, and decisions all live under one versioned system.

## How To Navigate

- Start with [Version](VERSION.md) for status and ownership.
- Read [The Constitution](00-the-constitution/README.md) to understand the product foundation.
- Use [Brand](01-brand/README.md) for brand architecture, essence, personality, vocabulary, identity, voice, naming, and visual DNA.
- Use [NDL](02-ndl/README.md) for experience principles and interface language.
- Use [Design System](03-design-system/README.md) for reusable visual, component, and product language token rules.
- Use [Product](04-product/README.md) for module-level specifications.
- Use [Engineering](05-engineering/README.md) for architecture and implementation constraints.
- Use [Decisions](06-decisions/README.md) for ADRs and decision records.
- Use [Roadmap](07-roadmap/README.md) for current work, backlog, milestones, and releases.
- Use [Templates](templates/chapter-template.md) when creating new chapters.

## Official Flow

```text
Idea
  |
Handbook
  |
Product Spec
  |
Mockup
  |
Review
  |
Approval
  |
Development
  |
QA
  |
Release
  |
Update Handbook
```

## Collaboration

Every meaningful change starts as a Handbook update or references an existing Handbook rule.

1. Identify the affected volume.
2. Update or create the smallest relevant chapter.
3. Link related chapters.
4. Add a Product Spec or ADR when the change affects product behavior or long-term direction.
5. Update [CHANGELOG.md](CHANGELOG.md) when the Handbook structure, version, or source of truth changes.

## Chapter Approval

A chapter is approved when it has:

- Clear purpose and scope.
- Links to related chapters.
- No duplicated source of truth.
- A named status.
- Enough detail to guide implementation without guessing.

## Versioning

The Handbook uses semantic versioning:

- Major: foundational direction changes.
- Minor: new volumes, chapters, or product rules.
- Patch: corrections, wording, and link maintenance.

Current status is tracked in [VERSION.md](VERSION.md).

## Scope Rules

This sprint is documentation-only. It must not modify React, Next.js, Tailwind, Supabase, database schema, components, hooks, screens, financial logic, or UI behavior.
