import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params:{
        folder : "assignments",
        resource_type : "raw",
        allowed_formats : ["pdf"],
    }
});

const upload = multer({storage});

export default upload;