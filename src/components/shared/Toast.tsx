"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

interface ToastProps {
  title: string;
  message: string;
  variant: "success" | "error";
  onClose: () => void;
}

export function Toast({ title, message, variant, onClose }: ToastProps) {
  const isSuccess = variant === "success";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed right-4 top-20 z-[70] w-[min(420px,calc(100vw-2rem))] rounded-lg border p-4 shadow-xl animate-slide-in-right ${
        isSuccess
          ? "border-semantic-success bg-semantic-success-muted"
          : "border-semantic-danger bg-semantic-danger-muted"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-semantic-success" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-semantic-danger" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body-medium font-medium text-text-primary">{title}</p>
          <p className="mt-1 text-small text-text-secondary">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm p-1 text-text-tertiary transition-colors duration-fast hover:text-text-primary focus-ring"
          aria-label="Закрыть уведомление"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}