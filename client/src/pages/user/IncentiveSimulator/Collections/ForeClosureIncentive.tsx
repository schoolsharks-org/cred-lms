import { Box, Slider, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./../IncentiveSimulator.css";

const data = {
  bucket1: {
    bucket: "31-90 bucket",
    pos: ["100% POS+50% Int. Due Collected"],
    incentive: [{ incentive: "6000", fos: "50%" }],
  },
  bucket2: {
    bucket: "90+ bucket",
    pos: ["80% POS+50% Int. Due Collected", "100% POS+35% Int. Due Collected"],
    incentive: [
      { incentive: "4% of Amount Collected", fos: "20%" },
      { incentive: "7.5% of Amount Collected", fos: "20%" },
    ],
  },
  bucket3: {
    bucket: "Write off case",
    pos: ["80% POS+35% Int. Due Collected", "100% POS+25% Int. Due Collected"],
    incentive: [
      { incentive: "8% of Amount Collected", fos: "20%" },
      { incentive: "10% of Amount Collected", fos: "20%" },
    ],
  },
};

const ForeClosureIncentive = () => {
  const [bucket, setBucket] = useState<"bucket1" | "bucket2" | "bucket3">(
    "bucket1"
  );

  const theme = useTheme();

  const handleChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    event;
    activeThumb;
    if (typeof value === "number") {
      if (value <= 50) setBucket("bucket1");
      else if (value > 50 && value < 100) setBucket("bucket2");
      else setBucket("bucket3");
    }
  };

  useEffect(() => {
    const e = {} as Event;
    handleChange(e, 0, 0);
  }, []);

  return (
    <Stack className="incentive-simulator-page" marginTop={"56px"}>
      <Box sx={{ bgcolor: "#000000", width: "max-content", padding: "12px" }}>
        <Typography color={"#ffffff"} width={"max-content"}>
          Fore Closure Incentive
        </Typography>
      </Box>
      <Stack
        bgcolor={theme.palette.primary.main}
        padding={"64px 24px 32px"}
        color={"#fff"}
        boxShadow="0px 4px 4px 0px #00000040"
      >
        <Stack
          sx={{
            height: "22px",
            position: "relative",
            background:
              "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 178, 181, 0.83) 100%)",
          }}
        >
          <Slider
            defaultValue={0}
            aria-label="Default"
            onChange={handleChange}
            sx={{ position: "absolute", zIndex: "1",bottom:"0" }}
          />
          <Stack
            alignItems={"center"}
            sx={{ position: "absolute", bottom: "-250%" }}
          >
            <Typography fontWeight={"600"} width={"50px"}>
              {data.bucket1.bucket}
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            sx={{
              position: "absolute",
              bottom: "-250%",
              left: "50%",
              transform: "translate(-50%)",
            }}
          >
            <Typography fontWeight={"600"} width={"50px"} textAlign={"center"}>
              {data.bucket2.bucket}
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            sx={{
              position: "absolute",
              bottom: "-250%",
              left: "100%",
              transform: "translate(-100%)",
            }}
          >
            <Typography fontWeight={"600"} textAlign={"right"} width={"86px"}>
              {data.bucket3.bucket}
            </Typography>
          </Stack>
        </Stack>

        <Stack marginTop={"108px"}>
          <Typography
            sx={{ textDecoration: "underline", fontFamily: "sans-serif" }}
            marginBottom={"4px"}
          >
            POS + Int. due
          </Typography>
          {data[bucket].pos.map((pos, index) => (
            <Typography key={index} fontSize={"1.25rem"} marginTop={"10px"} lineHeight={"1.25rem"}>
              {pos}
            </Typography>
          ))}
        </Stack>
        <Stack marginTop={"32px"}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography
              sx={{ textDecoration: "underline", fontFamily: "sans-serif" }}
              marginBottom={"4px"}
            >
              Incentive
            </Typography>
            <Typography
              sx={{ textDecoration: "underline", fontFamily: "sans-serif" }}
              marginBottom={"4px"}
            >
              FOs
            </Typography>
          </Stack>
          {data[bucket].incentive.map((incentive, index) => (
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography key={index} fontSize={"1.25rem"} marginTop={"10px"} lineHeight={"1.25rem"}>
                {incentive.fos}
              </Typography>
              <Typography fontSize={"1.25rem"} marginTop={"10px"} lineHeight={"1.25rem"}>{incentive.incentive}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ForeClosureIncentive;
