import { Outlet } from "react-router-dom"
import BottomNav from "../../components/user/BottomNav"
import { Stack } from "@mui/material"

const UserLayout = () => {
  return (
    <Stack>
      <Outlet/>
      <BottomNav/>
    </Stack>
  )
}

export default UserLayout
