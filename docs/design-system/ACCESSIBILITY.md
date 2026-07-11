# Niva Design System Accessibility Notes

The component library targets WCAG AA behavior for reusable UI primitives.

## Keyboard

- Buttons and icon buttons use native `<button>` behavior.
- Switch uses `role="switch"` and updates through Enter or Space through native button activation.
- Tabs use `role="tablist"`, `role="tab"`, `role="tabpanel"`, roving `tabIndex`, Arrow Left / Arrow Right navigation, and Home / End navigation.
- Modal closes with Escape and traps Tab focus while open.

## Labels

- Icon-only actions require `label`.
- Form controls accept `label`, `description`, and `error`.
- Modal title is connected through `aria-labelledby`.
- Modal description is connected through `aria-describedby` when provided.

## Error States

- Field errors set `aria-invalid`.
- Field errors receive stable IDs when the control has an `id`.
- Visual error color is token-backed and has dark-mode equivalents.

## Focus

- All interactive components use the shared Niva focus ring.
- Focus rings are visible in light and dark mode.
- Modal returns focus to the previously focused element after close.

## Color and Contrast

- Component colors are sourced from approved tokens and exposed through CSS variables.
- Dark mode variables are defined for all component-level colors.
- Status components must use tone props rather than arbitrary colors.

## Reduced Ambiguity

- Default button type is `button`.
- Loading buttons set `aria-busy`.
- Skeletons are decorative and hidden from assistive technologies.
