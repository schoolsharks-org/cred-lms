import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { handleAdminDashboard } from "../../controllers/adminDashboard.controller";
const router = express.Router();

router
  .route("/admin-dashboard")
  .get(authMiddleware, asyncHandler(handleAdminDashboard));

export default router;
