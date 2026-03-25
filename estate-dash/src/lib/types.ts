/**
 * EstateDash — TypeScript interfaces
 * Source of truth: docs/superpowers/specs/2026-03-25-estatedash-field-registry-design.md
 */

export interface PropertyLinks {
  website?: string;
  whatsapp?: string;
  googleDisk?: string;
  map?: string;
  priceList?: string;
}

export interface PropertyContact {
  label?: string;
  phone: string;
}

export interface Property {
  id: string;

  // Primary
  developer: string;
  project: string;
  location: string;
  finishing: string;
  propertyType: string;
  deliveryYear: string;
  renovationPrice?: string;
  minPricePerSqm?: string;
  commissionWithVAT: string;

  // Secondary-main
  paymentTerms: string;
  commissionTerms?: string;
  commissionNet: string;
  mortgage?: string;
  area?: string;
  floors?: string;
  deliveryQuarter?: string;
  renovationCommission?: string;

  // Secondary-extra
  links: PropertyLinks;
  trainingLink?: string;
  comments?: string;
  primaryContact?: string;
  contacts?: PropertyContact[];
  guaranteedYield?: string;
}

/**
 * Column mapping: thetable.xlsx (Лист1) column position (0-indexed) → Property field
 * Based on field registry: A(0)–Z(25), AA–AJ excluded.
 */
export const COLUMN_MAP: Record<number, string> = {
  0: "developer",           // A — Застройщик
  1: "project",             // B — Объект
  2: "paymentTerms",        // C — ПВ и рассрочка
  3: "commissionTerms",     // D — Выплата комиссии агентам
  4: "links.website",       // E — Официальный сайт
  5: "links.whatsapp",      // F — WhatsApp
  6: "links.googleDisk",    // G — Google Disk
  7: "links.map",           // H — Карта
  8: "links.priceList",     // I — Ссылка на прайс
  9: "finishing",           // J — Отделка
  10: "propertyType",       // K — Тип
  11: "area",               // L — Площадь
  12: "deliveryQuarter",    // M — Месяц/квартал сдачи
  13: "deliveryYear",       // N — Год сдачи
  14: "renovationPrice",    // O — Ремонт
  15: "renovationCommission", // P — Как платят комиссию за ремонт
  16: "guaranteedYield",    // Q — Гарантированная доходность
  17: "location",           // R — Локация
  18: "minPricePerSqm",     // S — Минимальная цена квадрата
  19: "floors",             // T — Этажность
  20: "mortgage",           // U — Ипотека
  21: "trainingLink",       // V — Обучение по объекту
  22: "comments",           // W — Комментарии и пожелания
  23: "primaryContact",     // X — Основной контакт
  24: "commissionNet",      // Y — Комиссия агента чистыми
  25: "commissionWithVAT",  // Z — Комиссия агента (с НДС)
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
  | "deliveryYear"
  | "finishing"
  | "minPricePerSqm"
  | "commissionWithVAT";

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
