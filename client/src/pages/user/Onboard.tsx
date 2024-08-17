import { Button, Stack, Typography, useTheme } from "@mui/material";
import wgabLogo from "@/assets/wgab-logo.png";
import { useNavigate } from "react-router-dom";

const Onboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Stack height={"100vh"} paddingBottom={"28px"}>
      <Stack alignItems={"center"} marginTop={"160px"}>
        <Typography color="#363636" fontWeight={"600"} fontSize={"4rem"}>
          Cred Dost
        </Typography>
        <Typography
          fontSize={"1.25rem"}
          fontWeight={"400"}
          color={theme.palette.text.secondary}
        >
          For Satin Finserv
        </Typography>
      </Stack>
      <Stack marginTop={"auto"} padding={"20px"}>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "0",
            padding: "16px",
            fontWeight: "500",
          }}
          onClick={() => navigate("/sign-in")}
        >
          Get Started
        </Button>
        <Stack alignItems={"center"} marginTop={"32px"}>
          <Typography fontSize={"0.8rem"} color={theme.palette.text.secondary}>
            A Game By
          </Typography>
          <img
            src={wgabLogo}
            alt=""
            style={{ width: "120px", height: "auto", objectFit: "contain" }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Onboard;
