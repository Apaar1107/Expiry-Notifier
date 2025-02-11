const jwt = require("jsonwebtoken");
const Store = require("../models/store.model.js/Store");

exports.isAuth = async(req,res,next)=>{
    try{
       
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
     
  
     
    if(!token)
           {
           
            return res.status(401).json({
                sucess:false,
                message:"Token Missing",
            })
           }

        //    verify the token
       try{
        const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const store=await Store.findById(decode._id).select("-password -refreshToken");

        if(!store){
            return res.status(401).json({
                success:false,
                message:"Invalid Access Token"
            })
        }
        req.store = store;

    }catch(err){
        console.log(err.message)
        return  res.status(401).json({
            success:false,
            message:"Invalid Token",
        })
    }
    next();

    }catch (error) {
        console.log(error.message);
        return res.status(401).json({
             success:false,
             message:"Something went wrong , while verify the token",
       });
    }
}