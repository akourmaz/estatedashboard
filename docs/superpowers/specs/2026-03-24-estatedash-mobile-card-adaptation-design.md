# Mobile Card Adaptation Design

**Date:** 2026-03-24  
**Scope:** Mobile-only adaptive layout for property list + commission display fix (all breakpoints)

## Summary

Adapt the existing property table for mobile viewports by hiding the table header row, replacing the current mobile card layout with a compact terse meta-item flow that mirrors the desktop column set, and unifying commission semantics across both breakpoints.

## Decisions

| Decision | Choice |
|----------|--------|
| Scope | Mobile-only; desktop table untouched |
| Mobile layout strategy | Adapt existing `PropertyRow` mobile branch; no new component |
| Expanded content | Inline under same card (current behavior) |
| Mobile sorting | None; default order only |
| Commission in visible part | Full commission (`commissionWithVAT`) — both desktop and mobile |
| Commission net | Moved to expanded Characteristics section — both desktop and mobile |
| Link URLs | Remove displayed domain text; keep icon + label only |

## Visible Mobile Card

Collapsed card shows developer/project as title, then all key fields as compact inline items without explicit labels, separated by `·`:

```
┌──────────────────────────────────┐
│ Developer Name              ▼    │
│ Project Name                     │
│                                  │
│ 📍 Локация · ТИП · ОТДЕЛКА ·    │
│ СДАЧА · 45 м² · 6.7%            │
└──────────────────────────────────┘
```

- Location: prefixed with 📍 emoji
- Property type: `PropertyTypeBadge` (colored pill)
- Finishing: `FinishingBadge` (colored pill)
- Delivery: `DeliveryBadge` (colored pill with semantic color)
- Area: plain text with "м²" suffix
- Commission: full commission in accent color, bold

## Expanded Detail Changes

### Payment Terms section
- Remove `Комиссия чистыми` and `Комиссия с НДС` rows (both now shown elsewhere)

### Characteristics section
- Add `Комиссия чистыми` (`commissionNet`) as first row

### Links section
- Remove `(domain)` text after each link label
- Keep: icon + label, clickable

## Desktop Changes

- Commission column in table row: switch from `commissionNet` to `commissionWithVAT`
- Expanded detail sections: same changes as above (shared component)

## Table Header on Mobile

- Hide `<thead>` below `md` breakpoint via `hidden md:table-header-group`

## Files Changed

| File | Change |
|------|--------|
| `PropertyTable.tsx` | Hide thead on mobile |
| `PropertyRow.tsx` | Desktop: commission → commissionWithVAT; Mobile: new terse meta flow |
| `PropertyDetail.tsx` | Move net commission to characteristics; remove URL domains from links |
