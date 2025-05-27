import doctormodel from "../models/doctormodel.js"

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentmodel from "../models/appointmentmodel.js"

let changeavailability=async(req,res)=>{
        try{
            let{docid}=req.body
            let docdata=await doctormodel.findById(docid)
            await doctormodel.findByIdAndUpdate(docid,{available:!docdata.available})
            res.json({success:true,message:'Availability Changed'})
        }
        catch(error){
            console.log(error)
            res.json({success:false,message:error.message})
        }
}

let doctorlist=async(req,res)=>{
    try {
        let doctors=await doctormodel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})

    } catch (error) {
         console.log(error)
            res.json({success:false,message:error.message})
    }
}

//API FOR DOCTOR LOGIN

let logindoctor=async(req,res)=>{
    try {
        let {email,password}=req.body
        let doctor=await doctormodel.findOne({email})

        if(!doctor){
            return res.json({success:false,message:'Invalid credentials'})
        }
        let ismatch=await bcrypt.compare(password,doctor.password)
        if(ismatch){
            let token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            return res.json({success:false,message:'Invalid credentials'})

        }
        
    } catch (error) {
        console.log(error)
            res.json({success:false,message:error.message})
    }
}

//API TO GET DOCTOR APPOINTMENTS FOR DOCTOR PANEL


let appointmentsdoctor = async (req, res) => {
  try {
    let { docid } = req.body; // 'docid' from the middleware (it's an ObjectId)


    // Convert ObjectId to string for comparison
    let stringDocId = docid.toString();

    let appointments = await appointmentmodel.find({ docId: stringDocId });

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to mark appointment completed for doctor panel

let appointmentcomplete=async(req,res)=>{
    try {
        let{docid,appointmentid}=req.body
        
        let appointmentdata=await appointmentmodel.findById(appointmentid)
        
        if(appointmentdata&&appointmentdata.docId===docid){
            await appointmentmodel.findByIdAndUpdate(appointmentid,{iscompleted:true})
            return res.json({success:true,message:'appointment completed'})
        }
        else{
                        return res.json({success:false,message:'Mark failed'})

        }

        
    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
    }
}


//API to cancel appointment for doctor panel

let appointmentcancel=async(req,res)=>{
    try {
        let{docid,appointmentid}=req.body
        let appointmentdata=await appointmentmodel.findById(appointmentid)
        if(appointmentdata&&appointmentdata.docId===docid){
            await appointmentmodel.findByIdAndUpdate(appointmentid,{cancelled:true})
            return res.json({success:true,message:'appointment cancelled'})
        }
        else{
                        return res.json({success:false,message:'cancellation failed'})

        }

        
    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
    }
}

//API to get dashboard data for doctor panel

let doctordashboard=async(req,res)=>{
    try {
        let { docid } = req.body; // 'docid' from the middleware (it's an ObjectId)


    // Convert ObjectId to string for comparison
    let stringDocId = docid.toString();

    let appointments = await appointmentmodel.find({ docId: stringDocId });
        let earnings=0
        appointments.map((item)=>{
            if(item.iscompleted||item.payment){
                earnings+=item.amount
            }
        })
        let patients=[]
        appointments.map((item)=>{
            if(!patients.includes(item.userid)){
                patients.push(item.userid)
            }
        })
        let dashdata={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestappointments:appointments.reverse().slice(0,5)

        }
       
        res.json({success:true,dashdata})
        
    } catch (error) {
         console.log(error);
    res.json({ success: false, message: error.message });
    }
}


//API TO GET DOCTOR PROFILE FOR DOCTOR PANEL

let doctorprofile = async (req, res) => {
    try {
        let { docid } = req.body;
        let profiledata = await doctormodel.findById(docid).select('-password');
        res.json({ success: true, profiledata });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//API TO Update doctor profile data from doctor panel
let updatedoctorprofile = async (req, res) => {
    try {
        let { docid, fees, address, available } = req.body;

        // Convert the docid string to ObjectId (if needed) and pass directly
        await doctormodel.findByIdAndUpdate(docid, {
            fees,
            address,
            available
        });

        res.json({ success: true, message: 'Profile updated' });
    } catch (error) {
        console.log("lamja");
        res.json({ success: false, message: error.message });
    }
};

export {changeavailability,doctorlist,logindoctor,appointmentsdoctor,appointmentcomplete,appointmentcancel,doctordashboard,doctorprofile,updatedoctorprofile}