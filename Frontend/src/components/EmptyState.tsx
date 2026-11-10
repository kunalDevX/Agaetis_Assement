import { SearchX, UsersRound } from "lucide-react";

interface EmptyStateProps {
  searching: boolean;
  onAdd: () => void;
}

export function LoadingState() {
  return (
    <ul className="divide-y divide-zinc-100" aria-busy="true">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex animate-pulse items-center gap-3 px-5 py-4">
          <span className="h-10 w-10 rounded-full bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <span className="block h-3 w-40 rounded bg-zinc-200" />
            <span className="block h-3 w-56 rounded bg-zinc-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function EmptyState({ searching, onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
        {searching ? <SearchX size={26} /> : <UsersRound size={26} />}
      </span>
      <h3 className="mt-4 font-medium text-zinc-900">
        {searching ? "No matching employees" : "No employees yet"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">
        {searching
          ? "Try a different name, email or role."
          : "Add your first employee to start building the directory."}
      </p>
      {!searching && (
        <button
          onClick={onAdd}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Employee
        </button>
      )}
    </div>
  );
}
