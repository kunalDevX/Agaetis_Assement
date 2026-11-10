import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import type { Notice } from "../types/employee";

interface ToastProps {
  notice: Notice;
  onDismiss: () => void;
}

export default function Toast({ notice, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  const isError = notice.type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm" role="status">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${
          isError ? "border-rose-200" : "border-emerald-200"
        }`}
      >
        {isError ? (
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-600" />
        ) : (
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-emerald-600"
          />
        )}
        <p className="flex-1 text-sm text-zinc-700">{notice.message}</p>
        <button
          onClick={onDismiss}
          className="text-zinc-400 hover:text-zinc-600"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
