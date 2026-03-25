"use client";

import { ChevronDown } from "lucide-react";
import { Property, FINISHING_COLORS, PROPERTY_TYPE_COLORS } from "@/lib/types";
import { useDashboardStore } from "@/stores/dashboard-store";
import { PropertyDetail } from "./PropertyDetail";

interface PropertyRowProps {
  property: Property;
  index: number;
}

function Badge({
  text,
  colorClass,
  bgClass,
}: {
  text: string;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs uppercase font-medium ${colorClass} ${bgClass}`}
      aria-label={text}
    >
      {text}
    </span>
  );
}

function getFinishingColors(finishing: string): { text: string; bg: string } {
  if (FINISHING_COLORS[finishing]) return FINISHING_COLORS[finishing];
  const upper = finishing.toUpperCase();
  if (upper.includes('TURNKEY')) return FINISHING_COLORS['Turnkey'];
  if (upper.includes('GF')) return FINISHING_COLORS['GF'];
  if (upper.includes('WF')) return FINISHING_COLORS['WF'];
  if (upper === 'PF' || upper.includes('С РЕМОНТОМ')) return FINISHING_COLORS['Turnkey'];
  if (upper.includes('BF') || upper.includes('БЕЗ РЕМОНТА')) return FINISHING_COLORS['BF'];
  return { text: "text-text-secondary", bg: "bg-elevated" };
}

function abbreviateFinishing(finishing: string): string {
  const upper = finishing.trim().toUpperCase();
  if (['BF', 'WF', 'GF', 'PF', 'TURNKEY'].includes(upper)) return finishing.trim();
  const prefixMatch = finishing.match(/^(BF|WF|GF|PF)\b/i);
  if (prefixMatch) return prefixMatch[1].toUpperCase();
  if (upper.includes('С РЕМОНТОМ')) return 'РЕМОНТ';
  if (finishing.length > 12) {
    const codes: string[] = [];
    if (upper.includes('TURNKEY')) codes.push('TK');
    if (upper.includes('BF')) codes.push('BF');
    if (upper.includes('WF')) codes.push('WF');
    if (upper.includes('GF')) codes.push('GF');
    if (upper.includes('PF')) codes.push('PF');
    if (codes.length > 0) return codes.join('/');
  }
  return finishing.trim();
}

function getPropertyTypeColors(type: string): { text: string; bg: string } {
  if (PROPERTY_TYPE_COLORS[type]) return PROPERTY_TYPE_COLORS[type];
  const lower = type.toLowerCase();
  if (lower.includes('апартамент')) return PROPERTY_TYPE_COLORS['Апартаменты'];
  if (lower.includes('вилл')) return PROPERTY_TYPE_COLORS['Вилла'];
  if (lower.includes('таунхаус')) return PROPERTY_TYPE_COLORS['Таунхаус'];
  if (lower.includes('жилой') || lower.includes('жилое')) return PROPERTY_TYPE_COLORS['Жилой'];
  return { text: "text-text-secondary", bg: "bg-elevated" };
}

function abbreviatePropertyType(type: string): string {
  const abbrev: Record<string, string> = {
    "Апартаменты": "АПАРТ",
    "Жилой": "ЖИЛ",
    "Вилла": "ВИЛ",
    "Таунхаус": "ТХ",
  };
  if (abbrev[type]) return abbrev[type];
  const lower = type.toLowerCase();
  if (type.length > 9) {
    const codes: string[] = [];
    if (lower.includes('апартамент')) codes.push('АПАРТ');
    if (lower.includes('вилл')) codes.push('ВИЛ');
    if (lower.includes('таунхаус')) codes.push('ТХ');
    if (lower.includes('жилой')) codes.push('ЖИЛ');
    if (codes.length > 0) return codes.join('/');
  }
  if (lower.includes('апартамент')) return 'АПАРТ';
  if (lower.includes('вилл')) return 'ВИЛ';
  if (lower.includes('таунхаус')) return 'ТХ';
  if (lower.includes('жилой')) return 'ЖИЛ';
  if (lower.includes('отел')) return 'ОТЕЛЬ';
  if (lower.includes('бренд')) return 'БРЕНД';
  if (type.length > 12) return type.substring(0, 10) + '…';
  return type;
}

function DeliveryBadge({ year }: { year: string }) {
  const lowerYear = year.toLowerCase();

  let colorClass = "text-accent-primary";
  let bgClass = "bg-accent-primary-muted";

  if (lowerYear === "сдан" || lowerYear === "готов") {
    colorClass = "text-semantic-success";
    bgClass = "bg-semantic-success-muted";
  } else {
    // Extract 4-digit year from strings like "2029 2 квартал" or "2 квартал 2027"
    const yearMatch = year.match(/\b(20\d{2})\b/);
    const currentYear = new Date().getFullYear();
    if (yearMatch) {
      const numYear = parseInt(yearMatch[1], 10);
      if (numYear <= currentYear + 1) {
        colorClass = "text-semantic-warning";
        bgClass = "bg-semantic-warning-muted";
      }
    }
  }

  return <Badge text={year} colorClass={colorClass} bgClass={bgClass} />;
}

function FinishingBadge({ finishing }: { finishing: string }) {
  const colors = getFinishingColors(finishing);
  const label = abbreviateFinishing(finishing);
  return <Badge text={label} colorClass={colors.text} bgClass={colors.bg} />;
}

function PropertyTypeBadge({ type }: { type: string }) {
  const display = abbreviatePropertyType(type);
  const colors = getPropertyTypeColors(type);
  return <Badge text={display} colorClass={colors.text} bgClass={colors.bg} />;
}

export function PropertyRow({ property, index }: PropertyRowProps) {
  const isExpanded = useDashboardStore((s) => s.expandedRows.has(property.id));
  const toggleRow = useDashboardStore((s) => s.toggleRow);

  const isEven = index % 2 === 1;

  return (
    <>
      {/* Desktop table row */}
      <tr
        onClick={() => toggleRow(property.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleRow(property.id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        className={`hidden md:table-row cursor-pointer transition-colors duration-fast border-b border-border-subtle border-l-[3px] group ${
          isExpanded
            ? "bg-active border-l-accent-primary"
            : isEven
            ? "bg-[rgba(255,255,255,0.02)] border-l-transparent"
            : "bg-surface border-l-transparent"
        } ${!isExpanded ? "hover:bg-hover hover:border-l-accent-primary" : ""}`}
      >
        <td className="px-4 py-3 text-body font-semibold text-text-primary">
          {property.developer}
        </td>
        <td className="px-4 py-3 text-body text-text-primary">
          {property.project}
        </td>
        <td className="px-4 py-3 text-body text-text-secondary">
          {property.location}
        </td>
        <td className="px-4 py-3">
          <PropertyTypeBadge type={property.propertyType} />
        </td>
        <td className="px-4 py-3">
          <DeliveryBadge year={property.deliveryYear} />
        </td>
        <td className="px-4 py-3">
          <FinishingBadge finishing={property.finishing} />
        </td>
        <td className="px-4 py-3 text-body text-text-secondary tabular-nums">
          {property.minPricePerSqm || "—"}
        </td>
        <td className="px-4 py-3 text-body font-semibold text-accent-primary tabular-nums">
          {property.commissionWithVAT}
        </td>
        <td className="px-4 py-3 w-10">
          <ChevronDown
            className={`w-4 h-4 text-text-tertiary transition-transform duration-base ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </td>
      </tr>

      {/* Desktop expanded detail */}
      {isExpanded && (
        <tr className="hidden md:table-row">
          <td colSpan={9} className="p-0">
            <PropertyDetail property={property} />
          </td>
        </tr>
      )}

      {/* Mobile card view */}
      <tr className="md:hidden">
        <td colSpan={9} className="p-0">
          <div
            onClick={() => toggleRow(property.id)}
            className={`bg-surface border border-border-subtle rounded-lg p-4 mb-3 cursor-pointer transition-colors duration-fast ${
              isExpanded ? "border-l-[3px] border-l-accent-primary" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-body font-semibold text-text-primary">
                  {property.developer}
                </div>
                <div className="text-body text-text-primary">
                  {property.project}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-text-tertiary transition-transform duration-base flex-shrink-0 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-small text-text-secondary">📍 {property.location}</span>
              <PropertyTypeBadge type={property.propertyType} />
              <FinishingBadge finishing={property.finishing} />
              <DeliveryBadge year={property.deliveryYear} />
            </div>

            <div className="flex items-center gap-3 text-small">
              {property.minPricePerSqm && (
                <span className="text-text-secondary tabular-nums">{property.minPricePerSqm}</span>
              )}
              <span className="text-accent-primary font-semibold tabular-nums">
                {property.commissionWithVAT}
              </span>
            </div>

            {isExpanded && (
              <div className="mt-3 border-t border-border-subtle pt-3" onClick={(e) => e.stopPropagation()}>
                <PropertyDetail property={property} />
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
