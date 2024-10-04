import { getAdminDashboardData } from "@/store/admin/adminActions";
import { useState } from "react";

interface Scorers {
    Name: string;
    Department: "Sales" | "Credit" | "Collection" | "Operations" | "Others";
    Score: number;
}

const departments = ["Sales", "Credit", "Collection", "Operations", "Others"];

const useAdminDashboard = () => {
    const [topScorers, setTopScorers] = useState<Scorers[] | null>(null);
    const [belowAverageScorers, setBelowAverageScorers] = useState<Scorers[] | null>(null);
    const [dashboardData, setDashboardData] = useState<{ name: string; data: number[] }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // Add error state

    const mapCountsToDepartments = (data: { _id: string; count: number }[] = []) => {
        const countsArray = new Array(departments.length).fill(0);
        data.forEach(item => {
            const index = departments.indexOf(item?._id);
            if (index !== -1) {
                countsArray[index] = item?.count ?? 0; // Add fallback for missing count
            }
        });
        return countsArray;
    };

    const mapAggregatedDataToDepartments = (data: { [key: string]: { belowEighty: number; progressReattempt: number; reattempted: number } } = {}) => {

        if(!data){
            return { belowEightyArray:[0,0,0,0,0], reattemptedArray:[0,0,0,0,0], progressReattemptArray:[0,0,0,0,0] }
        }
        const belowEightyArray = new Array(departments.length).fill(0);
        const reattemptedArray = new Array(departments.length).fill(0);
        const progressReattemptArray = new Array(departments.length).fill(0);

        departments.forEach((department, index) => {
            const departmentData = data[department] ?? {}; // Fallback to empty object
            belowEightyArray[index] = departmentData.belowEighty ?? 0;
            reattemptedArray[index] = departmentData.reattempted ?? 0;
            progressReattemptArray[index] = departmentData.progressReattempt ?? 0;
        });

        return { belowEightyArray, reattemptedArray, progressReattemptArray };
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null); // Reset error on fetch

        try {
            const response = await getAdminDashboardData();

            if (!response || !response.data) {
                throw new Error("No data received from the server");
            }

            // User Scores
            setTopScorers(response.data.userScores?.TopScore ?? []);
            setBelowAverageScorers(response.data.userScores?.BelowAverageScore ?? []);

            // Department data
            const totalEmployees = mapCountsToDepartments(response.data.userCountofDepartment);
            const inactive7Days = mapCountsToDepartments(response.data.sevenDaysInactiveUsers);
            const inactive15Days = mapCountsToDepartments(response.data.fifteenDaysInactiveUsers);
            const weeklyModules = mapCountsToDepartments(response.data.getTotalDepartmentModules);
            const modulesCompleted = mapCountsToDepartments(response.data.modulesCompleted);

            // Aggregated Data
            const { belowEightyArray, reattemptedArray, progressReattemptArray } = mapAggregatedDataToDepartments(response.data.monthlyAggregatedData);

            // Formatted dashboard data
            const formattedData = [
                { name: "Total no. of \nemployees", data: totalEmployees },
                { name: "Inactive \nlast 7 days", data: inactive7Days },
                { name: "Inactive \nlast 15 days", data: inactive15Days },
                { name: "No. of weekly \nmodules", data: weeklyModules },
                { name: "Modules \ncompleted", data: modulesCompleted },
                { name: "Below 80%", data: belowEightyArray },
                { name: "Reattempted", data: reattemptedArray },
                { name: ">80% After\n reattempt", data: progressReattemptArray },
            ];

            setDashboardData(formattedData);
        } catch (error: any) {
            console.error("Failed to fetch admin dashboard data:", error);
            setError(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return {
        topScorers,
        belowAverageScorers,
        dashboardData,
        loading,
        error,
        fetchDashboardData,
    };
};

export default useAdminDashboard;
