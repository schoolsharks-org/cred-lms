import { Box, Stack, Typography, useTheme } from "@mui/material";
import weeklyQuestionBadge from "@/assets/user/weekly-question-badge.png";
import useWeeklyQuestion from "@/hooks/users/useWeeklyQuestion";
import { Navigate } from "react-router-dom";
import Loader from "@/components/Loader";

const WeeklyQuestionsCompleted = () => {
  const theme = useTheme();
  const { scores,answered,totalQuestions ,loading} = useWeeklyQuestion();

  if(loading){
    return <Loader/>
  }
  if(answered<totalQuestions){
    return <Navigate to="/weekly-question"/>
  }
  return (
    <Stack minHeight={"100vh"}>
      <Stack alignItems={"center"} gap={"20px"} marginTop={"90px"}>
        <Typography fontSize={"2.5rem"} fontWeight={"600"}>
          Congratulations!!
        </Typography>
        <img src={weeklyQuestionBadge} alt="Badge" style={{ width: "110px" }} />
        <Typography fontSize={"1.5rem"} fontWeight={"500"}>
          You have earned a badge
        </Typography>
      </Stack>
      <Stack
        bgcolor={theme.palette.primary.main}
        color={"#fff"}
        flex={"1"}
        marginTop={"24px"}
      >
        <Stack
          direction={"row"}
          padding="20px"
          justifyContent={"space-between"}
        >
          <Typography fontSize={"1.5rem"}>Status</Typography>
          <Stack
            border={"1px solid #ffffff7b"}
            padding={"2px 12px"}
            alignItems={"flex-end"}
          >
            <Typography fontWeight={"500"}>Your Score - {scores.userScore}%</Typography>
            <Typography fontWeight={"500"}>Average Score - {scores.averageScore}%</Typography>
          </Stack>
        </Stack>

        <Stack padding={"16px"}>
          <Stack
            direction={"row"}
            height={"14px"}
            justifyContent={"space-between"}
            bgcolor={"#fff"}
            position={"relative"}
          >
            {Array.from({ length: 11 }).map((_, index) => (
              <Box
                height={"125%"}
                width="4px"
                bgcolor={index === 0 || index === 10 ? "#000" : "#796e6e61"}
                alignSelf={"flex-end"}
              />
            ))}

            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "20px solid #ff0000",
                position: "absolute",
                bottom: "0",
                left: `${scores.userScore??0}%`,
                transform: "translateX(-50%)",
              }}
            >
              <Typography
                fontSize="0.9rem"
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  transform: "translateX(-50%) translateY(20px)",
                }}
              >
                You
              </Typography>
            </Box>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "20px solid #000000",
                position: "absolute",
                bottom: "0",
                left: `${scores.averageScore??0}%`,
                transform: "translateX(-50%)",
              }}
            >
              <Typography
                fontSize="0.9rem"
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  transform: "translateX(-50%) translateY(20px)",
                }}
              >
                Average
              </Typography>
            </Box>

            <Typography
              fontSize="0.9rem"
              sx={{
                position: "absolute",
                top: "100%",
                left: "0",
                transform: "translateX(-50%)",
              }}
            >
              0%
            </Typography>
            <Typography
              fontSize="0.9rem"
              sx={{
                position: "absolute",
                top: "100%",
                left: "100%",
                transform: "translateX(-80%)",
              }}
            >
              100%
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ height: "1px", bgcolor: "#ffffff7b", marginTop: "34px" }} />
        <Stack padding={"20px"}>
          <Typography fontSize={"1.5rem"} fontWeight={"500"} marginTop={"34px"}>
            You have earned 80 points. 20 points away from your next reward.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WeeklyQuestionsCompleted;
