import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminrouter from './routes/adminroute.js'
import doctorrouter from './routes/doctorroute.js'
import userrouter from './routes/userroute.js'

//app config
let app=express()
let port=process.env.PORT || 4000
connectDB()
connectCloudinary()
//middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

//api end points
app.use('/api/admin',adminrouter)
//localhhost:4000/api/admin/add-doctor

app.use('/api/doctor',doctorrouter)

app.use('/api/user',userrouter)


app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>console.log("Server is Started",port))