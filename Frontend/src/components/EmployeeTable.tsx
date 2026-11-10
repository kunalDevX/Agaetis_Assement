import { Pencil, Trash2 } from "lucide-react";
import type { Employee } from "../types/employee";
import Avatar from "./Avatar";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-5 py-3 font-medium">Employee</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Role</th>
            <th className="hidden px-5 py-3 font-medium lg:table-cell">ID</th>
            <th className="hidden px-5 py-3 font-medium sm:table-cell">
              Created
            </th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-100">
          {employees.map((employee) => (
            <tr key={employee.id} className="transition hover:bg-indigo-50/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={employee.name} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">
                      {employee.name}
                    </p>
                    <p className="truncate text-zinc-500">{employee.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 md:hidden">
                      {employee.role}
                    </span>
                  </div>
                </div>
              </td>

              <td className="hidden px-5 py-4 md:table-cell">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
                  {employee.role}
                </span>
              </td>

              <td className="hidden px-5 py-4 font-mono text-xs text-zinc-400 lg:table-cell">
                #{employee.id}
              </td>

              <td className="hidden px-5 py-4 text-zinc-500 sm:table-cell">
                {new Date(employee.created_at).toLocaleDateString()}
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(employee)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                    title="Edit"
                    aria-label={`Edit ${employee.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(employee)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Delete"
                    aria-label={`Delete ${employee.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
