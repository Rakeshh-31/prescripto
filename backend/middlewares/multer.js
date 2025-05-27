import multer from 'multer'

let storage=multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

let upload=multer({
    storage
})

export default upload