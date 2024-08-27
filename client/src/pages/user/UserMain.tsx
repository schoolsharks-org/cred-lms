import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import HomeMain from "./Home/HomeMain";
import UserLayout from "./UserLayout";
import { Stack } from "@mui/material";
import Onboard from "./Onboard";
import SignIn from "./SignIn";
import { AppDispatch, RootState } from "@/store/store";
import { getUser } from "@/store/user/userActions";
import Loader from "@/components/Loader";
import WeeklyQuestions from "./weeklyQuestion/WeeklyQuestions";
import WeeklyQuestionsCompleted from "./weeklyQuestion/WeeklyQuestionsCompleted";
import Score from "./Score/Score";
import Profile from "./Home/Profile";
import Rewards from "./Home/Rewards";

const UserMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authenticated, loading } = useSelector(
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
      <Routes>
        <Route
          path="/onboard"
          element={authenticated ? <Navigate to="/home" /> : <Onboard />}
        />
        <Route
          path="/sign-in"
          element={authenticated ? <Navigate to="/home" /> : <SignIn />}
        />

        {authenticated ? (
          <>
            <Route element={<UserLayout />}>
              <Route path="/home" element={<HomeMain />} />
              <Route path="/score" element={<Score/>} />
              <Route path="/weekly-question/completed" element={<WeeklyQuestionsCompleted/>} />
              <Route path="/offer" element={<Rewards />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/weekly-question/completed"
                element={<WeeklyQuestionsCompleted />}
              />
            </Route>
            <Route path="/weekly-question" element={<WeeklyQuestions />} />

            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/onboard" />} />
        )}
      </Routes>
    </Stack>
  );
};

export default UserMain;
