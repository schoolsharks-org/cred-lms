import mongoose, { Schema, Document, Model } from "mongoose";
import WeeklyQuestion from "./weeklyQuestion.model";
import User from "./user.model";
interface weeklyResponseI extends Document {
  date: Date;
  weeklyQuestionPrompt: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  userResponse: Array<{
    id: mongoose.Schema.Types.ObjectId;
    response: string;
  }>;
}

const weeklyResponseSchema: Schema<weeklyResponseI> =
  new Schema<weeklyResponseI>(
    {
      date: {
        type: Date,
        required: true,
      },
      weeklyQuestionPrompt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WeeklyQuestion,
        required: true,
        trim: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      userResponse: [
        {
          id: {
            type: String,
            required: true,
          },
          response: {
            type: String,
            required: true,
          },
        },
      ],
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
