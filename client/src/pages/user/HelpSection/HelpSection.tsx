/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Stack,
  Typography,
  Box,
  useTheme,
  Card,
  IconButton,
} from "@mui/material";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { getDailyUpdates } from "@/store/user/userActions";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";


interface DailyUpdate {
  _id:string;
  title: string;
  image: string;
}

const modules = [
  { name: "New Circulars from Aug 24 onwards", date: "8th Sep" },
  { name: "Incentive scheme for FOs details", date: "12th Sep" },
  { name: "Pragati Scheme for FOs details", date: "15th Sep" },
];

const HelpSection = () => {
  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyUpdates = async () => {
      try {
        const response = await getDailyUpdates();
        console.log("response: ", response);
        // console.log("response.data: ", response.data);
        setDailyUpdates(response);
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to fetch daily updates"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDailyUpdates();
  }, []);
  // const array = [
  //   {
  //     title: "New E-NACH process Via Adhaar",
  //     img: "https://via.placeholder.com/150", // sample image link
  //   },
  //   {
  //     title: "B",
  //     img: "https://via.placeholder.com/150", // sample image link
  //   },
  //   {
  //     title: "C",
  //     img: "https://via.placeholder.com/150", // sample image link
  //   },
  // ];

  const theme = useTheme();
  const navigate = useNavigate();

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // One card visible at a time
    slidesToScroll: 1,
    arrows: true, // Optional: Adds left and right navigation arrows
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <>
      <Stack height={"100vh"}>
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
            <Typography
              fontSize={"2rem"}
              fontWeight={"700"}
              width={"max-content"}
            >
              Zaroor Dekho
            </Typography>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                height: "4px",
                borderRadius: "12px",
                width: "90%",
              }}
            />
            <Typography
              fontSize={"1.25rem"}
              fontWeight={"500"}
              maxWidth={"90%"}
            >
              Weekly sangram shuru krne se Pehle zaroor dekhe
            </Typography>
          </Stack>
        </Stack>

        {/* Horizontal Slider for cards */}
        <Stack width={"100%"} padding={"5px"}>
          <Slider {...settings}>
            {dailyUpdates.map((item, index) => (
              <Stack padding={"16px"}>
                <Card
                 onClick={() => navigate(`/zaroor-dekho/${item._id}`)}
                  key={index}
                  sx={{
                    backgroundColor: "#800000",
                    padding: "20px",
                    width: "100%",
                    flexDirection: "column",
                    cursor:"pointer",
                    display:index===0?"flex":"none",
                    // justifyContent: "center",
                    // textAlign: "center",
                    // margin: "20px", // Optional: Add space between cards
                  }}
                >
                  <Typography
                    padding={"3px"}
                    color={"#FFFFFF"}
                    fontSize={"1.5rem"}
                    fontWeight={"600"}
                  >
                    {item.title}
                  </Typography>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      margin: "auto",
                      width: "90%",
                      objectFit: "contain",
                      marginTop: "24px",
                    }}
                  />
                </Card>
              </Stack>
            ))}
          </Slider>
        </Stack>

        <Stack gap={"10px"}>
          {modules.map((module, index) => (
            <Stack
              bgcolor={theme.palette.secondary.main}
              borderTop={"1px solid #00000080 "}
              padding={"15px"}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                fontSize={"20px"}
              >
                <Typography color={theme.palette.text.secondary} fontWeight={"400"} fontSize={"0.8rem"}>
                  Module {index+1}
                </Typography>
                <Typography fontWeight={"400"} fontSize={"0.8rem"} color={theme.palette.text.secondary} >
                  {module.date}
                </Typography>
              </Stack>
              <Stack paddingTop={"10px"}>
                <Typography fontSize={"1.25rem"} fontWeight={"500"}>
                  {module.name}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default HelpSection;
