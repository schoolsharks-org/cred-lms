import adminApi from "@/api/adminApi";
import { useState } from "react";

const useEmployeeStatus = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const fetchEmployeeStatus = async () => {
    try {
      const response = await adminApi.get("/get-employee-status");
      setData(response.data?.employees);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { fetchEmployeeStatus, loading, data,error };
};

export default useEmployeeStatus;
