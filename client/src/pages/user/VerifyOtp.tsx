import { PIN } from "@/components/user/Pin";
import { AppDispatch, RootState } from "@/store/store";
import { verifyOtp } from "@/store/user/userActions";
import { setUser } from "@/store/user/userSlice";
import { ArrowBack } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VerifyOtp = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [pin, setPin] = useState<string>("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const {email,error}=useSelector((state:RootState)=>state.user)
  
  const handleVerifyOtp = () => {
    if (!pin) {
      setFieldError("OTP is required");
      return;
    }
    dispatch(verifyOtp({otp:pin,email}));
  };

  const handleChange=(pin:string)=>{
      if(error){
        dispatch(setUser({error:""}))
      }
      setFieldError(null)
      setPin(pin)
  }

  return (
    <Stack padding={"24px"}>
      <Stack direction={"row"} marginTop={"74px"}>
        <IconButton>
          <ArrowBack sx={{ color: "#000000" }} />
        </IconButton>
      </Stack>
      <Typography textAlign={"center"} fontSize={"2rem"} fontWeight={"600"}>
        Enter OTP
      </Typography>
      <Typography
        textAlign={"center"}
        fontSize={"0.9rem"}
        fontWeight={"500"}
        marginTop={"16px"}
        color={theme.palette.text.secondary}
        maxWidth={"65%"}
        margin={"auto"}
      >
        Enter the OTP code we just sent you on your registered Email Account
      </Typography>
      <Stack alignItems={"center"} marginTop={"32px"}>
      <PIN value={pin} onChange={handleChange} length={4} separator={<div></div>} />
      </Stack>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          borderRadius: "0",
          padding: "16px",
          fontWeight: "500",
          marginTop: "46px",
        }}
        onClick={handleVerifyOtp}
        // disabled={loading}
      >
        Proceed
      </Button>
      {fieldError && <Typography color={theme.palette.error.main} marginTop={"12px"}>{fieldError}</Typography>}
      {error && <Typography color={theme.palette.error.main} marginTop={"12px"}>{error}</Typography>}
      
      <Stack direction={"row"} gap={"4px"}>
        <Typography marginTop={"18px"} fontSize={"0.9rem"}>
          Didn’t get OTP?{" "}
        </Typography>
        <Typography
          color={theme.palette.primary.accent}
          marginTop={"18px"}
          fontSize={"0.9rem"}
        >
          Resend OTP
        </Typography>
      </Stack>
    </Stack>
  );
};

export default VerifyOtp;
