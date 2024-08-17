import { NotificationsNoneOutlined } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import medalIcon from "@/assets/user/medal-icon.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Header = () => {
  const theme = useTheme();
  const { name, score } = useSelector((state: RootState) => state.user);
  
  return (
    <Stack padding={"16px"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack>
          <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
            <Typography fontWeight={"600"} fontSize={"2.5rem"}>
              Hello {name.split(" ")[0]}!{" "}
              <Box
                sx={{
                  height: "4px",
                  borderRadius: "8px",
                  bgcolor: theme.palette.primary.main,
                }}
              />
            </Typography>
            <img src={medalIcon} alt="" />
          </Stack>
          <Typography fontSize={"1.2rem"}>
            <i>This is where you learn and earn</i>
          </Typography>
          <Typography fontSize={"1.5rem"} fontWeight={"600"} marginTop={"12px"}>
            Your Points - {score}
          </Typography>
        </Stack>
        <Stack>
          <IconButton>
            {" "}
            <NotificationsNoneOutlined
              sx={{ color: theme.palette.primary.main, fontSize: "2.4rem" }}
            />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Header;
