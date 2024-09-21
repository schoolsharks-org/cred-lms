import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CallMade, VisibilityOutlined } from "@mui/icons-material";

const HelpSectionCard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
      variant="contained"
      onClick={()=>navigate("/zaroor-dekho")}
      sx={{ border: "2px solid #000", marginTop: "48px", padding: "20px 16px",textTransform:"none",borderRadius:"0" }}
    >
      <Stack width={"100%"} height={"100%"}>
        <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
          <Typography fontSize={"1.8rem"} fontWeight={"700"} sx={{width:"max-content"}}>
            Zaroor Dekho
          </Typography>
          <VisibilityOutlined sx={{fontSize:"2.8rem"}}/>
        </Stack>
        <Stack
          direction={"row"}
          gap={"16px"}
          justifyContent={"flex-end"}
        >
          <Typography fontSize={"1.25rem"} textAlign={"left"}>Checkout daily updates to get useful insights</Typography>
          <CallMade sx={{ fontSize: "2.5rem" }} />
        </Stack>
      </Stack>
    </Button>
    </>
  );
};

export default HelpSectionCard;
