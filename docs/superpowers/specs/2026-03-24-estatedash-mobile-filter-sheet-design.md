# EstateDash — Mobile Filter Sheet Design

**Date:** 2026-03-24
**Status:** Approved by user during brainstorming
**Scope:** Responsive UX upgrade for mobile filtering only

---

## 1. Overview

This spec defines how filtering should work on mobile in EstateDash without changing the existing desktop filter experience or expanding the agreed filter set.

The current desktop FilterPanel uses inline dropdown chips and works acceptably on larger viewports. On mobile, that pattern becomes too dense, consumes too much vertical space, and creates small touch targets. The approved direction is to replace the mobile inline filter row with a compact bottom sheet flow while preserving the current filter logic and current subset of filters.

This spec covers only the mobile filter interaction layer. It does not add new filters, does not change store semantics, and does not redesign desktop filtering.

---

## 2. Goals

1. Make mobile filtering feel modern, compact, and easy to scan.
2. Keep the list of properties visually primary on mobile instead of letting filters dominate the page header area.
3. Preserve the current agreed filter set:
   - Location
   - Developer
   - Property Type
   - Finishing
   - Delivery Year
   - Mortgage
4. Avoid immediate list re-computation on every tap inside the mobile filter UI.
5. Reuse existing filter logic and state contracts so desktop behavior remains intact.

---

## 3. Out of Scope

This design does not include:

- Reintroducing price range or commission range filters
- Creating a separate mobile filters page
- Reworking desktop filter UI behavior
- Changing search behavior
- Persisted-state migration or hydration cleanup for legacy hidden filters
- Changing filter semantics in the Zustand store
- Expanding filtering logic beyond the current agreed subset

---

## 4. Approved UX Direction

### 4.1 Trigger Pattern

On mobile, the inline filter chip row is replaced by a single compact trigger button.

Suggested trigger label:

- `Фильтры`
- `Фильтры (N)` when active filters exist

`N` should represent the number of active filter criteria, not the total number of selected options across all groups.

Examples:

- Location + Mortgage active -> `Фильтры (2)`
- Developer + Type + Delivery Year active -> `Фильтры (3)`

The trigger remains visible in the main page flow and acts as the only mobile entry point into filter controls.

Active-count semantics for this trigger operate only on the approved six visible filters in this spec. Legacy hidden filter fields such as price range or commission range must not contribute to the mobile count.

### 4.2 Sheet Pattern

The approved mobile filter container is a compact bottom sheet.

Characteristics:

- Opens from the bottom of the viewport
- Takes roughly 60 to 70 percent of viewport height
- Keeps the property list visually present in the background
- Feels like a utility layer, not a separate page
- Includes a dimmed backdrop and scroll lock while open

The sheet should feel lightweight and fast, not modal-heavy.

All dismiss paths follow the same rule:

- close button
- backdrop tap
- drag-dismiss, if implemented

All of them discard unsaved draft changes and leave applied store filters untouched.

### 4.3 Application Model

Changes inside the sheet are draft-based and apply only when the user explicitly confirms.

Approved interaction:

1. User opens the mobile filter sheet
2. Current filters are copied from store into local draft state
3. User changes multiple filter groups inside the sheet
4. Property list does not update yet
5. User presses `Применить`
6. Draft filters are committed into the store
7. Filter sheet closes
8. Property list updates once

If the user closes the sheet without pressing `Применить`, draft changes are discarded.

`Сбросить всё` follows the same draft-first model:

- pressing it clears the draft values inside the open sheet
- the property list and store update only after `Применить`

There are no immediate-commit exceptions inside the mobile sheet flow.

---

## 5. Internal Sheet Layout

### 5.1 Header

The sheet header should contain:

- drag handle
- title `Фильтры`
- close affordance on the right

Optional secondary info:

- active criteria count

If shown, this count uses the same per-group counting rule as the mobile trigger.

### 5.2 Body

The body is vertically scrollable and contains the approved filter groups in this order:

1. Location
2. Developer
3. Property Type
4. Finishing
5. Delivery Year
6. Mortgage

Each filter group is shown as a larger tappable row or expandable section, not as the same tiny chip-style dropdowns used on desktop.

Default open state on sheet launch:

- all filter groups start collapsed
- user expands only the groups they need

This keeps the compact sheet visually short and scannable when opened.

### 5.3 Control Style

For mobile, controls should use larger touch targets and clearer grouping.

Approved behavior:

- Multi-select filters open inline inside the sheet as expanded lists of options
- Selected values are visible inside the section through compact chips under the section title
- Mortgage is shown as a single-select control with three options: `Все`, `Да`, `Нет`

Avoid nested modal-on-modal behavior. The sheet is the only container; filter sections expand inside it.

