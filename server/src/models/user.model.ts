import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export enum Department {
  Sales = "Sales",
  Credit = "Credit",
  Collection = "Collection",
  Operations = "Operations",
  Others = "Others",
}


export interface User extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  department: Department;
  contact: string;
  address: string;
  employeeId:string;
  score: number;
  dailyQuestionResponse: string;
  refreshToken: string;
  otpData:{otp:number,expiry:Date};
  status:"Active" | "Inactive";
  createdAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const UserSchema: Schema<User> = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId:{
      type:String,
      // required:true,
      trim:true,
    },
    password: {
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
    refreshToken: {
      type: String,
      trim: true,
    },
    status:{
      type:String,
      enum:["Active","Inactive"]
    },
    otpData:{
      type:{
        otp:Number,
        expiry:Date
      },
      default:null
    },

  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User: Model<User> = mongoose.model<User>("User", UserSchema);

export default User;
