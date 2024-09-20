import { Box } from '@mui/material'
import React from 'react'

interface MarkerCircleProps{
    width:string;
    color:string;
    left:number;
    bordered?:boolean;
    positioned?:boolean;

}
const MarkerCicle:React.FC<MarkerCircleProps> = ({width,color,left,bordered,positioned}) => {
  return (
    <Box width={width} height={width} borderRadius={"50%"} bgcolor={color} sx={{position:positioned?"":"absolute",left:`${left}%`,aspectRatio:"1/1",bottom:"0",border:bordered?"1px solid #000000":"none"}}></Box>
  )
}

export default MarkerCicle
