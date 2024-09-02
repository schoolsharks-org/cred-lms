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
import useDailyStats from "@/hooks/admin/useDailyStats";

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
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()].toLowerCase()
  );
  const [selectedWeek, setSelectedWeek] = useState<string>(
    `week-${Math.min(Math.ceil(new Date().getDate() / 7), 4)}`
  );
  const monthIndex =
    months.findIndex((month) => month.toLowerCase() === selectedMonth) + 1;

  const weekIndex =
    weeks.findIndex((week) => week.toLowerCase() === selectedWeek) + 1;

  const { data, loading } = useDailyStats(monthIndex, weekIndex);

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

        {!data || !data.length?<Typography textAlign={"center"}>No Data Available</Typography>:null}
      <Stack padding={"0 24px"} gap={"48px"}>
        {data && data.map((item,index) => (
          <AapkiAwaazCard
             key={index}
            date={item.date}
            question={"Q-"+(index+1) +" "+ item.question}
            departments={item.stats}
            voted={item.Voted}
            notVoted={item.NotVoted}
          />
        ))}
        {/* <AapkiAwaazCard
          date="8th Aug"
          question="Q. Which one do you think is the most appropriate? "
          departments={{
            Sales: { OptionA: 70, OptionB: 30 },
            Collections: { OptionA: 70, OptionB: 30 },
            Credit: { OptionA: 70, OptionB: 30 },
            Operations: { OptionA: 70, OptionB: 30 },
            Others: { OptionA: 70, OptionB: 30 },
          }}
        /> */}
      </Stack>
    </Stack>
  );
};

export default AapkiAwaaz;

interface ModuleCardProps {
  date: string;
  question: string;
  voted:number;
  notVoted:number;
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
  voted,
  notVoted
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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack direction={"row"} gap={"20px"}>
            <Typography
              fontWeight={"500"}
              color={theme.palette.text.secondary}
              fontSize={"1.25rem"}
            >
              Voted - {voted}
            </Typography>
            <Typography
              fontWeight={"500"}
              color={theme.palette.text.secondary}
              fontSize={"1.25rem"}
            >
              Did'nt Vote - {notVoted}
            </Typography>
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
