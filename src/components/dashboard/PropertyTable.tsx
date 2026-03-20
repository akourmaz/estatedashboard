"use client";

import { useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Search } from "lucide-react";
import { useDashboardStore, useFilteredProperties } from "@/stores/dashboard-store";
import { PropertyRow } from "./PropertyRow";
import { SortableColumn } from "@/lib/types";

const COLUMNS: { key: SortableColumn; label: string; sortable: boolean }[] = [
  { key: "developer", label: "Застройщик", sortable: true },
  { key: "project", label: "Проект", sortable: true },
  { key: "location", label: "Локация", sortable: true },
  { key: "propertyType", label: "Тип", sortable: true },
  { key: "area", label: "Площадь", sortable: false },
  { key: "deliveryYear", label: "Сдача", sortable: true },
  { key: "finishing", label: "Отделка", sortable: true },
  { key: "minPricePerSqm", label: "Цена/м²", sortable: true },
  { key: "commissionNet", label: "Комиссия", sortable: true },
];

function SortIcon({
  column,
  currentSort,
  currentOrder,
}: {
  column: string;
  currentSort: string;
  currentOrder: string;
}) {
  if (currentSort !== column) {
    return <ArrowUpDown className="w-3 h-3 text-text-tertiary" />;
  }
  return currentOrder === "asc" ? (
    <ArrowUp className="w-3 h-3 text-accent-primary" />
  ) : (
    <ArrowDown className="w-3 h-3 text-accent-primary" />
  );
}

export function PropertyTable() {
  const filteredProperties = useFilteredProperties();
  const sortBy = useDashboardStore((s) => s.sortBy);
  const sortOrder = useDashboardStore((s) => s.sortOrder);
  const setSort = useDashboardStore((s) => s.setSort);
  const isLoading = useDashboardStore((s) => s.isLoading);
  const properties = useDashboardStore((s) => s.properties);
  const resetFilters = useDashboardStore((s) => s.resetFilters);

  // Memoize skeleton widths to avoid hydration issues with Math.random
  const skeletonWidths = useMemo(
    () => Array.from({ length: 8 }, () =>
      Array.from({ length: 10 }, () => `${40 + Math.floor(Math.random() * 60)}%`)
    ),
    []
  );

  if (isLoading) {
    return (
      <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs uppercase tracking-[0.05em] text-text-tertiary font-medium"
                >
                  {col.label}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {skeletonWidths.map((widths, i) => (
              <tr key={i} className="border-b border-border-subtle">
                {widths.map((w, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="skeleton h-4 rounded-sm" style={{ width: w }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (properties.length === 0) return null;

  // Empty results after filtering
  if (filteredProperties.length === 0) {
    return (
      <div className="bg-surface border border-border-subtle rounded-lg p-12 text-center">
        <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
        <h2 className="text-h2 text-text-primary mb-2">Ничего не найдено</h2>
        <p className="text-body text-text-secondary mb-4">
          Попробуйте изменить фильтры или сбросить поиск
        </p>
        <button
          onClick={resetFilters}
          className="text-body text-accent-primary hover:underline transition-colors duration-fast"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="grid">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border-default bg-canvas">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs uppercase tracking-[0.05em] text-text-tertiary font-medium ${
                    col.sortable ? "cursor-pointer select-none hover:text-text-secondary" : ""
                  } transition-colors duration-fast`}
                  onClick={() => col.sortable && setSort(col.key)}
                  aria-sort={
                    sortBy === col.key
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <SortIcon
                        column={col.key}
                        currentSort={sortBy}
                        currentOrder={sortOrder}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property, index) => (
              <PropertyRow
                key={property.id}
                property={property}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="px-4 py-3 border-t border-border-subtle text-small text-text-tertiary">
        Показано {filteredProperties.length} из {properties.length} объектов
      </div>
    </div>
  );
}
