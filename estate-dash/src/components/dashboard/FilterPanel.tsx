"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { getUniqueValues, hasActiveFilters } from "@/lib/filters";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = selected.length > 0;

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-small border transition-all duration-base focus-ring ${
          isActive
            ? "bg-accent-primary-muted border-border-accent text-accent-primary font-medium"
            : "bg-surface border-border-subtle text-text-secondary hover:border-border-default"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        {isActive && (
          <span className="text-xs bg-accent-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-base ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-40 bg-overlay border border-border-default rounded-md shadow-lg min-w-[200px] max-h-[300px] overflow-y-auto animate-fade-in">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-2 text-small text-text-primary hover:bg-hover cursor-pointer transition-colors duration-fast"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="w-4 h-4 rounded border-border-default bg-surface text-accent-primary focus:ring-accent-primary focus:ring-offset-0 accent-[#00FFB2]"
              />
              <span>{option}</span>
            </label>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-2 text-small text-text-tertiary">
              Нет опций
            </div>
          )}
          {selected.length > 0 && (
            <div className="border-t border-border-subtle px-3 py-2">
              <button
                onClick={() => onChange([])}
                className="text-xs text-text-tertiary hover:text-semantic-danger transition-colors duration-fast"
              >
                Сбросить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterPanel() {
  const properties = useDashboardStore((s) => s.properties);
  const filters = useDashboardStore((s) => s.filters);
  const setFilter = useDashboardStore((s) => s.setFilter);
  const resetFilters = useDashboardStore((s) => s.resetFilters);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  const locations = useMemo(
    () => getUniqueValues(properties, "location"),
    [properties]
  );
  const developers = useMemo(
    () => getUniqueValues(properties, "developer"),
    [properties]
  );
  const propertyTypes = useMemo(
    () => getUniqueValues(properties, "propertyType"),
    [properties]
  );
  const finishings = useMemo(
    () => getUniqueValues(properties, "finishing"),
    [properties]
  );
  const deliveryYears = useMemo(
    () => getUniqueValues(properties, "deliveryYear"),
    [properties]
  );
  const mortgageOptions = useMemo(
    () => getUniqueValues(properties, "mortgage"),
    [properties]
  );

  const filtersActive = hasActiveFilters(filters) || searchQuery.length > 0;

  if (properties.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          placeholder="Поиск по объектам…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 rounded-md bg-surface border border-border-subtle text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent transition-colors duration-base"
          aria-label="Поиск по объектам"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-fast"
            aria-label="Очистить поиск"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
      <MultiSelectDropdown
        label="Локация"
        options={locations}
        selected={filters.locations}
        onChange={(v) => setFilter("locations", v)}
      />
      <MultiSelectDropdown
        label="Застройщик"
        options={developers}
        selected={filters.developers}
        onChange={(v) => setFilter("developers", v)}
      />
      <MultiSelectDropdown
        label="Тип"
        options={propertyTypes}
        selected={filters.propertyTypes}
        onChange={(v) => setFilter("propertyTypes", v)}
      />
      <MultiSelectDropdown
        label="Отделка"
        options={finishings}
        selected={filters.finishings}
        onChange={(v) => setFilter("finishings", v)}
      />
      <MultiSelectDropdown
        label="Год сдачи"
        options={deliveryYears}
        selected={filters.deliveryYears}
        onChange={(v) => setFilter("deliveryYears", v)}
      />
      <MultiSelectDropdown
        label="Ипотека"
        options={mortgageOptions}
        selected={filters.mortgage}
        onChange={(v) => setFilter("mortgage", v)}
      />

      {filtersActive && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 px-3 py-2 text-small text-text-tertiary hover:text-semantic-danger transition-colors duration-fast"
        >
          <X className="w-3.5 h-3.5" />
          Сбросить всё
        </button>
      )}
      </div>
    </div>
  );
}
