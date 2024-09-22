import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import battleIcon from "@/assets/user/weekly-question-battle-icon.png";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InitialAnimation from "../weeklyQuestion/InitialAnimation";

const WeeklyQuestionCard = () => {
  const theme = useTheme();
  const navigate=useNavigate()
  const [animationVisible, setAnimationVisible]=useState<boolean>(false)

  const openModule=()=>{
    setAnimationVisible(true)
    setTimeout(()=>{
      navigate("/weekly-question/insights")
    },3500)
  }
  return (
    <>
    {animationVisible && <Stack position={"fixed"} width="100%" height={"100%"} top="0" left="0" sx={{zIndex:"9999"}}><InitialAnimation/></Stack>}
    <Stack bgcolor={"#000000"} marginTop={"43px"} position={"relative"} overflow={"hidden"}>
      
      <Stack
        direction={"row"}
        padding={"20px"}
        justifyContent={"space-between"}
        zIndex={"2"}
      >
        <Typography color={"#fff"} fontSize={"1.8rem"} fontWeight={"600"}>
          Weekly Sangram
        </Typography>
        <img src={battleIcon} alt="Battle" style={{ width: "55px" }} />
      </Stack>
      <Stack position={"relative"}>
      {/* <Stack position={"absolute"} alignItems={"center"} justifyContent={"center"} width={"100%"} height={"100%"} sx={{backdropFilter:"blur(3px)",zIndex:"10",bgcolor:"#0000004a"}} gap={"10px"}>
        <LockOutlined sx={{color:"#fff",fontSize:"3rem"}}/>
        <Typography color={"#fff"} fontSize={"1.5rem"} fontWeight={"600"}>Will be unlocked on Monday</Typography>
      </Stack>  */}
      <Stack
        bgcolor={theme.palette.secondary.main}
        margin={"0 5px"}
        padding={"16px"}
        zIndex={"2"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography fontSize={"1.25rem"} fontWeight={"700"}>
            New circulars from Aug 24
          </Typography>
          <Typography fontSize={"1.25rem"} fontWeight={"600"}>
            16 Sep
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
        onClick={()=>openModule()}
        endIcon={<ArrowForward sx={{width:"48px",height:"36px"}} />}
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
      </Stack>

      {/* Lines */}
      <Box sx={{position:"absolute",width:"1px",filter:"blur(2px)",height:"100vh",transform:"rotate(47deg)",bgcolor:"#ffffff",top:"-50%",left:"-35%",zIndex:"1"}}/>
      <Box sx={{position:"absolute",width:"1px",filter:"blur(2px)",height:"100vh",transform:"rotate(47deg)",bgcolor:"#ffffff",top:"-50%",left:"-20%",zIndex:"1"}}/>
      <Box sx={{position:"absolute",width:"1px",filter:"blur(2px)",height:"100vh",transform:"rotate(47deg)",bgcolor:"#ffffff",top:"-50%",left:"40%",zIndex:"1"}}/>
    </Stack>
    </>
  );
};

export default WeeklyQuestionCard;
