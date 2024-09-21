import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import HomeMain from "./Home/HomeMain";
import UserLayout from "./UserLayout";
import { Stack } from "@mui/material";
import Onboard from "./Onboard";
import SignIn from "./SignIn";
import VerifyOtp from "./VerifyOtp";
import { AppDispatch, RootState } from "@/store/store";
import { getUser } from "@/store/user/userActions";
import Loader from "@/components/Loader";
import WeeklyQuestions from "./weeklyQuestion/WeeklyQuestions";
import WeeklyQuestionsCompleted from "./weeklyQuestion/WeeklyQuestionsCompleted";
import Score from "./Score/Score";
import Profile from "./Profile/Profile";
import Rewards from "./Rewards/Rewards";
import { authStatus } from "@/store/user/userSlice";
import Insights from "./weeklyQuestion/Insights";
import IncentiveSimulatorMain from "./IncentiveSimulator/IncentiveSimulatorMain";
import HelpSection from "./HelpSection/HelpSection";
import HelpSectionModule from "./HelpSection/HelpSectionModule";

const UserMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authStatus: status, loading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }
  
  return (
    <Stack maxWidth={"480px"} width={"100%"} margin={"auto"}>
      {/* <Insights/> */}
      <Routes>
        {status === authStatus.UNAUTHENTICATED && (
          <>
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/onboard" />} />
          </>
        )}

        {status === authStatus.OTP_SENT && (
          <>
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="*" element={<Navigate to="/verify-otp" />} />
          </>
        )}

        {status === authStatus.AUTHENTICATED && (
          <>
            <Route element={<UserLayout />}>
              <Route path="/home" element={<HomeMain />} />
              <Route path="/score" element={<Score />} />
              <Route path="/offer" element={<Rewards />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/weekly-question/completed"
                element={<WeeklyQuestionsCompleted />}
              />
            </Route>
            <Route path="/weekly-question/insights" element={<Insights />} />
            <Route path="/weekly-question" element={<WeeklyQuestions />} />
            <Route path="/incentive-simulator" element={<IncentiveSimulatorMain />} />
            <Route path="/zaroor-dekho" element={<HelpSection />} />
            <Route
              path="/zaroor-dekho/:id"
              element={<HelpSectionModule />}
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Stack>
  );
};

export default UserMain;
