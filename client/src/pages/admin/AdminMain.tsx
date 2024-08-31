import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./Dashboard/Dashboard"
import WeeklySangram from "./WeeklySangram/WeeklySangram"
import AapkiAwaaz from "./AapkiAwaaz/AapkiAwaaz"

const AdminMain = () => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/weekly-sangram" element={<WeeklySangram/>}/>
        <Route path="/sabki-awaaz" element={<AapkiAwaaz/>}/>
        <Route path="/*" element={<Navigate to="/admin/dashboard"/>}/>
      </Routes>
    </>
  )
}

export default AdminMain
