import { useState } from "react";
import ConfirmDialog from "./components/ConfirmDialog";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeTable from "./components/EmployeeTable";
import EmptyState, { LoadingState } from "./components/EmptyState";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import Toast from "./components/Toast";
import Toolbar from "./components/Toolbar";
import { useEmployees } from "./hooks/useEmployees";
import type { Employee, EmployeeForm } from "./types/employee";

export default function App() {
  const {
    employees,
    filteredEmployees,
    search,
    setSearch,
    loading,
    saving,
    notice,
    dismissNotice,
    fetchEmployees,
    saveEmployee,
    deleteEmployee,
  } = useEmployees();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (form: EmployeeForm) => {
    const ok = await saveEmployee(form, editing?.id);
    if (ok) closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    await deleteEmployee(target);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header onAdd={openCreate} />

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 md:px-10">
        <StatsCards employees={employees} />

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <Toolbar
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => void fetchEmployees()}
            loading={loading}
            total={employees.length}
            shown={filteredEmployees.length}
          />

          {loading && employees.length === 0 ? (
            <LoadingState />
          ) : filteredEmployees.length === 0 ? (
            <EmptyState searching={search.trim() !== ""} onAdd={openCreate} />
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
          )}
        </section>
      </main>

      {formOpen && (
        <EmployeeModal
          employee={editing}
          saving={saving}
          onSubmit={(form) => void handleSubmit(form)}
          onClose={closeForm}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          employee={pendingDelete}
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {notice && <Toast notice={notice} onDismiss={dismissNotice} />}
    </div>
  );
}
