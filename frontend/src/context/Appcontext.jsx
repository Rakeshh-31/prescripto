import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export let Appcontext=createContext()

let AppcontextProvider=(props)=>{

  let currencysymbol='$'
  let backendurl=import.meta.env.VITE_BACKEND_URL
  let [doctors,setdoctors]=useState([])
  let [token,settoken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
  let [userdata,setuserdata]=useState(false)

   
    let getdoctorsdata=async()=>{
        try{
            let {data}=await axios.get(backendurl+'/api/doctor/list')
            if(data.success){
                setdoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    let loaduserprofiledata=async()=>{
        try {
            let{data}=await axios.get(backendurl+'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setuserdata(data.userdata)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    let value={
       doctors,getdoctorsdata,currencysymbol,token,settoken,backendurl,userdata,setuserdata,loaduserprofiledata
    }

    useEffect(()=>{
        getdoctorsdata()
    },[])

    useEffect(()=>{
        if(token){
            loaduserprofiledata()
        }
        else{
            setuserdata(false)
        }
    },[token])
    return(
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}

export default AppcontextProvider