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
  ariaLabel,
}: {
  text: string;
  colorClass: string;
  bgClass: string;
  ariaLabel?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs uppercase font-medium ${colorClass} ${bgClass}`}
      aria-label={ariaLabel || text}
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

  return (
    <Badge
      text={year}
      colorClass={colorClass}
      bgClass={bgClass}
      ariaLabel={`Срок сдачи: ${year}`}
    />
  );
}

function FinishingBadge({ finishing }: { finishing: string }) {
  const colors = FINISHING_COLORS[finishing] || {
    text: "text-text-secondary",
    bg: "bg-elevated",
  };
  return (
    <Badge
      text={finishing}
      colorClass={colors.text}
      bgClass={colors.bg}
      ariaLabel={`Отделка: ${finishing}`}
    />
  );
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
      ariaLabel={`Тип недвижимости: ${type}`}
    />
  );
}

export function PropertyRow({ property, index }: PropertyRowProps) {
  const isExpanded = useDashboardStore((s) => s.expandedRows.has(property.id));
  const toggleRow = useDashboardStore((s) => s.toggleRow);

  const isEven = index % 2 === 1;
  const detailId = `property-detail-${property.id}`;

  const handleToggle = () => toggleRow(property.id);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

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
        className={`hidden md:table-row cursor-pointer border-b border-border-subtle transition-all duration-fast group ${
          isExpanded
            ? "bg-active shadow-[inset_3px_0_0_0_rgba(0,255,178,1)]"
            : isEven
            ? "bg-[rgba(255,255,255,0.02)]"
            : "bg-surface"
        } ${!isExpanded ? "hover:bg-hover hover:shadow-[inset_3px_0_0_0_rgba(0,255,178,1)]" : ""}`}
      >
        <td className="px-4 py-3 align-top">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] text-text-tertiary">
              Девелопер
            </p>
            <p className="text-body font-semibold text-text-primary">
              {property.developer}
            </p>
          </div>
        </td>
        <td className="px-4 py-3 align-top">
          <div className="space-y-1">
            <p className="text-body-medium font-semibold text-text-primary">
              {property.project}
            </p>
            {property.deliveryQuarter && (
              <p className="text-small text-text-secondary">
                {property.deliveryQuarter}
              </p>
            )}
          </div>
        </td>
        <td className="px-4 py-3 align-top">
          <div className="space-y-1">
            <p className="text-body text-text-secondary">{property.location}</p>
            {property.mortgage && (
              <p className="text-xs uppercase tracking-[0.08em] text-text-tertiary">
                Ипотека: {property.mortgage}
              </p>
            )}
          </div>
        </td>
        <td className="px-4 py-3 align-top">
          <PropertyTypeBadge type={property.propertyType} />
        </td>
        <td className="px-4 py-3 align-top">
          <div className="space-y-1">
            <p className="tabular-nums text-body text-text-secondary">{property.area}</p>
            {property.floors && (
              <p className="text-small text-text-tertiary">Этажность: {property.floors}</p>
            )}
          </div>
        </td>
        <td className="px-4 py-3 align-top">
          <DeliveryBadge year={property.deliveryYear} />
        </td>
        <td className="px-4 py-3 align-top">
          <FinishingBadge finishing={property.finishing} />
        </td>
        <td className="px-4 py-3 text-right align-top">
          <div className="space-y-1">
            <p className="tabular-nums text-body-medium font-semibold text-text-primary">
              {property.minPricePerSqm}
            </p>
            <p className="text-small text-text-tertiary">за м²</p>
          </div>
        </td>
        <td className="px-4 py-3 text-right align-top">
          <div className="space-y-1">
            <p className="tabular-nums text-body-medium font-semibold text-accent-primary">
              {property.commissionNet}
            </p>
            {property.commissionWithVAT && (
              <p className="text-small text-text-tertiary">с НДС: {property.commissionWithVAT}</p>
            )}
          </div>
        </td>
        <td className="px-4 py-3 w-10">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-base ${
              isExpanded ? "rotate-180 text-accent-primary" : "text-text-tertiary group-hover:text-text-secondary"
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
            className={`mb-3 overflow-hidden rounded-xl border border-border-subtle bg-surface transition-all duration-fast ${
              isExpanded
                ? "border-border-card bg-active shadow-[inset_3px_0_0_0_rgba(0,255,178,1)]"
                : "hover:border-border-default hover:bg-hover"
            }`}
          >
            <div
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-controls={detailId}
              className="focus-ring cursor-pointer p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                    {property.developer}
                  </div>
                  <div className="mt-1 text-[17px] font-semibold leading-tight text-text-primary">
                    {property.project}
                  </div>
                </div>

                <div className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-subtle bg-canvas/40">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-base ${
                      isExpanded ? "rotate-180 text-accent-primary" : "text-text-tertiary"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-small text-text-secondary">
                <span className="inline-flex items-center rounded-full border border-border-subtle bg-canvas/40 px-2.5 py-1 text-xs text-text-secondary">
                  📍 {property.location}
                </span>
                <span className="inline-flex rounded-full border border-border-subtle bg-elevated/80 px-1.5 py-1">
                  <PropertyTypeBadge type={property.propertyType} />
                </span>
                <span className="inline-flex rounded-full border border-border-subtle bg-elevated/80 px-1.5 py-1">
                  <FinishingBadge finishing={property.finishing} />
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border-subtle pt-4">
                <div className="rounded-lg border border-border-subtle bg-canvas/45 px-3 py-3">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                    Цена за м²
                  </div>
                  <div className="mt-1 tabular-nums text-body-medium font-semibold text-text-primary">
                    {property.minPricePerSqm}
                  </div>
                </div>

                <div className="rounded-lg border border-border-card bg-accent-primary-subtle px-3 py-3">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                    Комиссия
                  </div>
                  <div className="mt-1 tabular-nums text-body-medium font-semibold text-accent-primary">
                    {property.commissionNet}
                  </div>
                </div>

                <div className="rounded-lg border border-border-subtle bg-canvas/45 px-3 py-3">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                    Срок сдачи
                  </div>
                  <div className="mt-1">
                    <DeliveryBadge year={property.deliveryYear} />
                  </div>
                </div>

                <div className="rounded-lg border border-border-subtle bg-canvas/45 px-3 py-3">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                    Площадь
                  </div>
                  <div className="mt-1 tabular-nums text-body-medium font-semibold text-text-primary">
                    {property.area} м²
                  </div>
                </div>

                <div className="col-span-2 flex items-center justify-between rounded-lg border border-border-subtle bg-canvas/45 px-3 py-3 text-small">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                    Ипотека
                  </span>
                  <span className={`font-medium ${property.mortgage.toLowerCase() === "да" || property.mortgage.toLowerCase() === "yes" ? "text-semantic-success" : "text-text-secondary"}`}>
                    {property.mortgage || "Не указано"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-small">
                <div className="flex flex-col">
                  <span className="text-text-primary">
                    {isExpanded ? "Свернуть карточку" : "Подробнее"}
                  </span>
                  <span className="text-text-tertiary">
                    {isExpanded ? "Вернуться к списку KPI" : "Открыть полные условия и контакты"}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-[0.08em] text-text-tertiary">
                  {isExpanded ? "Open" : "Expand"}
                </span>
              </div>
            </div>

            {isExpanded && (
              <div
                id={detailId}
                onClick={(e) => e.stopPropagation()}
                className="border-t border-border-subtle"
              >
                <PropertyDetail property={property} />
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
