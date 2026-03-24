"use client";

import { startTransition, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

export function SearchBar() {
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);
  const isLoading = useDashboardStore((s) => s.isLoading);
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setSearchQuery(inputValue.trimStart());
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [inputValue, setSearchQuery]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Поиск по проекту, застройщику, локации, условиям, контакту..."
        disabled={isLoading}
        className="focus-ring h-search-bar w-full rounded-md border border-border-default bg-surface pl-11 pr-11 text-body text-text-primary placeholder:text-text-tertiary transition-all duration-base hover:border-border-strong focus:border-border-accent focus:shadow-accent-glow disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Поиск по объектам"
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => setInputValue("")}
          className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-text-tertiary transition-colors duration-fast hover:bg-hover hover:text-text-primary focus-ring"
          aria-label="Очистить поиск"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}