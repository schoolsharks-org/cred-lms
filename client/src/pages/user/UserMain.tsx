import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import HomeMain from "./Home/HomeMain";
import UserLayout from "./UserLayout";
import { Stack } from "@mui/material";
import Onboard from "./Onboard";
import SignIn from "./SignIn";
import { AppDispatch, RootState } from "@/store/store";
import { getUser } from "@/store/user/userActions";
import Loader from "@/components/Loader";


const UserMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authenticated, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && authenticated) {
      navigate("/home");
    }
  }, [loading, authenticated, navigate]);

  if(loading){
    return <Loader/>
  }

  return (
    <Stack maxWidth={"480px"} width={"100%"} margin={"auto"}>
      <Routes>
        {/* Routes accessible to all users */}
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        
        {/* Protected routes */}
        {authenticated && (
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomeMain />} />
            <Route path="/score" element={<div>Score Component</div>} />
            <Route path="/offer" element={<div>Offer Component</div>} />
            <Route path="/profile" element={<div>Profile Component</div>} />
          </Route>
        )}

        {/* Default redirection logic */}
        <Route path="*" element={authenticated ? <Navigate to="/home" /> : <Navigate to="/onboard" />} />
      </Routes>
    </Stack>
  );
};

export default UserMain;
