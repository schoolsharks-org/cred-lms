import { SaveAlt, Search, Settings } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();
  return (
    <Stack bgcolor={theme.palette.primary.main} minHeight={"100vh"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"15px 20px"}
      >
        <Typography color={"#fff"} fontSize={"2rem"} fontWeight={"600"}>
          Admin Screen
        </Typography>
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
      <Stack direction={"row"}>
        <Stack flex={"1"}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography color={"#fff"}>Matrix</Typography>
            <Stack direction={"row"}>
              <Typography color={"#fff"}>Download Full Report</Typography>
              <IconButton>
                <SaveAlt sx={{ color: "#fff" }} />
              </IconButton>
            </Stack>
          </Stack>
          <Stack>
            
          </Stack>
        </Stack>
        <Stack minWidth={"376px"}>
            
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
