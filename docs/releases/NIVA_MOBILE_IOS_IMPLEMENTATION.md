# Niva Mobile iOS Implementation

Date: 2026-07-12
Reference: design-reference/niva-mobile.html
Breakpoint: below 768px
Desktop impact: none; the existing desktop shell remains the rendered experience at 768px and above.

## Delivered

- Session-level visual lock inspired by Face ID, clearly labeled as visual rather than biometric security.
- Mobile Home with light/dark appearance, daily brief, available margin, scheduled commitment, recent activity and primary goal.
- Activity timeline with segmented filters, pull-to-refresh gesture, movement detail sheet and delete action.
- Analysis with swipeable KPIs, native period selector, weekly chart and category proportions.
- Accounts total, distribution grid, institution groups and access to scheduled transactions.
- Goals cards with amount, date and progress.
- Five-slot fixed tab bar with elevated central create action.
- New movement uses the existing Supabase-backed form inside the mobile bottom-sheet modal.
- Loading, empty and synchronization-error states.
- iOS safe-area support, standalone manifest and Apple web-app metadata.

## Data and security

All financial values are read from the existing Supabase hooks and remain protected by the established RLS policies. The visual session lock is not represented as real Face ID. Native biometric authentication would require a future WebAuthn/passkey flow.
