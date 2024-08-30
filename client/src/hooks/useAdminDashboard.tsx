import { getAdminDashboardData } from "@/store/admin/adminActions";
import { useState } from "react";

interface Scorers {
    Name: string;
    Score: number;
}

const departments = ["Sales", "Credit", "Collection", "Operations", "Others"];

const useAdminDashboard = () => {
    const [topScorers, setTopScorers] = useState<Scorers[] | null>(null);
    const [belowAverageScorers, setBelowAverageScorers] = useState<Scorers[] | null>(null);
    const [dashboardData, setDashboardData] = useState<{ name: string; data: number[] }[]>([]);

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
        const response = await getAdminDashboardData();

        setTopScorers(response?.data.userScores.TopScore);
        setBelowAverageScorers(response?.data.userScores.BelowAverageScore);

        const totalEmployees = mapCountsToDepartments(response?.data.userCountofDepartment);
        const inactive7Days = mapCountsToDepartments(response?.data.sevenDaysInactiveUsers);
        const inactive15Days = mapCountsToDepartments(response?.data.fifteenDaysInactiveUsers);

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
                data: [500, 450, 200, 350, 100],
              },
              {
                name: "Modules \ncompleted",
                data: [500, 450, 200, 350, 100],
              },
        ];

        setDashboardData(formattedData);
    };

    return {
        topScorers,
        belowAverageScorers,
        dashboardData,
        fetchDashboardData
    };
};

export default useAdminDashboard;
