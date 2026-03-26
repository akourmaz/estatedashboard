import { Property, DashboardFilters } from "./types";
import { parsePrice, parseCommission } from "./utils";

// ── Filter normalization rules ──────────────────────────────────────────

const PROPERTY_TYPE_RULES = [
  { canonical: "Апартаменты", matchers: ["апартамент"] },
  { canonical: "Жилой", matchers: ["жилой"] },
  { canonical: "Вилла", matchers: ["вилл"] },
  { canonical: "Таунхаус", matchers: ["таунхаус", "тх"] },
  { canonical: "Отель", matchers: ["отель", "брендирован", "резиденц"] },
];

const FINISHING_RULES = [
  { canonical: "BF", matchers: ["bf", "без ремонта"] },
  { canonical: "WF", matchers: ["wf"] },
  { canonical: "GF", matchers: ["gf"] },
  { canonical: "PF", matchers: ["pf"] },
  { canonical: "Turnkey", matchers: ["turnkey", "с ремонтом"] },
];

const DELIVERY_YEAR_HANDED_OVER = ["сдано", "сдан", "готов", "частично сдано", "2024", "2025"];

function normalizePropertyType(raw: string): string[] {
  const lower = raw.toLowerCase();
  const groups: string[] = [];
  for (const rule of PROPERTY_TYPE_RULES) {
    if (rule.matchers.some((m) => lower.includes(m))) {
      groups.push(rule.canonical);
    }
  }
  return groups.length > 0 ? groups : [raw];
}

function normalizeFinishing(raw: string): string[] {
  const lower = raw.toLowerCase();
  const groups: string[] = [];
  for (const rule of FINISHING_RULES) {
    if (rule.matchers.some((m) => lower.includes(m))) {
      groups.push(rule.canonical);
    }
  }
  return groups.length > 0 ? groups : [raw];
}

function normalizeDeliveryYear(raw: string): string[] {
  const lower = raw.toLowerCase().trim();
  if (DELIVERY_YEAR_HANDED_OVER.includes(lower)) return ["Сдан"];

  // Extract all 4-digit years from compound values like "Блок А 2025\r\nБлок B 2026"
  const yearMatches = raw.match(/\b(20\d{2})\b/g);
  if (yearMatches && yearMatches.length > 0) {
    const groups = new Set<string>();
    for (const y of yearMatches) {
      if (DELIVERY_YEAR_HANDED_OVER.includes(y)) {
        groups.add("Сдан");
      } else {
        groups.add(y);
      }
    }
    return Array.from(groups);
  }

  return [raw];
}

function normalizeMortgage(raw: string | undefined | null): string[] {
  if (!raw || !raw.trim()) return ["Нет"];
  const lower = raw.toLowerCase().trim();
  if (lower.includes("планируется")) return ["К началу года"];
  if (lower.includes("самостоятельно")) return ["Самостоятельно"];
  if (lower === "да" || lower === "yes" || lower.startsWith("да ") || lower.startsWith("да(")) return ["Да"];
  if (lower === "нет") return ["Нет"];
  return ["Условно"];
}

export function normalizeFilterValue(field: string, raw: string | undefined | null): string[] {
  if (field === "mortgage") return normalizeMortgage(raw);
  if (!raw || !raw.trim()) return [];
  switch (field) {
    case "propertyType": return normalizePropertyType(raw);
    case "finishing": return normalizeFinishing(raw);
    case "deliveryYear": return normalizeDeliveryYear(raw);
    default: return [raw];
  }
}

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
        p.area || "",
        p.deliveryYear,
        p.deliveryQuarter || "",
        p.commissionNet,
        p.commissionWithVAT,
        p.paymentTerms,
        p.commissionTerms || "",
        p.floors || "",
        p.mortgage || "",
        p.minPricePerSqm || "",
        p.primaryContact || "",
        p.comments || "",
        p.guaranteedYield || "",
        p.renovationPrice || "",
        p.renovationCommission || "",
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
    result = result.filter((p) => {
      const groups = normalizeFilterValue("propertyType", p.propertyType);
      return groups.some((g) => filters.propertyTypes.includes(g));
    });
  }

  if (filters.finishings.length > 0) {
    result = result.filter((p) => {
      const groups = normalizeFilterValue("finishing", p.finishing);
      return groups.some((g) => filters.finishings.includes(g));
    });
  }

  if (filters.deliveryYears.length > 0) {
    result = result.filter((p) => {
      const groups = normalizeFilterValue("deliveryYear", p.deliveryYear);
      return groups.some((g) => filters.deliveryYears.includes(g));
    });
  }

  // Mortgage filter
  if (filters.mortgage.length > 0) {
    result = result.filter((p) => {
      const groups = normalizeFilterValue("mortgage", p.mortgage);
      return groups.some((g) => filters.mortgage.includes(g));
    });
  }

  // Price range filter
  if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
    result = result.filter((p) => {
      if (!p.minPricePerSqm) return true;
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
    if (sortBy === "commissionNet" || sortBy === "commissionWithVAT") {
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

const NORMALIZED_FIELDS = ["propertyType", "finishing", "deliveryYear", "mortgage"];

/**
 * Get unique canonical values for a given field from properties array.
 * For normalized fields, returns canonical group names instead of raw values.
 */
export function getUniqueValues(
  properties: Property[],
  field: keyof Property
): string[] {
  const values = new Set<string>();

  if (NORMALIZED_FIELDS.includes(field)) {
    properties.forEach((p) => {
      const raw = p[field];
      const groups = normalizeFilterValue(field, raw as string);
      groups.forEach((g) => values.add(g));
    });
  } else {
    properties.forEach((p) => {
      const val = p[field];
      if (val && typeof val === "string" && val.trim()) {
        values.add(val.trim());
      }
    });
  }

  if (field === "deliveryYear") {
    return Array.from(values).sort((a, b) => {
      if (a === "Сдан") return -1;
      if (b === "Сдан") return 1;
      return a.localeCompare(b, "ru");
    });
  }

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
    filters.mortgage.length > 0 ||
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
  count += filters.mortgage.length;
  if (filters.priceRange.min !== null || filters.priceRange.max !== null)
    count++;
  if (
    filters.commissionRange.min !== null ||
    filters.commissionRange.max !== null
  )
    count++;
  return count;
}
