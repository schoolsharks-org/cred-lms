import mongoose, { Schema, Document, Model } from "mongoose";

export interface DailyQuestionI extends Document {
  date: Date;
  questionPrompt: string;
  departmentResponses: {
    Sales: {
      OptionA: number;
      OptionB: number;
    };
    Credit: {
      OptionA: number;
      OptionB: number;
    };
    Collection: {
      OptionA: number;
      OptionB: number;
    };
    Other: {
      OptionA: number;
      OptionB: number;
    };
  };
}

const dailyQuestionSchema: Schema<DailyQuestionI> = new Schema<DailyQuestionI>(
  {
    date: {
      type: Date,
      required: true,
    },
    questionPrompt: {
      type: String,
      required: true,
      trim: true,
    },
    departmentResponses: {
      Sales: {
        OptionA: {
          type: Number,
          required: true,
        },
        OptionB: {
          type: Number,
          required: true,
        },
      },
      Credit: {
        OptionA: {
          type: Number,
          required: true,
        },
        OptionB: {
          type: Number,
          required: true,
        },
      },
      Collection: {
        OptionA: {
          type: Number,
          required: true,
        },
        OptionB: {
          type: Number,
          required: true,
        },
      },
      Other: {
        OptionA: {
          type: Number,
          required: true,
        },
        OptionB: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const DailyQuestion: Model<DailyQuestionI> = mongoose.model(
  "DailyQuestion",
  dailyQuestionSchema
);

export default DailyQuestion;
