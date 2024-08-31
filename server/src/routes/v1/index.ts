import express from "express";
import userRoutes from "../../routes/v1/user.route";
import questionRoutes from "../../routes/v1/user.route";
import adminRoutes from "../../routes/v1/admin.route";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/question", questionRoutes);

router.use("/admin", adminRoutes);

export default router;
