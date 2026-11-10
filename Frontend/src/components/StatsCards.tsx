import { Briefcase, UserPlus, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { Employee } from "../types/employee";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  tone: string;
}

function StatCard({ label, value, icon, tone }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-900">
          {value}
        </p>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  employees: Employee[];
}

export default function StatsCards({ employees }: StatsCardsProps) {
  const now = new Date();
  const roles = new Set(employees.map((e) => e.role.trim().toLowerCase()));
  const newThisMonth = employees.filter((e) => {
    const created = new Date(e.created_at);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Total employees"
        value={employees.length}
        icon={<Users size={22} />}
        tone="bg-indigo-50 text-indigo-600"
      />
      <StatCard
        label="Distinct roles"
        value={roles.size}
        icon={<Briefcase size={22} />}
        tone="bg-violet-50 text-violet-600"
      />
      <StatCard
        label="Added this month"
        value={newThisMonth}
        icon={<UserPlus size={22} />}
        tone="bg-emerald-50 text-emerald-600"
      />
    </section>
  );
}
