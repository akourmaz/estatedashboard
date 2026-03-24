"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { PropertyTable } from "@/components/dashboard/PropertyTable";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { EmptyState, ExcelImporter } from "@/components/shared/ExcelImporter";
import { Toast } from "@/components/shared/Toast";
import { useDashboardStore } from "@/stores/dashboard-store";

interface ToastState {
  title: string;
  message: string;
  variant: "success" | "error";
}

export default function DashboardPage() {
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const properties = useDashboardStore((s) => s.properties);
  const isLoading = useDashboardStore((s) => s.isLoading);

  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return (
    <div className="min-h-screen bg-canvas">
      <Header
        propertyCount={properties.length}
        onOpenImport={() => setIsImporterOpen(true)}
      />

      <main
        id="main-content"
        className="max-w-dashboard mx-auto px-4 py-6 sm:px-6"
      >
        {properties.length === 0 && !isLoading ? (
          <EmptyState onImport={() => setIsImporterOpen(true)} />
        ) : (
          <div className="space-y-5">
            <StatsBar />
            <SearchBar />
            <FilterPanel />
            <PropertyTable />
          </div>
        )}
      </main>

      <ExcelImporter
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportSuccess={(count) =>
          setToast({
            title: "Импорт завершён",
            message: `Загружено ${count} объектов из Excel-файла.`,
            variant: "success",
          })
        }
        onImportError={(message) =>
          setToast({
            title: "Ошибка импорта",
            message,
            variant: "error",
          })
        }
      />

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
