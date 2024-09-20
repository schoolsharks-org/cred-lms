import { Stack } from "@mui/material"
import Header from "./Header"
import DailyQuestion from "./DailyQuestion"
import WeeklyQuestionCard from "./WeeklyQuestionCard"
import TrackLevels from "./TrackLevels"
import IncentiveSimulatorCard from "./IncentiveSimulatorCard"
import HelpSectionCard from "./HelpSectionCard"

const HomeMain = () => {
  return (
    <Stack paddingBottom={"48px"}>
      <Header/>
      <DailyQuestion/>
      <HelpSectionCard/>
      <WeeklyQuestionCard/>
      <IncentiveSimulatorCard/>
      <TrackLevels/>
    </Stack>
  )
}

export default HomeMain
