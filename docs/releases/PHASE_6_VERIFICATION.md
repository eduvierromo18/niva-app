# Niva Release Verification — Phase 6

Date: 2026-07-12
Candidate commit: 0529da3
Production: https://finanzas-personales-blush-three.vercel.app
Supabase project: aowzjfixyelpjudkfwnw

## Automated gates

- TypeScript: pass
- ESLint: pass
- Vitest: 21/21 pass
- Next.js production build: pass
- npm production dependency audit: 0 vulnerabilities
- Vercel production runtime errors (last hour): none
- Vercel production 5xx logs (last hour): none

## Browser verification

- /signup renders the Meridian/Niva registration flow with name, email and password fields.
- /login renders the approved Niva access flow.
- An unauthenticated request to /settings redirects to /login?next=%2Fsettings.
- Production alias points to the READY deployment for commit 0529da3.

## Supabase verification

- RLS enabled on all nine user-data tables.
- Every user-data table has an ownership policy.
- Authenticated owner can see exactly one own profile in the controlled check.
- A random foreign identity sees zero profiles.
- Profile format constraints exist and are validated.
- Security advisor reports no schema/RLS vulnerabilities.
- Performance advisor reports only unused-index informational notices; indexes are retained because the database is new and they protect planned query paths.

## Recovery

- Route-level and global error boundaries provide a safe retry path without exposing implementation details.

## Managed Auth exception

Supabase reports auth_leaked_password_protection as disabled. This switch is controlled in the hosted Auth dashboard, not through SQL or the available management connector. The dashboard requires an interactive owner session, so the codebase cannot enable it programmatically in this release. Remediation: enable **Leaked password protection** in Supabase Auth password security settings. Reference: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

