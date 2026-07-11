# DEV-002 App Shell and Layout System

The app shell and layout primitives live in `src/design-system/layout` and are exported from `src/design-system`.

This layer provides reusable structure only. It does not define product page content.

## Components

- `NivaAppShell`: route-aware application shell with desktop sidebar, topbar, mobile bottom navigation, and mobile sidebar drawer.
- `NivaSidebar`: accessible grouped navigation with active route state.
- `NivaTopbar`: title, subtitle, search field, leading action, and action slot.
- `NivaPageContainer`: responsive content container.
- `NivaSection`: section header pattern with eyebrow, title, description, action, and content slot.
- `NivaContentGrid`: responsive content grid.
- `NivaLayoutSurface`: token-backed layout surface for panel, card, and subtle utility surfaces.

## Navigation

Navigation items use this shape:

```ts
type NivaNavigationItem = {
  title: string;
  href: string;
  icon?: ComponentType;
  group?: string;
  disabled?: boolean;
};
```

Active state is derived from the current pathname. Exact paths and nested paths are supported.

## Accessibility

- Desktop sidebar and mobile bottom navigation use named `nav` regions.
- Active links use `aria-current="page"`.
- Disabled navigation items use `aria-disabled` and are removed from tab order.
- Mobile drawer uses `role="dialog"`, `aria-modal`, Escape close, and initial focus on the close action.
- Mobile drawer keeps Tab focus inside the drawer while open and returns focus to the trigger after close.
- Icon-only actions use `NivaIconButton`, which requires accessible labels.
- Search uses an explicit screen-reader label.

## Token Rules

All visual values use Niva CSS variables from `globals.css` or approved Tailwind layout primitives. Do not add literal color values to layout components.

## Example

```tsx
import { NivaAppShell } from "@/design-system";
import { appNavigation } from "@/lib/navigation";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <NivaAppShell
      navigation={appNavigation}
      brand={{ name: "Niva", description: "Finanzas personales" }}
      user={{ name: "Luis Eduvier Romo", initials: "LR", href: "/settings" }}
      primaryAction={<a href="/movements">Nuevo registro</a>}
    >
      {children}
    </NivaAppShell>
  );
}
```
