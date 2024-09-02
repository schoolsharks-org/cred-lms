import { Stack, Typography } from "@mui/material"
import weeklyModileGif from "@/assets/user/weekly-module.gif"
import {motion} from "framer-motion"


const InitialAnimation = () => {
  return (
    <Stack width={"100%"} height={"100%"} alignItems={"center"} justifyContent={"center"} bgcolor={"#242424b6"} sx={{backdropFilter:"blur(4px)"}}>
      <img src={weeklyModileGif} alt="" style={{width:"400px",position:"absolute",top:"0px"}} />
      <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:2}}><Typography fontSize={"2.5rem"} marginTop={"75px"} fontWeight={"900"} textAlign={"center"} color={"#fff"}>Weekly Sangram</Typography></motion.div>
    </Stack>
  )
}

export default InitialAnimation
