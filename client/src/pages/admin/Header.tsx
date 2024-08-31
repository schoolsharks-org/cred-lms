import { SaveAlt, Search, Settings } from "@mui/icons-material"
import { IconButton, Stack,Typography,useTheme } from "@mui/material"

const Header = () => {
const theme=useTheme()
  return (
    <Stack direction={"row"} padding={"8px 24px"} bgcolor={theme.palette.primary.main} justifyContent={"space-between"} color={"#ffffff"} alignItems={"center"}>
        <Typography fontSize={"1.25rem"} fontWeight={"500"}>Cred Dost</Typography>
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
