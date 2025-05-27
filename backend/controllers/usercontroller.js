import validator from 'validator'
import bcrypt from "bcryptjs";

import usermodel from '../models/usermodel.js'
import jwt from  'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctormodel from '../models/doctormodel.js'
import appointmentmodel from '../models/appointmentmodel.js'
import razorpay from 'razorpay'
//API to register user

let registeruser=async(req,res)=>{
    try {
        let {name,email,password}=req.body

        if(!name||!email||!password){
            return res.json({success:false,message:"Missing Details"})
        }
        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email"})
        }
        //Validating strong password
        if(password.lenght<8){
            return res.json({success:false,message:"Enter a strong password"})
        }
        
        //Hashing user password
        let salt=await bycrypt.genSalt(10)
        let hashedpassword=await bycrypt.hash(password,salt)

        let userdata={
            name,
            email,
            password:hashedpassword
        }
        
        let newuser=new usermodel(userdata)
        let user=await  newuser.save()

        let token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        
        res.json({success:true,token})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API USER LOGIN

let loginuser=async(req,res)=>{
    try {

        let {email,password}=req.body

        let user=await usermodel.findOne({email})

        if(!user){
           return  res.json({success:false,message:"User Does not exsist"})
        }
        let ismatch=await bycrypt.compare(password,user.password)
        if(ismatch)
        {
            let token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Crendentials"})

        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get userprofile data

let getprofile=async(req,res)=>{

    try {
        let  {userid}=req.body
        let userdata=await usermodel.findById(userid).select('-password')
        res.json({success:true,userdata})
        
    } catch (error) {
        res.json({success:false,message:error.message})

    }
}

//API TO UPDATE USER PROFILE

let updateprofile=async(req,res)=>{
    try {
        let{userid,name,phone,address,dob,gender}=req.body
        let imagefile=req.file

        if (!name||!phone||!dob||!gender) {
            return res.json({success:false,message:"Data missing"})
        } 
        await usermodel.findByIdAndUpdate(userid,{name,phone,address:JSON.parse(address),dob,gender})

        if(imagefile){
            //upload image to cloudinary

            let imageupload=await cloudinary.uploader.upload(imagefile.path,{resource_type:image})
            let imageurl=imageupload.secure_url

            await usermodel.findByIdAndUpdate(userid,{image:imageurl})

        }
        res.json({success:true,message:"Profile Updated"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}


//API to book appointment

let bookappointment=async(req,res)=>{
  console.log(req.body);
    try {
        let {userid,docId,slotdate,slottime}=req.body
        let docdata=await doctormodel.findById(docId).select('-password')
        if(!docdata.available){
            return res.json({success:false,message:'Doctor not available'})
        }

        let slots_booked=docdata.slots_booked;

        //Checking for slots availablity
        if(slots_booked[slotdate]){
            if(slots_booked[slotdate].includes(slottime)){
                return res.json({success:false,message:'Slot not available'})
            }
            else{
                slots_booked[slotdate].push(slottime)
            }
        }
        else{
            slots_booked[slotdate]=[]
            slots_booked[slotdate].push(slottime)
        }
        let userdata=await usermodel.findById(userid).select('-password')
        delete docdata.slots_booked
        let appointmentdata={
            userid,
            docId,
            slottime,
            slotdate,
            userdata,
            docdata,
            amount:docdata.fees,
            
            date:Date.now()
        }
        let newappointment=new appointmentmodel(appointmentdata)
        await newappointment.save()

        //save new slots data in docdata
        await doctormodel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Booked'})
    } catch (error) {
        
        res.json({success:false,message:error.message})
    }
}


//API to get user appointments for font end my-appoinments paage

let listappointment=async(req,res)=>{
    try{
        let {userid}=req.body
        let appointments=await appointmentmodel.find({userid})

        res.json({success:true,appointments})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//Api to cancel appointment
let cancelappointment = async (req, res) => {
    try {
        let { userid, appointmentid } = req.body;

        // 1. Fetch appointment
        let appointmentdata = await appointmentmodel.findById(appointmentid);
        if (!appointmentdata) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // 2. Validate user
        if (appointmentdata.userid.toString() !== userid.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        // 3. Cancel appointment
        await appointmentmodel.findByIdAndUpdate(appointmentid, { cancelled: true });

        // 4. Release doctor slot
        let { docId, slotdate, slottime } = appointmentdata;

        let doctordata = await doctormodel.findById(docId);
        if (!doctordata) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        let slots_booked = doctordata.slots_booked || {};

        // Check if the slotdate exists before modifying
        if (!slots_booked[slotdate]) {
            return res.json({ success: false, message: 'Slot date not found for doctor' });
        }

        // Filter out the cancelled time slot
        slots_booked[slotdate] = slots_booked[slotdate].filter(e => e !== slottime);

        await doctormodel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment cancelled successfully' });

    } catch (error) {
        console.error('Cancel Appointment Error:', error);
        res.json({ success: false, message: error.message });
    }
};

let razorpayInstance=new razorpay({
key_id:process.env.RAZORPAY_KEY_ID,
key_secret:process.env.RAZORPAY_KEY_SECRET
})

//API to make payment of appointment using razorpay

let paymentrazorpay= async(req,res)=>{
    try {
         let {appointmentid}=req.body
    let appointmentdata=await appointmentmodel.findById(appointmentid)
    if(!appointmentdata||appointmentdata.cancelled){
        return res.json({success:false,message:"APpoinement cancelled or not found"})

    }

    //Creating options for razorpay payment
    let options={
        amount:appointmentdata.amount*100,
        currency:process.env.CURRENCY,
        receipt:appointmentid,
    }

    //creation of an order
    let order=await razorpayInstance.orders.create(options)
    res.json({success:true,order})
        
    } catch (error) {
         console.error(error);
        res.json({ success: false, message: error.message });
    }
   
}

//API TO VERIFY PAYMENT OF RAZORPAAY

let verifyrazorpay=async(req,res)=>{
   
  try {
    let{razorpay_order_id}=req.body
    let orderinfo=await razorpayInstance.orders.fetch(razorpay_order_id)
    console.log(orderinfo)
    if(orderinfo.status==='paid'){
        await appointmentmodel.findByIdAndUpdate(orderinfo.receipt,{payment:true})
        res.json({success:true,message:"Payment Successful"})
    }
    else{
                res.json({success:false,message:"Payment Failed"})

    }
}
   catch (error) {
     console.error(error);
        res.json({ success: false, message: error.message });
    }
  }


export{registeruser,loginuser,getprofile,updateprofile,bookappointment,listappointment,cancelappointment,paymentrazorpay,verifyrazorpay}