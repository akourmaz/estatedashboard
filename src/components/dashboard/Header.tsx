"use client";

import { useMemo } from "react";
import { Building2, MapPin, HardHat, DollarSign, Diamond, Send } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { parsePrice } from "@/lib/utils";

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-accent-primary-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-body-medium font-semibold text-text-primary tabular-nums leading-tight">
          {value}
        </span>
        <span className="text-xs text-text-tertiary leading-tight">{label}</span>
      </div>
    </div>
  );
}

export function Header() {
  const properties = useDashboardStore((s) => s.properties);

  const stats = useMemo(() => {
    const locations = new Set(properties.map((p) => p.location).filter(Boolean));
    const prices = properties
      .map((p) => parsePrice(p.minPricePerSqm))
      .filter((p): p is number => p !== null);
    const minPrice = prices.length > 0 ? prices.reduce((a, b) => Math.min(a, b)) : 0;

    return {
      totalProperties: 37,
      totalLocations: locations.size,
      totalDevelopers: 27,
      minPrice,
    };
  }, [properties]);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-dashboard mx-auto h-header flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Diamond className="w-6 h-6 text-accent-primary" />
          <span className="text-h2 font-bold text-text-primary tracking-tight">
            Real Estate Dashboard by Алексей Курмаз
          </span>
          <a
            href="https://t.me/akourmaz"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 w-7 h-7 rounded-md bg-accent-primary-muted flex items-center justify-center flex-shrink-0 hover:bg-accent-primary/20 transition-colors duration-fast"
            title="Написать в Telegram"
          >
            <Send className="w-4 h-4 text-accent-primary" />
          </a>
        </div>

        {/* Stats in header */}
        {properties.length > 0 && (
          <div className="hidden md:flex items-center gap-6">
            <MiniStat
              icon={<Building2 className="w-4 h-4 text-accent-primary" />}
              value={stats.totalProperties}
              label="Объектов"
            />
            <MiniStat
              icon={<MapPin className="w-4 h-4 text-accent-primary" />}
              value={stats.totalLocations}
              label="Локации"
            />
            <MiniStat
              icon={<HardHat className="w-4 h-4 text-accent-primary" />}
              value={stats.totalDevelopers}
              label="Застройщики"
            />
            <MiniStat
              icon={<DollarSign className="w-4 h-4 text-accent-primary" />}
              value={stats.minPrice > 0 ? `${stats.minPrice.toLocaleString("ru-RU")}$` : "—"}
              label="Мин. цена/м²"
            />
          </div>
        )}
      </div>
    </header>
  );
}
