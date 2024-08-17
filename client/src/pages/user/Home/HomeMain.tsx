import { Stack } from "@mui/material"
import Header from "./Header"
import DailyQuestion from "./DailyQuestion"

const HomeMain = () => {
  return (
    <Stack paddingBottom={"120px"}>
      <Header/>
      <DailyQuestion/>
    </Stack>
  )
}

export default HomeMain
