import Loader from "@/components/Loader";
import useWeeklyQuestion from "@/hooks/useWeeklyQuestion";
import { Check, Close } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

const WeeklyQuestions = () => {
  const theme = useTheme();
  const {
    loading,
    currentQuestion,
    correctAnswer,
    time,
    totalQuestions,
    answered,
    handleSubmitAnswer,
    handleNextQuestion,
  } = useWeeklyQuestion();

  // const handleSubmitResponse=async(option:'OptionA'|'OptionB')=>{

  // }

  if (loading) {
    return <Loader />;
  }

  const getOptionComponent=(option:string|undefined)=>{
    if(option && ["RIGHT","WRONG"].includes(option)){
      return option==="RIGHT"?<Check sx={{fontSize:"3rem"}}/>:<Close sx={{fontSize:"3rem"}}/>;
    }
    return option
  }
  return (
    <Stack height="100vh">
      <Stack width={"max-content"} padding={"16px"}>
        <Typography fontSize={"2rem"} fontWeight={"600"}>
          Caption
        </Typography>
        <Box
          sx={{
            height: "4px",
            borderRadius: "8px",
            bgcolor: theme.palette.primary.main,
            marginTop: "8px",
          }}
        />
        <Typography fontSize={"1.25rem"} fontWeight={"500"} lineHeight={"2rem"}>
          Play to earn 100 points
        </Typography>
      </Stack>
      <Stack bgcolor={theme.palette.primary.main} flex={"1"}>
        <Stack
          direction={"row"}
          padding={"12px"}
          justifyContent={"space-between"}
          color={"#fff"}
        >
          <Typography fontWeight={"500"}>{time}</Typography>
          <Typography fontWeight={"500"}>
            {answered}/{totalQuestions}
          </Typography>
        </Stack>

        <Stack direction={"row"} gap={"10px"} marginTop={"20px"}>
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <Box
              key={index}
              flex={"1"}
              sx={{
                height: "28px",
                bgcolor: index < answered ? "#fff" : "",
                border: "1px solid #fff",
              }}
            />
          ))}
        </Stack>
        <Stack
          bgcolor={theme.palette.secondary.main}
          padding={"20px"}
          flex={"1"}
          marginTop={"12px"}
          justifyContent={"center"}
        >
          <Typography fontSize={"1.5rem"} fontWeight={"500"}>
            {currentQuestion?.questionPrompt}
          </Typography>
          <Stack direction={"row"} gap={"16px"} marginTop={"16px"}>
            {currentQuestion?.images?.map((image, index) => (
              <img
                src={image}
                alt=""
                key={index}
                style={{ flex: "1", width: "100%" }}
              />
            ))}
          </Stack>
          {currentQuestion?.optionTexts &&
          <Stack>
            <Box height={`2px`} bgcolor={theme.palette.primary.main} margin={"24px 0 38px"}/>
            <Typography fontSize="1.25rem" fontWeight={"500"}><b>Option A - </b> {currentQuestion.optionTexts.optionA}</Typography>
            <Typography fontSize="1.25rem" fontWeight={"500"} marginTop={"12px"}><b>Option B - </b> {currentQuestion.optionTexts.optionB}</Typography>
          </Stack>
          }
        </Stack>
        <Stack minHeight={"100px"} padding={"24px"} justifyContent={"center"}>
          <Typography
            color={"#fff"}
            fontSize={"1.25rem"}
            fontWeight={"400"}
            sx={{ opacity: "0.75" }}
          >
            {correctAnswer && `Correct Answer - ${currentQuestion?.correctAnswerDescription ?? `Option ${correctAnswer}`}`}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          bgcolor={theme.palette.secondary.main}
          height={"100px"}
        >
          {correctAnswer ? (
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              sx={{
                // height: "max-content",
                margin: "auto",
                fontSize: "2rem",
                height:"100%",
                color:"#000",
                bgcolor:"transparent",
                width:"100%",
                "&:hover":{
                  bgcolor:"transparent"
                }
              }}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() =>
                  handleSubmitAnswer(currentQuestion?.optionA ?? "")
                }
                sx={{
                  borderRadius: "0",
                  border: "2px solid #000",
                  flex: "1",
                  fontSize: "2.5rem",
                  color: "#000",
                  fontWeight: "600",
                  padding: "40px auto",
                  "&:hover": {
                    border: "2px solid #000",
                  },
                }}
              >
                {getOptionComponent(currentQuestion?.optionA)}
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  handleSubmitAnswer(currentQuestion?.optionB ?? "")
                }
                sx={{
                  borderRadius: "0",
                  border: "2px solid #000",
                  flex: "1",
                  fontSize: "2.5rem",
                  color: "#000",
                  fontWeight: "600",
                  padding: "40px auto",
                  "&:hover": {
                    border: "2px solid #000",
                  },
                }}
              >
                {getOptionComponent(currentQuestion?.optionB)}
              </Button>{" "}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WeeklyQuestions;
