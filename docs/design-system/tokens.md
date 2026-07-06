# Niva Visual Tokens

## Purpose

The Niva visual token layer defines the first technical foundation for the Niva Design Language. Tokens are plain TypeScript values that describe color, typography, spacing, radius, shadows, motion, and surfaces for a calm financial interface.

This sprint only creates the system foundation. Do not apply these tokens globally until a later implementation sprint.

## Source

Use the token modules in `src/design/tokens` or the composed theme in `src/design/theme.ts`.

```ts
import { nivaTheme } from "@/design/theme";
import { colors, spacing } from "@/design/tokens";
```

## Token Groups

- `colors`: White-first neutrals, restrained green accent, financial state colors, and semantic aliases.
- `typography`: Modern sans-serif stack, type sizes, line heights, weights, and reusable text styles.
- `spacing`: A generous spacing scale for layout rhythm and component padding.
- `radius`: Rounded values for light cards, panels, controls, and full pills.
- `shadows`: Minimal elevation for quiet hierarchy and focus treatment.
- `motion`: Short, calm durations and easing values for subtle interaction.
- `surfaces`: Composed surface recipes for app backgrounds, panels, cards, and subtle sections.

## Usage Guidance

Prefer semantic tokens when building product UI. For example, use `colors.semantic.accent` for a primary action accent instead of choosing a raw green shade directly.

Use surface tokens for new Niva primitives when a component needs a complete visual recipe. They bundle background, border, radius, and shadow decisions so cards remain light and consistent.

Use raw scale tokens when the component needs a specific primitive value, such as `spacing[6]`, `radius.lg`, or `typography.textStyle.bodySmall`.

## Boundaries

- Do not import these tokens into global CSS yet.
- Do not replace existing Aurora styles as part of this sprint.
- Do not change business logic, routing, hooks, queries, or Supabase code when consuming tokens.
- Keep future token adoption incremental and component-scoped.
