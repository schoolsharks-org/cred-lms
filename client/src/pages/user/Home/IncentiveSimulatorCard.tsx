import { Button, Stack, Typography } from "@mui/material";
import rupeeIcon from "@/assets/icons/rupee-symbol.svg";
import { CallMade } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const IncentiveSimulatorCard = () => {
    const navigate=useNavigate()
  const{department}=useSelector((state:RootState)=>state.user)

  if(!["Sales","Collections"].includes(department)){
    return null;
  }
  return (
    <Button
      variant="contained"
      onClick={()=>navigate("/incentive-simulator")}
      sx={{ border: "2px solid #000", marginTop: "48px", padding: "20px 16px",textTransform:"none",borderRadius:"0"  }}
    >
      <Stack width={"100%"} height={"100%"}>
        <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
          <img src={rupeeIcon} alt="" style={{ width:"32px"}} />
          <Typography fontSize={"1.8rem"} fontWeight={"700"} sx={{width:"max-content"}}>
            Incentive Calculator
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          gap={"10px"}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Typography fontSize={"1.25rem"}>Checkout your bonus!</Typography>
          <CallMade sx={{ fontSize: "2rem" }} />
        </Stack>
      </Stack>
    </Button>
  );
};

export default IncentiveSimulatorCard;
