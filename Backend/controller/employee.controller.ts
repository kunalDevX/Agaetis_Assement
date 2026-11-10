import type {
  Request,
  RequestHandler,
  RequestParamHandler,
  Response,
} from "express";
import { z } from "zod";
import type { Employee } from "../generated/prisma/client";
import * as employeeService from "../service/employee.service";

/* -------------------------------------------------------------------------- */
/*  Validation schemas (single source of truth for input rules)               */
/* -------------------------------------------------------------------------- */

const MAX_BIGINT = 9223372036854775807n;

const text = (label: string, min: number, max: number) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(
      min,
      min === 1
        ? `${label} is required`
        : `${label} must be at least ${min} characters`,
    )
    .max(max, `${label} must be at most ${max} characters`);

const idSchema = z
  .string({ message: "Invalid employee ID" })
  .regex(/^[1-9]\d*$/, "Invalid employee ID")
  .transform((value) => BigInt(value))
  .refine((value) => value <= MAX_BIGINT, "Invalid employee ID");

// Unknown keys are stripped, so clients can't write fields we didn't expect.
const employeeSchema = z.object({
  name: text("Name", 2, 100),
  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase() // normalise so "A@x.com" and "a@x.com" can't both exist
    .email("Enter a valid email address")
    .max(254, "Email must be at most 254 characters"),
  role: text("Role", 1, 100),
});

const patchSchema = employeeSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  });

const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(["name", "email", "role", "created_at"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  // Pagination is opt-in: no `limit` means "return everything".
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const parse = <S extends z.ZodType>(
  schema: S,
  input: unknown,
  code = "VALIDATION_ERROR",
): z.output<S> => {
  const result = schema.safeParse(input);

  if (!result.success) {
    const { issues } = result.error;
    throw new employeeService.AppError(
      400,
      code,
      issues[0]?.message ?? "Invalid input",
      issues.map(({ path, message }) => ({
        field: path.map(String).join("."),
        message,
      })),
    );
  }

  return result.data;
};

// Express 4 doesn't forward rejected promises to error middleware; this does.
const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

// Prisma returns BigInt ids, which JSON can't carry — send them as strings.
const toDto = (employee: Employee) => ({
  ...employee,
  id: employee.id.toString(),
});

const send = (
  res: Response,
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
) => res.status(status).json({ success: true, message, ...extra });

const employeeId = (res: Response): bigint => res.locals.employeeId;

/* -------------------------------------------------------------------------- */
/*  router.param("id") hook: validate once, reuse in every :id route          */
/* -------------------------------------------------------------------------- */

export const validateIdParam: RequestParamHandler = (_req, res, next, id) => {
  try {
    res.locals.employeeId = parse(idSchema, id, "INVALID_EMPLOYEE_ID");
    next();
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*  Handlers                                                                  */
/* -------------------------------------------------------------------------- */

// GET /employees?search=&sortBy=&order=&page=&limit=
export const getEmployees = asyncHandler(async (req, res) => {
  const query = parse(listQuerySchema, req.query);
  const { items, total } = await employeeService.listEmployees(query);

  const meta = query.limit
    ? {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      }
    : { total };

  send(res, 200, "Employees fetched successfully", {
    data: items.map(toDto),
    meta,
  });
});

// GET /employees/:id
export const getEmployeeById = asyncHandler(async (_req, res) => {
  const employee = await employeeService.getEmployeeById(employeeId(res));
  send(res, 200, "Employee fetched successfully", { data: toDto(employee) });
});

// POST /employees
export const createEmployee = asyncHandler(async (req, res) => {
  const data = parse(employeeSchema, req.body ?? {});
  const employee = await employeeService.createEmployee(data);
  send(res, 201, "Employee created successfully", { data: toDto(employee) });
});

// PUT /employees/:id  — full replacement, every field required
export const replaceEmployee = asyncHandler(async (req, res) => {
  const data = parse(employeeSchema, req.body ?? {});
  const employee = await employeeService.updateEmployee(employeeId(res), data);
  send(res, 200, "Employee updated successfully", { data: toDto(employee) });
});

// PATCH /employees/:id  — partial update, at least one field
export const updateEmployee = asyncHandler(async (req, res) => {
  const data = parse(patchSchema, req.body ?? {});
  const employee = await employeeService.updateEmployee(employeeId(res), data);
  send(res, 200, "Employee updated successfully", { data: toDto(employee) });
});

// DELETE /employees/:id
export const deleteEmployee = asyncHandler(async (_req, res) => {
  await employeeService.deleteEmployee(employeeId(res));
  send(res, 200, "Employee deleted successfully");
});
