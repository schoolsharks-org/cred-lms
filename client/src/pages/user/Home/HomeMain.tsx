import { Stack } from "@mui/material"
import Header from "./Header"
import DailyQuestion from "./DailyQuestion"
import WeeklyQuestionCard from "./WeeklyQuestionCard"

const HomeMain = () => {
  return (
    <Stack paddingBottom={"120px"}>
      <Header/>
      <DailyQuestion/>
      <WeeklyQuestionCard/>
    </Stack>
  )
}

export default HomeMain
