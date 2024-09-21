import {
    Box,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./../IncentiveSimulator.css";

type Categories = "week-1" | "week-2" | "week-3" | "week-4";

const data = {
  "week-1": {
    target1: { target: 15, incentive: 3000, position: 33.33 },
    target2: { target: 18, incentive: 3500, position: 66.66 },
    target3: { target: 21, incentive: 4000, position: 100 },
    startValue: 12,
    endValue: 21,
  },
  "week-2": {
    target1: { target: 55, incentive: 4000, position: 33.33 },
    target2: { target: 60, incentive: 4500, position: 66.66 },
    target3: { target: 65, incentive: 5000, position: 100 },
    startValue: 50,
    endValue: 65,
  },
  "week-3": {
    target1: { target: 85, incentive: 5000, position: 37.5 },
    target2: { target: 88, incentive: 5500, position: 75 },
    target3: { target: 90, incentive: 6000, position: 100 },
    startValue: 82,
    endValue: 90,
  },
  "week-4": {
    target1: { target: 95, incentive: 6000, position: 37.5 },
    target2: { target: 98, incentive: 6500, position: 75 },
    target3: { target: 100, incentive: 7000, position: 100 },
    startValue: 92,
    endValue: 100,
  },
};
const IncentiveMain = () => {
  const [category, setCategory] = useState<Categories>("week-1");
  const [target, setTarget] = useState<string>("");
  const [incentive, setIncentive] = useState<number>();

  const theme = useTheme();
  // const startValue=15
  // const endValue=20

  const handleChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    event;
    activeThumb;

    if (typeof value === "number") {
      const n =
        data[category].startValue +
        (value / 100) * (data[category].endValue - data[category].startValue);
      setTarget(n.toFixed(0));

      const targetValue = n;
      if (targetValue < data[category].target1.target) {
        setIncentive(0);
      } else if (
        targetValue >= data[category].target1.target &&
        targetValue < data[category].target2.target
      ) {
        setIncentive(data[category].target1.incentive);
      } else if (
        targetValue >= data[category].target2.target &&
        targetValue < data[category].target3.target
      ) {
        setIncentive(data[category].target2.incentive);
      } else if (targetValue >= data[category].target3.target) {
        setIncentive(data[category].target3.incentive);
      }
    }
  };

  useEffect(() => {
    const e = {} as Event;
    handleChange(e, 50, 50);
  }, []);

  return (
    <Stack className="incentive-simulator-page" marginTop={"56px"}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={category}
        label="Category"
        onChange={(e) => setCategory(e.target.value as Categories)}
      >
        <MenuItem value={"week-1"}>Week 1</MenuItem>
        <MenuItem value={"week-2"}>Week 2</MenuItem>
        <MenuItem value={"week-3"}>Week 3</MenuItem>
        <MenuItem value={"week-4"}>Week 4</MenuItem>
      </Select>
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
            defaultValue={50}
            aria-label="Default"
            onChange={handleChange}
            sx={{ position: "absolute", zIndex: "1",bottom:"0" }}
          />
          <Stack
            alignItems={"center"}
            sx={{ position: "absolute", bottom: "-150%" }}
          >
            <Typography fontWeight={"600"}>
              {data[category].startValue}%
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            sx={{
              position: "absolute",
              bottom: "-150%",
              left: `${data[category].target1.position}%`,
              transform: `translateX(-50%)`,
            }}
          >
            <Typography fontWeight={"600"}>
              {data[category].target1.target}%
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            sx={{
              position: "absolute",
              bottom: "-150%",
              left: `${data[category].target2.position}%`,
              transform: `translateX(-50%)`,
            }}
          >
            <Typography fontWeight={"600"}>
              {data[category].target2.target}%
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            sx={{
              position: "absolute",
              bottom: "-150%",
              left: `${data[category].target3.position}%`,
              transform: `translateX(-${data[category].target3.position}%)`,
            }}
          >
            <Typography fontWeight={"600"}>
              {data[category].target3.target}%
            </Typography>
          </Stack>
        </Stack>

        <Stack alignItems={"center"} marginTop={"56px"} gap={"5px"}>
            <Box sx={{width:"90%",height:"0.5px",bgcolor:"#ffffff79"}}/>
            <Typography fontSize={"0.625rem"}>of Field Allocation</Typography>
        </Stack>
        <Stack
          direction={"row"}
          marginTop={"34px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack>
            <Typography
              sx={{ textDecoration: "underline", fontFamily: "sans-serif" }}
            >
              Target
            </Typography>
            <Typography fontSize={"0.5rem"}>
              (0 to Infinity Bucket)
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: "300" ,lineHeight:"2.9rem"}}>
              {target} %
            </Typography>
            <Typography fontSize={"0.625rem"}>
                of field allocation
            </Typography>
          </Stack>
          <Stack alignItems={"flex-end"}>
            <Typography sx={{ textDecoration: "underline", fontFamily: "sans-serif" }}>Incentive</Typography>
            <Typography fontSize={"1.5rem"}>
              <span style={{ fontSize: "2.5rem", fontWeight: "300" }}>
                {incentive}
              </span>{" "}
              ₹
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default IncentiveMain;
