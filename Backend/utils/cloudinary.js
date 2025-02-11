const cloudinary= require("cloudinary").v2;
const fs=require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

  exports.uploadCloudinary =async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        // upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type:"auto"})

        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary ", response.url)
        fs.unlinkSync(localFilePath);
        return response.secure_url;
    } catch (error) {
        
        fs.unlinkSync(localFilePath);
        return null;
        
    }
  }