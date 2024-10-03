import {
  Stack,
  Typography,
  Box,
  useTheme,
  Card,
  Button,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { getHelpSectionModule } from "@/store/user/userActions";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { ArrowBack, Pause, VolumeUpOutlined } from "@mui/icons-material";
import useTextToSpeech from "@/hooks/users/useTextToSpeech";

const HelpSectionModule = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const sliderRef = useRef<any>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [title, setTitle] = useState<string>();
  const { id } = useParams();

  const { convertTextToSpeech, audioBlob } = useTextToSpeech();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleAudioSetup = useCallback(() => {
    if (audioBlob) {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onloadedmetadata = () => {
        playAudio();
      };
      
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
  }, [audioBlob]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
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
      playAudio();
    } else {
      handleAudioSetup();
    }
  };

  useEffect(() => {
    if (data?.length > 0) {
      const initialSteps = data[0]?.steps;
      convertTextToSpeech(initialSteps);
    }
  }, [data, convertTextToSpeech]);

  useEffect(() => {
    if (audioBlob) {
      handleAudioSetup();
    }
  }, [audioBlob, handleAudioSetup]);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await getHelpSectionModule(id);
          setData(response.modules);
          setTitle(response.title);
          if (response.modules.length > 0) {
            convertTextToSpeech(response.modules[0].steps);
          }
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [id, navigate, convertTextToSpeech]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (currentSlide: number) => {
      setSelectedIndex(currentSlide);
      const currentStep = data[currentSlide]?.steps;
      
      // Stop current audio before converting new text
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      convertTextToSpeech(currentStep);
      
      buttonsRef.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
  };

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
                  ref={(el) => (buttonsRef.current[index] = el)}
                  variant={selectedIndex === index ? "contained" : "outlined"}
                  sx={{
                    borderColor: "#000000",
                    minWidth: "40px",
                    color: selectedIndex === index ? "white" : "black",
                    borderRadius: "0",
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
                    {!isPlaying ? (
                      <IconButton onClick={restartAudio}>
                        <VolumeUpOutlined
                          sx={{ color: "#ffffff", fontSize: "1.8rem" }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton onClick={pauseAudio}>
                        <Pause sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
                      </IconButton>
                    )}

                    <Box sx={{ height: "5px", flex: 1, bgcolor: "#ffffff79" }}>
                      <Box
                        sx={{
                          height: "100%",
                          width: `${progress}%`,
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
                    color={"#FFFFFF"}
                    fontSize={"1.25rem"}
                    fontWeight={"600"}
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
