import { ArrowBack, ArrowCircleRightOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { AppDispatch, RootState } from "@/store/store";
import { sendOtp } from "@/store/user/userActions";
import { authStatus, setUser } from "@/store/user/userSlice";

const SignIn = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { authStatus:status, loading } = useSelector((state: RootState) => state.user);

  // const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: "phone" | "password") => {
  //   const { value } = e.target;
  //   if (field === "email") {
  //       setEmail(numericValue);
  //       setFieldError(null); 
  //     } else {
  //       setFieldError("Phone number should not exceed 10 digits");
  //     }
  //   } else if (field === "password") {
  //     setPassword(value);
  //     setFieldError(null); 
  //   }
  // };

  const handleSendOtp = () => {
    if (!email) {
      setFieldError("Email is required");
      return;
    }
    dispatch(setUser({email}))
    dispatch(sendOtp(email));
  };

  if (status===authStatus.AUTHENTICATED) {
    navigate("/home");
  }

  return (
    <Stack className="sign-in-page" padding={"24px"}>
      <Stack direction={"row"} marginTop={"74px"}>
        <IconButton><ArrowBack sx={{ color: "#000000" }} /></IconButton>
      </Stack>
      <Typography textAlign={"center"} fontSize={"2rem"} fontWeight={"600"}>Sign In</Typography>
      <Stack gap={"5px"} marginTop={"48px"}>
        <Typography fontWeight={"500"}>Enter Email</Typography>
        <TextField
          type="email"
          placeholder="eg. Rahul@gmail.com"
          value={email}
          onChange={(e:ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          disabled={loading}
        />
      </Stack>
      {/* <Stack gap={"5px"} marginTop={"12px"}>
        <Typography fontWeight={"500"}>Password</Typography>
        <TextField
          placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(e:ChangeEvent<HTMLInputElement>) => handleFieldChange(e, "password")}
          disabled={loading}
        />
      </Stack> */}
      {fieldError && <Typography color={theme.palette.error.main} marginTop={"12px"}>{fieldError}</Typography>}
      <Button
        variant="contained"
        sx={{ textTransform: "none", borderRadius: "0", padding: "16px", fontWeight: "500", marginTop: "46px" }}
        onClick={handleSendOtp}
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>

      <Typography color={theme.palette.primary.accent} marginTop={"18px"}>Not able to login?</Typography>
      <Typography>Request Email <ArrowCircleRightOutlined sx={{ fontSize: "1rem" }} /></Typography>
    </Stack>
  );
};

export default SignIn;
