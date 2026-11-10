import { Router } from "express";
import type { ErrorRequestHandler } from "express";
import {
  validateIdParam,
  getEmployees,
  getEmployeeById,
  createEmployee,
  replaceEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controller/employee.controller.ts";
import { AppError } from "../service/employee.service";

const router = Router();

// Validates and parses `:id` once for every route below that has it.
router.param("id", validateIdParam);

router.route("/").get(getEmployees).post(createEmployee);

router
  .route("/:id")
  .get(getEmployeeById)
  .put(replaceEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);

// Single place where every error from this router becomes an HTTP response.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      message: err.message,
      error: {
        code: err.code,
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  console.error("EMPLOYEE ROUTER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on our side",
    error: { code: "INTERNAL_SERVER_ERROR" },
  });
};

router.use(errorHandler);

export default router;
