import { Stack } from "@mui/material";
import Header from "./Header";
import DailyQuestion from "./DailyQuestion";
import WeeklyQuestionCard from "./WeeklyQuestionCard";
import TrackLevels from "./TrackLevels";
import DailyUpdatesCard from "./DailyUpdatesCard";

const HomeMain = () => {
  return (
    <Stack paddingBottom={"48px"}>
      <Header />
      <DailyQuestion />
      <DailyUpdatesCard />
      <WeeklyQuestionCard />
      <TrackLevels />
    </Stack>
  );
};

export default HomeMain;
