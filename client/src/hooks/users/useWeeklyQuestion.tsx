import { useEffect, useState, useMemo, useCallback } from "react";
import userApi from "@/api/userApi";
import { useNavigate } from "react-router-dom";

enum QuestionCategory {
  category_1 = "PromptOnly",
  category_2 = "ImagePairPrompt",
  category_3 = "SingleImagePrompt",
}

export interface Question {
  _id: string;
  questionPrompt: string;
  optionA: string;
  optionB: string;
  optionTexts?: {
    optionA: string;
    optionB: string;
  };
  correctAnswerDescription?:string;
  questionCategory: QuestionCategory;
  images?: string[];
}

const useWeeklyQuestion = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submissionLoading,setSubmissionLoading]=useState<boolean>(false)
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<null | string>(null);
  const [time, setTime] = useState<string>("00:00");



  const [scores, setScores] = useState({
    userScore: 0,
    maxScore:0,
    averageScore: 0,
  });

  const calculateTimeDifference = useCallback((startTime: Date) => {
    const now = new Date();
    const differenceInSeconds = Math.floor(
      (now.getTime() - new Date(startTime).getTime()) / 1000
    );

    const minutes = Math.floor(differenceInSeconds / 60);
    const seconds = differenceInSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  const fetchWeeklyQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const date = new Date();
      const response = await userApi.get("/weekly-question", {
        params: { date: date.toISOString() },
      });

      const { questions, startTime, answeredCount, scores } = response.data;

      setAnsweredCount(answeredCount);
      setQuestions(questions);
      setCurrentQuestion(questions[answeredCount] || null);

      if (questions?.length <= answeredCount) {
        setScores(scores);
        navigate("/weekly-question/completed");
      }

      if (startTime) {
        const startDate = new Date(startTime);
        setTime(calculateTimeDifference(startDate));

        // Throttled interval to update time every 1 second
        const interval = setInterval(() => {
          setTime(calculateTimeDifference(startDate));
        }, 1000);

        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error(error);
      setError("No Weekly Questions Found");
    } finally {
      setLoading(false);
    }
  }, [calculateTimeDifference]);

  useEffect(() => {
    if (!questions) {
      fetchWeeklyQuestions();
    }
  }, [fetchWeeklyQuestions]);

  const handleSubmitAnswer = useCallback(
    async (selectedOption: string) => {
      if (!currentQuestion) return;
      
      try {
        setSubmissionLoading(true)
        const response = await userApi.post("/weekly-question", {
          questionId: currentQuestion._id,
          response: selectedOption,
        });

        const { correctAnswer, scores } = response.data;
        setScores(scores);

        setCorrectAnswer(correctAnswer);
        setAnsweredCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error(error);
        setError("Failed to submit the answer.");
      }
      finally{
        setSubmissionLoading(false)
      }
    },
    [currentQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    if (questions) {
      if (questions?.length <= answeredCount) {
        navigate("completed");
      }
      setCorrectAnswer(null);
      setCurrentQuestion(questions[answeredCount] || null);
    }
  }, [questions, answeredCount]);

  const memoizedTime = useMemo(() => time, [time]);

  return {
    error,
    submissionLoading,
    loading,
    scores,
    totalQuestions: questions?.length ?? 0,
    answered: answeredCount,
    currentQuestion,
    correctAnswer,
    time: memoizedTime,
    handleSubmitAnswer,
    handleNextQuestion,
  };
};

export default useWeeklyQuestion;
