import { NextFunction, Request, response, Response } from "express";
import AppError from "../utils/appError";
import WeeklyResponse from "../models/weeklyResponse.model";
import WeeklyQuestion from "../models/weeklyQuestion.model";

function getMondays(year: any, month: any) {
  const mondays = [];

  const firstDay = new Date(year, month, 1);
  console.log("firstDay: ", firstDay);
  const dayOfWeek = firstDay.getDay();
  console.log("dayOfWeek: ", dayOfWeek);
  let firstMonday;
  if (dayOfWeek === 0) {
    firstMonday = new Date(year, month, 2);
    console.log("firstMonday: ", firstMonday);
  } else {
    const daysToAdd = dayOfWeek === 1 ? 0 : 9 - dayOfWeek;
    firstMonday = new Date(year, month, 1 + daysToAdd);
    console.log("firstMonday: ", firstMonday);
  }

  console.log("firstMonday: ", firstMonday);
  let currentMonday = firstMonday;
  while (currentMonday.getMonth() === month) {
    mondays.push(new Date(currentMonday));

    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  console.log("modays: ", mondays);
  const formattedMondays = mondays.map(
    (date) => date.toISOString().split("T")[0]
  );
  console.log("formattedMondays: ", formattedMondays);
  return formattedMondays;
}

async function scorePercentage() {
  const year = 2024;
  const month = 7;

  const mondays = getMondays(year, month);
  console.log("Mondays in August:", mondays);

  const percentResponse = [];
  for (const monday of mondays) {
    console.log("monday: ", monday);
    const weeklyQuestion = await WeeklyQuestion.findOne({
      date: monday,
    }).select("department totalScore moduleName");
    if (!weeklyQuestion) {
      return;
    }
    //   console.log("weeklyQuestion: ", weeklyQuestion);
    //   console.log("weeklyQuestion: ", weeklyQuestion.totalScore);
    //   console.log("weeklyQuestion: ", weeklyQuestion._id);
    //   console.log("weeklyQuestion: ", weeklyQuestion.moduleName);
    //   console.log("weeklyQuestion: ", weeklyQuestion.department);

    const responses = await WeeklyResponse.find({
      weeklyQuestion: weeklyQuestion._id,
    }).select("weeklyQuestion score");

    console.log("responses: ", responses);

    const usersResponded = responses.length;
    console.log("usersResponded: ", usersResponded);

    const totalScore = weeklyQuestion.totalScore * usersResponded;
    console.log("totalScore: ", totalScore);

    let totalScoreFromResponses = 0;

    for (const response of responses) {
      totalScoreFromResponses += response.score;
    }

    console.log("totalScoreFromResponses: ", totalScoreFromResponses);

    const weeklyScorePercentOfDepartment =
      (totalScoreFromResponses / totalScore) * 100;
    console.log(
      "weeklyScorePercentOfDepartment: ",
      weeklyScorePercentOfDepartment
    );

    percentResponse.push({
      date: monday,
      module: weeklyQuestion.moduleName,
      department: weeklyQuestion.department,
      scorePercent: weeklyScorePercentOfDepartment,
    });
  }
  return percentResponse;
}

async function calculateTime() {
  const year = 2024;
  const month = 7;

  const mondays = getMondays(year, month);

  const calculatedDepartmentTime = [];
  for (const monday of mondays) {
    console.log("monday: ", monday);
    const weeklyQuestions = await WeeklyQuestion.findOne({
      date: "2024-08-26",
    }).select("department moduleName");
    if (!weeklyQuestions) {
      return;
    }
    console.log("weeklyQuestion: ", weeklyQuestions);
    console.log("weeklyQuestion: ", weeklyQuestions._id);
    // console.log("weeklyQuestion: ", weeklyQuestions.moduleName);
    console.log("weeklyQuestion: ", weeklyQuestions.department);

    const responses = await WeeklyResponse.find({
      weeklyQuestion: weeklyQuestions._id,
    }).select("weeklyQuestion startTime endTime");

    console.log("responses: ", responses);

    const time = [];

    for (const response of responses) {
      const startDate = new Date(response.startTime);
      const endDate = new Date(response.endTime);

      const timeDifferenceInMilliseconds: number =
        endDate.getTime() - startDate.getTime();
      console.log(
        "timeDifferenceInMilliseconds: ",
        timeDifferenceInMilliseconds
      );
      const timeDifferenceInMinutes: number =
        timeDifferenceInMilliseconds / (1000 * 60);
      //   console.log(
      //     "timeDifferenceInMinutes: ",
      //     timeDifferenceInMinutes.toFixed(2)
      //   );

      time.push(timeDifferenceInMinutes);
    }

    console.log("time: ", time);
    const departmentTime = time.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    console.log("departmentTime: ", departmentTime.toFixed(2));

    calculatedDepartmentTime.push({
      date: monday,
      department: weeklyQuestions.department,
      timeInMints: departmentTime,
    });
  }
  return calculatedDepartmentTime;
}

export const employeeStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    const [scorePercent, time] = await Promise.all([
      scorePercentage(),
      calculateTime(),
    ]);

    res.json({
      scorePercent,
      time,
    });
  } catch (error) {
    next(error);
  }
};
