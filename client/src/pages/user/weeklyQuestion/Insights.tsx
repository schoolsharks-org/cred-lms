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
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTextToSpeech from "@/hooks/users/useTextToSpeech";

const Insights = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { handleFetchInsights, insights, loading, moduleName } =
    useWeeklyQuestion();

  const { audioBlob, convertTextToSpeech, isLoading } = useTextToSpeech();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    handleFetchInsights();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      pauseAudio();
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      pauseAudio(); 
    };
  }, [navigate]);

  useEffect(() => {
    if (insights.length > 0 && audioBlob === null) {
      const combinedInsights = insights
        .map((insight) => insight.text)
        .join(". ");
      convertTextToSpeech(combinedInsights);
    }
  }, [insights]);

  useEffect(() => {
    if (audioBlob && !isPlaying) {
      playAudio();
    }
  }, [audioBlob]);

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.ontimeupdate = () => {
        const currentTime = audioRef.current?.currentTime || 0;
        const duration = audioRef.current?.duration || 1;
        setProgress((currentTime / duration) * 100);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(100);
      };
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      playAudio();
    }
  };

  if (loading || isLoading) {
    return <Loader />;
  }

 

  return (
    <>
      <Stack>
        <Stack direction="row" padding={"24px 8px"} gap={"8px"}>
          <IconButton
            sx={{ height: "max-content", marginTop: "12px" }}
            onClick={() => navigate("/home")}
          >
            <ArrowBack
              sx={{ color: theme.palette.primary.main, fontWeight: "700" }}
            />
          </IconButton>
          <Stack gap={"5px"}>
            <Typography fontSize={"1.5rem"} fontWeight={"700"}>
              {moduleName}
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
          {isPlaying ? (
            <IconButton onClick={pauseAudio}>
              <Pause sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
            </IconButton>
          ) : (
            <IconButton onClick={restartAudio}>
              <VolumeUpOutlined sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
            </IconButton>
          )}

          <Box sx={{ height: "5px", flex: 1, bgcolor: "#ffffff79" }}>
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                bgcolor: "#ffffff",
                transition: "width 0.3s ease",
              }}
            />
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
            {insights?.map((insight, index) => {
              if (insight.type === "BODY") {
                return (
                  <Typography key={index} color={"#fff"} fontSize={"1.25rem"}>
                    • {insight.text}
                  </Typography>
                );
              }
              if (insight.type === "SUBHEADING") {
                return (
                  <Typography
                    key={index}
                    color={"#fff"}
                    fontWeight={"600"}
                    marginTop="20px"
                    fontSize={"1.25rem"}
                  >
                    {insight.text}
                  </Typography>
                );
              }
            })}
          </Stack>
        </Stack>
        <Button
          variant="contained"
          endIcon={<ArrowForward style={{ fontSize: "1.8rem" }} />}
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            fontSize: "2rem",
            fontWeight: "500",
            justifyContent: "space-between",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "0",
            "&:hover": { bgcolor: "#000000" },
          }}
        >
          Take the test
        </Button>
      </Stack>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Stack sx={{ padding: "28px 24px", maxWidth: "310px" }}>
          <Typography fontSize={"1.25rem"} fontWeight={"600"}>
            Test shuru hone ke baad aap beech mein quit nahi kar paayenge.
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
