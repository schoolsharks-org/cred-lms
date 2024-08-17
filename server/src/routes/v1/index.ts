import express from "express";
import userRoutes from "../../routes/v1/user.route";
import questionRoutes from "../../routes/v1/user.route";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/question", questionRoutes);

export default router;
