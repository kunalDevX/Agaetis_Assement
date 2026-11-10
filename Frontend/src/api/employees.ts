import axios from "axios";
import type { Employee, EmployeeForm } from "../types/employee";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const employeeApi = {
  async list(): Promise<Employee[]> {
    const response = await API.get("/employees");
    return response.data.data ?? [];
  },

  async create(form: EmployeeForm): Promise<void> {
    await API.post("/employees", form);
  },

  async update(id: string, form: EmployeeForm): Promise<void> {
    await API.patch(`/employees/${id}`, form);
  },

  async remove(id: string): Promise<void> {
    await API.delete(`/employees/${id}`);
  },
};

export function getErrorMessage(err: unknown, fallback: string): string {
  return axios.isAxiosError(err)
    ? err.response?.data?.message || fallback
    : "Something went wrong";
}
