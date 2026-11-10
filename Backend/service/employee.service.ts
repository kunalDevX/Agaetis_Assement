import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

/* -------------------------------------------------------------------------- */
/*  Domain error                                                              */
/* -------------------------------------------------------------------------- */

// Thrown by the service/controller layers; the router's error handler turns it
// into an HTTP response. (Fields are declared explicitly, not as constructor
// parameter properties, so this also runs under Node's type-stripping.)
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const notFound = () =>
  new AppError(404, "EMPLOYEE_NOT_FOUND", "Employee not found");

// Translate known Prisma failures into domain errors, so controllers never
// need to know anything about Prisma error codes.
const translateError = (error: unknown): unknown => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new AppError(
        409,
        "DUPLICATE_EMAIL",
        "Employee with this email already exists",
      );
    }
    if (error.code === "P2025") return notFound();
  }
  return error;
};

const run = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw translateError(error);
  }
};

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface EmployeeInput {
  name: string;
  email: string;
  role: string;
}

export type SortField = "name" | "email" | "role" | "created_at";

export interface ListEmployeesOptions {
  search?: string;
  sortBy: SortField;
  order: "asc" | "desc";
  page: number;
  /** When omitted, every matching employee is returned (no pagination). */
  limit?: number;
}

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

export const listEmployees = ({
  search,
  sortBy,
  order,
  page,
  limit,
}: ListEmployeesOptions) => {
  // `mode: "insensitive"` is for PostgreSQL / MongoDB. On MySQL / SQLite,
  // remove it (those already match case-insensitively / don't support it).
  const where: Prisma.EmployeeWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  return run(async () => {
    // One transaction so the rows and the total come from the same snapshot.
    const [items, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        // `id` is a tiebreaker so pages stay stable when the sort column repeats.
        orderBy: [
          { [sortBy]: order } as Prisma.EmployeeOrderByWithRelationInput,
          { id: "asc" },
        ],
        ...(limit !== undefined && { skip: (page - 1) * limit, take: limit }),
      }),
      prisma.employee.count({ where }),
    ]);

    return { items, total };
  });
};

export const getEmployeeById = (id: bigint) =>
  run(async () => {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw notFound();
    return employee;
  });

/* -------------------------------------------------------------------------- */
/*  Commands                                                                  */
/* -------------------------------------------------------------------------- */

export const createEmployee = (data: EmployeeInput) =>
  run(() => prisma.employee.create({ data }));

export const updateEmployee = (id: bigint, data: Partial<EmployeeInput>) =>
  run(() => prisma.employee.update({ where: { id }, data }));

export const deleteEmployee = (id: bigint) =>
  run(() => prisma.employee.delete({ where: { id } }));
