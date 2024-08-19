import mongoose, { Schema, Document, Model } from "mongoose";
import { Question, QuestionSchema } from "./questions.model"; 

interface WeeklyQuestionI extends Document {
  date: Date;
  weeklyQuestionModule: Question[]; 
  totalScore: number;
  totalAnswers: number;
}

const weeklyQuestionSchema: Schema<WeeklyQuestionI> = new Schema<WeeklyQuestionI>(
  {
    date: {
      type: Date,
      required: true,
    },
    weeklyQuestionModule: {
      type: [QuestionSchema], 
      required: true,
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

const WeeklyQuestion: Model<WeeklyQuestionI> = mongoose.model<WeeklyQuestionI>(
  "WeeklyQuestion",
  weeklyQuestionSchema
);

export default WeeklyQuestion;
