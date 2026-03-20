"use client";

import { useState, useRef, useCallback } from "react";
import { FileSpreadsheet, Upload, X, AlertTriangle } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { parseExcelFile, isExcelFile } from "@/lib/excel-parser";

interface ExcelImporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExcelImporter({ isOpen, onClose }: ExcelImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const properties = useDashboardStore((s) => s.properties);
  const setProperties = useDashboardStore((s) => s.setProperties);
  const setIsLoading = useDashboardStore((s) => s.setIsLoading);

  const importFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const buffer = await file.arrayBuffer();
        const parsed = parseExcelFile(buffer);
        setProperties(parsed);
        onClose();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Произошла ошибка при импорте файла"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setProperties, onClose]
  );

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!isExcelFile(file)) {
        setError("Файл не является Excel-таблицей. Поддерживаемый формат: .xlsx");
        return;
      }

      // If data already exists, ask for confirmation
      if (properties.length > 0) {
        setPendingFile(file);
        setShowConfirm(true);
        return;
      }

      await importFile(file);
    },
    [properties.length, importFile]
  );

  const handleConfirmReplace = useCallback(async () => {
    if (pendingFile) {
      setShowConfirm(false);
      await importFile(pendingFile);
      setPendingFile(null);
    }
  }, [pendingFile, importFile]);

  const handleCancelReplace = useCallback(() => {
    setShowConfirm(false);
    setPendingFile(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-overlay border border-border-default rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-h2 text-text-primary">Импорт данных</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-fast rounded-sm focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showConfirm ? (
            /* Confirm replace dialog */
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-semantic-warning mx-auto mb-4" />
              <h3 className="text-h3 text-text-primary mb-2">
                Заменить текущие данные?
              </h3>
              <p className="text-body text-text-secondary mb-6">
                Текущие {properties.length} объектов будут заменены данными из
                нового файла.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelReplace}
                  className="px-4 py-2 text-small text-text-secondary border border-border-default rounded-sm hover:bg-hover transition-colors duration-fast focus-ring"
                >
                  Отмена
                </button>
                <button
                  onClick={handleConfirmReplace}
                  className="px-4 py-2 text-small text-white bg-semantic-danger hover:bg-red-600 rounded-sm transition-colors duration-fast focus-ring"
                >
                  Заменить
                </button>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-base ${
                isDragging
                  ? "border-accent-primary bg-accent-primary-muted"
                  : "border-border-default hover:border-border-strong"
              }`}
            >
              <FileSpreadsheet
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDragging ? "text-accent-primary" : "text-text-tertiary"
                }`}
              />
              <p className="text-body text-text-secondary mb-1">
                Перетащите Excel-файл
              </p>
              <p className="text-body text-text-secondary mb-3">
                или нажмите для выбора
              </p>
              <p className="text-small text-text-tertiary">.xlsx формат</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-semantic-danger-muted border-l-4 border-semantic-danger rounded-md">
              <p className="text-small text-text-primary">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state shown when no data has been imported yet.
 */
export function EmptyState({ onImport }: { onImport: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-[400px]">
        <FileSpreadsheet className="w-16 h-16 text-accent-primary-muted mx-auto mb-6" />
        <h2 className="text-h2 text-text-primary mb-2">
          Добро пожаловать в EstateDash
        </h2>
        <p className="text-body text-text-secondary mb-6">
          Загрузите Excel-файл с объектами недвижимости для начала работы
        </p>
        <button
          onClick={onImport}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-text-inverse text-body font-medium rounded-md transition-all duration-base focus-ring glow-hover"
        >
          <Upload className="w-5 h-5" />
          Загрузить Excel
        </button>
        <p className="text-small text-text-tertiary mt-4">
          Поддерживаемый формат: .xlsx
        </p>
      </div>
    </div>
  );
}
