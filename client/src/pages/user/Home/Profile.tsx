import {
  Stack,
  Typography,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import badge from "../../../assets/user/weekly-question-badge.png";
import EditIcon from "@mui/icons-material/Edit";

const badges = [
  {
    name: "Microfinance Star",
    completion: 50,
    icon: badge,
    unlocked:true
  },
  {
    name: "Microfinance Star",
    completion: 100,
    icon: badge,
    unlocked:true
  },
  {
    name: "Microfinance Star",
    completion: 50,
    icon: badge,
    unlocked:false
  },
  {
    name: "Microfinance Star",
    completion: 50,
    icon: badge,
    unlocked:false
  },
  {
    name: "Microfinance Star",
    completion: 50,
    icon: badge,
    unlocked:false
  },
  {
    name: "Microfinance Star",
    completion: 50,
    icon: badge,
    unlocked:false
  },
];
const Profile = () => {
  const theme = useTheme();
  const { name, email, address, department, score } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <Stack height={"100vh"}>
      <Stack width={"max-content"} padding={"12px"}>
        <Typography fontSize={"2rem"} fontWeight={"600"}>
          Profile
        </Typography>
        <Box
          sx={{
            height: "4px",
            borderRadius: "8px",
            bgcolor: theme.palette.primary.main,
            marginTop: "4px",
          }}
        />
      </Stack>

      <Stack flex={"1"}>
        <Stack
          direction={"column"}
          padding={"30px"}
          marginTop={"10px"}
          bgcolor={theme.palette.secondary.main}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontWeight={"700"} fontSize={"20px"}>
              Personal Details
            </Typography>
            <IconButton>
              <EditIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Stack>

          <Typography
            width={"max-content"}
            fontWeight={"500"}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            borderBottom={"1px solid #00000080 "}
            fontSize={"15px"}
          >
            Name - {name}
          </Typography>
          <Typography
            width={"max-content"}
            fontWeight={"500"}
            borderBottom={"1px solid #00000080 "}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            fontSize={"15px"}
          >
            Email - {email}
          </Typography>
          <Typography
            width={"max-content"}
            fontWeight={"500"}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            borderBottom={"1px solid #00000080 "}
            fontSize={"15px"}
          >
            Department - {department}
          </Typography>
          <Typography
            width={"max-content"}
            fontWeight={"500"}
            borderBottom={"1px solid #00000080 "}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            fontSize={"15px"}
          >
            Address - {address}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          marginTop={"20px"}
          padding={"15px"}
          justifyContent={"space-between"}
          bgcolor={theme.palette.secondary.main}
          fontSize={"20px"}
        >
          <Typography fontWeight={"700"} fontSize={"1.25rem"}>
            Total Points Earned
          </Typography>
          <Typography fontWeight={"700"} fontSize={"1.25rem"}>
            {score}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          borderTop={"1px solid #00000080 "}
          padding={"15px"}
          justifyContent={"space-between"}
          bgcolor={theme.palette.secondary.main}
          fontSize={"20px"}
        >
          <Typography fontWeight={"700"} fontSize={"1.25rem"}>
            Total Points Redeemed
          </Typography>
          <Typography fontWeight={"700"} fontSize={"1.25rem"}>
            0p
          </Typography>
        </Stack>
        <Stack
          margin={"20px 0 128px"}
          padding={"20px"}
          justifyContent={"center"}
          bgcolor={theme.palette.secondary.main}
        >
          <Typography fontWeight={"800"} fontSize={"1.25rem"}>
            Badges
          </Typography>
          <Stack direction={"row"} flexWrap={"wrap"} gap={"12px"} marginTop={"12px"}>
            {badges.map((badge,index)=>(
              <Stack key={index} bgcolor={badge.unlocked?"#fff":"#C9C9C9"} alignItems={"center"} flexGrow={"1"} padding={"20px"} boxShadow={badge.unlocked?"0 0 10px #0000003c":"none"} sx={{ filter: badge.unlocked ? "none" : "grayscale(100%)" }}>
                <Typography color={"#363636"} fontWeight={"700"}>{badge.name}</Typography>
                <img src={badge.icon} alt="" style={{width:"100%",maxWidth:"120px"}}/>
                <Stack width={"100%"} marginTop="12px">
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    {badge.completion===100?<Typography margin="auto" fontSize={"12px"} fontWeight={"600"}>Completed 100%</Typography>:
                    <>
                    <Typography fontSize={"12px"} fontWeight={"600"}>Next</Typography>
                    <Typography fontSize={"12px"} fontWeight={"600"}>{badge.completion}%</Typography>
                    </>
                    }
                  </Stack>
                  <Stack height="5px" bgcolor={"#6A6464"} borderRadius={"12px"} sx={{overflow:"hidden"}} >
                    <Stack height={"100%"} width={`${badge.completion}%`} bgcolor={theme.palette.primary.main}></Stack>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Profile;
