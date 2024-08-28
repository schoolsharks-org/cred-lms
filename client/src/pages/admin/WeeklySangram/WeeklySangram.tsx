import {
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../Header";
import { ArrowBack, ExpandMore, SaveAlt } from "@mui/icons-material";
import "./weeklySangram.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarkerCicle from "@/components/user/MarkerCicle";

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WeeklySangram = () => {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState<string>("august");
  const navigate = useNavigate();

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <Stack className="weekly-sangram-page">
      <Header />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        padding={"12px 24px"}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography fontWeight={"600"} fontSize="1.5rem">
            Weekly Sangram
          </Typography>
        </Stack>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          IconComponent={ExpandMore}
          value={selectedMonth}
          onChange={handleMonthChange}
          sx={{ color: theme.palette.text.secondary, fontSize: "1.25rem" }}
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={month.toLowerCase()}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {/* Modules */}
      <Stack padding={"0 24px"}>
        <ModuleCard
          name="Module 1 - Samuruddhi loan ka GYAN"
          date={"5th Aug"}
        />
      </Stack>
    </Stack>
  );
};

export default WeeklySangram;



interface ModuleCardProps {
  name: string;
  date: string;
}

const header = [
  { text: "Department", icon: null },
  {
    text: "Average",
    icon: (
      <Box
        sx={{
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderBottom: "14px solid #F40009",
        }}
      />
    ),
  },
  {
    text: "Sales",
    icon: (
      <MarkerCicle width="12px" color="#2874BA" left={0} positioned={true} />
    ),
  },
  {
    text: "Credit",
    icon: (
      <MarkerCicle width="12px" color="#FFDD00" left={0} positioned={true} />
    ),
  },
  {
    text: "Collections",
    icon: (
      <MarkerCicle width="12px" color="#AA75CB" left={0} positioned={true} />
    ),
  },
  {
    text: "Operations",
    icon: (
      <MarkerCicle width="12px" color="#000000" left={0} positioned={true} />
    ),
  },
  {
    text: "Others",
    icon: (
      <MarkerCicle width="12px" color="#32FF21" left={0} positioned={true} />
    ),
  },
];
const data = [
  ["Engagement", "70%", "69%", "60%", "54%", "80%", "60%"],
  ["Time", "4min", "10min", "5min", "3min", "4min", "4min"],
  ["Score", "18%", "32%", "60%", "54%", "80%", "60%"],
];
const ModuleCard: React.FC<ModuleCardProps> = ({ name, date }) => {
  const theme = useTheme();
  return (
    <Stack
      border={`2px solid ${theme.palette.primary.main}`}
      bgcolor={theme.palette.secondary.main}
      padding={"24px"}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Typography
          sx={{ textDecoration: "underline" }}
          fontSize={"1.5rem"}
          fontWeight={"600"}
        >
          {name}
        </Typography>
        <Typography
          sx={{ textDecoration: "underline" }}
          fontSize={"1.25rem"}
          fontWeight={"600"}
        >
          {date}
        </Typography>
      </Stack>

      <Stack
        height={"16px"}
        border="1px solid #000"
        bgcolor={"#fff"}
        borderRadius={"12px"}
        marginTop={"48px"}
        position={"relative"}
      >
        <MarkerCicle width="20px" color="#2874BA" left={10} />
        <MarkerCicle width="20px" color="#FFDD00" left={20} />
        <MarkerCicle width="20px" color="#AA75CB" left={30} />
        <MarkerCicle width="20px" color="#000000" left={40} />
        <MarkerCicle width="20px" color="#32FF21" left={80} />
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "20px solid #F40009",
            position: "absolute",
            bottom: "0",
            left: `${35}%`,
            transform: "translateX(-50%)",
          }}
        />

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          position={"absolute"}
          bottom={"-160%"}
          width={"100%"}
          color={theme.palette.text.secondary}
        >
          <Typography>0%</Typography>
          <Typography>50%</Typography>
          <Typography>100%</Typography>
        </Stack>
      </Stack>

      <Stack padding={"36px"} marginTop={"32px"} position={"relative"}>
        <Table sx={{zIndex:"2"}}>
          <TableHead>
            <TableRow>
              {header.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid black",
                    position: "relative",
                  }}
                >
                  <Stack direction={"row"} alignItems={"center"} gap={"12px"}>
                    {header.icon}
                    {header.text}
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    sx={{
                      fontWeight: cellIndex === 0 ? "bold" : "normal",
                      border: "1px solid black",
                    }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{position:"absolute",left:"50%",top:"50%",width:"100%",height:"100%",filter:"blur(50px)",bgcolor:"#ffffff",borderRadius:"50%",transform:"translateX(-50%) translateY(-50%) ",zIndex:"1"}}/>
      </Stack>
        <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"}>
          <Typography fontWeight={"600"} fontSize={"1.25rem"} color={theme.palette.text.secondary}>
            Download Full Report
          </Typography>
          <IconButton>
            <SaveAlt/>
          </IconButton>
      </Stack>
    </Stack>
  );
};
