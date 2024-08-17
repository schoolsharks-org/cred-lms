import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import{ handleGetUser, handleLoginUser, handleLogoutUser,handleRefreshAccessToken, handleRegisterUser} from "../../controllers/User.controller";
import { getDailyQuestion, respondToDailyQuestion } from "../../controllers/DailyQuestion.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();


router.route("/login").post(asyncHandler(handleLoginUser))
router.route("/register").post(asyncHandler(handleRegisterUser))
router.route("/refresh-token").post(asyncHandler(handleRefreshAccessToken))
router.route("/logout").post(authMiddleware,  asyncHandler(handleLogoutUser))


router.get("/get-user",authMiddleware, asyncHandler(handleGetUser));
router.route("/daily-question")
    .get(authMiddleware, asyncHandler(getDailyQuestion))
    .post(authMiddleware,asyncHandler(respondToDailyQuestion))



export default router;
