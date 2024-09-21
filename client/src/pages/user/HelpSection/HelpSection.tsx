import {
  Stack,
  Typography,
  Box,
  useTheme,
  Card,
  Button,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { getHelpSectionModule } from "@/store/user/userActions";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { ArrowBack, Pause, VolumeUpOutlined } from "@mui/icons-material";

const HelpSectionModule = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const sliderRef = useRef<any>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [title, setTitle] = useState<string>();

  const [isPaused, setIsPaused] = useState<boolean>(true);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const handleVoicesChanged = () => {
      if (data?.length > 0 && selectedIndex < data?.length && !isPaused) {
        speakStep(data[selectedIndex].steps);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = handleVoicesChanged;
    }
  }, [data, selectedIndex, isPaused]);

  const speakStep = (step: string) => {
    if (synth.speaking) {
      synth.cancel(); // Cancel any ongoing speech before starting new one
    }

    if (!isPaused && step) {
      const utterance = new SpeechSynthesisUtterance(step);
      const voices = synth.getVoices();
      const indianVoice = voices.find(
        (v) => v.lang === "en-IN" || v.name.includes("India")
      );

      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      utterance.onend = () => {
        console.log("Speech finished for:", step);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
      };

      synth.speak(utterance); // Start speaking the step
    }
  };

  const pauseAudio = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause(); // Pause the speech
      setIsPaused(true); // Update the paused state
    }
  };

  const restartAudio = () => {
    if (synth.paused) {
      synth.resume(); // Resume the paused speech
      setIsPaused(false); // Update the paused state
    } else {
      // If not paused, start from the current step
      synth.cancel();
      setIsPaused(false);
      speakStep(data[selectedIndex]?.steps);
    }
  };

  const handleVolumeClick = () => {
    // If speech is paused or hasn't started yet, trigger restartAudio to start speech
    if (isPaused) {
      restartAudio();
    } else {
      pauseAudio(); // If already playing, pause
    }
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (currentSlide: number) => {
      setSelectedIndex(currentSlide);
      if (!isPaused) {
        speakStep(data[currentSlide].steps);
      } else {
        pauseAudio();
      }
      buttonsRef.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await getHelpSectionModule(id);
          console.log("response: ", response);
          setData(response.modules);
          setTitle(response.title);
        } else {
          navigate(-1);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, []);

  const handleButtonClick = (index: number) => {
    setSelectedIndex(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Stack height={"100vh"} padding={"12px"}>
        <Stack direction={"row"} marginTop={"24px"}>
          <Stack>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: "1.8rem",
                  marginTop: "8px",
                }}
              />
            </IconButton>
          </Stack>
          <Stack>
            <Typography fontSize={"1.5rem"} fontWeight={"700"}>
              {title}
            </Typography>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                height: "4px",
                borderRadius: "12px",
                width: "90%",
              }}
            />
          </Stack>
        </Stack>

        {/* Number Navigation */}
        <Stack
          direction="row"
          spacing={1}
          marginTop={"32px"}
          padding={"0 0 0 20px"}
        >
          <Typography fontSize={"1.25rem"} fontWeight={"600"}>
            Step-
          </Typography>
          <Stack
            overflow={"scroll"}
            width={"70%"}
            direction={"row"}
            sx={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Stack direction={"row"} gap={"4px"}>
              {data?.map((_: any, index: number) => (
                <Button
                  key={index}
                  ref={(el) => (buttonsRef.current[index] = el)} // Assign button ref
                  variant={selectedIndex === index ? "contained" : "outlined"}
                  sx={{
                    borderColor: "black", // Set border color to black for outlined buttons
                    minWidth: "40px",
                    color: selectedIndex === index ? "white" : "black",
                  }}
                  onClick={() => handleButtonClick(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Card with dynamic content */}
        <Stack width={"100%"} padding={"5px"} marginTop={"16px"}>
          <Slider ref={sliderRef} {...settings}>
            {data?.map((item: any, index: number) => (
              <Stack
                key={index}
                padding={"16px"}
                sx={{
                  scale: index === selectedIndex ? "1" : "0.95",
                  transition: "all 0.3s ease",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#800000",
                    padding: "20px",
                    width: "100%",
                    flexDirection: "column",
                    display: "flex",
                    color: "#fff",
                    opacity: index === selectedIndex ? "1" : "0.9",
                    transition: "all 0.1s ease",
                  }}
                >
                  <Stack
                    direction={"row"}
                    bgcolor={theme.palette.primary.main}
                    alignItems={"center"}
                    padding={"8px 24px 8px 8px"}
                  >
                    <IconButton onClick={handleVolumeClick}>
                      {isPaused ? (
                        <VolumeUpOutlined
                          sx={{ color: "#ffffff", fontSize: "1.8rem" }}
                        />
                      ) : (
                        <Pause sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
                      )}
                    </IconButton>

                    <Box sx={{ height: "5px", flex: 1, bgcolor: "#ffffff79" }}>
                      <Box
                        sx={{
                          height: "100%",
                          width: `${(selectedIndex * 100) / data?.length}%`,
                          bgcolor: "#ffffff",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Box>
                  </Stack>
                  <img
                    src={item.img}
                    alt={item.steps}
                    style={{
                      margin: "auto",
                      width: "90%",
                      objectFit: "contain",
                      marginTop: "24px",
                    }}
                  />
                  <Typography marginTop={"24px"}>Steps to follow-</Typography>
                  <Typography
                    padding={"3px"}
                    color={"#FFFFFFB2"}
                    fontSize={"1.25rem"}
                  >
                    {item.steps}
                  </Typography>
                </Card>
              </Stack>
            ))}
          </Slider>
        </Stack>
      </Stack>
    </>
  );
};

export default HelpSectionModule;
