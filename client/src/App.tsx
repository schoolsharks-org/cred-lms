import { Route, Routes } from "react-router-dom";
import "./App.css";
import UserMain from "./pages/user/UserMain";
import AdminMain from "./pages/admin/AdminMain";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<UserMain />}/>
      <Route path="/admin/*" element={<AdminMain />}/>
    </Routes>
  );
}

export default App;
