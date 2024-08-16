import mongoose, { Schema, Document, Model } from "mongoose";

interface WeeklyQuestion extends Document {
  date: Date;
  questionPrompt: string[];
  totalScore: number;
  totalAnswers: number;
}

const weeklyQuestionSchema: Schema<WeeklyQuestion> = new Schema<WeeklyQuestion>(
  {
    date: {
      type: Date,
      required: true,
    },
    questionPrompt: {
      type: [String],
      required: true,
      trim: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    totalAnswers: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WeeklyQuestion: Model<WeeklyQuestion> = mongoose.model<WeeklyQuestion>(
  "WeeklyQuestion",
  weeklyQuestionSchema
);

export default WeeklyQuestion;
