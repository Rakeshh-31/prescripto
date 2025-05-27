import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Appcontext } from '../context/Appcontext'; 
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Myappointments = () => {
  let {backendurl,token,getdoctorsdata}=useContext(Appcontext)
  let [appointments,setappointments]=useState([])
  let months =["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  
  let navigate=useNavigate()

  let slotdateformat=(slotdate)=>{
    let datearray=slotdate.split('_')
    return datearray[0]+" "+months[Number(datearray[1])]+" "+datearray[2]
  }

  let getuserappointments=async()=>{
    try {
      let {data}=await axios.get(backendurl+'/api/user/appointments',{headers:{token}})
      if(data.success){
        setappointments(data.appointments.reverse())
        console.log(data.appointments)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  let cancelappointment=async(appointmentid)=>{
    try {

      let {data}=await axios.post(backendurl+'/api/user/cancel-appointment',{appointmentid},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getuserappointments()
        getdoctorsdata()
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
   
  let initpay= (order)=>{
   let  options={
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount :order.amount,
    currency:order.currency,
    name:'Appointment Payment',
    description:'Appointment Payment',
    order_id:order.id,
    receipt:order.receipt,
    handler: async(response)=>{
      console.log(response)

      try {
        let {data}=await axios.post(backendurl+'/api/user/verifyrazorpay',response,{headers:token})
        if(data.success){
          getuserappointments()
          navigate('/my-appointments')
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
   }
   let rzp=new window.Razorpay(options)
   rzp.open()

  }

  let appointmentrazorpay=async(appointmentid)=>{
    try {
      let{data}=await axios.post(backendurl+'/api/user/payment-razorpay',{appointmentid},{headers:{token}})
      if(data.success){
        console.log(data.order)
        initpay(data.order)
      }
      
    } catch (error) {
      
    }
  }
  
  useEffect(()=>{
    if(token){
      getuserappointments()
    }
  },[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.map((item,index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docdata.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docdata.name}</p>
              <p>{item.docdata.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docdata.address.line1}</p>
              <p className='text-xs'>{item.docdata.address.line2}</p>
              <p className='rext-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotdateformat(item.slotdate)}|  {item.slottime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled&&item.payment&& !item.iscompleted &&<button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-500'>Paid</button>}
              {!item.cancelled&&!item.payment&& !item.iscompleted&&<button onClick={()=>appointmentrazorpay(item._id)} className='text-sm text-stone-500  text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6fff] hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled&&!item.iscompleted&&<button onClick={()=>cancelappointment(item._id)} className='text-sm text-stone-500  text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
             {item.cancelled &&!item.iscompleted&&<button className='sm:min-w-48 py-2 border-red-500  text-red-500 rounded-xl'>Appointment cancelled</button>}
             {
              item.iscompleted&&<button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
             }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Myappointments
