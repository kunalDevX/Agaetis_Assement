import { useCallback, useEffect, useMemo, useState } from "react";
import { employeeApi, getErrorMessage } from "../api/employees";
import type { Employee, EmployeeForm, Notice } from "../types/employee";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setNotice(null);
      setEmployees(await employeeApi.list());
    } catch (err) {
      setNotice({
        type: "error",
        message: getErrorMessage(err, "Failed to fetch employees"),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  /** Creates (no id) or updates (with id). Resolves true on success. */
  const saveEmployee = async (
    form: EmployeeForm,
    id?: string | null
  ): Promise<boolean> => {
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      setNotice({ type: "error", message: "All fields are required" });
      return false;
    }

    try {
      setSaving(true);
      setNotice(null);

      if (id) {
        await employeeApi.update(id, form);
      } else {
        await employeeApi.create(form);
      }

      setNotice({
        type: "success",
        message: id
          ? "Employee updated successfully"
          : "Employee created successfully",
      });
      await fetchEmployees();
      return true;
    } catch (err) {
      setNotice({
        type: "error",
        message: getErrorMessage(err, "Failed to save employee"),
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteEmployee = async (employee: Employee): Promise<boolean> => {
    try {
      setNotice(null);
      await employeeApi.remove(employee.id);
      setEmployees((prev) => prev.filter((item) => item.id !== employee.id));
      setNotice({ type: "success", message: "Employee deleted successfully" });
      return true;
    } catch (err) {
      setNotice({
        type: "error",
        message: getErrorMessage(err, "Failed to delete employee"),
      });
      return false;
    }
  };

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase();
    return employees.filter((employee) =>
      `${employee.name} ${employee.email} ${employee.role}`
        .toLowerCase()
        .includes(query)
    );
  }, [employees, search]);

  return {
    employees,
    filteredEmployees,
    search,
    setSearch,
    loading,
    saving,
    notice,
    dismissNotice: () => setNotice(null),
    fetchEmployees,
    saveEmployee,
    deleteEmployee,
  };
}
