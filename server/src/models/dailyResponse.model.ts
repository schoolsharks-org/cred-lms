import mongoose, { Schema, Document, Model } from "mongoose";
import DailyQuestion from "./dailyQuestion.model";
import User from "./user.model";
interface dailyResponseI extends Document {
  date: Date;
  dailyQuestionPrompt: string;
  user: string;
  userResponse: string;
}

const dailyResponseSchema: Schema<dailyResponseI> = new Schema<dailyResponseI>(
  {
    date: {
      type: Date,
      required: true,
    },
    dailyQuestionPrompt: {
      type: String,
      ref: DailyQuestion,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      ref: User,
      required: true,
    },
    userResponse: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DailyResponse: Model<dailyResponseI> = mongoose.model<dailyResponseI>(
  "DailyRespponse",
  dailyResponseSchema
);

export default DailyResponse;
