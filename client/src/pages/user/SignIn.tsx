import { ArrowBack, ArrowCircleRightOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { AppDispatch, RootState } from "@/store/store";
import { loginUser } from "@/store/user/userActions";

const SignIn = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { authenticated, loading, error } = useSelector((state: RootState) => state.user);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: "phone" | "password") => {
    const { value } = e.target;
    if (field === "phone") {
      const numericValue = value.replace(/\D/g, ''); 
      if (numericValue.length <= 10) {
        setPhone(numericValue);
        setFieldError(null); 
      } else {
        setFieldError("Phone number should not exceed 10 digits");
      }
    } else if (field === "password") {
      setPassword(value);
      setFieldError(null); 
    }
  };

  const handleLogin = () => {
    if (!phone || !password) {
      setFieldError("All Fields Required");
      return;
    }
    if (phone.length !== 10) {
      setFieldError("Phone number should be exactly 10 digits");
      return;
    }
    dispatch(loginUser({ phone, password }));
  };

  if (authenticated) {
    navigate("/home");
  }

  return (
    <Stack className="sign-in-page" padding={"24px"}>
      <Stack direction={"row"} marginTop={"74px"}>
        <IconButton><ArrowBack sx={{ color: "#000000" }} /></IconButton>
      </Stack>
      <Typography textAlign={"center"} fontSize={"2rem"} fontWeight={"600"}>Sign In</Typography>
      <Stack gap={"5px"} marginTop={"48px"}>
        <Typography fontWeight={"500"}>Phone Number</Typography>
        <TextField
          type="number"
          placeholder="Enter 10 digit Mobile Number"
          value={phone}
          onChange={(e:ChangeEvent<HTMLInputElement>) => handleFieldChange(e, "phone")}
          disabled={loading}
        />
      </Stack>
      <Stack gap={"5px"} marginTop={"12px"}>
        <Typography fontWeight={"500"}>Password</Typography>
        <TextField
          placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(e:ChangeEvent<HTMLInputElement>) => handleFieldChange(e, "password")}
          disabled={loading}
        />
      </Stack>
      {fieldError && <Typography color={theme.palette.error.main} marginTop={"12px"}>{fieldError}</Typography>}
      <Button
        variant="contained"
        sx={{ textTransform: "none", borderRadius: "0", padding: "16px", fontWeight: "500", marginTop: "46px" }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      <Typography color={theme.palette.primary.accent} marginTop={"18px"}>Not able to login?</Typography>
      <Typography>Request Email <ArrowCircleRightOutlined sx={{ fontSize: "1rem" }} /></Typography>
    </Stack>
  );
};

export default SignIn;
