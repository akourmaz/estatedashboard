"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, HardHat, MapPin, Wallet } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { parsePrice } from "@/lib/utils";

function useAnimatedNumber(target: number, duration = 500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setValue(0);
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card-teal-gradient gradient-overlay glow-hover inner-glow overflow-hidden rounded-lg border border-border-subtle">
      <div className="card-grid-pattern relative flex min-h-[120px] items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-card bg-accent-primary-subtle text-accent-primary shadow-glow-sm">
          {icon}
        </div>
        <div className="relative z-10 min-w-0">
          <p className="text-small text-text-secondary">{label}</p>
          <p className="mt-1 text-h1 font-semibold text-text-primary tabular-nums">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatsBar() {
  const properties = useDashboardStore((s) => s.properties);
  const isLoading = useDashboardStore((s) => s.isLoading);

  const stats = useMemo(() => {
    const locations = new Set(properties.map((property) => property.location).filter(Boolean));
    const developers = new Set(properties.map((property) => property.developer).filter(Boolean));
    const prices = properties
      .map((property) => parsePrice(property.minPricePerSqm))
      .filter((price): price is number => price !== null);

    return {
      propertyCount: properties.length,
      locationCount: locations.size,
      developerCount: developers.size,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
    };
  }, [properties]);

  const animatedPropertyCount = useAnimatedNumber(stats.propertyCount);
  const animatedLocationCount = useAnimatedNumber(stats.locationCount);
  const animatedDeveloperCount = useAnimatedNumber(stats.developerCount);
  const animatedMinPrice = useAnimatedNumber(stats.minPrice);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border-subtle bg-surface p-5"
          >
            <div className="skeleton h-[90px] rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        label="Всего объектов"
        value={animatedPropertyCount}
      />
      <StatCard
        icon={<MapPin className="h-5 w-5" />}
        label="Локации"
        value={animatedLocationCount}
      />
      <StatCard
        icon={<HardHat className="h-5 w-5" />}
        label="Застройщики"
        value={animatedDeveloperCount}
      />
      <StatCard
        icon={<Wallet className="h-5 w-5" />}
        label="Мин. цена за м²"
        value={animatedMinPrice > 0 ? `${animatedMinPrice.toLocaleString("ru-RU")}$` : "—"}
      />
    </div>
  );
}