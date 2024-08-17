import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import userCheckedIcon from "@/assets/icons/user-check-icon.svg";
import {
  ArrowBackIos,
  ArrowCircleDown,
  ArrowForwardIos,
} from "@mui/icons-material";
import BarGraph from "@/components/user/BarGraph";
import useDailyQuestion from "@/hooks/useDailyQuestion";
import Loader from "@/components/Loader";

const DailyQuestion = () => {
  const theme = useTheme();
  const { date, dailyQuestionData,loading,error,respondToDailyQuestion ,prevDay,forwardDay} = useDailyQuestion();

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`;
  };

  
  const checkTodayDate = (date: Date): boolean => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return date >= startOfDay && date <= endOfDay;
  };

  const handleSubmit=(option:'OptionA'|'OptionB')=>{
    respondToDailyQuestion(option)
  }

  return (
    <Stack marginTop={"16px"}>
      {/* Title Strip */}
      <Stack bgcolor={theme.palette.primary.main} padding={"16px"}>
        <Stack direction={"row"}>
          <Typography color={"#FFFFFF"} fontSize={"2.5rem"} fontWeight={"600"}>
            Apki Awaaz{" "}
          </Typography>
        </Stack>
        <Typography color={"#FFFFFF"}>
          Give your vote and earn 5 points
        </Typography>
      </Stack>

      <Stack bgcolor={theme.palette.secondary.main} minHeight={"140px"}>
    {loading?<Loader minHeight="40vh"/>:
      <Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          padding={"10px 24px"}
        >
          <Stack direction={"row"} gap={"5px"}>
            <Typography color={theme.palette.text.secondary} fontWeight={"600"}>
              250
            </Typography>
            <img src={userCheckedIcon} alt="" />
          </Stack>
          <Typography color={theme.palette.text.secondary} fontWeight={"600"}>
            {formatDate(date)}
          </Typography>
        </Stack>
        {/* Main Question */}
        <Stack padding={"12px"} direction={"row"}>
          <IconButton onClick={prevDay} >
            <ArrowBackIos />
          </IconButton>
          <Typography fontSize={"2rem"} fontWeight={"500"} lineHeight={"2rem"}>
            {dailyQuestionData?.question}
          </Typography>
          <IconButton disabled={checkTodayDate(date)} onClick={forwardDay}>
            <ArrowForwardIos />
          </IconButton >
        </Stack>

        {/* "Not Answered" is coming from backend when question not answered */}
        {dailyQuestionData?.userResponse === "Not Answered" ? (
          !checkTodayDate(date)?<Typography fontSize={"1.5rem"} color={theme.palette.text.secondary} padding="12px 48px" >You missed to respond</Typography>:
          <Stack direction={"row"} marginTop={"1rem"}>
            {Object.entries(dailyQuestionData.options).map(
              ([key, value], index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={()=>handleSubmit(key as 'OptionA'|'OptionB')}
                  sx={{
                    borderRadius: "0",
                    border: "2px solid #000",
                    flex: "1",
                    fontSize: "2rem",
                    color: "#000",
                    fontWeight: "600",
                    padding: "16px auto",
                    "&:hover":{
                      border:"2px solid #000"
                    }
                  }}
                >
                  {value}
                </Button>
              )
            )}
          </Stack>
        ) : (
          
          <Stack marginTop={"24px"}>
            <Typography
              fontSize={"1.5rem"}
              fontWeight={"600"}
              padding={"0 48px"}
            >
              You Chose - {dailyQuestionData?.options[dailyQuestionData?.userResponse]}
            </Typography>
            <Box
              sx={{
                height: "1px",
                bgcolor: "#000",
                width: "90%",
                margin: " 24px auto 0",
              }}
            />{" "}
            {/*Divider Line */}
            <Accordion sx={{ bgcolor: "transparent", boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<ArrowCircleDown />}
                aria-controls="panel1-content"
                id="panel1-header"
                // sx={{border:"none"}}
              >
                <Typography
                  fontSize={"1.25rem"}
                  color={theme.palette.text.secondary}
                >
                  Sabki Awaaz
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack width={"100%"}>
                  <BarGraph data={dailyQuestionData?.stats}/>
                  <Stack
                    gap="32px"
                    direction={"row"}
                    justifyContent={"flex-end"}
                  >
                    <Stack direction={"row"} gap={"5px"}>
                      <Box
                        sx={{
                          width: "24px",
                          height: "24px",
                          bgcolor: "#D53951",
                        }}
                      />
                      <Typography fontWeight={"600"}>YES</Typography>
                    </Stack>
                    <Stack direction={"row"} gap={"5px"}>
                      <Box
                        sx={{
                          width: "24px",
                          height: "24px",
                          bgcolor: "#000000",
                        }}
                      />
                      <Typography fontWeight={"600"}>NO</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        )}
      </Stack>
      }
      </Stack>
    </Stack>
  );
};

export default DailyQuestion;
