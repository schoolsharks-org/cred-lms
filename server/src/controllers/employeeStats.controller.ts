import { NextFunction, Request, Response } from "express";
import WeeklyQuestion from "../models/weeklyQuestion.model";
import { getUserCountForEachDepartment } from "./adminDashboard.controller";

interface DepartmentStats {
  department: string;
  averageTime: string; // in minutes:seconds format
  averageScore: number;
  engagement: number; // percentage value
}

interface DepartmentCount {
  department: string;
  count: number;
}

export const hanldeWeeklySangramStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  const monthNumber = parseInt(month as string, 10);
  const yearNumber = parseInt(year as string, 10);

  if (
    isNaN(monthNumber) ||
    isNaN(yearNumber) ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return res.status(400).json({ message: "Invalid month or year." });
  }

  const startDate = new Date(yearNumber, monthNumber - 1, 1);
  const endDate = new Date(yearNumber, monthNumber, 0, 23, 59, 59, 999);

  const weeklyQuestions = await WeeklyQuestion.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const departmentCountsArray: DepartmentCount[] = await getUserCountForEachDepartment();

  const departmentMemberCounts: Record<string, number> = {};
  departmentCountsArray.forEach(({ department, count }) => {
    departmentMemberCounts[department] = count;
  });

  const stats = weeklyQuestions.map((weeklyQuestion) => {
    const departmentStats: DepartmentStats[] = [];
    
    let totalTimeAcrossDepartments = 0;
    let totalScoreAcrossDepartments = 0;
    let totalAnswersAcrossDepartments = 0;
    let departmentCount = 0;

    Object.entries(weeklyQuestion.analytics).forEach(
      ([department, { totalTime, totalScore, totalAnswers }]) => {
        const averageTimeSeconds = totalTime / totalAnswers;
        const minutes = Math.floor(averageTimeSeconds / 60);
        const seconds = Math.floor(averageTimeSeconds % 60);
        const averageTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        const averageScore = totalScore / totalAnswers;
        const departmentSize = departmentMemberCounts[department] || 1;
        const engagement = (totalAnswers / departmentSize) * 100;

        departmentStats.push({
          department,
          averageTime,
          averageScore,
          engagement,
        });

        // Accumulate totals for average calculation
        totalTimeAcrossDepartments += totalTime;
        totalScoreAcrossDepartments += totalScore;
        totalAnswersAcrossDepartments += totalAnswers;
        departmentCount++;
      }
    );

    // Calculate averages for all departments
    if (departmentCount > 0) {
      const avgTimeSeconds = totalTimeAcrossDepartments / totalAnswersAcrossDepartments;
      const avgMinutes = Math.floor(avgTimeSeconds / 60);
      const avgSeconds = Math.floor(avgTimeSeconds % 60);
      const averageTime = `${avgMinutes}:${avgSeconds < 10 ? "0" : ""}${avgSeconds}`;

      const averageScore = totalScoreAcrossDepartments / totalAnswersAcrossDepartments;
      const averageEngagement = (totalAnswersAcrossDepartments / (Object.values(departmentMemberCounts).reduce((acc, val) => acc + val, 0))) * 100;

      departmentStats.unshift({
        department: "Average",
        averageTime,
        averageScore,
        engagement: Math.round(averageEngagement),
      });
    }

    return {
      moduleName: weeklyQuestion.moduleName,
      date: new Date(weeklyQuestion.date).toLocaleString('en-GB', { day: 'numeric', month: 'short' }).replace(/ (\d)$/, ' $1th'),
      departmentStats,
      department:weeklyQuestion.department
    };
  });

  return res.json(stats);
};
