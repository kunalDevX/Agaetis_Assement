import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { emptyForm } from "../types/employee";
import type { Employee, EmployeeForm } from "../types/employee";

interface EmployeeModalProps {
  /** Employee being edited, or null when creating a new one. */
  employee: Employee | null;
  saving: boolean;
  onSubmit: (form: EmployeeForm) => void;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function EmployeeModal({
  employee,
  saving,
  onSubmit,
  onClose,
}: EmployeeModalProps) {
  const [form, setForm] = useState<EmployeeForm>(
    employee
      ? { name: employee.name, email: employee.email, role: employee.role }
      : emptyForm
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-900/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {employee ? "Edit employee" : "Add employee"}
            </h2>
            <p className="text-sm text-zinc-500">
              {employee
                ? "Update the details below."
                : "Fill in the details of the new employee."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">
              Name
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Cooper"
              className={inputClass}
              required
              minLength={2}
              autoFocus
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">
              Email
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              className={inputClass}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">
              Role
            </span>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Product Designer"
              className={inputClass}
              required
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : employee ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
