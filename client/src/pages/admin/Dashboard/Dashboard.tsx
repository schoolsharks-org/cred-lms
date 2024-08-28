import { ArrowForward, SaveAlt, Search, Settings } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const departments = ["Sales", "Credit", "Collection", "Operations", "Others"];

const data = [
  {
    name: "Total no. of \nemployees",
    data: [500, 450, 200, 350, 100],
  },
  {
    name: "Inactive \nlast 7 days",
    data: [500, 450, 200, 350, 100],
  },
  {
    name: "Inactive \nlast 15 days",
    data: [500, 450, 200, 350, 100],
  },
  {
    name: "No. of weekly \nmodules",
    data: [500, 450, 200, 350, 100],
  },
  {
    name: "Modules \ncompleted",
    data: [500, 450, 200, 350, 100],
  },
];

const scorelist = [
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
  { name: "Karan Verma", percentage: 95 },
];
const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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

      <Stack direction={"row"} padding={"20px"} gap="20px">
        <Stack flex={"1"} paddingTop={"32px"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography color={"#fff"} fontWeight={"500"}>
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
                <TableCell key={index} text={department} bold={true} />
              ))}
            </Stack>
            {data.map((row, index) => (
              <Stack
                flex={"1"}
                key={index}
                direction={"row"}
                gap={"10px"}
                bgcolor={"#FFB2B5"}
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
              onClick={()=>navigate("/admin/sabki-awaaz")}
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
              onClick={()=>navigate("/admin/weekly-sangram")}
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
          <ScoreList name={"Top Scorers"} data={scorelist} />
          <ScoreList name={"Below Average Scorers"} data={scorelist.slice(5)} />
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
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;

const TableCell = ({ text, bold }: { text: string; bold?: boolean }) => (
  <Stack
    border={"1px solid #000"}
    padding={"12px 16px"}
    alignItems={"center"}
    justifyContent={"center"}
    flex={"1"}
    sx={{ borderWidth: "0 1px 0 1px" }}
  >
    <Typography
      fontWeight={bold ? "700" : "500"}
      sx={{ whiteSpace: "pre-line", width: "100%" }}
    >
      {text}
    </Typography>
  </Stack>
);

interface ScorelistData {
  name: string;
  percentage: number;
}

const ScoreList = ({ name, data }: { name: String; data: ScorelistData[] }) => {
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
        {data.map((_, index) => (
          <Stack key={index} direction={"row"} gap="12px">
            <Typography>{index + 1}.</Typography>
            <Typography flex="1" fontWeight={"600"}>
              Karan Verma
            </Typography>
            <Typography>95%</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
