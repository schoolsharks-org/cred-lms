import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { handleAdminDashboard } from "../../controllers/adminDashboard.controller";
import { hanldeWeeklySangramStats } from "../../controllers/employeeStats.controller";
import { employeeDailyStats } from "../../controllers/employeeDailyStats";
const router = express.Router();

router.route("/admin-dashboard").get(asyncHandler(handleAdminDashboard));

router
  .route("/weekly-sangram-stats")
  .get(asyncHandler(hanldeWeeklySangramStats));

router.route("/daily-stats").get(asyncHandler(employeeDailyStats));

export default router;
