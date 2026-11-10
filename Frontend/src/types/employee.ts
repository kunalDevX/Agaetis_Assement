export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface EmployeeForm {
  name: string;
  email: string;
  role: string;
}

export const emptyForm: EmployeeForm = {
  name: "",
  email: "",
  role: "",
};

export interface Notice {
  type: "success" | "error";
  message: string;
}
