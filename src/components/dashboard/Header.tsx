"use client";

import { Diamond, FileSpreadsheet, Upload } from "lucide-react";

interface HeaderProps {
  propertyCount: number;
  onOpenImport: () => void;
}

export function Header({ propertyCount, onOpenImport }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-dashboard mx-auto flex min-h-header items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-card bg-accent-primary-subtle shadow-glow-sm">
            <Diamond className="h-5 w-5 text-accent-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-h2 font-semibold tracking-tight text-text-primary">
                EstateDash
              </span>
              <span className="hidden rounded-full border border-border-card bg-accent-primary-subtle px-2 py-0.5 text-xs font-medium text-accent-primary sm:inline-flex">
                Georgia Real Estate
              </span>
            </div>
            <p className="hidden text-small text-text-secondary sm:block">
              Поиск, фильтрация и разбор объектов застройщиков в одном рабочем дашборде.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-2 sm:flex">
            <FileSpreadsheet className="h-4 w-4 text-accent-primary" />
            <span className="text-small text-text-secondary">Объектов</span>
            <span className="tabular-nums text-body-medium font-semibold text-text-primary">
              {propertyCount}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenImport}
            className="inline-flex items-center gap-2 rounded-md border border-border-card bg-accent-primary px-3 py-2 text-small font-medium text-text-inverse transition-all duration-base hover:bg-accent-primary-hover focus-ring sm:px-4"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Загрузить Excel</span>
            <span className="sm:hidden">Импорт</span>
          </button>
        </div>
      </div>
    </header>
  );
}
