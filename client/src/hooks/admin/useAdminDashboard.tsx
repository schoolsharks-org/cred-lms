import { getAdminDashboardData } from "@/store/admin/adminActions";
import { useState } from "react";

interface Scorers {
    Name: string;
    Department:"Sales"| "Credit"| "Collection"| "Operations"| "Others"
    Score: number;
}

const departments = ["Sales", "Credit", "Collection", "Operations", "Others"];

const useAdminDashboard = () => {
    const [topScorers, setTopScorers] = useState<Scorers[] | null>(null);
    const [belowAverageScorers, setBelowAverageScorers] = useState<Scorers[] | null>(null);
    const [dashboardData, setDashboardData] = useState<{ name: string; data: number[] }[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    const mapCountsToDepartments = (data: { _id: string; count: number }[]) => {
        const countsArray = new Array(departments.length).fill(0);
        data.forEach(item => {
            const index = departments.indexOf(item._id);
            if (index !== -1) {
                countsArray[index] = item.count;
            }
        });
        return countsArray;
    };

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            const response = await getAdminDashboardData();

            setTopScorers(response?.data.userScores.TopScore);
            setBelowAverageScorers(response?.data.userScores.BelowAverageScore);

            const totalEmployees = mapCountsToDepartments(response?.data.userCountofDepartment);
            const inactive7Days = mapCountsToDepartments(response?.data.sevenDaysInactiveUsers);
            const inactive15Days = mapCountsToDepartments(response?.data.fifteenDaysInactiveUsers);
            const weeklyModules = mapCountsToDepartments(response?.data.getTotalDepartmentModules);
            const modulesCompleted = mapCountsToDepartments(response?.data.modulesCompleted);

            const formattedData = [
                {
                    name: "Total no. of \nemployees",
                    data: totalEmployees,
                },
                {
                    name: "Inactive \nlast 7 days",
                    data: inactive7Days,
                },
                {
                    name: "Inactive \nlast 15 days",
                    data: inactive15Days,
                },
                {
                    name: "No. of weekly \nmodules",
                    data: weeklyModules,
                },
                {
                    name: "Modules \ncompleted",
                    data: modulesCompleted,
                },
                {
                    name:"Below 80%",
                    data:modulesCompleted,
                },
                {
                    name:"Reattempted",
                    data:modulesCompleted,
                },
                {
                    name:">80% After\n reattempt",
                    data:modulesCompleted,
                },
            ];

            setDashboardData(formattedData);
        } catch (error) {
            console.error("Failed to fetch admin dashboard data:", error);
        } finally {
            setLoading(false); 
        }
    };

    return {
        topScorers,
        belowAverageScorers,
        dashboardData,
        loading, 
        fetchDashboardData,
    };
};

export default useAdminDashboard;
