import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import handleGetUser from "../../controllers/User.controller";
import { getDailyQuestion } from "../../controllers/DailyQuestion.controller";

const router = express.Router();

router.get("/get-user", asyncHandler(handleGetUser));
router.get("/get-daily-question", asyncHandler(getDailyQuestion));

export default router;
