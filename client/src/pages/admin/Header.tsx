import { SaveAlt, Search, Settings } from "@mui/icons-material"
import { IconButton, Stack,Typography,useTheme } from "@mui/material"

const Header = () => {
const theme=useTheme()
  return (
    <Stack direction={"row"} padding={"8px 24px"} bgcolor={theme.palette.primary.main} justifyContent={"space-between"} color={"#ffffff"} alignItems={"center"} sx={{position:"sticky",top:"0",zIndex:"8"}}>
        <Typography fontSize={"1.25rem"} fontWeight={"500"}>SFL Sangram</Typography>
        <Stack direction={"row"} height={"max-content"} gap={"10px"}>
          <IconButton>
            <SaveAlt sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <Search sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <Settings sx={{ color: "#fff" }} />
          </IconButton>
        </Stack>

    </Stack>
  )
}

export default Header
