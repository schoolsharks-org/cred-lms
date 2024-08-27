import { InfoOutlined } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import rank1 from "@/assets/user/scores-rank-1.png";
import rank2 from "@/assets/user/scores-rank-2.png";
import rank3 from "@/assets/user/scores-rank-3.png";

const Score = () => {
  const theme = useTheme();
  return (
    <Stack>
      <Stack
        direction={"row"}
        padding={"16px"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography fontSize={"2rem"} fontWeight={"600"}>
            Scoreboard
          </Typography>
          <Box
            sx={{
              height: "4px",
              borderRadius: "8px",
              bgcolor: theme.palette.primary.main,
              marginTop: "6px",
            }}
          />
        </Stack>
        <IconButton>
          <InfoOutlined
            sx={{ fontSize: "2rem", color: theme.palette.primary.main }}
          />
        </IconButton>
      </Stack>
      <Stack direction={"row"} padding={"24px"} justifyContent={"space-between"} height={"260px"}>
        <Stack flex={"1"} alignItems={"center"} marginTop={"auto"}>
            <img src={rank2} alt="" style={{width:"56px"}} />
            <Typography fontSize={"1.25rem"} fontWeight={"600"}>Name2</Typography>
            <Typography fontSize={"1.25rem"} fontWeight={"500"}>80</Typography>
        </Stack>
        <Stack flex={"1"} alignItems={"center"}>
            <img src={rank1} alt="" style={{width:"56px"}} />
            <Typography fontSize={"1.25rem"} fontWeight={"600"}>Name1</Typography>
            <Typography fontSize={"1.25rem"} fontWeight={"500"}>100</Typography>
        </Stack>
        <Stack flex={"1"} alignItems={"center"} marginTop={"auto"}>
            <img src={rank3} alt="" style={{width:"56px"}} />
            <Typography fontSize={"1.25rem"} fontWeight={"600"}>Name3</Typography>
            <Typography fontSize={"1.25rem"} fontWeight={"500"}>90</Typography>
        </Stack>
      </Stack>
      
    </Stack>
  );
};

export default Score;
