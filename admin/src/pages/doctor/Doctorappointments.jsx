import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/Doctorcontext'
import { useEffect } from 'react'
import { AppContext } from '../../context/Appcontext'
import { assets } from '../../assets/assets_admin/assets'

const Doctorappointments = () => {
  let {dtoken,appointments,getappointments,completeappointment,cancelappointment}=useContext(DoctorContext)
 
  let {caluculateage,slotdateformat,currency}=useContext(AppContext)
  useEffect(()=>{
    if(dtoken){
      getappointments()
    }
  },[dtoken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50hv] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {
          appointments.reverse().map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                <p className='max-sm:hidden'>{index+1}</p>
                <div className='flex-items-center gap-2'>
                  <img className='w-8 rounded-full' src={item.userdata.image} alt="" />
                  <p>{item.userdata.name}</p>
                </div>
                <div>
                  <p className='text-xs inline border border-#5f6fff px-2 rounded-full'>
                    {item.payment ?'Online':'CASH'}
                  </p>
                </div>
                <p className='max-sm:hidden'>{caluculateage(item.userdata.dob)}</p>
                <p>{slotdateformat(item.slotdate)},{item.slottime}</p>
                <p>{currency},{item.amount}</p>
                {
                  item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>cancelled</p>
                  : item.iscompleted
                    ?<p className='text-green-500 text-cs font-medium'>completed</p>
                    :<div className='flex'>
                  <img onClick={()=>cancelappointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={()=>completeappointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
                }
              </div>
          ))
        }
      </div>
    </div>
  )
}

export default Doctorappointments
