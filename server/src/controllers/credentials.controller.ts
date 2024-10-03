import { Request, Response } from "express";



export const getAWSCredentials = (req: Request, res: Response) => {
    try {
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  
      if (!accessKeyId || !secretAccessKey) {
        return res.status(500).json({ error: "AWS credentials not found" });
      }
      return res.status(200).json({
        accessKeyId,
        secretAccessKey,
        region:"ap-south-1"
      });
    } catch (error) {
      console.error("Error fetching AWS credentials:", error);
      return res.status(500).json({ error: "Failed to fetch credentials" });
    }
  };