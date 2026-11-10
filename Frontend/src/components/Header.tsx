import { Plus, Users } from "lucide-react";

interface HeaderProps {
  onAdd: () => void;
}

export default function Header({ onAdd }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Users size={20} />
          </span>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-zinc-900">
              Employee Management
            </h1>
            <p className="text-xs text-zinc-500">
              Manage your organization's people
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Employee</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
