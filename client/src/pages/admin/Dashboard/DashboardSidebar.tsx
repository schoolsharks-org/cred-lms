import { ArrowForward } from "@mui/icons-material";
import { Button, Stack, Typography, useTheme } from "@mui/material";


interface ScorelistData {
    Name: string;
    Score: number;
  }

const DashboardSidebar = ({topScorers,belowAverageScorers}:{topScorers:ScorelistData[] | null ,belowAverageScorers:ScorelistData[]| null}) => {

  return (
    <>
      <ScoreList name={"Top Scorers"} data={topScorers} />
      <ScoreList name={"Below Average Scorers"} data={belowAverageScorers} />

      <Button
        variant="outlined"
        endIcon={<ArrowForward />}
        sx={{
          border: "2px solid #ffffff",
          color: "#fff",
          textTransform: "none",
          justifyContent: "space-between",
          fontSize: "1.25rem",
          "&:hover": {
            border: "2px solid #ffffff",
          },
        }}
      >
        Create Module
      </Button>
    </>
  );
};

export default DashboardSidebar;



const ScoreList = ({ name, data }: { name: String; data: ScorelistData[] | null}) => {
  const theme = useTheme();
  return (
    <Stack bgcolor={theme.palette.secondary.main}>
      <Typography
        bgcolor={theme.palette.primary.main}
        color={"#ffffff"}
        width={"max-content"}
        fontSize={"1.25rem"}
        padding={"5px 16px"}
      >
        {name}
      </Typography>
      <Stack gap={"5px"} padding={"20px"}>
        {data?.map((item, index) => (
          <Stack key={index} direction={"row"} gap="12px">
            <Typography>{index + 1}.</Typography>
            <Typography flex="1" fontWeight={"600"}>
              {item.Name}
            </Typography>
            <Typography>{item.Score?.toFixed(1)}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
