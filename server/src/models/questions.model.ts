import mongoose, { Schema, Document, Model } from "mongoose";

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

const QuestionSchema: Schema<Question> = new Schema<Question>(
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
      enum: Options,
    },
    optionB: {
      type: String,
      required: true,
      enum: Options,
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

const Question: Model<Question> = mongoose.model<Question>(
  "Question",
  QuestionSchema
);

export default Question;
