import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  handleGetUser,
  handleLogoutUser,
  handleRefreshAccessToken,
  handleRegisterUser,
  handleSendOtp,
  handleVerifyOtp,
} from "../../controllers/User.controller";
import {
  getDailyQuestion,
  respondToDailyQuestion,
} from "../../controllers/DailyQuestion.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getWeeklyQuestion,
  respondToWeeklyQuestion,
} from "../../controllers/WeeklyQuestionController";
import { TrackLevels } from "../../controllers/trackLevel.controller";
import { handleScoreboard } from "../../controllers/scoreboard.controller";
const router = express.Router();


// router.route("/login").post(asyncHandler(handleLoginUser));
router.route("/send-otp").post(asyncHandler(handleSendOtp));
router.route("/verify-otp").post(asyncHandler(handleVerifyOtp));
router.route("/register").post(asyncHandler(handleRegisterUser));
router.route("/refresh-token").post(asyncHandler(handleRefreshAccessToken));
router.route("/logout").post(authMiddleware, asyncHandler(handleLogoutUser));

router.get("/get-user", authMiddleware, asyncHandler(handleGetUser));

router
  .route("/daily-question")
  .get(authMiddleware, asyncHandler(getDailyQuestion))
  .post(authMiddleware, asyncHandler(respondToDailyQuestion));

router
  .route("/weekly-question")
  .get(authMiddleware, asyncHandler(getWeeklyQuestion))
  .post(authMiddleware, asyncHandler(respondToWeeklyQuestion));
  
router.route("/track-levels").get(authMiddleware, asyncHandler(TrackLevels));

router.route("/scoreboard").get(authMiddleware, asyncHandler(handleScoreboard));
export default router;
