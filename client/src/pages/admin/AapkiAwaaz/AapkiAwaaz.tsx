import {
    Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../Header";
import { ArrowBack, ExpandMore, SaveAlt } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./aapkiAwaaz.css";
import BarGraph from "@/components/admin/BarGraph";

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

const weeks: string[] = ["Week-1", "Week-2", "Week-3", "Week-4"];
const AapkiAwaaz = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>("august");
  const [selectedWeek, setSelectedWeek] = useState<string>("week-1");

  return (
    <Stack className="aapki-awaaz-page">
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
            Sabki Awaaz
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            IconComponent={ExpandMore}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{ color: theme.palette.text.secondary, fontSize: "1.25rem" }}
          >
            {months.map((month, index) => (
              <MenuItem key={index} value={month.toLowerCase()}>
                {month}
              </MenuItem>
            ))}
          </Select>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            IconComponent={ExpandMore}
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            sx={{ color: theme.palette.text.secondary, fontSize: "1.25rem" }}
          >
            {weeks.map((month, index) => (
              <MenuItem key={index} value={month.toLowerCase()}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
      <Stack padding={"0 24px"}>
        <AapkiAwaazCard
          date="8th Aug"
          question="Q. Which one do you think is the most appropriate? "
          departments={{
            Sales: { OptionA: 70, OptionB: 30 },
            Collections: { OptionA: 70, OptionB: 30 },
            Credit: { OptionA: 70, OptionB: 30 },
            Operations: { OptionA: 70, OptionB: 30 },
            Others: { OptionA: 70, OptionB: 30 },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default AapkiAwaaz;

interface ModuleCardProps {
  date: string;
  question: string;
  departments: {
    Sales: { OptionA: number; OptionB: number };
    Credit: { OptionA: number; OptionB: number };
    Collections: { OptionA: number; OptionB: number };
    Operations: { OptionA: number; OptionB: number };
    Others: { OptionA: number; OptionB: number };
  };
}
const AapkiAwaazCard: React.FC<ModuleCardProps> = ({
  date,
  question,
  departments,
}) => {
  const theme = useTheme();
  return (
    <Stack
      padding={"12px"}
      border={`2px solid ${theme.palette.primary.main}`}
      bgcolor={theme.palette.secondary.main}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography
          fontWeight={"600"}
          fontSize={"1.25rem"}
          color={theme.palette.text.secondary}
        >
          {date}
        </Typography>
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent={"flex-end"}
        >
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
      <Stack padding={"36px 36px 12px"} gap={"24px"}>
        <Typography fontSize={"1.5rem"} fontWeight={"600"}>
          {question}
        </Typography>
        <Stack minHeight={"360px"}>
          <BarGraph data={departments} />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack direction={"row"} gap={"20px"}>
                <Typography fontWeight={"500"} color={theme.palette.text.secondary} fontSize={"1.25rem"}>Voted - 650</Typography>
                <Typography fontWeight={"500"} color={theme.palette.text.secondary} fontSize={"1.25rem"}>Did'nt Vote - 50</Typography>
            </Stack>
            <Stack direction={"row"} gap={"20px"}>
                <Stack direction={"row"} gap={"5px"} fontSize={"1.25rem"}>
                    <Box width="24px" height="24px" bgcolor={"#D53951"} />
                    <Typography fontWeight={"700"}>YES</Typography>
                </Stack>
                <Stack direction={"row"} gap={"5px"} fontSize={"1.25rem"}>
                    <Box width="24px" height="24px" bgcolor={"#000000"} />
                    <Typography fontWeight={"700"}>NO</Typography>
                </Stack>
            </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
