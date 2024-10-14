import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { getTrackLevels } from "@/store/user/userActions";
import Loader from "@/components/Loader";
import { ArrowCircleDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

enum moduleStatuses {
  TO_BE_LAUNCHED = "TO_BE_LAUNCHED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  MISSED="MISSED"
}

const TrackLevels = () => {
  const theme = useTheme();
  const [trackLevels, setTrackLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMoreExpanded, setViewMoreExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrackLevels = async () => {
      try {
        const response = await getTrackLevels();
        setTrackLevels(response);

      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to fetch track levels"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrackLevels();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Stack
      bgcolor={theme.palette.secondary.main}
      marginTop={"40px"}
      padding={"16px"}
    >
      <Typography fontSize={"1.8rem"} fontWeight={"600"}>
        Track Levels
      </Typography>
      <Stack marginTop={"48px"} gap={"24px"}>
        {trackLevels?.slice(0, 1)?.map((month, index) => (
          <TrackLevelsItem key={index} month={month} />
        ))}

        <Accordion
          expanded={viewMoreExpanded}
          onChange={()=>setViewMoreExpanded((prev) => !prev)}
          sx={{ background: "transparent", boxShadow: "none" }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowCircleDown sx={{ fontSize: "1.5rem", color: "#000000" }} />
            }
            sx={{
              borderTop: "2px",
              borderColor: "#000000",
              borderStyle: "solid",
            }}
          >
            <Stack>
              <Typography color={"#000000"}>{viewMoreExpanded?"View less":"View more"}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {trackLevels?.slice(1).map((month, index) => (
              <TrackLevelsItem key={index} month={month} />
            ))}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );
};

export default TrackLevels;

const TrackLevelsItem = ({ month }: { month: any }) => {
  const theme = useTheme();
  const navigate=useNavigate()

  const handleRedirectToReview=({date,status}:{date:string,status:moduleStatuses})=>{
    const weekDate = new Date(date); 
    const today=new Date()
    if(weekDate<=today && status != moduleStatuses.IN_PROGRESS && status != moduleStatuses.TO_BE_LAUNCHED){
      navigate(`/weekly-questions-review?date=${date}`)
    }
  }
  return (
    <Stack direction={"row"} gap={"16px"}>
      <Stack padding={"10px 4px"}>
        <Typography fontWeight={"700"}>{month.month}</Typography>
      </Stack>
      <Stack
        bgcolor={theme.palette.primary.main}
        padding={"10px 4px"}
        alignItems={"center"}
      >
        {month.weeks.map((week: any, weekIndex: number) => (
          <React.Fragment key={weekIndex}>
            <Box
              width={"24px"}
              height={"24px"}
              border={`2px solid #FFB2B5`}
              bgcolor={
                week.status === moduleStatuses.COMPLETED
                  ? "#FFB2B5"
                  : "transparent"
              }
              sx={{cursor:"pointer"}}
              onClick={()=>handleRedirectToReview({date:week.date,status:week.status})}
            />
            {weekIndex !== month.weeks.length - 1 ? (
              <Box width={"2px"} height={"24px"} bgcolor={"#FFB2B5"} />
            ) : null}
          </React.Fragment>
        ))}
      </Stack>
      <Stack>
        {month.weeks.map((week: any, weekIndex: number) => (
          <Stack
            direction={"row"}
            key={weekIndex}
            alignItems={"center"}
            flex={"1"}
            gap={"4px"}
          >
            <Typography fontWeight={"700"}>{week.week}</Typography>
            <Typography
              fontSize={"0.75rem"}
              fontWeight={"500"}
              color={
                week.status === moduleStatuses.TO_BE_LAUNCHED
                  ? theme.palette.text.secondary
                  : week.status === moduleStatuses.COMPLETED
                  ? theme.palette.primary.main
                  : "(In Progress)"
              }
            >
              {week.status === moduleStatuses.TO_BE_LAUNCHED
                ? "(To be launched)"
                : week.status === moduleStatuses.COMPLETED
                ? "(Completed)"
                : week.status === moduleStatuses.MISSED?
                  "(Missed)"
                : "(In Progress)"}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
