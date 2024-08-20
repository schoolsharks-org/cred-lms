import { Outlet } from "react-router-dom"
import BottomNav from "../../components/user/BottomNav"
import { Box, Stack } from "@mui/material"

const UserLayout = () => {
  return (
    <Stack>
      <Outlet/>
      <Box bgcolor="transparent" height="58px"/>
      <BottomNav/>
    </Stack>
  )
}

export default UserLayout
