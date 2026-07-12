# Niva Design Tokens

## Authority

Niva Design Manual v4.0 governs product tokens. Niva Meridian Identity v1.0 governs only the mark and wordmark.

## Product Foundation

| Role | Token | Value |
| --- | --- | --- |
| Canvas | `--niva-color-background` | `#FAFBFC` |
| Surface | `--niva-color-surface` | `#FFFFFF` |
| Ink | `--niva-color-foreground` | `#111827` |
| Body | `--niva-color-body` | `#1F2937` |
| Muted | `--niva-color-muted` | `#6B7280` |
| Border | `--niva-color-border` | `#E5E7EB` |
| Accent | `--niva-color-accent` | `#1E7A4E` |
| Accent hover | `--niva-color-accent-hover` | `#186640` |
| Accent wash | `--niva-color-accent-surface` | `#DCEFE4` |
| Negative | `--niva-color-danger` | `#454B57` |
| Information | `--niva-color-info` | `#5B6472` |

Ultramarine `#27409A` and lifted ultramarine `#6E8AD6` are brand-mark colors and cannot be used for product actions.

## Typography

- Inter: body, labels, controls and tables.
- Manrope: titles and primary financial figures.
- IBM Plex Mono: tracked eyebrows, dates and identifiers.
- Archivo Light: Meridian wordmark only.

All production fonts are served locally from `public/fonts`.

## Shape

Approved radius scale: 8, 12, 18, 22 and 26 pixels. Full radius is reserved for pills and circular controls.

## Elevation

Shadows use cool neutral `rgb(16 24 40)` values. Warm-tinted shadows are not allowed.

## Motion

Product transitions use 180ms and the standard `cubic-bezier(0.2, 0, 0, 1)` curve unless an approved component specification says otherwise.

## Implementation

- Typed values: `src/design/tokens/`
- CSS values: `src/app/globals.css`
- Components: `src/design-system/`
- Live catalogue: `/design-system`
