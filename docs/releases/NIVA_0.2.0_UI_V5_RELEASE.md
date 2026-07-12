# Niva 0.2.0 — UI v5 Release

Release date: 2026-07-12
Status: Approved for production
Tag: v0.2.0
Production: https://finanzas-personales-blush-three.vercel.app
Supabase: aowzjfixyelpjudkfwnw

## Delivered

- Governance baseline and immutable register of approved sources.
- Meridian v1.0 mark, wordmark, fonts, icons and app metadata.
- Design Manual v4 token foundation and component catalog.
- UI v5 migration across active desktop and mobile routes.
- Real authenticated identity and persistent profile preferences.
- Spanish product language pass and removal of provisional credentials.
- Verified Supabase ownership isolation, constraints and production deployment.
- Global and route-level recovery boundaries.

## Quality record

- TypeScript, ESLint and Next.js build: pass.
- Vitest: 21/21 pass.
- Production dependency audit: 0 vulnerabilities.
- Vercel runtime errors and 5xx during verification window: none.
- Supabase RLS: enabled with policies on 9/9 user-data tables.

## Data changes

- Applied migration harden_profile_preferences.
- Added validated profile constraints for ISO-style currency, locale and name length.
- No destructive data migration was performed.

## Known managed setting

- Supabase leaked-password protection remains a dashboard-managed owner action; see PHASE_6_VERIFICATION.md.

## Rollback

- Vercel retains the prior READY production deployment.
- Database changes are additive constraints and did not rewrite user data.

