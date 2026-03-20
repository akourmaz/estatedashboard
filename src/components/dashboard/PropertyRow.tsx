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

function DeliveryBadge({ year }: { year: string }) {
  const lowerYear = year.toLowerCase();
  const currentYear = new Date().getFullYear();

  let colorClass = "text-accent-primary";
  let bgClass = "bg-accent-primary-muted";

  if (lowerYear === "сдан" || lowerYear === "готов") {
    colorClass = "text-semantic-success";
    bgClass = "bg-semantic-success-muted";
  } else {
    const numYear = parseInt(year, 10);
    if (!isNaN(numYear)) {
      if (numYear <= currentYear + 1) {
        colorClass = "text-semantic-warning";
        bgClass = "bg-semantic-warning-muted";
      }
    }
  }

  return <Badge text={year} colorClass={colorClass} bgClass={bgClass} />;
}

function FinishingBadge({ finishing }: { finishing: string }) {
  const colors = FINISHING_COLORS[finishing] || {
    text: "text-text-secondary",
    bg: "bg-elevated",
  };
  return <Badge text={finishing} colorClass={colors.text} bgClass={colors.bg} />;
}

function PropertyTypeBadge({ type }: { type: string }) {
  // Abbreviate for table display
  const abbrev: Record<string, string> = {
    "Апартаменты": "АПАРТ",
    "Жилой": "ЖИЛ",
    "Вилла": "ВИЛ",
    "Таунхаус": "ТХ",
  };
  const display = abbrev[type] || type;
  const colors = PROPERTY_TYPE_COLORS[type] || {
    text: "text-text-secondary",
    bg: "bg-elevated",
  };
  return (
    <Badge
      text={display}
      colorClass={colors.text}
      bgClass={colors.bg}
    />
  );
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
        className={`hidden md:table-row cursor-pointer transition-colors duration-fast border-b border-border-subtle group ${
          isExpanded
            ? "bg-active border-l-[3px] border-l-accent-primary"
            : isEven
            ? "bg-[rgba(255,255,255,0.02)]"
            : "bg-surface"
        } ${!isExpanded ? "hover:bg-hover hover:border-l-[3px] hover:border-l-accent-primary" : ""}`}
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
        <td className="px-4 py-3 text-body text-text-secondary tabular-nums">
          {property.area}
        </td>
        <td className="px-4 py-3">
          <DeliveryBadge year={property.deliveryYear} />
        </td>
        <td className="px-4 py-3">
          <FinishingBadge finishing={property.finishing} />
        </td>
        <td className="px-4 py-3 text-body font-semibold text-text-primary tabular-nums">
          {property.minPricePerSqm}
        </td>
        <td className="px-4 py-3 text-body font-semibold text-accent-primary tabular-nums">
          {property.commissionNet}
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
          <td colSpan={10} className="p-0">
            <PropertyDetail property={property} />
          </td>
        </tr>
      )}

      {/* Mobile card view */}
      <tr className="md:hidden">
        <td colSpan={10} className="p-0">
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

            <div className="flex items-center gap-2 text-small text-text-secondary mb-3">
              <span>📍 {property.location}</span>
              <span>·</span>
              <PropertyTypeBadge type={property.propertyType} />
              <span>·</span>
              <FinishingBadge finishing={property.finishing} />
            </div>

            <div className="border-t border-border-subtle pt-3 grid grid-cols-2 gap-2 text-small">
              <div>
                <span className="text-text-tertiary">Площадь: </span>
                <span className="text-text-primary tabular-nums">{property.area} м²</span>
              </div>
              <div>
                <span className="text-text-tertiary">Сдача: </span>
                <DeliveryBadge year={property.deliveryYear} />
              </div>
              <div>
                <span className="text-text-tertiary">Цена: </span>
                <span className="text-text-primary font-semibold tabular-nums">
                  {property.minPricePerSqm}/м²
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">Комиссия: </span>
                <span className="text-accent-primary font-semibold tabular-nums">
                  {property.commissionNet}
                </span>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3">
                <PropertyDetail property={property} />
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
