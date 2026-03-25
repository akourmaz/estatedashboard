# EstateDash — Data Reconciliation Notes

**Date:** 2026-03-25
**Status:** Approved during working session
**Scope:** Reconcile differences between thetable-driven documentation, historical specs, and current implementation

---

## 1. Purpose

This document records the main mismatches between:

1. `thetable.xlsx` and its raw snapshot
2. The historical design/spec documents
3. The current implementation in code

It exists to make future migration work explicit and controlled.

---

## 2. Confirmed Current Reality

### 2.1 thetable structure

- Worksheet: `Лист1`
- Range: `A1:AJ570`
- Named fields actually used for project decisions: `A:Z`
- Empty technical tail: `AA:AJ`

### 2.2 Current runtime implementation

Current runtime data still comes from the older catalog generation path and not from `thetable.xlsx`.

Current path:

`newdata.xlsx` -> `scripts/extract-data.js` -> `src/data/catalog/properties.raw.json`

This means documentation and code are intentionally out of sync for now.

---

## 3. Main Mismatches

### 3.1 Source mismatch

| Topic | Current Runtime | New Documentation Direction |
|---|---|---|
| Source workbook | `newdata.xlsx` | `thetable.xlsx` |
| Runtime catalog source | old extractor path | not migrated yet |
| Documentation source | mixed historical references | unified around `thetable.xlsx` |

### 3.2 Field count mismatch

| Topic | Current Code | thetable Documentation |
|---|---|---|
| Explicit mapped columns | old truncated map in `types.ts` | full working set `A:Z` |
| Empty tail handling | not documented | `AA:AJ` explicitly excluded |

### 3.3 Field naming mismatch

Historical and runtime naming was inconsistent in multiple places.

Agreed compact display naming now includes:

| Original Header | Agreed Display Name | Technical Key |
|---|---|---|
| Минимальная цена квадрата (октябрь) | Цена м² | `minPricePerSqm` |
| Март 2026. ПВ и рассрочка. Скидки | ПВ / рассрочка | `paymentTerms` |
| Выплата комиссии агентам | Выплата агентам | `commissionTerms` |
| Комиссия агента чистыми | Комиссия чистыми | `commissionNet` |
| Как платят комиссию за ремонт | Комиссия за ремонт | `renovationCommission` |
| Комментарии и пожелания | Комментарии | `comments` |
| Основной контакт | Контакт | `primaryContact` |
| Обучение по объекту | Обучение | `trainingLink` |
| Ссылка на прайс (при наличии) | Прайс | `links.priceList` |
| Официальный сайт | Сайт | `links.website` |

### 3.4 Priority mismatch

The old specs and current code did not distinguish the newly approved three-level information hierarchy.

Approved hierarchy now is:

- `Primary`
- `Secondary-main`
- `Secondary-extra`
- `Excluded`

This hierarchy is now part of the project contract and should guide future UI and model decisions.

---

## 4. Implementation Alignment Targets

### 4.1 `types.ts`

Current issues to fix in a later implementation phase:

1. Ensure the Property model matches the approved field registry exactly
2. Keep `links.website` explicitly represented
3. Keep `deliveryQuarter` explicitly represented
4. Align field inclusion/exclusion with registry decisions
5. Preserve explicit distinction between `commissionNet` and `commissionWithVAT`

### 4.2 Import logic

Later importer work should:

1. Read from the approved future source path once migration is authorized
2. Preserve hyperlink extraction for all link fields
3. Map Excel headers to stable technical keys from the field registry
4. Respect excluded columns and ignore `AA:AJ`

### 4.3 UI layer

Later UI work should:

1. Use short display labels from the field registry
2. Use `Primary` fields for first-scan layouts
3. Use `Secondary-main` fields near the top of expanded details
4. Use `Secondary-extra` fields deeper in property details

---

## 5. Migration Guardrails

Until migration is explicitly approved, do not:

1. Switch runtime catalog generation from `newdata.xlsx` to `thetable.xlsx`
2. Replace live catalog data with `thetable`-derived output
3. Let old implementation files override the field registry decisions

Instead, use the documentation set as the planning and alignment layer.

---

## 6. Result Of This Reconciliation Phase

At the end of this documentation phase, the project now has:

1. A canonical field registry
2. A documented relationship model for all data artifacts
3. A written explanation of where current code and historical specs differ from the newly approved field set

This is the required baseline before a safe migration of types, import logic, and UI.
