import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

const WeeklyQuestions = () => {
  const theme = useTheme();

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
          <Typography fontWeight={"500"}>00:02</Typography>
          <Typography fontWeight={"500"}>10/100</Typography>
        </Stack>

        <Stack direction={"row"} gap={"10px"} marginTop={"20px"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Box
              key={index}
              flex={"1"}
              sx={{ height: "28px", bgcolor: "", border: "1px solid #fff" }}
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
          <Typography fontSize={"2rem"} fontWeight={"500"}>
            Do you think this will be the right approach? Let us know your
            opinion.
          </Typography>
        </Stack>
        <Stack minHeight={"100px"} padding={"24px"} justifyContent={"center"}>
          <Typography color={"#fff"} fontSize={"1.25rem"} fontWeight={"400"} sx={{opacity:"0.75"}}>
            Correct Answer - Option A
          </Typography>
        </Stack>
        <Stack direction={"row"} bgcolor={theme.palette.secondary.main} height={"100px"}>
          <Button
            variant="outlined"
            // onClick={()=>handleSubmit(key as 'OptionA'|'OptionB')}
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
            YES
          </Button>
          <Button
            variant="outlined"
            // onClick={()=>handleSubmit(key as 'OptionA'|'OptionB')}
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
            NO
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WeeklyQuestions;
