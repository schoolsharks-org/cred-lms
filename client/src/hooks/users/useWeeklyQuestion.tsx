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
  const [moduleId,setModuleId]=useState<string|null>(null)
  const [scoreImprovement,setScoreImprovement]=useState<number|null>()
  const [insights,setInsights]=useState<string[]>([])

  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<null | string>(null);


  const [time, setTime] = useState<string>("00:00");



  const [scores, setScores] = useState({
    userScore: 0,
    maxScore:0,
    averageScore: 0,
    reattemptScores:[]
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

      const { questions, startTime, answeredCount, scores,id } = response.data;

      setAnsweredCount(answeredCount);
      setQuestions(questions);
      setCurrentQuestion(questions[answeredCount] || null);
      setModuleId(id)

      if (questions?.length <= answeredCount) {
        const userScore = scores?.userScore || 0;
        const maxScore = scores?.maxScore || 0;
        let averageScore = scores?.averageScore || 0;
        const reattemptScores = scores?.reattemptScores || [];
        
        if (reattemptScores.length > 0) {
          let percentageChange = 0;
          if (reattemptScores?.length === 1) {
            const firstReattemptScore = reattemptScores[0];
            percentageChange = ((firstReattemptScore - userScore ) / Math.abs(firstReattemptScore)) * 100;
          }
          if (reattemptScores?.length === 2) {
            const firstReattemptScore = reattemptScores[0];
            const secondReattemptScore = reattemptScores[1];
            percentageChange = ((secondReattemptScore - firstReattemptScore) / Math.abs(firstReattemptScore)) * 100;
          }
          percentageChange = Math.round(percentageChange);

          setScoreImprovement(percentageChange)

        }
        
        setScores({ 
          userScore, 
          maxScore, 
          averageScore, 
          reattemptScores 
        });
      
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
    const pathname = window.location.pathname;
    // const lastPathSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
    if (!questions && !pathname.includes("insights")) {
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


  const handleReattempt=async()=>{
    try {
      const response = await userApi.post("/weekly-question-reattempt",{weeklyQuestion:moduleId}) 
      if(response.status===200){
        setAnsweredCount(0)
      }
    } catch (error) {
      console.log("Error:",error)
    }
  }


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


  const handleFetchInsights=async()=>{
    try {
      setLoading(true)
      const response=await userApi.get("/weekly-question-insights")
      const {insights:insightsData}=response.data
      
      setInsights(insightsData)

    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  


  return {
    error,
    submissionLoading,
    loading,
    scores,
    totalQuestions: questions?.length ?? 0,
    answered: answeredCount,
    currentQuestion,
    correctAnswer,
    time:scores?.reattemptScores?.length>0?"_": memoizedTime,
    scoreImprovement,
    insights,
    handleFetchInsights,
    handleSubmitAnswer,
    handleNextQuestion,
    handleReattempt
  };
};

export default useWeeklyQuestion;
