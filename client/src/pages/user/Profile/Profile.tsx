import {
  Stack,
  Typography,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import badge1 from "../../../assets/badges/badge-1.png";
import badge2 from "../../../assets/badges/badge-2.png";
import EditIcon from "@mui/icons-material/Edit";
import certificateImage1 from "@/assets/certificates/certificate-1.png"
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const badges = [
  {
    name: "Microfinance Star",
    completion: 0,
    icon: badge2,
    unlocked:false
  },
  {
    name: "Client Relationship Master",
    completion: 0,
    icon: badge2,
    unlocked:false
  }
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
            <Typography fontWeight={"700"} fontSize={"1.5rem"}>
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
          margin={"20px 0"}
          padding={"20px"}
          justifyContent={"center"}
          bgcolor={theme.palette.secondary.main}
        >
          <Typography fontWeight={"800"} fontSize={"1.25rem"}>
            Badges
          </Typography>
          <Stack direction={"row"} flexWrap={"wrap"} gap={"12px"} marginTop={"12px"}>
            {badges.map((badge,index)=>(
              <Stack flex={"1"} key={index} bgcolor={badge.unlocked?"#fff":"#C9C9C9"} alignItems={"center"} flexGrow={"1"} padding={"20px"} boxShadow={badge.unlocked?"0 0 10px #0000003c":"none"} sx={{ filter: badge.unlocked ? "none" : "grayscale(100%)" }}>
                <Typography color={"#363636"} fontWeight={"700"} textAlign={"center"}>{badge.name}</Typography>
                <img src={badge.icon} alt="" style={{width:"100%",maxWidth:"120px",marginTop:"15px"}}/>
                <Stack width={"100%"} marginTop="12px"flex={"1"}>
                  <Stack direction={"row"} justifyContent={"space-between"} marginTop={"auto"}>
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
      <Stack bgcolor={theme.palette.secondary.main} marginBottom={"128px"} padding={"20px"}>
        <Typography fontWeight={"800"} fontSize={"1.25rem"}>Certificates</Typography>
        <img src={certificateImage1} alt="" style={{marginTop:"16px"}} />
        <Stack direction="row" gap={"16px"} justifyContent={"center"} alignItems={"center"}>
          <ArrowBack sx={{color:theme.palette.text.secondary,fontSize:"1rem"}}/>
          <Typography color={theme.palette.text.secondary}>Swipe</Typography>
          <ArrowForward sx={{color:theme.palette.text.secondary,fontSize:"1rem"}}/>
        </Stack>
      </Stack>
      </Stack>
    </Stack>
  );
};

export default Profile;
