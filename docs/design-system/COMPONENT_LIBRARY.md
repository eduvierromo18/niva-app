# Niva Component Library

The production component library lives in `src/design-system`. It implements the approved Niva design system using the canonical token files in `src/design/tokens` and CSS variables in `src/app/globals.css`.

Do not create one-off UI for product work. Compose with these components first.

## Exports

- `NivaButton`
- `NivaIconButton`
- `NivaInput`
- `NivaTextarea`
- `NivaSelect`
- `NivaSwitch`
- `NivaTabs`
- `NivaModal`
- `NivaCard`
- `NivaBadge`
- `NivaAlert`
- `NivaSkeleton`
- `NivaComponentLibraryExample`

## Component API

### NivaButton

Use for actions. Default `type` is `button` to avoid accidental form submits.

Props: `variant`, `size`, `iconLeft`, `iconRight`, `loading`, plus native button props.

Variants: `primary`, `secondary`, `ghost`, `danger`.

Sizes: `sm`, `md`, `lg`.

### NivaIconButton

Use for icon-only actions. `label` is required and becomes both `aria-label` and `title`.

Props: `icon`, `label`, `variant`, `size`, plus native button props.

### NivaInput, NivaTextarea, NivaSelect

Use for forms. These components own label, description, error state, `aria-invalid`, and error description wiring.

Props: `label`, `description`, `error`, plus the native control props. `NivaSelect` receives `options`.

### NivaSwitch

Use for binary settings. It is controlled through `checked` and `onCheckedChange`.

Props: `checked`, `label`, `description`, `onCheckedChange`, plus safe button props.

### NivaTabs

Use for switching between related views. It implements `role="tablist"`, roving tab index, Arrow Left / Arrow Right navigation, and Home / End navigation.

Props: `tabs`, `value`, `onValueChange`, `label`.

### NivaModal

Use for blocking dialogs. It manages Escape close, focus trapping, focus return, `aria-modal`, and labelled title/description.

Props: `open`, `title`, `description`, `children`, `onClose`, action labels, action handlers, `footer`, `preview`.

### NivaCard, NivaBadge, NivaAlert, NivaSkeleton

Use for layout, status, feedback, and loading states. Tone values are typed and token-backed.

## Examples

Examples live in `src/design-system/examples/component-library.examples.tsx`. They are importable examples, not app pages.

```tsx
import { NivaButton, NivaInput } from "@/design-system";

export function Example() {
  return (
    <form className="grid gap-4">
      <NivaInput id="movement-name" label="Nombre" placeholder="Renta mensual" />
      <NivaButton type="submit">Guardar</NivaButton>
    </form>
  );
}
```

## Rules

- Use exported components instead of hardcoded Tailwind component blocks.
- Use canonical tokens through CSS variables and `src/design/tokens`.
- Do not add new variants unless they are approved in the design system.
- Do not place product-specific behavior inside design-system components.
- Prefer composition: pass icons, actions, panels, and children rather than creating duplicate components.
