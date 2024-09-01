import adminApi from "@/api/adminApi";
import { useState, useEffect } from "react";

const useWeeklyStats = (month: number, year: number) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.get("/weekly-sangram-stats", {
        params: { month, year },
      });

      if (response && response.data) {
        console.log(response.data)
        setData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  return { data, loading, error };
};

export default useWeeklyStats;
