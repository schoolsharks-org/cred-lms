import Loader from "@/components/Loader";
import useWeeklyQuestion from "@/hooks/users/useWeeklyQuestion";
import {
  ArrowBack,
  ArrowForward,
  Pause,
  VolumeUpOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Insights = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { handleFetchInsights, insights, loading } = useWeeklyQuestion();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const synth = window.speechSynthesis;

  // Function to speak insights
  const speakInsight = (insight: string) => {
    if (synth.speaking) return; // Prevent overlap

    const utterance = new SpeechSynthesisUtterance(insight);
    const voices = synth.getVoices();
    const indianVoice = voices.find((v) => v.lang === "en-IN" || v.name.includes("India"));
    if(indianVoice){
      utterance.voice=indianVoice
    }
    utterance.onend = () => {
      setCurrentInsightIndex((prev) => prev + 1); // Move to next insight
    };

    synth.speak(utterance);
  };

  useEffect(() => {
    handleFetchInsights();
  }, []);

  useEffect(() => {
    if (
      insights.length > 0 &&
      currentInsightIndex < insights.length &&
      !isPaused
    ) {
      speakInsight(insights[currentInsightIndex]);
    }
  }, [insights, currentInsightIndex, isPaused]);

  const pauseAudio = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const restartAudio = () => {
    synth.cancel();
    setCurrentInsightIndex(0);
    setIsPaused(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Stack>
        <Stack direction="row" padding={"24px 8px"} gap={"8px"}>
          <IconButton sx={{ height: "max-content", marginTop: "12px" }} onClick={()=>navigate("/home")}>
            <ArrowBack
              sx={{ color: theme.palette.primary.main, fontWeight: "700" }}
            />
          </IconButton>
          <Stack gap={"5px"}>
            <Typography fontSize={"1.5rem"} fontWeight={"700"}>
              New Circulars From Aug 24 onwards
            </Typography>
            <Box
              height={"4px"}
              width={"100%"}
              borderRadius={"8px"}
              bgcolor={theme.palette.primary.main}
            />
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          bgcolor={theme.palette.primary.main}
          alignItems={"center"}
          padding={"8px 24px 8px 8px"}
        >
          {isPaused ? (
            <IconButton onClick={()=>restartAudio()}>
              <VolumeUpOutlined sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
            </IconButton>
          ) : (
            <IconButton onClick={()=>pauseAudio()}>
              <Pause sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
            </IconButton>
          )}

          <Box sx={{ height: "5px", flex: 1, bgcolor: "#ffffff79" }}>
            <Box sx={{height:"100%",width:`${currentInsightIndex*100/insights.length}%`,bgcolor:"#ffffff",transition:"all 0.3s ease"}}/>
          </Box>
        </Stack>

        <Stack
          bgcolor={theme.palette.primary.main}
          marginTop={"24px"}
          padding="24px 16px"
        >
          <Typography
            fontWeight={"500"}
            fontSize={"1.25rem"}
            color="#ffffff"
            marginBottom={"24px"}
          >
            Points to be noted-
          </Typography>
          <Stack gap={"20px"}>
            {insights.map((insight, index) => (
              <Typography key={index} color={"#fff"} fontSize={"1.25rem"}>
                {index + 1}. {insight}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <Button
          variant="contained"
          endIcon={<ArrowForward style={{ fontSize: "1.8rem" }} />}
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: "#ffffff",
            color: "#000000",
            fontSize: "2rem",
            fontWeight: "500",
            justifyContent: "space-between",
            textTransform: "none",
            padding: "12px 24px",
            "&:hover": { bgcolor: "#ffffff" },
          }}
        >
          Take the test
        </Button>
      </Stack>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Stack sx={{ padding: "28px 24px", maxWidth: "310px" }}>
          <Typography fontSize={"1.25rem"} fontWeight={"600"}>
            Once the test begins, you will not be able to uit.
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            marginTop={"36px"}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setDialogOpen(false)}
              sx={{ textTransform: "none", fontSize: "1.25rem" }}
            >
              Go back
            </Button>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate("/weekly-question")}
              sx={{
                textTransform: "none",
                fontSize: "1.25rem",
                color: "#000000",
              }}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default Insights;
