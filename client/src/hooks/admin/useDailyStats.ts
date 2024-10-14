import adminApi from "@/api/adminApi";
import { useEffect, useState } from "react";

export interface DailyStatsItem {
  department: string;
}

const useDailyStats = (month: number, week: number, department: string) => {
  const [data, setData] = useState<DailyStatsItem[] | null>(null);
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
        const filteredData = response.data.filter(
          (item: DailyStatsItem) => item.department.toLowerCase() === department.toLowerCase()
        );
        setData(filteredData);
      }
    } catch (err) {
      setData(null);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, week, department]); 

  return {
    data,
    loading,
    error
  };
};

export default useDailyStats;