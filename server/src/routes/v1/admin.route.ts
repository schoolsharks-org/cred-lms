import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { handleAdminDashboard } from "../../controllers/adminDashboard.controller";
import { hanldeWeeklySangramStats } from "../../controllers/employeeStats.controller";
import { employeeDailyStats } from "../../controllers/employeeDailyStats";
import { handleDownloadBelow80Scorers, handleDownloadInactiveLast15Days, handleDownloadInactiveLast7Days, handleDownloadModulesCompleted, handleDownloadProgressReattempt, handleDownloadReattempted, handleDownloadWeeklyModules, handleTotalEmployeesDownload } from "../../controllers/adminDownload.controller";
const router = express.Router();

router.route("/admin-dashboard").get(asyncHandler(handleAdminDashboard));

router
  .route("/weekly-sangram-stats")
  .get(asyncHandler(hanldeWeeklySangramStats));

router.route("/daily-stats").get(asyncHandler(employeeDailyStats));


router.route("/download-totalEmployees").get(asyncHandler(handleTotalEmployeesDownload));
router.route("/download-inactiveLast7Days").get(asyncHandler(handleDownloadInactiveLast7Days));
router.route("/download-inactiveLast15Days").get(asyncHandler(handleDownloadInactiveLast15Days));
router.route("/download-weeklyModules").get(asyncHandler(handleDownloadWeeklyModules));
router.route("/download-modulesCompleted").get(asyncHandler(handleDownloadModulesCompleted));
router.route("/download-below80Scorers").get(asyncHandler(handleDownloadBelow80Scorers));
router.route("/download-reattempted").get(asyncHandler(handleDownloadReattempted));
router.route("/download-progressReattempt").get(asyncHandler(handleDownloadProgressReattempt));



export default router;
