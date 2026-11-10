import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import type { Employee } from "../types/employee";

interface ConfirmDialogProps {
  employee: Employee;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  employee,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <Trash2 size={22} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-zinc-900">
          Delete employee?
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          <span className="font-medium text-zinc-700">{employee.name}</span>{" "}
          will be permanently removed. This can't be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
