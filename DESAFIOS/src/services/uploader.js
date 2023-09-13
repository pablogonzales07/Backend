import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        if(file.fieldname === "profileUser"){
            cb(null,`${__dirname}/public/profiles`)
        }else if(file.fieldname === "productImage"){
            cb(null,`${__dirname}/public/products`)
        } else{
            cb(null,`${__dirname}/public/documents`)
        }
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage});
export default uploader;