import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse a price string like "3004$", "5 750$", "$1,200", "1 010$ WF" into a number.
 * Extracts the first numeric value found. Returns null if parsing fails.
 */
export function parsePrice(price: string): number | null {
  if (!price) return null;
  // Remove currency symbols, whitespace, and common suffixes
  // First, try to find a number pattern: digits possibly separated by spaces, commas, or dots
  const match = price.match(/[\d][\d\s,.]*[\d]|[\d]+/);
  if (!match) return null;
  // Clean the matched number: remove spaces, replace comma with nothing (treat as thousand separator)
  const cleaned = match[0].replace(/\s/g, "").replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) || num < 100 ? null : num; // Filter out obviously wrong values (< $100/sqm)
}

/**
 * Parse a commission string like "4.0%" into a number.
 * Returns null if parsing fails.
 */
export function parseCommission(commission: string): number | null {
  if (!commission) return null;
  const cleaned = commission.replace(/[^\d.,]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Format a number as a price string with $ suffix.
 */
export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")}$`;
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a unique ID for a property based on developer + project.
 */
export function generatePropertyId(developer: string, project: string, index: number): string {
  const base = `${developer}-${project}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${base}-${index}`;
}
