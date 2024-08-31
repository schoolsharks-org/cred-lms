import { Box, Stack, Typography, useTheme } from "@mui/material"

enum moduleStatuses{
    TO_BE_LAUNCHED="TO_BE_LAUNCED",
    IN_PROGRESS="IN_PROGRESS",
    COMPLETED="COMPLETED"
}
const data=[
    {
        month:"Aug",
        weeks:[
            {
                name:"Week-4",
                status:moduleStatuses.IN_PROGRESS,
                statusDescription:"(To be launched)",
            },
            {
                name:"Week-3",
                status:moduleStatuses.IN_PROGRESS,
                statusDescription:"(To be launched)",
            },
            {
                name:"Week-2",
                status:moduleStatuses.IN_PROGRESS,
                statusDescription:"(To be launched)",
            },
            {
                name:"Week-1",
                status:moduleStatuses.IN_PROGRESS,
                statusDescription:"(To be launched)",
            }
        ]
    }
]
const TrackLevels = () => {
    const theme=useTheme()
    
  return (
    <Stack bgcolor={theme.palette.secondary.main} marginTop={"40px"} padding={"16px"}>
      <Typography fontSize={"1.5rem"} fontWeight={"600"} >Track Levels</Typography>
      <Stack marginTop={"48px"} gap={"24px"}>  
      {data.map((month,index)=>(
        <Stack key={index} direction={"row"} gap={"16px"}>
        <Stack padding={"10px 4px"}><Typography fontWeight={"700"}>{month.month}</Typography></Stack>
        <Stack bgcolor={theme.palette.primary.main} padding={"10px 4px"} alignItems={"center"}>
            {month.weeks.map((week,index)=>(
                <><Box width={"24px"} height={"24px"} border={`2px solid #FFB2B5`} bgcolor={week.status===moduleStatuses.COMPLETED?"#FFB2B5":"transparent"}/>
                {index!=month.weeks.length-1?<Box width={"2px"} height={"24px"} bgcolor={"#FFB2B5"}/>:null}
                </>
            ))}
        </Stack>
        <Stack>
            {month.weeks.map((week,index)=>(
                <Stack direction={"row"} key={index} alignItems={"center"} flex={"1"} gap={"4px"}>
                    <Typography fontWeight={"700"}>{week.name}</Typography>
                    <Typography fontSize={"0.75rem"} color={theme.palette.text.secondary}>{week.statusDescription}</Typography>
                </Stack>
            ))}
        </Stack>
      </Stack>
      ))}
      </Stack>
    </Stack>
  )
}

export default TrackLevels
