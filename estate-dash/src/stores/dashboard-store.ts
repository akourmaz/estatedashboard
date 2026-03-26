import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import {
  Property,
  DashboardFilters,
  DEFAULT_FILTERS,
  SortOrder,
  DashboardPreset,
} from "@/lib/types";
import { applyPresetFilter, filterProperties, sortProperties } from "@/lib/filters";
import catalogProperties from "@/data/catalog";

interface DashboardState {
  // Data
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filters
  filters: DashboardFilters;
  activePreset: DashboardPreset | null;
  setFilter: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => void;
  applyPreset: (preset: DashboardPreset) => void;
  clearPreset: () => void;
  resetFilters: () => void;

  // Sort
  sortBy: string;
  sortOrder: SortOrder;
  setSort: (column: string) => void;

  // Expanded rows
  expandedRows: Set<string>;
  toggleRow: (id: string) => void;
  collapseAll: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Data — pre-loaded from the repository catalog generated from Excel
      properties: catalogProperties,
      setProperties: (properties) => set({ properties, expandedRows: new Set() }),
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),

      // Search
      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Filters
      filters: { ...DEFAULT_FILTERS },
      activePreset: null,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      applyPreset: (preset) =>
        set((state) => {
          const nextPreset = state.activePreset === preset ? null : preset;

          return {
            filters: { ...DEFAULT_FILTERS },
            searchQuery: "",
            activePreset: nextPreset,
          };
        }),
      clearPreset: () => set({ activePreset: null }),
      resetFilters: () =>
        set({
          filters: { ...DEFAULT_FILTERS },
          searchQuery: "",
          activePreset: null,
        }),

      // Sort
      sortBy: "developer",
      sortOrder: "asc",
      setSort: (column) =>
        set((state) => ({
          sortBy: column,
          sortOrder:
            state.sortBy === column
              ? state.sortOrder === "asc"
                ? "desc"
                : "asc"
              : "asc",
        })),

      // Expanded rows
      expandedRows: new Set<string>(),
      toggleRow: (id) =>
        set((state) => {
          const newExpanded = new Set(state.expandedRows);
          if (newExpanded.has(id)) {
            newExpanded.delete(id);
          } else {
            newExpanded.add(id);
          }
          return { expandedRows: newExpanded };
        }),
      collapseAll: () => set({ expandedRows: new Set() }),
    }),
    {
      name: "estate-dash-storage",
      partialize: (state) => ({
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
      // Handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Selector hook: returns filtered + sorted properties.
 * Uses useMemo to avoid recomputing filter+sort unless the
 * underlying state slices actually change.
 */
export function useFilteredProperties(): Property[] {
  const properties = useDashboardStore((s) => s.properties);
  const activePreset = useDashboardStore((s) => s.activePreset);
  const filters = useDashboardStore((s) => s.filters);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const sortBy = useDashboardStore((s) => s.sortBy);
  const sortOrder = useDashboardStore((s) => s.sortOrder);

  return useMemo(() => {
    const presetFiltered = applyPresetFilter(properties, activePreset);
    const filtered = filterProperties(presetFiltered, filters, searchQuery);
    return sortProperties(filtered, sortBy, sortOrder);
  }, [properties, activePreset, filters, searchQuery, sortBy, sortOrder]);
}
