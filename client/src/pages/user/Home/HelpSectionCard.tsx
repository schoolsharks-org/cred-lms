import { Stack, Typography, useTheme } from "@mui/material";
import arrow from "../../../assets/arrow-right.png";
import { useNavigate } from "react-router-dom";

const HelpSectionCard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const openDailyUpdates = () => {
    setTimeout(() => {
      navigate("/help-section");
    }, 200);
  };

  return (
    <>
      <Stack marginTop={"16px"}>
        {/* Title Strip */}
        <Stack bgcolor={theme.palette.primary.main} padding={"16px"}>
          <Stack direction={"row"}>
            <Typography
              color={"#FFFFFF"}
              fontSize={"2.5rem"}
              fontWeight={"600"}
            >
              Zaroor Dekho
            </Typography>
            <img alt="" style={{ width: "40px" }} />
          </Stack>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography color={"#FFFFFF"} maxWidth={"70%"}>
              Checkout Daily updates to get useful insight
            </Typography>
            <img
              src={arrow}
              alt=""
              style={{ width: "40px" }}
              onClick={() => openDailyUpdates()}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default HelpSectionCard;
