import mongoose, { Schema, Document, Model } from "mongoose";

export enum Department {
  Sales = "Sales",
  Credit = "Credit",
  Collection = "Collection",
  Others = "Others",
}

export interface User extends Document {
  name: string;
  email: string;
  department: Department;
  contact: string;
  address: string;
  score: number;
  dailyQuestionResponse: string;
  token: string;
  createdAt: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      enum: Object.values(Department),
      required: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
      },
    },
    address: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    dailyQuestionResponse: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<User> = mongoose.model<User>("User", UserSchema);

export default User;
