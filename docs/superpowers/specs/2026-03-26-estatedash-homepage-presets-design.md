# EstateDash — Homepage Preset Picks

**Date:** 2026-03-26
**Status:** Approved during working session
**Scope:** Hero preset section on the dashboard homepage that applies curated filter scenarios

---

## 1. Purpose

This document defines a new homepage section that gives users a fast way to enter the catalog through three curated scenarios instead of starting from manual filters.

The goal is to make the first screen more useful for new users while keeping the behavior aligned with the existing filtering model.

This is not a separate recommendation engine.

It is a UI layer of preset filter scenarios that reuse the current table and current filtering flow.

---

## 2. UX Summary

### 2.1 Placement

The homepage should place preset picks as the first grouped control inside the standard filter row.

Order on the page:

1. Header
2. Search input
3. Filter row beginning with a compact `Подборки` group
4. Standard filters continue in the same line after the preset group
5. Property table

### 2.2 Section content

The preset group should contain:

- a short heading, such as `Подборки`
- a one-line explanation that these are quick scenarios
- three compact preset buttons

The group should be visually distinct from the standard filter row so that users understand these are starting points, not just more filter chips.

### 2.3 Preset buttons

Each preset button should include:

- title
- active state
- result count based on the current catalog

---

## 3. Preset Set

The first version should ship with these three presets:

1. `Мягкий вход`
2. `Быстрая сдача`
3. `Высокая комиссия`

These three were chosen because they map well to the currently available data and cover three distinct user intents:

- easier entry
- shorter wait horizon
- stronger agent incentive

---

## 4. Interaction Model

### 4.1 Core behavior

When the user clicks a preset:

1. current manual filters are fully reset
2. current search query is cleared
3. the chosen preset becomes active
4. the preset's filter logic is applied
5. the property table updates immediately

This behavior is intentionally destructive to prior filter state because the presets are meant to act as clean scenario entry points.

### 4.2 Active state rules

- only one preset can be active at a time
- clicking another preset switches directly to that preset
- clicking the active preset again should clear the preset and return the page to the unfiltered default state

### 4.3 Manual follow-up filtering

After a preset is applied, the user may continue using the standard filters manually.

This means the preset defines the starting state, but the user is not locked into it.

### 4.4 Reset behavior

If the user uses the existing `Сбросить всё` control, the following should happen together:

- manual filters reset
- search query clears
- active preset clears

---

## 5. Preset Definitions

The preset logic should be implemented with deterministic rules based on the current catalog fields.

The rules below are product rules, not visual hints.

### 5.1 `Мягкий вход`

Intent: show projects that feel easier to enter financially.

Primary signals:

- mortgage availability that is better than `Нет`
- or financing language in payment terms that implies installment-based entry
- and price should avoid the expensive end of the catalog

Recommended first implementation rule:

- include properties where:
  - normalized mortgage is `Да`, `Самостоятельно`, or `К началу года`
  - or payment terms contain clear installment language
- exclude properties with very high minimum price per sqm relative to the catalog

Implementation note:

For the first version, this preset may be implemented as a custom predicate rather than a pure mapping to the visible filter chips, because `paymentTerms` is not exposed as a manual UI filter.

### 5.2 `Быстрая сдача`

Intent: show projects with the shortest delivery horizon.

Recommended first implementation rule:

- include normalized delivery groups:
  - `Сдан`
  - `2025`
  - `2026`

This preset can be expressed directly through the existing delivery-year filtering logic.

### 5.3 `Высокая комиссия`

Intent: show projects with stronger commercial upside for the agent.

Recommended first implementation rule:

- include properties with commission values above the catalog median
- preferred threshold for version one: `commissionNet >= 5.0`

This threshold is intentionally simple and explainable. It can be tuned later if the catalog changes.

Implementation note:

This preset may also use a custom predicate because the current UI exposes a commission range in state, but not as a ready-made visible chip input.

---

## 6. Data And State Model

### 6.1 New state concept

The dashboard store should track the active preset separately from the existing filter state.

Suggested state shape:

- `activePreset: "soft-entry" | "fast-delivery" | "high-commission" | null`

### 6.2 Filtering order

The effective property list should be computed in this order:

1. start from full property catalog
2. apply active preset logic if present
3. apply search query
4. apply manual filters
5. apply sorting

This keeps preset behavior composable with the current system.

### 6.3 Preset application rule

Applying a preset should not mutate the raw property data.

It should only change derived UI state.

---

## 7. Empty And Edge States

### 7.1 No results after additional filtering

If the user narrows an already active preset to zero results, the empty state should clearly reflect that the current preset plus additional filters produced no matches.

### 7.2 Catalog drift

If future source data changes significantly, preset counts may shift.

The UI should tolerate zero results for a preset without breaking layout.

### 7.3 Ambiguous text fields

Some preset logic depends on text normalization, especially for mortgage and payment terms.

The implementation should use the existing normalization utilities where possible and add targeted preset-specific normalization only where needed.

---

## 8. Visual Direction

The preset area should feel distinct, but compact and inline with the rest of the filters.

Recommended direction:

- a lightly separated group placed first in the main filter row
- smaller buttons than the original hero-card concept
- concise copy
- clear selected state with stronger fill and border treatment than the standard filter controls

The preset area should improve discoverability without adding a large hero section above the filters.

---

## 9. Testing Guidance

The implementation should be validated against these behaviors:

1. Clicking a preset clears existing filters and search.
2. Only one preset can be active.
3. Clicking the active preset again clears it.
4. Manual filters still work after preset application.
5. `Сбросить всё` also clears the active preset.
6. `Быстрая сдача` includes only expected delivery groups.
7. `Высокая комиссия` applies the chosen numeric threshold correctly.
8. `Мягкий вход` remains stable for mixed mortgage and payment-term data.

---

## 10. Out Of Scope

This phase does not include:

- machine-learned recommendations
- personalized rankings per user
- saving preset choices between sessions unless later requested
- adding more than three presets in the first release