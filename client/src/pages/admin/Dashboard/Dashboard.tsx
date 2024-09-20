import useAdminDashboard from "@/hooks/admin/useAdminDashboard";
import { SaveAlt, Search, Settings } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import Loader from "@/components/Loader";
import MarkerCicle from "@/components/user/MarkerCicle";
import {BLACK,BLUE,GREEN,PURPLE,YELLOW} from "@/utils/departmentColors"

// const departments = ["Sales", "Credit", "Collection", "Operations", "Others"];
const departments = [
  { name: "Sales" ,icon:<MarkerCicle color={YELLOW} width={"16px"} left={0} positioned={true} bordered={true}/>},
  { name: "Credit" ,icon:<MarkerCicle color={BLUE} width={"16px"} left={0} positioned={true} bordered={true}/>},
  { name: "Collection",icon:<MarkerCicle color={PURPLE} width={"16px"} left={0} positioned={true} bordered={true}/> },
  { name: "Operations",icon:<MarkerCicle color={BLACK} width={"16px"} left={0} positioned={true} bordered={false}/> },
  { name: "Others" ,icon:<MarkerCicle color={GREEN} width={"16px"} left={0} positioned={true} bordered={false}/>},
];

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    fetchDashboardData,
    topScorers,
    belowAverageScorers,
    dashboardData: data,
    loading,
  } = useAdminDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack bgcolor={theme.palette.primary.main} minHeight={"100vh"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"0px 20px"}
      >
        <Typography color={"#fff"} fontSize={"3rem"} fontWeight={"600"}>
          Admin Screen
        </Typography>
        <Stack direction={"row"} height={"max-content"} gap={"10px"}>
          <IconButton>
            <SaveAlt sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <Search sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <Settings sx={{ color: "#fff" }} />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction={"row"} padding={"8px 20px"} gap="20px">
        <Stack flex={"1"} paddingTop={"32px"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography color={"#fff"} fontSize={"1.25rem"} fontWeight={"600"}>
              Matrix
            </Typography>
            <Stack direction={"row"} alignItems="center">
              <Typography color={"#fff"} fontWeight={"500"}>
                Download Full Report
              </Typography>
              <IconButton>
                <SaveAlt sx={{ color: "#fff" }} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack bgcolor={"#fff"} gap={"10px"} flex={"1"}>
            <Stack
              direction={"row"}
              gap={"10px"}
              bgcolor={"#FFB2B5"}
              border={"1px solid #000"}
              sx={{ borderWidth: "1px 0 1px 0" }}
            >
              <TableCell text={"Department"} bold={true} />
              {departments.map((department, index) => (
                <TableCell key={index} text={department.name} bold={true} startIcon={department.icon}/>
              ))}
            </Stack>
            {data.map((row, index) => (
              <Stack
                flex={"1"}
                key={index}
                direction={"row"}
                gap={"10px"}
                bgcolor={index > 4 ? "#D0C5C5" : "#FFB2B5"}
                border={"1px solid #000"}
                sx={{ borderWidth: "1px 0 1px 0" }}
              >
                <TableCell text={row.name} />
                {row.data.map((item, index) => (
                  <TableCell key={index} text={item.toString()} />
                ))}
              </Stack>
            ))}
          </Stack>
          <Stack direction={"row"} marginTop={"10px"} gap={"10px"}>
            <Button
              variant="contained"
              onClick={() => navigate("/admin/sabki-awaaz")}
              sx={{
                bgcolor: theme.palette.secondary.main,
                padding: "16px",
                flex: "1",
                color: "#000",
                textTransform: "none",
                alignItems: "flex-start",
                flexDirection: "column",
                borderRadius: "0",
                "&:hover": {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
            >
              <Typography fontSize={"1.5rem"} fontWeight={"700"}>
                Sabki Awaaz
              </Typography>
              <Typography>Summary</Typography>
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/admin/weekly-sangram")}
              sx={{
                bgcolor: theme.palette.secondary.main,
                padding: "16px",
                flex: "1",
                color: "#000",
                textTransform: "none",
                alignItems: "flex-start",
                flexDirection: "column",
                borderRadius: "0",
                "&:hover": {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
            >
              
              <Typography fontSize={"1.5rem"} fontWeight={"700"}>
                Weekly Sangram
              </Typography>
              <Typography>Summary</Typography>
            </Button>
          </Stack>
        </Stack>
        <Stack minWidth={"376px"} gap="20px">
          <DashboardSidebar
            topScorers={topScorers}
            belowAverageScorers={belowAverageScorers}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;

const TableCell = ({
  text,
  bold,
  startIcon,
}: {
  text: string;
  bold?: boolean;
  startIcon?: any;
}) => (
  <Stack
    direction={"row"}
    border={"1px solid #000"}
    padding={"8px 16px"}
    alignItems={"center"}
    justifyContent={"center"}
    flex={"1"}
    minHeight={"64px"}
    gap={"8px"}
    sx={{ borderWidth: "0 1px 0 1px" }}
  >
    {startIcon}
    <Typography
      fontWeight={bold ? "700" : "500"}
      sx={{ whiteSpace: "pre-line", width: "100%" }}
    >
      {text}
    </Typography>
  </Stack>
);
