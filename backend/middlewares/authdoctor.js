
import jwt from 'jsonwebtoken'

//doctor authentication middleware

let authdoctor=async(req,res,next)=>{
  try{
     let {dtoken}=req.headers
     if(!dtoken){
        return res.json({success:false,message:'Not Authorized Login Again'})
     }
     let token_decode=jwt.verify(dtoken,process.env.JWT_SECRET)
     
     req.body.docid=token_decode.id
     next()

     
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}
export default authdoctor