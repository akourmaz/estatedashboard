import { Property, DashboardFilters } from "./types";
import { parsePrice, parseCommission } from "./utils";

/**
 * Apply all filters and search query to properties array.
 */
export function filterProperties(
  properties: Property[],
  filters: DashboardFilters,
  searchQuery: string
): Property[] {
  let result = [...properties];

  // Fulltext search across all string fields
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((p) => {
      const searchableFields = [
        p.developer,
        p.project,
        p.location,
        p.propertyType,
        p.finishing,
        p.area,
        p.deliveryYear,
        p.deliveryQuarter,
        p.minPricePerSqm,
        p.floors,
        p.mortgage,
        p.commissionNet,
        p.commissionWithVAT,
        p.paymentTerms,
        p.commissionTerms,
        p.primaryContact,
        p.comments || "",
        p.guaranteedYield || "",
        p.renovationPrice || "",
      ];
      return searchableFields.some((field) =>
        field.toLowerCase().includes(query)
      );
    });
  }

  // Multi-select filters
  if (filters.locations.length > 0) {
    result = result.filter((p) => filters.locations.includes(p.location));
  }

  if (filters.developers.length > 0) {
    result = result.filter((p) => filters.developers.includes(p.developer));
  }

  if (filters.propertyTypes.length > 0) {
    result = result.filter((p) =>
      filters.propertyTypes.includes(p.propertyType)
    );
  }

  if (filters.finishings.length > 0) {
    result = result.filter((p) => filters.finishings.includes(p.finishing));
  }

  if (filters.deliveryYears.length > 0) {
    result = result.filter((p) =>
      filters.deliveryYears.includes(p.deliveryYear)
    );
  }

  // Mortgage filter
  if (filters.mortgage !== null) {
    result = result.filter((p) => {
      const hasMortgage =
        p.mortgage.toLowerCase() === "да" || p.mortgage.toLowerCase() === "yes";
      return filters.mortgage === "Да" ? hasMortgage : !hasMortgage;
    });
  }

  // Price range filter
  if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
    result = result.filter((p) => {
      const price = parsePrice(p.minPricePerSqm);
      if (price === null) return true; // Keep items without price data
      if (filters.priceRange.min !== null && price < filters.priceRange.min)
        return false;
      if (filters.priceRange.max !== null && price > filters.priceRange.max)
        return false;
      return true;
    });
  }

  // Commission range filter
  if (
    filters.commissionRange.min !== null ||
    filters.commissionRange.max !== null
  ) {
    result = result.filter((p) => {
      const commission = parseCommission(p.commissionNet);
      if (commission === null) return true;
      if (
        filters.commissionRange.min !== null &&
        commission < filters.commissionRange.min
      )
        return false;
      if (
        filters.commissionRange.max !== null &&
        commission > filters.commissionRange.max
      )
        return false;
      return true;
    });
  }

  return result;
}

/**
 * Sort properties by a given column.
 */
export function sortProperties(
  properties: Property[],
  sortBy: string,
  sortOrder: "asc" | "desc"
): Property[] {
  const sorted = [...properties].sort((a, b) => {
    let valA = (a as unknown as Record<string, string>)[sortBy] ?? "";
    let valB = (b as unknown as Record<string, string>)[sortBy] ?? "";

    if (!valA) valA = "";
    if (!valB) valB = "";

    // For price columns, compare numerically
    if (sortBy === "minPricePerSqm") {
      const numA = parsePrice(valA) ?? 0;
      const numB = parsePrice(valB) ?? 0;
      return sortOrder === "asc" ? numA - numB : numB - numA;
    }

    // For commission, compare numerically
    if (sortBy === "commissionNet") {
      const numA = parseCommission(valA) ?? 0;
      const numB = parseCommission(valB) ?? 0;
      return sortOrder === "asc" ? numA - numB : numB - numA;
    }

    // Default: string comparison
    const comparison = valA.localeCompare(valB, "ru");
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Get unique values for a given field from properties array.
 */
export function getUniqueValues(
  properties: Property[],
  field: keyof Property
): string[] {
  const values = new Set<string>();
  properties.forEach((p) => {
    const val = p[field];
    if (val && typeof val === "string" && val.trim()) {
      values.add(val.trim());
    }
  });
  return Array.from(values).sort((a, b) => a.localeCompare(b, "ru"));
}

/**
 * Check if any filters are active.
 */
export function hasActiveFilters(filters: DashboardFilters): boolean {
  return (
    filters.locations.length > 0 ||
    filters.developers.length > 0 ||
    filters.propertyTypes.length > 0 ||
    filters.finishings.length > 0 ||
    filters.deliveryYears.length > 0 ||
    filters.mortgage !== null ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null ||
    filters.commissionRange.min !== null ||
    filters.commissionRange.max !== null
  );
}

/**
 * Count the total number of active filter selections.
 */
export function countActiveFilters(filters: DashboardFilters): number {
  let count = 0;
  count += filters.locations.length;
  count += filters.developers.length;
  count += filters.propertyTypes.length;
  count += filters.finishings.length;
  count += filters.deliveryYears.length;
  if (filters.mortgage !== null) count++;
  if (filters.priceRange.min !== null || filters.priceRange.max !== null)
    count++;
  if (
    filters.commissionRange.min !== null ||
    filters.commissionRange.max !== null
  )
    count++;
  return count;
}
