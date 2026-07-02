---
title: Product Language Tokens
version: 0.1.0
status: Review
owner: Product Team
last_updated: 2026-07-02
related_chapters:
  - ../01-brand/brand-vocabulary.md
  - ../01-brand/voice.md
  - ../02-ndl/writing.md
  - tokens.md
related_product_specs: []
---

# Product Language Tokens

Product Language Tokens are the future system for centralizing product text in Niva.

Every recurring label, action, empty state, success message, error, and notification should eventually originate from a documented language token.

This sprint creates the documentation foundation only.

Do not create JSON.

Do not modify code.

Do not integrate Product Language Tokens into the app yet.

## Purpose

Visual tokens make interface decisions reusable.

Product Language Tokens do the same for words.

They give Niva a shared language layer so product copy can stay consistent across navigation, cards, forms, notifications, emails, charts, settings, and the future AI assistant.

## Definition

A Product Language Token is a stable key that represents an approved piece of product language.

The key is not shown to the user.

The value is the human-facing copy that belongs to Niva.

Example:

| Token | Product Copy | Purpose |
| --- | --- | --- |
| `plt.navigation.home` | Inicio | Primary navigation label for the starting screen. |
| `plt.money.available` | Disponible | Label for money the user can use now. |
| `plt.success.saved` | Todo listo | Generic calm success confirmation. |

## Naming Model

Product Language Tokens should be grouped by product meaning, not by component implementation.

Use this pattern:

```text
plt.category.semanticName
```

The category describes the language area.

The semantic name describes the meaning.

## Example Token Foundation

| Token | Product Copy | Notes |
| --- | --- | --- |
| `plt.navigation.home` | Inicio | Replaces software-oriented labels like "Dashboard". |
| `plt.navigation.activity` | Actividad | Names financial movement without saying "Transaction List". |
| `plt.navigation.accounts` | Cuentas | Uses the familiar product object. |
| `plt.navigation.goals` | Objetivos | Connects planning to outcomes. |
| `plt.money.available` | Disponible | Answers what the user can use. |
| `plt.money.reserved` | Reservado | Explains money set aside. |
| `plt.money.total` | Total | Uses the simplest complete-number label. |
| `plt.success.saved` | Todo listo | Calm generic success state. |
| `plt.success.accountCreated` | Cuenta creada | Specific completion message for accounts. |
| `plt.empty.noActivity` | Todavía no hay actividad | Human empty state for activity. |
| `plt.error.generic` | Algo no salió bien | Calm generic error language. |

## Token Categories

Initial Product Language Token categories should include:

- `plt.navigation`
- `plt.money`
- `plt.activity`
- `plt.accounts`
- `plt.goals`
- `plt.buttons`
- `plt.empty`
- `plt.error`
- `plt.success`
- `plt.notifications`
- `plt.dates`
- `plt.numbers`

These categories may evolve as the product grows, but new categories must be documented before they are used.

## Why PLTs Matter

### Consistency

PLTs prevent the same concept from being named differently across screens.

If "Disponible" is the approved word, it should not become "Balance", "Cash", or "Monto disponible" elsewhere without an intentional vocabulary decision.

### Localization

PLTs create a future path for localization.

When product copy is centralized by meaning, each language can translate intent instead of translating scattered interface strings one by one.

### Accessibility

Consistent language helps users build recognition.

It also supports future screen reader review because repeated actions and states can be audited from a shared source.

### Maintenance

Centralized language reduces copy drift.

When a term changes, the team can identify every place the concept appears and update it with less risk.

### AI Integration

The future Niva assistant should speak with the same vocabulary as the interface.

PLTs give AI features a controlled language foundation so assistant responses, summaries, and explanations do not introduce forbidden or inconsistent terms.

### Future Automation

PLTs make future QA possible.

Automated checks can compare product copy against approved tokens, flag forbidden words, and detect undocumented language.

## Governance

Product Language Tokens should follow the Brand Vocabulary chapter.

A token may be created only when:

- The visible copy is approved language.
- The token name describes meaning, not UI placement.
- The copy is reusable or strategically important.
- The token has a clear owner and related chapter.
- The token does not duplicate an existing language decision.

## Documentation Requirements

Before Product Language Tokens are implemented in code, the Handbook must define:

- Token naming rules.
- Token categories.
- Ownership.
- Review process.
- Localization model.
- Accessibility review process.
- Migration plan from hardcoded product copy.

## Non-Goals

This chapter does not create a technical implementation.

This chapter does not require a JSON file.

This chapter does not change app copy.

This chapter does not modify components, routes, screens, database, Supabase, Tailwind, or product specs.

## Chapter Status

Status: Review.

This chapter is the documentation foundation for the future Product Language Token system.
