import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { getTrackLevels } from "@/store/user/userActions";
import Loader from "@/components/Loader";

enum moduleStatuses {
  TO_BE_LAUNCHED = "TO_BE_LAUNCHED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

const TrackLevels = () => {
  const theme = useTheme();
  const [trackLevels, setTrackLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackLevels = async () => {
      try {
        const response = await getTrackLevels();
        setTrackLevels(response); 
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch track levels");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackLevels();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Stack bgcolor={theme.palette.secondary.main} marginTop={"40px"} padding={"16px"}>
      <Typography fontSize={"1.8rem"} fontWeight={"600"}>Track Levels</Typography>
      <Stack marginTop={"48px"} gap={"24px"}>
        {trackLevels?.map((month, index) => (
          <Stack key={index} direction={"row"} gap={"16px"}>
            <Stack padding={"10px 4px"}>
              <Typography fontWeight={"700"}>{month.month}</Typography>
            </Stack>
            <Stack bgcolor={theme.palette.primary.main} padding={"10px 4px"} alignItems={"center"}>
              {month.weeks.map((week:any, weekIndex:number) => (
                <React.Fragment key={weekIndex}>
                  <Box
                    width={"24px"}
                    height={"24px"}
                    border={`2px solid #FFB2B5`}
                    bgcolor={week.status === moduleStatuses.COMPLETED ? "#FFB2B5" : "transparent"}
                  />
                  {weekIndex !== month.weeks.length - 1 ? <Box width={"2px"} height={"24px"} bgcolor={"#FFB2B5"} /> : null}
                </React.Fragment>
              ))}
            </Stack>
            <Stack>
              {month.weeks.map((week:any, weekIndex:number) => (
                <Stack direction={"row"} key={weekIndex} alignItems={"center"} flex={"1"} gap={"4px"}>
                  <Typography fontWeight={"700"}>{week.week}</Typography>
                  <Typography fontSize={"0.75rem"} fontWeight={"500"} color={week.status === moduleStatuses.TO_BE_LAUNCHED ? theme.palette.text.secondary : week.status===moduleStatuses.COMPLETED?theme.palette.primary.main:"(In Progress)"}>
                    {week.status === moduleStatuses.TO_BE_LAUNCHED ? "(To be launched)" : week.status===moduleStatuses.COMPLETED?"(Completed)":"(In Progress)"}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default TrackLevels;
