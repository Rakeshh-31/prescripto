import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/Admincontext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/Doctorcontext'

const Login = () => {

    let [state,setstate]=useState('Admin')
    let [email,setemail]=useState('')
    let [password,setpassword]=useState('')
    let{setatoken,backendurl}=useContext(AdminContext)
    let{setdtoken}=useContext(DoctorContext)
    let onSubmitHandler=async(event)=>{
        event.preventDefault()
        try{
            if(state==='Admin'){
                let {data}=await axios.post(backendurl+'/api/admin/login',{email,password})
                if(data.success){
                    localStorage.setItem('atoken',data.token)
                   setatoken(data.token)
                }
                else{
                  toast.error(data.message)
                }
            }
            else{
              let {data}=await axios.post(backendurl+'/api/doctor/login',{email,password})
              if(data.success){
                    localStorage.setItem('dtoken',data.token)
                     setdtoken(data.token)
                     console.log(data.token)
                }
                else{
                  toast.error(data.message)
                } 
            }
        }
        catch(err){

        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'> {state} </span>Login</p>
        <div className='w-full '>
            <p>Email</p>
            <input onChange={(e)=>setemail(e.target.value)} value={email}className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
            <p>password</p>
            <input onChange={(e)=>setpassword(e.target.value)} value={password}className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'>Login</button>
        {
            state==='Admin'
            ?<p>Doctor Login?<span className='text-[#5F6FFF] underline cursor-pointer'onClick={()=>setstate('Doctor')}>Click here</span></p>
            : <p>Admin Login?<span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setstate('Admin')}>Click here</span></p>
        }   
      </div>
    </form>
  )
}

export default Login
