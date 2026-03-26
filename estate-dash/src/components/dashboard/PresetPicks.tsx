"use client";

import { BriefcaseBusiness, KeyRound, TimerReset } from "lucide-react";
import { DASHBOARD_PRESETS } from "@/lib/filters";
import { DashboardPreset } from "@/lib/types";
import { useDashboardStore } from "@/stores/dashboard-store";

const PRESET_ORDER: DashboardPreset[] = [
  "soft-entry",
  "fast-delivery",
  "high-commission",
];

const PRESET_ICONS: Record<DashboardPreset, React.ReactNode> = {
  "soft-entry": <KeyRound className="w-4 h-4" />,
  "fast-delivery": <TimerReset className="w-4 h-4" />,
  "high-commission": <BriefcaseBusiness className="w-4 h-4" />,
};

export function PresetPicks() {
  const properties = useDashboardStore((s) => s.properties);
  const activePreset = useDashboardStore((s) => s.activePreset);
  const applyPreset = useDashboardStore((s) => s.applyPreset);

  if (properties.length === 0) return null;

  return (
    <section className="w-full max-w-full rounded-lg border border-border-card bg-transparent px-1.5 py-1.5">
      <div className="grid grid-cols-3 gap-1.5">
          {PRESET_ORDER.map((preset) => {
            const isActive = activePreset === preset;
            const meta = DASHBOARD_PRESETS[preset];

            return (
              <button
                key={preset}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`group inline-flex min-h-0 min-w-0 items-center gap-1 rounded-md border px-2 py-1.5 text-left transition-all duration-200 focus-ring ${
                  isActive
                    ? "border-border-accent bg-accent-primary-subtle text-text-primary"
                    : "border-border-subtle bg-surface text-text-secondary hover:border-border-card hover:text-text-primary"
                }`}
                aria-pressed={isActive}
                title={meta.title}
              >
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    isActive
                      ? "border-border-accent bg-surface text-accent-primary"
                      : "border-border-default bg-surface text-accent-primary"
                  }`}
                >
                  {PRESET_ICONS[preset]}
                </span>
                <span className="min-w-0 text-[11px] font-medium leading-[1.1] text-current break-words">
                  {meta.title}
                </span>
              </button>
            );
          })}
      </div>
    </section>
  );
}