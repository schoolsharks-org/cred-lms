import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import weeklyQuestionBadge from "@/assets/user/weekly-question-badge.png";
import useWeeklyQuestion from "@/hooks/users/useWeeklyQuestion";
import { Navigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const WeeklyQuestionsCompleted = () => {
  const theme = useTheme();
  const {
    scores,
    answered,
    totalQuestions,
    loading,
    scoreImprovement,
    handleReattempt,
  } = useWeeklyQuestion();

  if (loading) {
    return <Loader />;
  }
  
  if (answered < totalQuestions) {
    return <Navigate to="/weekly-question" />;
  }

  return (
    <Stack minHeight={"100vh"}>
      <Stack alignItems={"center"} marginTop={"42px"}>
        <Typography fontSize={"2rem"} fontWeight={"600"}>
          Congratulations!!
        </Typography>
        <Typography
          fontSize={"1.25rem"}
          fontWeight={"500"}
          color={theme.palette.primary.main}
        >
          {scoreImprovement===0?"There is no improvement":scoreImprovement? (scoreImprovement>0?"You did it better":"You did worse than before"):"You have earned a badge"}
        </Typography>
        {scoreImprovement || scoreImprovement===0 ? (
          <Stack direction={"row"} margin={"45px 0"}>
            <Typography fontSize={"3rem"} fontWeight={"700"}>{scoreImprovement}%</Typography>
            {scoreImprovement===0?null:scoreImprovement>0?<ArrowUpward sx={{fontSize:"4rem",color:"#32FF21"}} />:<ArrowDownward sx={{fontSize:"4rem",color:"#ff0000"}}/>}
          </Stack>
        ) : (
          <img
            src={weeklyQuestionBadge}
            alt="Badge"
            style={{ width: "110px", margin: "32px auto" }}
          />
        )}
      </Stack>
       <Stack bgcolor={"#D53951"} padding={"18px 12px"} gap={"8px"}>
          {scores?.reattemptScores?.map((score,index)=>(<Typography color="#ffffff" fontSize={"18px"}>Test {index+1} score - {Math.round(score*100/scores.maxScore)}%</Typography>))}
        </Stack> 
      <Stack bgcolor={theme.palette.secondary.main} paddingBottom={"48px"}>
        <Stack
          direction={"row"}
          padding="28px 16px"
          justifyContent={"space-between"}
        >
          <Typography fontSize={"1.5rem"} fontWeight={"500"}>
            Status
          </Typography>
          <Stack border={"1px solid #796E6E"} padding={"2px 12px"}>
            <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderBottom: "15px solid #000000",
                }}
              />
              <Typography fontWeight={"500"}>
                Your Score -{" "}
                {Math.round((scores?.userScore * 100) / scores?.maxScore)}%
              </Typography>
            </Stack>
            <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderBottom: `15px solid ${theme.palette.primary.main}`,
                }}
              />
              <Typography fontWeight={"500"}>
                Average Score -{" "}
                {Math.round((scores?.averageScore * 100) / scores?.maxScore)}%
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack padding={"16px"}>
          <Stack
            direction={"row"}
            height={"14px"}
            justifyContent={"space-between"}
            bgcolor={"#fff"}
            position={"relative"}
            boxShadow={"0px 4px 4px 0px #00000040"}
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
                borderBottom: "20px solid #000000",
                position: "absolute",
                bottom: "0",
                left: `${
                  Math.round((scores?.userScore * 100) / scores?.maxScore) ?? 0
                }%`,
                transform: "translateX(-50%)",
                zIndex:2
              }}
            ></Box>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: `20px solid ${theme.palette.primary.main}`,
                position: "absolute",
                bottom: "0",
                left: `${
                  Math.round((scores?.averageScore * 100) / scores?.maxScore) ??
                  0
                }%`,
                transform: "translateX(-50%)",
                zIndex:1
              }}
            ></Box>

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
      </Stack>

      <Stack direction={"row"}>
        <Button
          variant="outlined"
          sx={{
            flex: "1",
            textAlign: "left",
            fontWeight: "500",
            padding: "16px auto",
            textTransform: "none",
            borderRadius: "0",
            border: "2px solid #000000",
            borderRight: "none",
            color: "#000000",
            "&:hover": { border: "2px solid #000000" },
          }}
        >
          In-Person Training ke liye request karein
        </Button>
        <Button
          variant="outlined"
          disabled={scores?.reattemptScores?.length >= 2}
          onClick={handleReattempt}
          sx={{
            flex: "1",
            textAlign: "left",
            fontWeight: "500",
            padding: "16px auto",
            textTransform: "none",
            borderRadius: "0",
            border: "2px solid #000000",
            color: "#000000",
            "&:hover": { border: "2px solid #000000" },
            "&:disabled": {
              border: "2px solid #000",
              color: "#000",
              bgcolor: "#796E6E",
            },
          }}
        >
          Reattempt ke liye request karein
        </Button>
      </Stack>

      <Stack
        bgcolor={theme.palette.primary.main}
        marginTop={"35px"}
        padding={"12px 16px"}
      >
        <Typography color={"#fff"} fontSize={"1"}>
          You have earned {scores.userScore} points.
        </Typography>
        <Typography color={"#fff"} fontSize={"1"}>
          No points for reattempt
        </Typography>
      </Stack>

      {/* <Stack
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
          >
            <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderBottom: "15px solid #000000",
                }}
              />
              <Typography fontWeight={"500"}>
                Your Score -{" "}
                {Math.round((scores.userScore * 100) / scores.maxScore)}%
              </Typography>
            </Stack>
            <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
            <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderBottom: "15px solid #ff0000",
                }}
              />
            <Typography fontWeight={"500"}>
              Average Score -{" "}
              {Math.round((scores.averageScore * 100) / scores.maxScore)}%
            </Typography>
            </Stack>
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
                borderBottom: "20px solid #000000",
                position: "absolute",
                bottom: "0",
                left: `${
                  Math.round((scores.userScore * 100) / scores.maxScore) ?? 0
                }%`,
                transform: "translateX(-50%)",
              }}
            >
            </Box>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "20px solid #ff0000",
                position: "absolute",
                bottom: "0",
                left: `${
                  Math.round((scores.averageScore * 100) / scores.maxScore) ?? 0
                }%`,
                transform: "translateX(-50%)",
              }}
            >
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
            You have earned {scores.userScore} points. 80 points away from your
            next reward.
          </Typography>
        </Stack>
      </Stack> */}
    </Stack>
  );
};

export default WeeklyQuestionsCompleted;
