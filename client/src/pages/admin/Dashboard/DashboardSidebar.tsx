import MarkerCicle from "@/components/user/MarkerCicle";
import { BLACK, BLUE, GREEN, PURPLE, YELLOW } from "@/utils/departmentColors";
import { ArrowForward } from "@mui/icons-material";
import { Button, Stack, Typography, useTheme } from "@mui/material";



type Department="Sales"|"Collection"|"Credit"|"Operations"|"Others"

interface ScorelistData {
    Name: string;
    Department:Department
    Score: number;
  }



  const departments = [
    { name: "Sales" ,icon:<MarkerCicle color={YELLOW} width={"16px"} left={0} positioned={true} bordered={false}/>},
    { name: "Credit" ,icon:<MarkerCicle color={BLUE} width={"16px"} left={0} positioned={true} bordered={false}/>},
    { name: "Collection",icon:<MarkerCicle color={PURPLE} width={"16px"} left={0} positioned={true} bordered={false}/> },
    { name: "Operations",icon:<MarkerCicle color={BLACK} width={"16px"} left={0} positioned={true} bordered={false}/> },
    { name: "Others" ,icon:<MarkerCicle color={GREEN} width={"16px"} left={0} positioned={true} bordered={false}/>},
  ];

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
        fontWeight={"500"}
      >
        {name}
      </Typography>
      <Stack gap={"5px"} padding={"20px"}>
        {data?.map((item, index) => (
          <Stack key={index} direction={"row"} gap="12px" alignItems={"center"}>
            <Typography width={"0.4rem"}>{index + 1}.</Typography>
            {departments.filter((dep)=>dep.name===item.Department)[0].icon}
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
