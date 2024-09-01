import { InfoOutlined } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import rank1 from "@/assets/user/scores-rank-1.png";
import rank2 from "@/assets/user/scores-rank-2.png";
import rank3 from "@/assets/user/scores-rank-3.png";
import useScoreboard from "@/hooks/users/useScoreboard";
import Loader from "@/components/Loader";
import { useEffect } from "react";

const Score = () => {
  const theme = useTheme();
  const {scoreboardData,currentUser,formatTime}=useScoreboard()
  useEffect(()=>{
  },[scoreboardData])


  if(!scoreboardData){
    return <Loader/>
  }


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
            <Typography fontSize={"1.25rem"} fontWeight={"600"} textAlign={"center"}>{scoreboardData[1]?.name.split(" ")[0]}</Typography>
            <Typography fontSize={"1.25rem"} fontWeight={"500"}>{scoreboardData[1]?.points}</Typography>
        </Stack>
        <Stack flex={"1"} alignItems={"center"}>
            <img src={rank1} alt="" style={{width:"56px"}} />
            <Typography fontSize={"1.25rem"} fontWeight={"600"} textAlign={"center"}>{scoreboardData[0]?.name.split(" ")[0]}</Typography>
            <Typography fontSize={"1.25rem"} fontWeight={"500"}>{scoreboardData[0]?.points}</Typography>
        </Stack>
        <Stack flex={"1"} alignItems={"center"} marginTop={"auto"}>
            <img src={rank3} alt="" style={{width:"56px"}} />
            <Typography fontSize={"1.25rem"} fontWeight={"600"} textAlign={"center"}>{scoreboardData[2]?.name.split(" ")[0]}</Typography>
            <Typography fontSize={"1.25rem"} fontWeight={"500"}>{scoreboardData[2]?.points}</Typography>
        </Stack>
      </Stack>

      <Stack padding={"14px"} boxShadow={"-12px 0 20px #00000037"}>
      <Stack
          margin={"0px 0 8px"}
          direction={"row"}
          gap={"16px"}
          alignItems={"center"}
        >
          <Typography fontWeight={"700"} fontSize={"1.25rem"} width={"48px"}>
            Rank
          </Typography>
          <Typography fontWeight={"700"} fontSize={"1.25rem"} flex={"1"}>
            Name
          </Typography>
          <Typography fontWeight={"700"} fontSize={"1.25rem"} width={"64px"} textAlign={"center"}>
            Time
          </Typography>
          <Typography fontWeight={"700"} fontSize={"1.25rem"} width={"82px"} textAlign={"center"}>
            Points
          </Typography>
        </Stack>
        <Box />
        <Box sx={{ height: "2px",bgcolor:theme.palette.primary.main,width:"95%",margin:"auto"}} />
        {scoreboardData?.slice(3).map((item, index:number) => {
          return (
            <Stack direction={"row"} margin={"6px 2px"} gap={"16px"}>
              <Typography fontWeight={"500"} fontSize={"1.25rem"} width={"48px"} textAlign={"center"}>
                {index+4}
              </Typography>
              <Typography fontWeight={"500"} fontSize={"1.25rem"} flex={"1"} >
                {item.name.split(" ")[0]}
              </Typography>
              <Typography fontWeight={"500"} fontSize={"1.25rem"} textAlign={"center"}  >
                {formatTime(item.timeInMints)}
              </Typography>
              <Typography fontWeight={"500"} fontSize={"1.25rem"} textAlign={"center"} width={"82px"}>
                {item.points}
              </Typography>
            </Stack>
          );
        })}
        <Stack direction={"row"} margin={"6px 2px"} gap={"16px"} bgcolor={"#F9E1E2"} borderRadius={"4px"} padding={"5px 0"}>
              <Typography fontWeight={"600"} fontSize={"1.25rem"} width={"48px"} textAlign={"center"}>
                {currentUser?.rank}
              </Typography>
              <Typography fontWeight={"600"} fontSize={"1.25rem"} flex={"1"} >
                {currentUser?.name.split(" ")[0]}
              </Typography>
              <Typography fontWeight={"600"} fontSize={"1.25rem"} textAlign={"center"}  >
                {currentUser && formatTime(currentUser?.timeInMints)}
              </Typography>
              <Typography fontWeight={"600"} fontSize={"1.25rem"} textAlign={"center"} width={"82px"}>
                {currentUser?.points}
              </Typography>
            </Stack>
      </Stack>
      
    </Stack>
  );
};

export default Score;
