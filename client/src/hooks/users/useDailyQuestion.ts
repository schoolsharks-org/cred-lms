import userApi from "@/api/userApi";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/store/user/userSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface DailyQuestion {
  question: string;
  options: {
    OptionA: string;
    OptionB: string;
  };
  userResponse: "OptionA" | "OptionB" | "Not Answered";
  correctOption:string;
  optionTexts?:{
    optionA:string;
    optionB:string;
  };
  stats?: {
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
    Operations:{
      OptionA:number;
      OptionB:number;
    }
    Others: {
      OptionA: number;
      OptionB: number;
    };
  };
}
const useDailyQuestion = () => {
  const [loading,setLoading]=useState<boolean>(false)
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<DailyQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dispatch=useDispatch<AppDispatch>()

  const fetchDailyQuestion = async () => {
    try {
      setLoading(true)
      const istDate = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      
      const response = await userApi.get("/daily-question", {
        params: { date:istDate },
      });
      setData(response.data);
      
    } catch (error: any) {
      setError(error?.message);
    }
    finally{
      setLoading(false)
    }
  };

  const respondToDailyQuestion = async (option: "OptionA" | "OptionB") => {
    try {
      const response = await userApi.post("/daily-question", { option });
      setData(response.data);
      dispatch(setUser({score:response.data.score}))
    } catch (error: any) {
      setError(error.message);
    }
  };

  const prevDay = () => {
    setDate((date) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 1);
      return newDate;
    });
  };

  const forwardDay = () => {
    setDate((date) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 1);
      return newDate;
    });
  };

  useEffect(() => {
    fetchDailyQuestion();
  }, [date]);

  return {
    error,
    loading,
    date,
    dailyQuestionData: data,
    respondToDailyQuestion,
    prevDay,
    forwardDay,
    
  };
};

export default useDailyQuestion;
