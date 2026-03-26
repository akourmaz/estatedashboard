"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, MapPin, HardHat, Send } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

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

function Dot() {
  return (
    <span className="text-text-tertiary/50 select-none" aria-hidden>
      ·
    </span>
  );
}

export function Header() {
  const properties = useDashboardStore((s) => s.properties);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll(); // sync on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = useMemo(() => {
    const locations = new Set(properties.map((p) => p.location).filter(Boolean));
    const developers = new Set(properties.map((p) => p.developer).filter(Boolean));

    return {
      totalProperties: properties.length,
      totalLocations: locations.size,
      totalDevelopers: developers.size,
    };
  }, [properties]);

  return (
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-sm">
      <div
        className={`max-w-dashboard mx-auto flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-out ${
          isScrolled ? "h-11" : "h-14"
        }`}
      >
        {/* Brand toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-nowrap overflow-hidden whitespace-nowrap">
          <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-accent-primary select-none flex-shrink-0">
            ESTATEDASH
          </span>

          <Dot />
          <span className="text-[14px] text-text-primary">
            <span className="hidden sm:inline">Alexey </span>Kurmaz
          </span>

          <Dot />
          <span className="text-[14px] text-text-secondary">
            SoldOut<span className="hidden sm:inline"> Team</span>
          </span>

          <Dot />
          <a
            href="https://t.me/akourmaz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-accent-primary hover:text-accent-primary-hover transition-colors"
            title="Написать в Telegram"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="text-[13px]">@akourmaz</span>
          </a>
        </div>

        {/* Stats — desktop only, hidden on scroll */}
        {properties.length > 0 && (
          <div
            className={`hidden md:flex items-center gap-6 transition-all duration-300 ease-out ${
              isScrolled
                ? "opacity-0 max-w-0 overflow-hidden pointer-events-none"
                : "opacity-100 max-w-md"
            }`}
          >
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
          </div>
        )}
      </div>

      {/* Mint gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
    </header>
  );
}