### 5.4 Action Zone

The bottom action area remains visually anchored and always accessible.

Required actions:

- `Сбросить всё`
- `Применить`

The action zone should also respect bottom mobile safe-area inset.

Behavior:

- `Сбросить всё` clears the draft state inside the open sheet
- `Применить` commits draft values to the store and closes the sheet

The action area should remain visible while the sheet body scrolls.

---

## 6. Responsive Structure

### Desktop and Tablet

Desktop and tablet behavior stays aligned with the current implementation:

- inline dropdown-style filters remain visible
- current desktop interaction model remains unchanged

### Mobile

Mobile uses the new compact sheet flow only.

Responsive cutoff for this behavior:

- mobile sheet is used below `sm` (`< 640px`) as a hard requirement for this change
- inline filters continue from `sm` upward unless later responsive polish introduces a tablet-specific presentation

This means FilterPanel becomes a responsive bifurcation point:

- desktop and tablet branch: existing inline controls
- mobile branch: trigger button plus bottom sheet

The filtering logic remains shared.

---

## 7. State Management Contract

The Zustand store remains the source of truth.

Implementation contract:

- opening the sheet snapshots only the approved six visible filter fields into local component state
- edits inside the sheet mutate only the local draft
- pressing `Применить` writes draft values into the store via existing filter setters
- pressing `Сбросить всё` clears the draft only while the sheet is open; store changes only after `Применить`
- closing without applying discards draft changes

Additional contract constraints:

- mobile apply and reset behavior must operate only on the approved six visible filters
- hidden legacy filter fields such as price range and commission range must be ignored by the mobile sheet UI
- the mobile sheet must not clear the search query and must not rely on any store-wide reset path that resets non-filter state

Legacy persisted hidden-filter rule:

- opening the mobile sheet must never mutate applied filters before `Применить`
- this spec assumes that any hidden legacy persisted price range or commission range filters are either already absent or handled by a separate prerequisite cleanup outside this mobile UX change
- mobile sheet handlers must not attempt to solve persisted-state migration concerns during sheet open, close, apply, or reset
- under that prerequisite, mobile apply and reset flows operate only on the approved six visible filters

No store API redesign is required.

---

## 8. Edge Cases

1. **No active filters**
   - Trigger label remains `Фильтры`

2. **Active filters exist**
   - Trigger shows active criteria count

3. **User edits and closes without applying**
   - Store remains unchanged
   - On next open, draft is rebuilt from current store state

4. **Imported dataset changes available options**
   - Mobile sheet must derive options from the same `getUniqueValues(...)` logic used today

5. **No values available for a group**
   - Group still renders in a disabled or empty state with a clear `Нет опций` message

---

## 9. Accessibility Requirements

The mobile sheet must meet the same practical accessibility bar already expected elsewhere in the project.

Required behavior:

- touch targets at least 44px tall
- focus moves into the sheet when opened
- focus returns to the trigger when closed
- backdrop tap closes the sheet
- Escape closes the sheet where keyboard is available
- sheet state is announced semantically through proper dialog and button attributes
- controls inside sections remain understandable without relying only on color

The design must not depend on tiny chevrons or color-only selection cues.

---

## 10. Component Boundaries

Primary integration point remains:

- `src/components/dashboard/FilterPanel.tsx`

Recommended internal structure:

- keep current desktop dropdown components for non-mobile usage
- add mobile-specific subcomponents inside the same file or as tightly-scoped children if clarity requires it

Potential internal pieces:

- `MobileFilterSheet`
- `MobileFilterSection`
- `MobileMultiSelectList`
- `MobileSingleSelectList`

The goal is separation of presentation, not duplication of filtering logic.

---

## 11. Verification Criteria

The mobile filter sheet is considered successful when:

1. On mobile, the filter trigger replaces the dense inline filter row.
2. Opening the trigger presents a compact bottom sheet rather than a full-screen page.
3. Users can edit multiple filter groups without the list updating until `Применить` is pressed.
4. Closing the sheet without applying leaves the property list untouched.
5. `Сбросить всё` resets the current draft state, and applied filters update only after `Применить`.
6. Desktop filtering continues to behave as it does now.
7. The current agreed filter subset remains unchanged.
8. Drag-dismiss remains optional polish and is not required for completion of this change.

---

## 12. Implementation Notes for Planning

This work should be planned as a focused responsive UX enhancement, not as a store or logic refactor.

Expected impact area:

- `src/components/dashboard/FilterPanel.tsx`
- possibly small shared helpers if local draft sync benefits from them
- possible minor page-level spacing adjustments if the mobile trigger needs different placement

This should remain a single coherent planning unit because it concerns one subsystem: mobile presentation of filtering.