import adminApi from "@/api/adminApi";
import { useEffect, useState } from "react";

const useDailyStats = (month: number, week: number) => {
  const [data, setData] = useState<any[]|null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.get("/daily-stats", {
        params: { month, week },
      });

      if (response && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setData(null)
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [month, week]);

  return {
    data,
    loading,
    error
  };
};

export default useDailyStats;
