import validator from "validator"
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary" 
import doctormodel from "../models/doctormodel.js";
import  jwt from 'jsonwebtoken'
import appointmentmodel from "../models/appointmentmodel.js";
import usermodel from "../models/usermodel.js";
//API for adding doctor

let adddoctor=async(req,res)=>{
    try{
        let{name,email,password,speciality,degree,experience,about,fees,address}=req.body
        let imagefile=req.file

        // Checking for all data to add doctor
        if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!address){
            return res.json({success:false,message:"Missing Details"})
        }

        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        //validating strong password

        if(password.length<8){
            console.log("Password is too short:", password); 
            return res.json({success:false,message:"Please enter a strong password"})

        }
        else{
        //hashing doctor password
        let salt=await bcrypt.genSalt(10)
        let hashedpassword=await bcrypt.hash(password,salt)

        //upload imagge to cloudinary
        let imageupload=await cloudinary.uploader.upload(imagefile.path,{resource_type:"image"})
        let imageurl=imageupload.secure_url
        
        //doctor data
        let doctordata={
            name,
            email,
            image:imageurl,
            password:hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()

        }

        let newdoctor=new doctormodel(doctordata)
        await newdoctor.save()
        res.json({success:true,message:"Doctor added"})
        }

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for admin login
let loginadmin=async(req,res)=>{
    try{
        let {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD){
            let token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:error.message})
    }
}

//API TO GET ALL DOCTOR LIST FOR ADMIN PANEL

let alldoctors=async(req,res)=>{
    try{
        let doctors=await doctormodel.find({}).select('-password')
        res.json({success:true,doctors})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

//API TO GET ALL APPOINTMENTS LISt

let appoinmentsadmin=async(req,res)=>{
    try {
        let appointments=await appointmentmodel.find({})
        res.json({success:true,appointments})
    } catch (error) {
         console.log(err)
        res.json({success:false,message:err.message})
    }
}

//API FOR APPOINTMENT CANCELLATION

let appointmentcancel = async (req, res) => {
    try {
        let {  appointmentid } = req.body;

        // 1. Fetch appointment
        let appointmentdata = await appointmentmodel.findById(appointmentid);
        if (!appointmentdata) {
            return res.json({ success: false, message: 'Appointment not found' });
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

//API to get DASHBOARD data for admin panel

let admindashboard=async(req,res)=>{
    try {
        let doctors=await doctormodel.find({})
        let users=await usermodel.find({})
        let appointments=await appointmentmodel.find({})

        let dashdata={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestappointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashdata})

        
    } catch (error) {
         console.log( error);
        res.json({ success: false, message: error.message });
    }
}

export {adddoctor,loginadmin,alldoctors,appoinmentsadmin,appointmentcancel,admindashboard}