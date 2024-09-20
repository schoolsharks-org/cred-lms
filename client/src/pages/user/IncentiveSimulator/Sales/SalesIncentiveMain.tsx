import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import IncentiveMain from "./IncentiveMain";
import "./../IncentiveSimulator.css";
import PragatiScheme from "./PragatiScheme";
import { useNavigate } from "react-router-dom";

const importantNotes=[
  "Payment process - To be paid in 3 months equal installments",
  "Monthly target as per Pragati Scheme."
]
const SalesIncentiveMain = () => {
  const theme = useTheme();
  const navigate=useNavigate()

  return (
    <Stack className="incentive-simulator-page">
      <Stack direction={"row"} marginTop={"24px"}>
        <Stack>
          <IconButton onClick={()=>navigate(-1)}>
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
            Incentive Simulator
          </Typography>
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              height: "4px",
              borderRadius: "12px",
              width: "90%",
            }}
          />
          <Typography fontSize={"1.25rem"} fontWeight={"500"} maxWidth={"90%"}>
            Choose the category to know your incentive.
          </Typography>
        </Stack>
      </Stack>

      <IncentiveMain />
      <PragatiScheme/>

      <Stack gap={"10px"} margin={"40px 0"}>
        {importantNotes.map((note,index)=><Stack key={index} bgcolor={"#FFB2B5D4"} padding="8px 14px"><Typography fontSize={"1.25rem"} fontWeight={"600"}>• {note}</Typography></Stack>)}
      </Stack>
    </Stack>
  );
};

export default SalesIncentiveMain;
