import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/Admincontext";
import { toast } from "react-toastify";
import axios from "axios";
const Adddoctor = () => {

    let [docimg,setdocimg]=useState(false)
    let [name,setname]=useState('')
    let [email,setemail]=useState('')
    let [password,setpassword]=useState('')
    let [experience,setexperience]=useState('1 Year')
    let [fees,setfees]=useState('')
    let [about,setabout]=useState('')
    let [speciality,setspeciality]=useState('General physician')
    let [degree,setdegree]=useState('')
    let [address1,setaddress1]=useState('')
    let [address2,setaddress2]=useState('')

    let {backendurl,atoken}=useContext(AdminContext)

    let onSubmitHandler= async (event)=>{
      event.preventDefault()

      try{
        if(!docimg){
          return toast.error('image not selected')
        }
        let formData=new FormData()
        formData.append('image',docimg)
        formData.append('name',name)
        formData.append('email',email)
        formData.append('password',password)
        formData.append('experience',experience)
        formData.append('fees',fees)
        formData.append('about',about)
        formData.append('speciality',speciality)
        formData.append('degree',degree)
        formData.append('address',JSON.stringify({line1:address1,line2:address2}))

        //console log formdata
        formData.forEach((value,key)=>{
          console.log(`${key}:${value}`)
        })

        let {data}=await  axios.post(backendurl+'/api/admin/add-doctor',formData,{headers:{"Content-Type":"multipart/form-data",atoken}})

        if(data.success){
          toast.success(data.message)
          setdocimg(false)
          setname('')
          setpassword('')
          setemail('')
          setaddress1('')
          setaddress2('')
          setdegree('')
          setabout('')
          setfees('')

        }
        else{
          toast.error(data.msg) 
        }
      }
      catch(err){
        toast.error(error.msg)
        console.log(err)
      }
    }


  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docimg? URL.createObjectURL(docimg):assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e)=>setdocimg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>
            Upload doctor <br />
            picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col  gap-1">
              <p>Doctor name</p>
              <input onChange={(e)=>setname(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder="Name" required />
            </div>

            <div className="flex-1 flex flex-col  gap-1">
              <p>Doctor Email</p>
              <input onChange={(e)=>setemail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="Email" required />
            </div>

            <div className="flex-1 flex flex-col  gap-1">
              <p>Doctor Password</p>
              <input onChange={(e)=>setpassword(e.target.value)} value={password} className="border rounded px-3 py-2" type="password" placeholder="password" required />
            </div>

            <div className="flex-1 flex flex-col  gap-1">
              <p>Experience</p>
              <select onChange={(e)=>setexperience(e.target.value)} value={experience} className="border rounded px-3 py-2" name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col  gap-1">
              <p>Fees</p>
              <input onChange={(e)=>setfees(e.target.value)} value={fees} className="border rounded px-3 py-2" type="number" placeholder="fees" required />
            </div>

          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col  gap-1">
              <p>Speciality</p>
              <select onChange={(e)=>setspeciality(e.target.value)} value={speciality} className="border rounded px-3 py-2" name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col  gap-1">
              <p>Education</p>
              <input onChange={(e)=>setdegree(e.target.value)} value={degree} className="border rounded px-3 py-2" type="text" placeholder="Education" required />
            </div>

            <div className="flex-1 flex flex-col  gap-1">
              <p>Address</p>
              <input onChange={(e)=>setaddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder="address 1" required />
              <input onChange={(e)=>setaddress2(e.target.value)} value={address2} className="border rounded px-3 py-2" type="text" placeholder="address 2" required />
            </div>
          </div>
          </div>
          <div className="flex-1 flex flex-col  gap-1">
            <p className="mt-4 mb-2">About Doctor</p>
            <textarea onChange={(e)=>setabout(e.target.value)} value={about} className="w-full px-4 pt-2 border rounded" placeholder="write about doctor" rows={5} required />
          </div>
          <button type="submit" className="bg-[#5F6FFF] px-10 py-3 mt-4 text-white rounded-full">Add Doctor</button>
        </div>
      
    </form>
  );
};

export default Adddoctor;
