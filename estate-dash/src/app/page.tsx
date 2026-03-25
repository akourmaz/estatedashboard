"use client";

import { Header } from "@/components/dashboard/Header";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { PropertyTable } from "@/components/dashboard/PropertyTable";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />

      <main
        id="main-content"
        className="max-w-dashboard mx-auto px-4 sm:px-6 py-6 space-y-5"
      >
        <FilterPanel />
        <PropertyTable />
      </main>
    </div>
  );
}
