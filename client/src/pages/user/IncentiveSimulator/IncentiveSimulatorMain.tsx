import { useEffect } from "react"
import SalesIncentiveMain from "./Sales/SalesIncentiveMain"
import CollectionsIncentiveMain from "./Collections/CollectionsIncentiveMain"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const IncentiveSimulatorMain = () => {
  const {department}=useSelector((state:RootState)=>state.user)
  
  useEffect(()=>{
    window.scrollTo({top:0})
  },[])

  if(department==="Sales")
  return <SalesIncentiveMain/>


  else if(department==="Collection"){
    return <CollectionsIncentiveMain/>
  }

  else {
    return null
  }

  
}

export default IncentiveSimulatorMain
