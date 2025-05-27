import express from 'express'
import { doctorlist,logindoctor,appointmentsdoctor,appointmentcomplete,appointmentcancel,doctordashboard,doctorprofile,updatedoctorprofile} from '../controllers/doctorcontroller.js'
import authdoctor from '../middlewares/authdoctor.js'
let doctorrouter=express.Router()

doctorrouter.get('/list',doctorlist)

doctorrouter.post('/login',logindoctor)

doctorrouter.get('/appointments',authdoctor,appointmentsdoctor)

doctorrouter.post('/complete-appointment',authdoctor,appointmentcomplete)

doctorrouter.post('/cancel-appointment',authdoctor,appointmentcancel)

doctorrouter.get('/dashboard',authdoctor,doctordashboard)

doctorrouter.get('/profile',authdoctor,doctorprofile)

doctorrouter.post('/update-profile',authdoctor,updatedoctorprofile)
export default doctorrouter