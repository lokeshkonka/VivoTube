import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs'

cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

const uploadOnCloudinary = async function (localfilepath) {
  try {
     if (!localfilepath) return null
     const response = cloudinary.uploader.upload(
        localfilepath,{
            resource_type:"auto"
        } 
     )
     console.log(`file uploaded ${(await response).url} `);
     return response
     // once file is uploaded we would like to delete it from server
  } catch (error) {
    console.log(`Error uploading file to Cloudinary: ${error.message}`);
    
    fs.unlinkSync(localfilepath)
    return null
  }
}
export {uploadOnCloudinary}