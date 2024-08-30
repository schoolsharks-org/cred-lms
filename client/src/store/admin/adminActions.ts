import adminApi from "@/api/adminApi"

export const getAdminDashboardData=async()=>{
try {
        const response = await adminApi.get("/admin-dashboard")
        return response
    } catch (error) {
        console.log(error)
    }
}