import { Box,Slider, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./../IncentiveSimulator.css";


const data={
    target1:{
        target:18.5,
        incentive:24000
    },
    target2:{
        target:20,
        incentive:36000,
    },
    target3:{
        target:23.5,
        incentive:42000
    },
    startValue:17,
    endValue:23.5
}

const PragatiScheme = () => {
  const [target,setTarget]=useState<string>("")
  const [incentive,setIncentive]=useState<number>()

  const theme = useTheme();
  // const startValue=15
  // const endValue=20

  const handleChange = (event: Event, value: number | number[], activeThumb: number) => {
    event;activeThumb;
  
    if (typeof value === "number") {
      console.log(value)
      const n = (data.startValue + (value / 100) * (data.endValue - data.startValue)).toFixed(2);
      setTarget(n);

  
      const targetValue = parseFloat(n); 
      if(targetValue<data.target1.target){
        setIncentive(0)
      }
      else if(targetValue>=data.target1.target && targetValue<data.target2.target){
        setIncentive(data.target1.incentive)
      }
      else if(targetValue>=data.target2.target && targetValue<data.target3.target){
        setIncentive(data.target2.incentive)
      }
      else if(targetValue>=data.target3.target){
        setIncentive(data.target3.incentive)
      }
    }
  };

  useEffect(()=>{
    const e={} as Event
    handleChange(e,50,50)
  },[])


  return (
    <Stack className="incentive-simulator-page" marginTop={"56px"}>
      <Box sx={{bgcolor:"#000000",width:"max-content",padding:"12px"}}>
        <Typography color={"#ffffff"} width={"max-content"}>Pragati Scheme</Typography>
      </Box>
      <Stack bgcolor={theme.palette.primary.main} padding={"64px 24px 32px"} color={"#fff"} boxShadow= "0px 4px 4px 0px #00000040">
        
        <Stack
          sx={{
              height: "22px",
              position:"relative",
              background:
              "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 178, 181, 0.83) 100%)",
            }}
        >
           <Slider defaultValue={50} aria-label="Default" onChange={handleChange} sx={{position:"absolute",zIndex:"1",bottom:"0"}} />
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%"}}>
            <Typography fontWeight={"600"}>{data.startValue}L</Typography>
           </Stack>
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%",left:"23%",transform:"translate(-50%)"}}>
            <Typography fontWeight={"600"}>{data.target1.target}L</Typography>
            <Typography fontSize={"0.7rem"}>(Eligibility level)</Typography>
           </Stack>
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%",left:"46.15%",transform:"translate(-50%)"}}>
            <Typography fontWeight={"600"}>{data.target2.target}L</Typography>
            <Typography fontSize={"0.7rem"} width={"max-content"}>(Level 2)</Typography>
           </Stack>
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%",left:"100%",transform:"translate(-100%)"}}>
            <Typography fontWeight={"600"}>{data.target3.target}L</Typography>
            <Typography fontSize={"0.7rem"} width={"max-content"}>(Level 3)</Typography>
           </Stack>
        </Stack>

        <Stack direction={"row"} marginTop={"108px"} justifyContent={"space-between"}>
            <Stack>
                <Typography sx={{textDecoration:"underline",fontFamily:"sans-serif"}}>Target</Typography>
                <Typography fontWeight={"500"}><span style={{fontSize:"2.5rem",fontWeight:"300"}}>{target}</span> Lakhs</Typography>
            </Stack>
            <Stack alignItems={"flex-end"}>
                <Typography>Incentive</Typography>
                <Typography fontSize={"1.5rem"}><span style={{fontSize:"2.5rem",fontWeight:"300"}}>{incentive}</span> ₹</Typography>
            </Stack>
        </Stack>
        <Typography fontSize={"1.25rem"} marginTop={"48px"}>Collection Target - 100%</Typography>
        <Typography fontSize={"1.25rem"}>Performance period - 6 Months</Typography>
      </Stack>
    </Stack>
  );
};

export default PragatiScheme;
