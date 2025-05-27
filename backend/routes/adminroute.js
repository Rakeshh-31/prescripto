import express from 'express'
import { adddoctor,alldoctors,loginadmin,appoinmentsadmin, appointmentcancel,admindashboard } from '../controllers/admincontroller.js'
import upload from '../middlewares/multer.js'
import authadmin from '../middlewares/authadmin.js'
import { changeavailability } from '../controllers/doctorcontroller.js'

let adminrouter=express.Router()

adminrouter.post('/add-doctor',authadmin,upload.single('image'),adddoctor)
adminrouter.post('/login',loginadmin)
adminrouter.post('/all-doctors',authadmin,alldoctors)
adminrouter.post('/change-availability',authadmin,changeavailability)
adminrouter.get('/appointments',authadmin,appoinmentsadmin)
adminrouter.post('/cancel-appointment',authadmin,appointmentcancel)
adminrouter.get('/dashboard',authadmin,admindashboard) 
                                              
export default adminrouter