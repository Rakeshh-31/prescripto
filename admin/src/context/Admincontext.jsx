import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export let AdminContext=createContext()

let AdminContextProvider=(props)=>{

    let [atoken,setatoken]=useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')
    let backendurl=import.meta.env.VITE_BACKEND_URL
    let [doctors,setdoctors]=useState([])
    let[appointments,setappointments]=useState([])
    let [dashdata,setdashdata]=useState(false)
    let getalldoctors=async()=>{
        try{
            let {data}=await axios.post(backendurl+'/api/admin/all-doctors',{},{headers:{atoken}})
            if(data.success){
                setdoctors(data.doctors)
                console.log(data.doctors)
            }
            else{
                toast.error(data.message)
            }


        }
        catch(error){
            toast.error(error.message)
        }
    }

    let changeavailability=async(docid)=>{
        try{
            let{data}=await axios.post(backendurl+'/api/admin/change-availability',{docid},{headers:{atoken}})
            if(data.success){
                toast.success(data.message)
                getalldoctors()
            }
            else{
                toast.error(data.message)
            }
            
        }
        catch(error){
            toast.error(error.message)
        }
    }
    
    let getallappointments=async()=>{
        try {
            let {data}=await axios.get(backendurl+'/api/admin/appointments',{headers:{atoken}})
            if(data.success){
                setappointments(data.appointments)
                console.log(data.appointments)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
          toast.error(data.message)

        }
    }
    
    let cancelappointment=async(appointmentid)=>{
      try {
        let{data}=await axios.post(backendurl+'/api/admin/cancel-appointment',{appointmentid},{headers:{atoken}})
        if(data.success){
            toast.success(data.message)
            getallappointments()
        }
        else{
            toast.error(error.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    let getdashdata=async()=>{
        try {
            let{data}=await axios.get(backendurl+'/api/admin/dashboard',{headers:{atoken}})
            if(data.success){
                setdashdata(data.dashdata)
                console.log(data.dashdata)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    let value={
        atoken,setatoken,backendurl,doctors,getalldoctors,changeavailability,appointments,setappointments,getallappointments,cancelappointment,dashdata,getdashdata
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider