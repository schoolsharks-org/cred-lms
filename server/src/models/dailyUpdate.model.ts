import mongoose, { Schema, Document, Model } from "mongoose";

interface dailyUpdateI extends Document {
  title: String;
  image: String;
  module: [{ img: String; steps: String }];
}

const dailyUpdateSchema: Schema<dailyUpdateI> = new Schema<dailyUpdateI>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  module: {
    type: [],
    required: true,
  },
});

const DailyUpdate: Model<dailyUpdateI> = mongoose.model<dailyUpdateI>(
  "DailyUpdate",
  dailyUpdateSchema
);

export default DailyUpdate;
