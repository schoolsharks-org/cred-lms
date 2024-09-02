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
import useWeeklyStats from "@/hooks/admin/useWeeklyStats";
import Loader from "@/components/Loader";

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
  const currentYear = new Date().getFullYear();
  const monthIndex =
    months.findIndex((month) => month.toLowerCase() === selectedMonth) + 1;
  const { data, loading } = useWeeklyStats(monthIndex, currentYear);

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value);
  };

  if (loading) {
    return <Loader />;
  }

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
        {!data.length ? <Typography>No Data Available</Typography> : null}
        {data.map((module, index) => (
          <ModuleCard
            key={index}
            name={"Module " + (index + 1) + "-" + module.moduleName}
            data={module.departmentStats}
            date={module.date}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default WeeklySangram;

interface ModuleCardProps {
  name: string;
  date: string;
  data: any[];
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
    text: "Collection",
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

const ModuleCard: React.FC<ModuleCardProps> = ({ name, date, data }) => {
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

      {/* Update Table Structure Here */}
      <Stack padding={"36px"} marginTop={"32px"} position={"relative"}>
        <Table sx={{ zIndex: "2" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>
                Departments
              </TableCell>
              {data.map((item, index) => {
                const col = header.find(
                  (headerItem) => headerItem.text === item.department
                );
                return (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: "bold",
                      border: "1px solid black",
                      position: "relative",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={"12px"}
                    >
                      {col?.icon}
                      {col?.text}
                    </Stack>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>
                Engagement
              </TableCell>
              {data.map((item, index) => (
                <TableCell
                  align="center"
                  key={index}
                  sx={{ border: "1px solid black" }}
                >
                  {item.engagement}%
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>
                Time
              </TableCell>
              {data.map((item, index) => (
                <TableCell
                  align="center"
                  key={index}
                  sx={{ border: "1px solid black" }}
                >
                  {item.averageTime !== "NaN:NaN" ? item.averageTime : "N/A"}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid black" }}>
                Score
              </TableCell>
              {data.map((item, index) => (
                <TableCell
                  align="center"
                  key={index}
                  sx={{ border: "1px solid black" }}
                >
                  {item.averageScore !== null ? item.averageScore : "N/A"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            height: "100%",
            filter: "blur(50px)",
            bgcolor: "#ffffff",
            borderRadius: "50%",
            transform: "translateX(-50%) translateY(-50%) ",
            zIndex: "1",
          }}
        />
      </Stack>

      <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"}>
        <Typography
          fontWeight={"600"}
          fontSize={"1.25rem"}
          color={theme.palette.text.secondary}
        >
          Download Full Report
        </Typography>
        <IconButton>
          <SaveAlt />
        </IconButton>
      </Stack>
    </Stack>
  );
};
