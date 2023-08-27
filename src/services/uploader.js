import multer from 'multer'
import {__dirname} from '../utils.js'

const storage = multer.diskStorage({
    //Carpeta donde voy a guardar los files
    destination:function(req,file,callback){
        callback(null,`${__dirname}/public/img`)
    },
    filename:function(req,file,callback){
        callback(null,`${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({storage})

export default uploader;