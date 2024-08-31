import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { handleAdminDashboard } from "../../controllers/adminDashboard.controller";
import { employeeStats } from "../../controllers/employeeStats.controller";
const router = express.Router();

router
  .route("/admin-dashboard")
  .get(asyncHandler(handleAdminDashboard));

router
  .route("/employee-stats")
  .get(authMiddleware, asyncHandler(employeeStats));

export default router;
