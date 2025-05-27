import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export let DoctorContext=createContext()

let DoctorContextProvider=(props)=>{

    let backendurl=import.meta.env.VITE_BACKEND_URL
    let [dtoken,setdtoken]=useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):'')
    
    let [appointments,setappointments]=useState([])

    let[dashdata,setdashdata]=useState(false)

    let[profiledata,setprofiledata]=useState(false)
    let getappointments=async()=>{
        try {
            let{data}=await axios.get(backendurl+'/api/doctor/appointments',{headers:{dtoken}})
            console.log(data)
            if(data.success){
              
                setappointments(data.appointments)
                
                
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
   
    let completeappointment=async(appointmentid)=>{
        try {
            let{data}=await axios.post(backendurl+'/api/doctor/complete-appointment',{appointmentid},{headers:{dtoken}}) 
            if(data.success){
                toast.success(data.message)
                getappointments()
            }    
            else{
                toast.error(data.message)
            }
        } catch (error) {
           console.log(error)
            toast.error(error.message) 
        }
    }
    
    let cancelappointment=async(appointmentid)=>{
        try {
            let{data}=await axios.post(backendurl+'/api/doctor/cancel-appointment',{appointmentid},{headers:{dtoken}}) 

            if(data.success){
                toast.success(data.message)
                getappointments()
            }    
            else{
                toast.error(data.message)
            }
        } catch (error) {
           console.log(error)
            toast.error(error.message) 
        }
    }

    let getdashdata=async()=>{
        try {
            let{data}=await axios.get(backendurl+'/api/doctor/dashboard',{headers:{dtoken}})
            console.log(data)
            if(data.success){
                setdashdata(data.dashdata)
                console.log(data.dashdata)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
             console.log(error)
            toast.error(error.message)
        }
    }
    let getprofiledata=async()=>{
        try {
            
            let {data}=await axios.get(backendurl+'/api/doctor/profile',{headers:{dtoken}})
            console.log(data)
            if(data.success){
                setprofiledata(data.profiledata)
                console.log(data.profiledata)
                
            }    
                    
        } catch (error) {
            

            toast.error(error.message)
        }
    }
    let value={
        dtoken,setdtoken,backendurl,appointments,setappointments,getappointments,completeappointment,cancelappointment,dashdata,setdashdata,getdashdata,profiledata,setprofiledata,getprofiledata
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider