import mongoose, { Schema, Document, Model } from "mongoose";

interface dailyResponseI extends Document {
  date: Date;
  dailyQuestion: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userResponse: 'OptionA'|'OptionB';
}

const dailyResponseSchema: Schema<dailyResponseI> = new Schema<dailyResponseI>(
  {
    date: {
      type: Date,
      required: true,
    },
    dailyQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyQuestion',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userResponse: {
      type: String,
      enum:['OptionA','OptionB'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DailyResponse: Model<dailyResponseI> = mongoose.model<dailyResponseI>(
  "DailyResponse",
  dailyResponseSchema
);

export default DailyResponse;
