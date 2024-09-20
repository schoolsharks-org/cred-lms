import { MenuItem, Select, Slider, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./../IncentiveSimulator.css";

type Categories = "category-1" | "category-2" | "category-3";

const data={
  "category-1":{
    target1:{target:15,incentive:4000},
    target2:{target:17.5,incentive:5500},
    startValue:15,
    endValue:20
  },
  "category-2":{
    target1:{target:17.25,incentive:4500},
    target2:{target:20,incentive:6000},
    startValue:17.25,
    endValue:22.75,
  },
  "category-3":{
    target1:{target:20,incentive:5000},
    target2:{target:22.5,incentive:7000},
    startValue:20,
    endValue:25,
  },
}
const IncentiveMain = () => {
  const [category, setCategory] = useState<Categories>("category-1");
  const [target,setTarget]=useState<string>("")
  const [incentive,setIncentive]=useState<number>()

  const theme = useTheme();
  // const startValue=15
  // const endValue=20

  const handleChange = (event: Event, value: number | number[], activeThumb: number) => {
    event;activeThumb;
  
    if (typeof value === "number") {
      const n = (data[category].startValue + (value / 100) * (data[category].endValue - data[category].startValue)).toFixed(2);
      setTarget(n);
  
      const targetValue = parseFloat(n); 
      if (targetValue > data[category].target1.target && targetValue < data[category].target2.target) {
        setIncentive(data[category].target1.incentive);
      } else if (targetValue == data[category].target2.target) {
        setIncentive(data[category].target2.incentive);
      } else if (targetValue > data[category].target2.target) {
        setIncentive(Math.round(0.0075 * targetValue * 100000)); 
      }
    }
  };

  useEffect(()=>{
    const e={} as Event
    handleChange(e,50,50)
  },[])


  return (
    <Stack className="incentive-simulator-page" marginTop={"56px"}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={category}
        label="Category"
        onChange={(e) => setCategory(e.target.value as Categories)}
      >
        <MenuItem value={"category-1"}>Category-1</MenuItem>
        <MenuItem value={"category-2"}>Category-2</MenuItem>
        <MenuItem value={"category-3"}>Category-3</MenuItem>
      </Select>
      <Stack bgcolor={theme.palette.primary.main} padding={"64px 24px 32px"} color={"#fff"} boxShadow= "0px 4px 4px 0px #00000040">
        
        <Stack
          sx={{
              height: "22px",
              position:"relative",
              background:
              "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 178, 181, 0.83) 100%)",
            }}
        >
           <Slider defaultValue={50} aria-label="Default" onChange={handleChange} sx={{position:"absolute",zIndex:"1"}} />
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%"}}>
            <Typography fontWeight={"600"}>{data[category].startValue}L</Typography>
            <Typography fontSize={"0.7rem"}>(Level 1)</Typography>
           </Stack>
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%",left:"50%",transform:"translate(-50%)"}}>
            <Typography fontWeight={"600"}>{data[category].target2.target}L</Typography>
            <Typography fontSize={"0.7rem"}>(Level 2)</Typography>
           </Stack>
           <Stack alignItems={"center"} sx={{position:"absolute",bottom:"-200%",left:"100%",transform:"translate(-100%)"}}>
            <Typography fontWeight={"600"}>{data[category].endValue}L</Typography>
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
      </Stack>
    </Stack>
  );
};

export default IncentiveMain;
