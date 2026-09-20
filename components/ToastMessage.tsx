"use client";

import { useEffect } from "react";

type ToastMessageProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function ToastMessage({
  message,
  type = "info",
  onClose,
}: ToastMessageProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-slate-800";

  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm">
      <div className={`${colors} rounded-lg px-4 py-3 text-sm text-white shadow-lg`}>
        <div className="flex items-start justify-between gap-3">
          <p>{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
