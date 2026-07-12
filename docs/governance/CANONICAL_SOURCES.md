# Canonical Sources

## Status

- Register version: 1.0.0
- Status: Active
- Owner: Eduardo Zuniga
- Registered: 2026-07-12
- Scope: Niva frontend implementation

This register binds implementation work to the approved workspace artifacts without duplicating or modifying them.

## Authority Order

| Rank | Authority | Canonical workspace path | SHA-256 |
| --- | --- | --- | --- |
| 1 | Niva Design Governance v1.0 | `00_Governance/Approved/Niva Design Governance v1.0.html` | `C297CC57ED1FDE2F486E0507971899CB9531DDA989F6025CCAAFFF12D2A55CDF` |
| 2 | Niva Design Manual v4.0 | `03_Design_System/Approved/Manual/Niva Design Manual v4.0.html` | `BA53CD1B2BDADF27E7CA5DA997C657CEAF34A820EC2E0635F3EF14D9C75383F7` |
| 3 | Niva Meridian Identity v1.0 | `02_Brand/Approved/Identity/Niva Meridian Identity v1.0.html` | `655C361FF3A8DF0FD959F028B3F85F22C78EC5B23441B1B1CA95D764B84231C4` |
| 4 | Niva UI v5.0 | `04_UI/Approved/v5.0/Niva UI v5.0.html` | `B6C381AEAC242BE022A65EDDD77248873582A79235267F0C36CDEE54E95AA812` |
| 4a | Niva UI v5.0 Compliance Report | `04_UI/Approved/v5.0/Niva UI v5.0 Compliance Report.html` | `5DFF01C9A8C850DFF15366FB99BC4830725B5B0B5A91D299855CDA133273569C` |
| 5 | Product specifications | `docs/product_specs/` | Versioned with code |
| 6 | Implementation | `src/` | Must conform to ranks 1–5 |

## Conflict Resolution

- Governance controls ownership, approval, versioning and change process.
- Design Manual v4 controls all product surfaces.
- Meridian controls the mark and wordmark only.
- UI v5.0 controls the approved screen expression while preserving its documented information architecture.
- Product Specs control behavior where they do not contradict higher authorities.
- Code never creates a new authority by existing first.

The approved UI v5 compliance report explicitly resolves the green/ultramarine split: evergreen is the product accent; ultramarine appears only inside the Meridian mark.

## Handbook Status

The repository Handbook is a working product source at version 0.1.3 and status Review. It is not promoted to the workspace's approved Product Handbook location yet. Until promotion, it may organize and clarify implementation but cannot override the authorities above.

## Change Rule

Any change to a registered authority requires:

1. Proposal in the owning workspace RFC area.
2. Dependency review against higher authorities.
3. Approval metadata and a new semantic version.
4. Updated SHA-256 in this register.
5. Implementation audit and release note.

