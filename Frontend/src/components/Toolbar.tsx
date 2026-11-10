import { RefreshCw, Search, X } from "lucide-react";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
  total: number;
  shown: number;
}

export default function Toolbar({
  search,
  onSearchChange,
  onRefresh,
  loading,
  total,
  shown,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-5">
      <div>
        <h2 className="font-semibold text-zinc-900">Employee Directory</h2>
        <p className="text-xs text-zinc-500">
          Showing {shown} of {total}
        </p>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <div className="relative flex-1 sm:w-64 sm:flex-none">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email or role"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-8 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-xl border border-zinc-200 p-2.5 text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-60"
          title="Refresh"
          aria-label="Refresh"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}
