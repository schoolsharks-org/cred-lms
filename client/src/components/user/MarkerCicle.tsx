import { Box } from '@mui/material'
import React from 'react'

interface MarkerCircleProps{
    width:string;
    color:string;
    left:number;
    positioned?:boolean;

}
const MarkerCicle:React.FC<MarkerCircleProps> = ({width,color,left,positioned}) => {
  return (
    <Box width={width} height={width} borderRadius={"50%"} bgcolor={color} sx={{position:positioned?"":"absolute",left:`${left}%`,bottom:"0"}}></Box>
  )
}

export default MarkerCicle
