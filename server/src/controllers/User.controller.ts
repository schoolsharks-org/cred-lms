import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
const handleGetUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(userId as string);

    const user = await User.findById(objectId).select("name score");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      name: user.name,
      score: user.score,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default handleGetUser;
