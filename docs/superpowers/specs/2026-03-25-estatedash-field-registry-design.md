# EstateDash — Field Registry

**Date:** 2026-03-25
**Status:** Approved during working session
**Scope:** Canonical field registry for data sourced from `start-data/thetable.xlsx`

---

## 1. Purpose

This document is the canonical registry of project fields derived from `thetable.xlsx`.

It exists to separate four concerns that were previously mixed together:

1. Raw Excel headers and worksheet structure
2. Short display names for UI and documentation
3. Stable technical keys for the project model
4. Field priority inside the product experience

This registry is the main reference for future work on import, types, filtering, table layout, mobile cards, and property detail views.

---

## 2. Source Of Truth

- Primary original source: `start-data/thetable.xlsx`
- Machine-readable raw snapshot: `start-data/raw-thetable/thetable.raw.json`
- Active worksheet: `Лист1`
- Worksheet range: `A1:AJ570`
- Meaningful named columns: `A:Z`
- Empty technical tail excluded from the working model: `AA:AJ`

---

## 3. Naming Rules

### 3.1 Display names

Display names are shortened for UI clarity and document readability.

They may be compact, but they must remain understandable to non-technical users.

### 3.2 Technical keys

Technical keys remain explicit and stable.

They are not shortened just to match UI labels.

### 3.3 Priority levels

- `Primary` — visible in the main table/card view
- `Secondary-main` — shown early in expanded details and treated as higher-value secondary info
- `Secondary-extra` — shown in deeper details, helpful but not core to first-pass scanning
- `Excluded` — not part of the working model for the current phase

---

## 4. Canonical Field Registry

| Col | Excel Header | Display Name | Technical Key | Priority | Status | Type | Notes |
|---|---|---|---|---|---|---|---|
| A | Застройщик | Застройщик | `developer` | Primary | Used | string | Core identity field |
| B | Объект | Объект | `project` | Primary | Used | string | Core identity field |
| C | Март 2026. ПВ и рассрочка. Скидки | ПВ / рассрочка | `paymentTerms` | Secondary-main | Used | string | Multiline text allowed |
| D | Выплата комиссии агентам | Выплата агентам | `commissionTerms` | Secondary-main | Used | string | Secondary but high-value commercial detail |
| E | Официальный сайт | Сайт | `links.website` | Secondary-extra | Used | url | Hyperlink field |
| F | WhatsApp | WhatsApp | `links.whatsapp` | Secondary-extra | Used | url | Hyperlink field |
| G | Google Disk | Google Disk | `links.googleDisk` | Secondary-extra | Used | url | Hyperlink field |
| H | Карта | Карта | `links.map` | Secondary-extra | Used | url | Hyperlink field |
| I | Ссылка на прайс\n(при наличии) | Прайс | `links.priceList` | Secondary-extra | Used | url | Optional hyperlink field |
| J | Отделка | Отделка | `finishing` | Primary | Used | string | Badge-style categorical field |
| K | Тип | Тип | `propertyType` | Primary | Used | string | Badge-style categorical field |
| L | Площадь | Площадь | `area` | Secondary-main | Used | string | Stored as text range/value |
| M | Месяц/квартал сдачи | Месяц/квартал сдачи | `deliveryQuarter` | Secondary-main | Used | string | Delivery timing detail |
| N | Год сдачи | Год сдачи | `deliveryYear` | Primary | Used | string | High-scan delivery status field |
| O | Ремонт | Ремонт | `renovationPrice` | Primary | Used | string | Commercial renovation offer/price text |
| P | Как платят комиссию за ремонт | Комиссия за ремонт | `renovationCommission` | Secondary-main | Used | string | Renamed for compact UI display |
| Q | Гарантированная доходность | Гарантированная доходность | `guaranteedYield` | Secondary-extra | Used | string | Optional investment detail |
| R | Локация | Локация | `location` | Primary | Used | string | Primary scan and grouping field |
| S | Минимальная цена квадрата (октябрь) | Цена м² | `minPricePerSqm` | Primary | Used | string | Display label intentionally shortened |
| T | Этажность | Этажность | `floors` | Secondary-main | Used | string | Building characteristic |
| U | Ипотека | Ипотека | `mortgage` | Secondary-main | Used | string | Yes/no style value stored as text |
| V | Обучение по объекту | Обучение | `trainingLink` | Secondary-extra | Used | url | Hyperlink field |
| W | Комментарии и пожелания | Комментарии | `comments` | Secondary-extra | Used | string | Internal note field |
| X | Основной контакт | Контакт | `primaryContact` | Secondary-extra | Used | string | May later be split into structured contact data |
| Y | Комиссия агента чистыми | Комиссия чистыми | `commissionNet` | Secondary-main | Used | string | Commercial detail shown after primary scan |
| Z | Комиссия агента (с НДС) | Комиссия агента | `commissionWithVAT` | Primary | Used | string | Primary commission field for product display |
| AA-AJ | *(no named headers)* | *(excluded)* | *(none)* | Excluded | Excluded | n/a | Empty tail columns not used in working model |

---

## 5. Priority Summary

### 5.1 Primary

- `developer`
- `project`
- `location`
- `finishing`
- `propertyType`
- `deliveryYear`
- `renovationPrice`
- `minPricePerSqm`
- `commissionWithVAT`

### 5.2 Secondary-main

- `paymentTerms`
- `commissionTerms`
- `commissionNet`
- `mortgage`
- `area`
- `floors`
- `deliveryQuarter`
- `renovationCommission`

### 5.3 Secondary-extra

- `links.website`
- `links.whatsapp`
- `links.googleDisk`
- `links.map`
- `links.priceList`
- `trainingLink`
- `comments`
- `primaryContact`
- `guaranteedYield`

### 5.4 Excluded

- Empty worksheet columns `AA:AJ`

---

## 6. Notes For Future Implementation

1. This registry governs display labels for design and product discussions.
2. Technical keys should be reused when updating the TypeScript model.
3. Nested link fields should remain grouped under `links.*` in the normalized model.
4. `primaryContact` may later evolve from a plain string into a richer contact structure, but not before the field registry is implemented in code.
5. `renovationPrice` is kept as a string because current worksheet values are mixed (`$900`, `-`, custom text).
