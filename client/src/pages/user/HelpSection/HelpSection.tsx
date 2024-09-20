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
import React, { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
interface DailyUpdate {
  title: string;
  image: string;
}
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
  const openModule = () => {
    setTimeout(() => {
      navigate("/help-section-module");
    }, 3500);
  };

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
        <Stack direction={"row"}>
          <IconButton>
            <ArrowBack sx={{ color: theme.palette.primary.main }} />
          </IconButton>
          <Stack width={"max-content"} padding={"12px"}>
            <Typography fontSize={"2rem"} fontWeight={"600"}>
              Zaroor Dekho
            </Typography>
            <Box
              sx={{
                height: "4px",
                borderRadius: "8px",
                bgcolor: theme.palette.primary.main,
                marginTop: "4px",
              }}
            />
            <Typography padding={"12px"} maxWidth={"90%"}>
              Learn before you go ahead with the weekly sangram
            </Typography>
          </Stack>
        </Stack>

        {/* Horizontal Slider for cards */}
        <Stack width={"100%"} padding={"5px"}>
          <Slider {...settings}>
            {dailyUpdates.map((item, index) => (
              <Stack padding={"16px"}>
                <Card
                  onClick={() => openModule()}
                  key={index}
                  sx={{
                    backgroundColor: "#800000",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    // justifyContent: "center",
                    // textAlign: "center",
                    height: "400px", // Adjust height of each card
                    // margin: "20px", // Optional: Add space between cards
                  }}
                >
                  <Typography
                    padding={"3px"}
                    color={"#FFFFFF"}
                    fontSize={"1.5rem"}
                    fontWeight={"600"}
                    maxWidth={"70%"}
                  >
                    {item.title}
                  </Typography>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "300px", // Image width
                      height: "300px", // Image height
                      objectFit: "contain", // Ensures image fits well in its box
                      marginTop: "10px",
                    }}
                  />
                </Card>
              </Stack>
            ))}
          </Slider>
        </Stack>

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
            <Typography color={""} fontWeight={"400"} fontSize={"1rem"}>
              Module 1
            </Typography>
            <Typography fontWeight={"400"} fontSize={"1rem"}>
              8 Sept
            </Typography>
          </Stack>
          <Stack paddingTop={"10px"}>
            <Typography fontSize={"1.5rem"} fontWeight={"600"}>
              New Circulars from Aug 24 onwards
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default HelpSection;
