import Loader from "@/components/Loader";
import useWeeklyQuestion from "@/hooks/users/useWeeklyQuestion";
import { ArrowBack, ArrowForward, VolumeUpOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// const insights = [
//   "Agar applicant ka Credit score nahi hai to doosre co-applicant jinka Credit score bureau norms ke hisaab se hai, unka spouse hona chahiye, koi aur family member nahi.",
//   "Agar CRIF report mein saare loans 3 saal se zyada pehle close ho chuke hain - ise New to Credit mana jayega aur aage process nahi kiya jayega.",
//   "Customer ka credit vintage minimum 12 mahine ka hona chahiye, warna ise New to Credit mana jayega.",
//   "Satin Money Plus - Credit score 650 ya usse zyada hona chahiye aur saath mein 4 saal ka repayment track hona chahiye jisme total Rs. 75K ho; jisme se sirf Rs. 22,500 ko pichle 12 mahine ka repayment maana jayega, baaki Rs. 52,500 remaining period ke liye count hoga.",
//   "Samruddhi aur Satin Money segment ka qualifying Credit score 451 ya usse zyada hona chahiye.",
//   "Social Score Bharat ke liye minimum 6 hona chahiye, Bihar ko chhodkar. Bihar ke liye yeh minimum 5 hai.",
// ];

const Insights = () => {
  const theme = useTheme();
  const navigate=useNavigate()


  const {handleFetchInsights,insights,loading}=useWeeklyQuestion()
  const [dialogOpen,setDialogOpen]=useState<boolean>(false)


  useEffect(()=>{
    handleFetchInsights()
  },[])

  useEffect(()=>{
    console.log("Insights:",insights)
  },[insights])

  if(loading){
    return <Loader/>
  }

  return (
    <>
    <Stack>
      <Stack direction="row" padding={"24px 8px"} gap={"8px"}>
        <IconButton sx={{ height: "max-content", marginTop: "12px" }}>
          <ArrowBack
            sx={{ color: theme.palette.primary.main, fontWeight: "700" }}
          />
        </IconButton>
        <Stack gap={"5px"}>
          <Typography fontSize={"1.5rem"} fontWeight={"700"}>
            New Circulars From Aug 24 onwards
          </Typography>
          <Box
            height={"4px"}
            width={"100%"}
            borderRadius={"8px"}
            bgcolor={theme.palette.primary.main}
          />
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        bgcolor={theme.palette.primary.main}
        alignItems={"center"}
        padding={"8px 24px 8px 8px"}
      >
        <IconButton>
          <VolumeUpOutlined sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
        </IconButton>
        <Box sx={{ height: "5px", flex: 1, bgcolor: "#ffffff79" }} />
      </Stack>

      <Stack
        bgcolor={theme.palette.primary.main}
        marginTop={"24px"}
        padding="24px 16px"
      >
        <Typography
          fontWeight={"500"}
          fontSize={"1.25rem"}
          color="#ffffff"
          marginBottom={"24px"}
        >
          Points to be noted-
        </Typography>
        <Stack gap={"20px"}>
          {insights.map((insight, index) => (
            <Typography key={index} color={"#fff"} fontSize={"1.25rem"}>
              {index + 1}. {insight}
            </Typography>
          ))}
        </Stack>
      </Stack>
      <Button
        variant="contained"
        endIcon={<ArrowForward style={{fontSize:"1.8rem"}}/>}
        onClick={()=>setDialogOpen(true)}
        sx={{
          bgcolor: "#ffffff",
          color: "#000000",
          fontSize: "2rem",
          fontWeight: "500",
          justifyContent: "space-between",
          textTransform: "none",
          padding:"12px 24px",
          "&:hover": { bgcolor: "#ffffff" },
        }}
      >
        Take the test
      </Button>
    </Stack>
    <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} >
      <Stack sx={{padding:"28px 24px",maxWidth:"310px"}}>
        <Typography fontSize={"1.25rem"} fontWeight={"600"}>Once the test begins, you will not be able to uit.</Typography>
        <Stack direction={"row"} justifyContent={"space-between"} marginTop={"36px"}>
          <Button startIcon={<ArrowBack/>} onClick={()=>setDialogOpen(false)} sx={{textTransform:"none",fontSize:"1.25rem"}}>Go back</Button>
          <Button endIcon={<ArrowForward/>} onClick={()=>navigate("/weekly-question")}  sx={{textTransform:"none",fontSize:"1.25rem",color:"#000000"}}>Continue</Button>
        </Stack>
        </Stack>
    </Dialog>
    </>
  );
};

export default Insights;
