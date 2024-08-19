import { Schema, Document } from "mongoose";

export enum Options {
  YES = "YES",
  NO = "NO",
  A = "A",
  B = "B",
  RIGHT = "RIGHT",
  WRONG = " WRONG",
}

export enum Category {
  category_1 = "PromptOnly",
  category_2 = "ImagePairPrompt",
  category_3 = "SingleImagePrompt",
}

export interface Question extends Document {
  questionPrompt: string;
  questionCategory: Category;
  images: string[];
  optionA: string;
  optionB: string;
  correctOption: string;
  score: number;
  createdAt: Date;
}

export const QuestionSchema: Schema<Question> = new Schema<Question>(
  {
    questionPrompt: {
      type: String,
      required: true,
      trim: true,
    },
    questionCategory: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    images: {
      type: [String],
    },
    correctOption: {
      type: String,
      required: true,
    },
    optionA: {
      type: String,
      required: true,
      // enum: Object.values(Options),
    },
    optionB: {
      type: String,
      required: true,
      // enum: Object.values(Options),
    },
    score: {
      type: Number,
      default: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
