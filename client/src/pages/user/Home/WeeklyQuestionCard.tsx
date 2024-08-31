import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import battleIcon from "@/assets/user/weekly-question-battle-icon.png";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const WeeklyQuestionCard = () => {
  const theme = useTheme();
  const navigate=useNavigate()
  return (
    <Stack bgcolor={"#000000"} marginTop={"43px"} position={"relative"} overflow={"hidden"}>

      <Stack
        direction={"row"}
        padding={"20px"}
        justifyContent={"space-between"}
        zIndex={"2"}
      >
        <Typography color={"#fff"} fontSize={"2rem"} fontWeight={"600"}>
          Weekly Sangram
        </Typography>
        <img src={battleIcon} alt="Battle" style={{ width: "55px" }} />
      </Stack>
      <Stack
        bgcolor={theme.palette.secondary.main}
        margin={"0 5px"}
        padding={"16px"}
        zIndex={"2"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography fontSize={"1.25rem"} fontWeight={"700"}>
            Samuruddhi loan ka GYAN
          </Typography>
          <Typography fontSize={"1.25rem"} fontWeight={"600"}>
            26 Aug
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          marginTop={"24px"}
        >
          <Typography fontWeight={"500"}>Play to earn 100 points</Typography>
          <Typography fontWeight={"500"} color={theme.palette.text.secondary}>
            5 mins
          </Typography>
        </Stack>
      </Stack>
      <Button
        onClick={()=>navigate("/weekly-question")}
        endIcon={<ArrowForward />}
        variant="contained"
        sx={{
          bgcolor: "#000",
          textTransform: "none",
          fontSize: "2rem",
          justifyContent: "space-between",
          height:"82px",
          zIndex:"2"
        }}
      >
        Let's Play
      </Button>

      {/* Lines */}
      <Box sx={{position:"absolute",width:"1px",filter:"blur(2px)",height:"100vh",transform:"rotate(47deg)",bgcolor:"#ffffff",top:"-50%",left:"-35%",zIndex:"1"}}/>
      <Box sx={{position:"absolute",width:"1px",filter:"blur(2px)",height:"100vh",transform:"rotate(47deg)",bgcolor:"#ffffff",top:"-50%",left:"-20%",zIndex:"1"}}/>
      <Box sx={{position:"absolute",width:"1px",filter:"blur(2px)",height:"100vh",transform:"rotate(47deg)",bgcolor:"#ffffff",top:"-50%",left:"40%",zIndex:"1"}}/>
    </Stack>
  );
};

export default WeeklyQuestionCard;
