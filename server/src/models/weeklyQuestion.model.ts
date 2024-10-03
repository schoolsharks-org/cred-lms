import mongoose, { Schema, Document, Model } from "mongoose";
import { Question, QuestionSchema } from "./questions.model";

interface WeeklyQuestionI extends Document {
  _id:mongoose.Types.ObjectId;
  moduleName:string;
  date: Date;
  weeklyQuestionModule: Question[];
  analytics:{
    Sales:{
      totalScore:number,
      totalTime:number, // In seconds
      totalAnswers:number,
      belowEighty:number,
      reattempted:number,
      progressReattempt:number,
    },
    Operations:{
      totalScore:number,
      totalTime:number,
      totalAnswers:number,  
      belowEighty:number,
      reattempted:number,
      progressReattempt:number
    },
    Collection:{
      totalScore:number,
      totalTime:number,
      totalAnswers:number,  
      belowEighty:number,
      reattempted:number,
      progressReattempt:number
    },
    Credit:{
      totalScore:number,
      totalTime:number,
      totalAnswers:number, 
      belowEighty:number,
      reattempted:number,
      progressReattempt:number
    },
    Others:{
      totalScore:number,
      totalTime:number,
      totalAnswers:number,
      belowEighty:number,
      reattempted:number,
      progressReattempt:number
    }
  }
  insights:{type:"BODY"|"SUBHEADING",text:string}[];
  // totalScore: {
  //   Sales:number,
  //   Operations:number,
  //   Collection:number,
  //   Credit:number,
  //   Others:number
  // };
  // totalAnswers: number;
  department: String;
}

const weeklyQuestionSchema: Schema<WeeklyQuestionI> =
  new Schema<WeeklyQuestionI>(
    {
      date: {
        type: Date,
        required: true,
      },
      moduleName: {
        type: String,
        required: true,
      },
      weeklyQuestionModule: {
        type: [QuestionSchema],
        required: true,
      },
      // totalScore: {
      //   type:{
      //     Sales:{type:Number,default:0},
      //     Operations:{type:Number,default:0},
      //     Collection:{type:Number,default:0},
      //     Credit:{type:Number,default:0},
      //     Others:{type:Number,default:0}
      //   }
      // },
      analytics:{
        Sales:{
          totalScore:Number,
          totalTime:Number,
          totalAnswers:Number,
          belowEighty:Number,
          reattempted:Number,
          progressReattempt:Number,
        },
        Operations:{
          totalScore:Number,
          totalTime:Number,
          totalAnswers:Number,
          belowEighty:Number,
          reattempted:Number,
          progressReattempt:Number,
        },
        Collection:{
          totalScore:Number,
          totalTime:Number,
          totalAnswers:Number,
          belowEighty:Number,
          reattempted:Number,
          progressReattempt:Number,
        },
        Credit:{
          totalScore:Number,
          totalTime:Number,
          totalAnswers:Number,
          belowEighty:Number,
          reattempted:Number,
          progressReattempt:Number,
        },
        Others:{
          totalScore:Number,
          totalTime:Number,
          totalAnswers:Number,
          belowEighty:Number,
          reattempted:Number,
          progressReattempt:Number,
        }
      },
      // totalAnswers: {
      //   type: Number,
      //   required: true,
      // },
      insights: [{
        type: {
          type: String, 
          enum: ["BODY", "SUBHEADING"],
        },
        text: String,
      }],
      department: {
        type: String,
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
