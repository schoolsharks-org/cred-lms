import { Route, Routes } from "react-router-dom"
import Dashboard from "./Dashboard/Dashboard"

const AdminMain = () => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default AdminMain
