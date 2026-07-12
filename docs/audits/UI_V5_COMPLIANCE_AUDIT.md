# Niva UI v5.0 — Compliance Audit

## Control

- Status: Completed
- Audit date: 2026-07-12
- Owner: Development
- Scope: Production frontend at commit `06a4201`
- Result: Partial compliance; remediation required

## Authorities

1. `00_Governance/Approved/Niva Design Governance v1.0.html`
2. `03_Design_System/Approved/Manual/Niva Design Manual v4.0.html`
3. `02_Brand/Approved/Identity/Niva Meridian Identity v1.0.html`
4. `04_UI/Approved/v5.0/Niva UI v5.0.html`
5. `04_UI/Approved/v5.0/Niva UI v5.0 Compliance Report.html`

The approved compliance report resolves the visual-authority split: Design Manual v4 governs product surfaces; Meridian governs the mark and wordmark.

## Executive Result

| Area | Status | Evidence | Remediation phase |
| --- | --- | --- | --- |
| Governance and traceability | Partial | Approved sources exist outside the app repository, but the implementation has no canonical-source register or release compliance record. | 1 |
| Meridian mark and wordmark | Non-compliant | The shell and authentication use a generic letter or `WalletCards`; no approved Meridian SVG treatment is implemented. | 2 |
| Product typography | Non-compliant | Inter is named but not self-hosted; Manrope and IBM Plex Mono are absent; display and eyebrow styles do not match the approved system. | 2–3 |
| Product colors | Non-compliant | Current warm neutrals and `#3F8F5B` conflict with cool neutrals and evergreen `#1E7A4E`. Legacy slate, emerald, Aurora blue, red and amber classes remain. | 3 |
| Radius and elevation | Partial | Tokenized primitives exist, but the scale and warm shadows differ from the approved 8/12/18/22/26 scale and cool shadows. | 3 |
| App shell and navigation | Partial | Responsive shell and route structure exist, but brand treatment, color, selection and surface styling differ. | 4 |
| Dashboard/Home | Partial | Core composition exists, but provisional name, mixed English labels, off-spec palette and non-approved content remain. | 4–5 |
| Accounts | Partial | Persistent account flows exist; account-specific warm palette conflicts with Manual v4. | 4 |
| Activity/Movements | Partial | Persistent CRUD exists; legacy components and off-spec semantic colors remain. | 4 |
| Categories/Analytics | Partial | Functional charts exist; chart palette and legacy Recharts surfaces are not fully v5 compliant. | 4 |
| Budgets/Goals/Liabilities/Scheduled | Partial | Functional modules exist beyond the six-screen reference; they use inconsistent old and new primitives. | 4 |
| Authentication | Non-compliant | Generic emerald/slate UI, generic wallet mark, and no Meridian threshold treatment. | 4 |
| Settings | Non-compliant | Extensive legacy slate/emerald/amber styling and provisional administrative copy remain. | 4–5 |
| Spanish product language | Partial | Primary language is Spanish, but English headings and placeholder content remain. | 5 |
| Accessibility | Partial | Focus primitives and semantic labels exist, but no release-wide keyboard, contrast and responsive evidence is recorded. | 6 |
| Supabase security | Compliant with known flag | RLS and ownership policies are implemented; leaked-password protection remains a dashboard configuration recommendation. | 6 |
| CI and deployment | Compliant | Unit tests, typecheck, lint, build and Vercel Git deployment are active. | 6–7 |

## Approved Foundation Delta

| Foundation | Approved | Current implementation |
| --- | --- | --- |
| Canvas | `#FAFBFC` | `#FAFAF8` and `#F4F6F8` |
| Surface | `#FFFFFF` | Mostly `#FFFFFF` |
| Ink | Cool `#111827 → #C3C8D0` | Warm `#181816 → #D8D8CF` plus legacy slate |
| Accent | `#1E7A4E`, hover `#186640` | `#3F8F5B`, hover `#2F7047` |
| Body/labels | Inter | System fallback; Inter not loaded |
| Display | Manrope | System sans |
| Mono eyebrow | IBM Plex Mono | Generic monospace |
| Wordmark | Archivo Light, `-0.03em` | Generic bold sans |
| Mark | Meridian ground-specific SVG | Generic letter / wallet icon |
| Radius | 8 / 12 / 18 / 22 / 26 | 8 / 12 / 16 / 20 |
| Negative | Calm slate `#454B57` | Red danger scale |
| Information | Desaturated slate `#5B6472` | Blue `#2F7BA3` |

## Screen Inventory

| Route | Functional | Visual compliance | Priority |
| --- | --- | --- | --- |
| `/login`, `/signup`, `/check-email` | Yes | No | P0 |
| `/dashboard` | Yes | Partial | P0 |
| `/accounts` | Yes | Partial | P0 |
| `/movements` | Yes | Partial | P0 |
| `/categories` | Yes | Partial | P1 |
| `/budgets` | Yes | Partial | P1 |
| `/goals` | Yes | Partial | P1 |
| `/liabilities` | Yes | Partial | P1 |
| `/programados` | Yes | Partial | P1 |
| `/settings` | Yes | No | P1 |
| `/design-system` | Internal | No; still presents Aurora | P0 |

## Preserved Contracts

Per the approved UI v5 compliance report, the following are not redesign targets:

- Navigation model and sidebar order.
- Information architecture.
- Existing screen grids and column structure where applicable.
- Spanish product voice.
- Threshold entry beat and screen transitions.
- Component composition patterns such as briefs, cards, rows, tables, charts, badges and selects.

## Acceptance Criteria for Remediation

- Every shipped surface uses approved v4 product tokens.
- Meridian mark and wordmark are used exactly in sanctioned light and dark treatments.
- Fonts are self-hosted and no production UI depends on remote font loading.
- No Aurora, generic brand mark, warm legacy palette, or unexplained ad-hoc semantic color remains in active routes.
- All user-visible product copy is coherent Spanish and contains no provisional personal data.
- Functional behavior and Supabase ownership isolation remain unchanged.
- CI, visual verification, responsive verification and production error scan pass.

## Audit Decision

The current release is a functional persistent MVP, not a compliant Niva UI v5 release. Phases 1–7 are authorized remediation work; they must preserve financial behavior while moving implementation to the approved authorities.
