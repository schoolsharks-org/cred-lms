import mongoose, { Schema, Document, Model } from "mongoose";
import WeeklyQuestion from "./weeklyQuestion.model";
import User from "./user.model";

interface weeklyResponseI extends Document {
  user: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  score: number;
  endTime: Date;
  weeklyQuestion: mongoose.Schema.Types.ObjectId;
  userResponse: Array<{
    _id: mongoose.Schema.Types.ObjectId;
    response: string;
  }>;
  reattempts: [{ score: number,answeredCount:number }];
}

export const MAX_REATTEMPTS=2

const weeklyResponseSchema: Schema<weeklyResponseI> =
  new Schema<weeklyResponseI>(
    {
      weeklyQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WeeklyQuestion,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
      },
      score: {
        type: Number,
        default: 0,
      },
      userResponse: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          response: {
            type: String,
            required: true,
          },
        },
      ],
      reattempts: {
        type: [
          {
            score: Number,
            answeredCount:{type:Number,default:0}
          },
        ],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

const WeeklyResponse: Model<weeklyResponseI> = mongoose.model<weeklyResponseI>(
  "WeeklyResponse",
  weeklyResponseSchema
);

export default WeeklyResponse;
