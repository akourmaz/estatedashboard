/**
 * EstateDash — TypeScript interfaces
 */

export interface PropertyLinks {
  website?: string;
  whatsapp?: string;
  googleDisk?: string;
  map?: string;
  priceList?: string;
}

export interface Property {
  id: string;
  developer: string;
  project: string;
  paymentTerms: string;
  commissionTerms: string;
  links: PropertyLinks;
  finishing: string;
  propertyType: string;
  area: string;
  deliveryQuarter: string;
  deliveryYear: string;
  renovationPrice?: string;
  renovationCommission?: string;
  guaranteedYield?: string;
  location: string;
  minPricePerSqm: string;
  floors: string;
  mortgage: string;
  trainingLink?: string;
  comments?: string;
  primaryContact: string;
  commissionNet: string;
  commissionWithVAT: string;
}

/**
 * Column mapping: Excel column position (0-indexed) → Property field
 */
export const COLUMN_MAP: Record<number, string> = {
  0: "developer",       // A
  1: "project",          // B
  2: "paymentTerms",     // C
  3: "commissionTerms",  // D
  4: "links.website",    // E
  5: "links.whatsapp",   // F
  6: "links.googleDisk", // G
  7: "links.map",        // H
  8: "links.priceList",  // I
  9: "finishing",        // J
  10: "propertyType",    // K
  11: "area",            // L
  12: "deliveryQuarter", // M
  13: "deliveryYear",    // N
  14: "renovationPrice", // O
  15: "renovationCommission", // P
  16: "guaranteedYield", // Q
  17: "location",        // R
  18: "minPricePerSqm",  // S
  19: "floors",          // T
  20: "mortgage",        // U
  21: "trainingLink",    // V
  22: "comments",        // W
  23: "primaryContact",  // X
  24: "commissionNet",   // Y
  25: "commissionWithVAT", // Z
};

export interface DashboardFilters {
  locations: string[];
  developers: string[];
  propertyTypes: string[];
  finishings: string[];
  deliveryYears: string[];
  mortgage: string | null;
  priceRange: { min: number | null; max: number | null };
  commissionRange: { min: number | null; max: number | null };
}

export const DEFAULT_FILTERS: DashboardFilters = {
  locations: [],
  developers: [],
  propertyTypes: [],
  finishings: [],
  deliveryYears: [],
  mortgage: null,
  priceRange: { min: null, max: null },
  commissionRange: { min: null, max: null },
};

export type SortOrder = "asc" | "desc";

export type SortableColumn =
  | "developer"
  | "project"
  | "location"
  | "propertyType"
  | "area"
  | "deliveryYear"
  | "finishing"
  | "minPricePerSqm"
  | "commissionNet"
  | "mortgage";

/** Finishing type badge color mapping */
export const FINISHING_COLORS: Record<string, { text: string; bg: string }> = {
  BF: { text: "text-badge-bf", bg: "bg-badge-bf-bg" },
  WF: { text: "text-badge-wf", bg: "bg-badge-wf-bg" },
  GF: { text: "text-badge-gf", bg: "bg-badge-gf-bg" },
  Turnkey: { text: "text-badge-turnkey", bg: "bg-badge-turnkey-bg" },
};

/** Property type badge color mapping */
export const PROPERTY_TYPE_COLORS: Record<string, { text: string; bg: string }> = {
  "Апартаменты": { text: "text-badge-apartment", bg: "bg-badge-apartment-bg" },
  "Жилой": { text: "text-badge-residential", bg: "bg-badge-residential-bg" },
  "Вилла": { text: "text-badge-villa", bg: "bg-badge-villa-bg" },
  "Таунхаус": { text: "text-badge-townhouse", bg: "bg-badge-townhouse-bg" },
};
