
import jwt from 'jsonwebtoken'

//user authentication middleware

let authuser=async(req,res,next)=>{
  try{
     let {token}=req.headers
     if(!token){
        return res.json({success:false,message:'Not Authorized Login Again'})
     }
     let token_decode=jwt.verify(token,process.env.JWT_SECRET)
     
     req.body.userid=token_decode.id
     next()

     
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}
export default authuser