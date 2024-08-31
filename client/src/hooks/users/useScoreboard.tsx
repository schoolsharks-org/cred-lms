import userApi from '@/api/userApi';
import React, { useEffect, useState } from 'react'


interface ScoreboardUser{
    name:string;
    rank:number;
    timeInMints:number;
    points:number
}
const useScoreboard = () => {
    const [data,setData]=useState<ScoreboardUser[] | null>(null)
    const [currentUser,setCurrentUser]=useState<ScoreboardUser | null>(null)

    const fetchData=async()=>{
        const response=await userApi.get("/scoreboard")
        setData(response.data.scoreboard)
        setCurrentUser(response.data.currentUserDetails)
    }
    useEffect(()=>{
        if(!data){
            fetchData()
        }
    },[])


    function formatTime(decimalMinutes: number): string {
        const minutes = Math.floor(decimalMinutes);
        const seconds = Math.round((decimalMinutes - minutes) * 60);
      
        // Format seconds to always have two digits
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      
        return `${minutes}:${formattedSeconds}`;
      }

    return{
        scoreboardData:data,
        currentUser,
        formatTime
    }
}

export default useScoreboard
