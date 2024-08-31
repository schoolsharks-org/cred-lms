import mongoose, { Schema, Document, Model } from "mongoose";

export type Option = "OptionA" | "OptionB";

export interface DailyQuestionI extends Document {
  date: Date;
  questionPrompt: string;
  options: {
    optionA: string;
    optionB: string;
  };
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
    Operations: {
      OptionA: number;
      OptionB: number;
    };
    Others: {
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
    options: {
      optionA: {
        type: String,
        required: true,
      },
      optionB: {
        type: String,
        required: true,
      },
    },
    departmentResponses: {
      Sales: {
        OptionA: {
          type: Number,
          required: true,
          default:0,
        },
        OptionB: {
          type: Number,
          required: true,
          default:0,
        },
      },
      Credit: {
        OptionA: {
          type: Number,
          required: true,
          default:0,
        },
        OptionB: {
          type: Number,
          required: true,
          default:0,
        },
      },
      Collection: {
        OptionA: {
          type: Number,
          required: true,
          default:0,
        },
        OptionB: {
          type: Number,
          required: true,
          default:0,
        },
      },
      Others: {
        OptionA: {
          type: Number,
          required: true,
          default:0,
        },
        OptionB: {
          type: Number,
          required: true,
          default:0,
        },
      },
      Operations:{
        OptionA: {
          type: Number,
          required: true,
          default:0,
        },
        OptionB: {
          type: Number,
          required: true,
          default:0,
        },
      }
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
