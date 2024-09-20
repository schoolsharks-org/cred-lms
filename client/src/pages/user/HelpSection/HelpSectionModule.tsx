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
import { ArrowBack } from "@mui/icons-material";

const HelpSectionModule = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const sliderRef = useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [title, setTitle] = useState<string>();

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (currentSlide: number) => {
      setSelectedIndex(currentSlide);
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
      <Stack height={"100vh"} padding={"16px"}>
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

        {/* Title */}
        {/* <Stack width={"max-content"} padding={"12px"}>
          <Typography fontSize={"1.5rem"} fontWeight={"600"} maxWidth={"80%"}>
            {title}
          </Typography>
          <Box
            sx={{
              height: "4px",
              borderRadius: "8px",
              bgcolor: theme.palette.primary.main,
              marginTop: "4px",
            }}
          />
        </Stack> */}

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
            gap={"4px"}
            sx={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {data.map(
              (_: any, index: number) => (
                <Button
                  key={index}
                  variant={selectedIndex === index ? "contained" : "outlined"}
                  //   color="primary"
                  sx={{
                    borderColor: "black", // Set border color to black for outlined buttons
                    minWidth: "40px",
                    color: selectedIndex === index ? "white" : "black",
                  }}
                  onClick={() => handleButtonClick(index)}
                >
                  {index + 1}
                </Button>
              )
            )}
          </Stack>
        </Stack>

        {/* Card with dynamic content */}

        <Stack width={"100%"} padding={"5px"}>
          <Slider ref={sliderRef} {...settings}>
            {data?.map((item: any, index: number) => (
              <Stack padding={"16px"}>
                <Card
                  key={index}
                  sx={{
                    backgroundColor: "#800000",
                    padding: "20px",
                    width: "100%",
                    flexDirection: "column",
                    display: "flex",
                    color:"#fff"
                    // display:index===0?"flex":"none",
                    // justifyContent: "center",
                    // textAlign: "center",
                    // margin: "20px", // Optional: Add space between cards
                  }}
                >
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
                  <Typography marginTop={"24px"}>Steps to follow- </Typography>
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
