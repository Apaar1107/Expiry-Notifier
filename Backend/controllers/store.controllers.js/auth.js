const Store=require("../../models/store.model.js/Store");
const Category = require("../../models/record.model.js/category.model");
const Record = require("../../models/record.model.js/Record");
const bcrypt=require("bcrypt");
require("dotenv").config();
const jwt=require("jsonwebtoken");
const { uploadCloudinary } = require("../../utils/cloudinary");

exports.signUp=async(req,res)=>{
      
    try {
        
        // fetch the data
       const  {storename,ownername,location,email,phone,password}=req.body;

       if(!storename || !ownername || !location || !email || !phone || !password){
        res.status(400).json(
            {
                success:false,
                message:"Please fill all the fields carefully",
            }
        );
       }
    //    check if user already exist

     const existingStore=await Store.findOne({email});

     if(existingStore)
     {
        return res.status(400).json(
            {
                success:false,
                message:"Store Already Exists",
            }
        )
     }
     const imagePath=req?.file?.path;
      
    
     let picture;
     if(imagePath){
       picture= await uploadCloudinary(imagePath);
     }
    

    let hashedPassword;
    try{
        hashedPassword= await bcrypt.hash(password,10);

    }catch(err){
       return res.status(500).json(
            {
                suceess:false,
                message:"issue in hashing password"
            }
        )
    }

    // create entry for user

    const store=await Store.create({
        storename,ownername,location,email,phone,password:hashedPassword,
        image:picture || ""
    })

    res.status(200).json({
        success:true,
        message:"Store  Created Successfully"
    })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Store cannot be registered ,please try again later"
        })
        
    }
}


exports.logIn =async(req,res)=>{
    
    try {
        
       const  {email,password}=req.body;
    

       if(!email || !password){
        res.status(400).json(
            {
                success:false,
                message:"Please fill all the fields carefully",
            }
        );
       }

       let store= await Store.findOne({email});
      

       if(!store){
        res.status(401).json({
            success:false,
            message:"Store is not registered",
        })
       }

       const isPasswordValid=  bcrypt.compare(password,store.password);

       if(!isPasswordValid){
         return res.status(401).json(
            {
                success:false,
                message:"Invalid Credentials",
            }
         )
       }
       let accessToken;
     
      try {
         accessToken= store.generateAccessToken();
       

       


      } catch (error) {

          return res.status(500).json({
            success:false,
            message:"Something went wrong while generating refresh and access token"
          })
      }

      store.password=undefined;
    

      const options={
        expires:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ,
        httpOnly:true,
        secure:true
      }

      
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .json({
        success:true,
        store,
        message:"User loggedIn successfully"
      })

       


   
    } catch (error) {
        

        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        })
    }
}

exports.logOut =async (req,res)=>{
       try {
           
           const options={
            httpOnly:true,
            secure:true
           }

           return res
           .status(200)
           .clearCookie("accessToken",options)
           .clearCookie("refreshToken",options)
           .json({
               success:true,
               message:"User Logged Out Successfully",
           })

       } catch (error) {
        res.status(500).json({
            message:"Server error",
            success:false,
        })
       }
}

exports.refreshAccessToken =async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
     
    if(!incomingRefreshToken){
        return res.status(401).json({
            success:false,
            message:"Invalid Refresh Token"
        })
    }

    try {
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const store=await Store.findById(decodedToken?._id);

        if(!store){
            return res.status(401).json({
                success:false,
                message:"Invalid refresh token"
            })
        }

        if(store.refreshToken !== incomingRefreshToken){
            return res.status(401).json({
                success:false,
                message:"Refresh token is expired"
            })
        }

        const options={
            httpOnly:true,
            secure:true
        }
        let accessToken;
        let newRefreshToken;
       try {
          accessToken= store.generateAccessToken();
          newRefreshToken =store.generateRefreshToken();
 
        store.refreshToken=newRefreshToken;
        await store.save({validateBeforeSave:false});
 
        
 
 
       } catch (error) {
 
           return res.status(500).json({
             success:false,
             message:"Something went wrong while generating refresh and access token"
           })
       }

       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",newRefreshToken,options)
       .json({
          success:true,
          message:"Access token refreshed",
          accessToken,
          refreshToken:newRefreshToken
       })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:error.message || "Invalid refresh token"
        })
    }
   

    
}

exports.updateDashboard = async (req, res) => {
    try {
      const storeID = req.store._id;
  
      if (!storeID) {
        return res.status(400).json({
          success: false,
          message: "Store information is missing.",
        });
      }
  
      const store = await Store.findById(storeID);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store does not exist.",
        });
      }
  
      // Fetch categories and records
      const categories = await Category.find({ store: storeID });
      const records = await Record.find({ store: storeID });
  
      // Metrics calculations
      const totalCategories = categories.length;
      const totalProducts = records.length;
  
      // Expired products length
      const expiredProducts = records.filter(
        (record) => new Date(record.expiry) < new Date()
      );
      const expiredProductsLength = expiredProducts.length;
  
      // Expire soon products (e.g., expiring within 30 days)
      const expireSoonProducts = records.filter((record) => {
        if (!record.expiry) { // Use "expiry" instead of "expiryDate"
          console.error("Missing expiry for record:", record);
          return false;
        }
      
        const expiryDate = new Date(record.expiry); // Use "expiry" field here
        if (isNaN(expiryDate)) {
          console.error("Invalid expiry for record:", record);
          return false;
        }
      
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30);
      
        // Compare expiryDate directly
        return expiryDate >= today && expiryDate <= futureDate;
      });
      
      const expireSoonProductsLength = expireSoonProducts.length;
      
     
      
      
  
      // Total value of store (rate * quantity)
      const totalValue = records.reduce(
        (sum, record) => sum + record.rate * record.quantity,
        0
      );
  
      // Expected value (MRP * quantity)
      const expectedValue = records.reduce(
        (sum, record) => sum + record.mrp * record.quantity,
        0
      );
  
      // Overall quantity
      const overallQuantity = records.reduce(
        (sum, record) => sum + record.quantity,
        0
      );
  
      // Recently added products (e.g., added within the last 7 days)
      const recentlyAddedProducts = records.filter((record) => {
        const addedDate = new Date(record.createdAt);
        const today = new Date();
        return addedDate >= new Date(today.setDate(today.getDate() - 7));
      });
      const recentlyAddedProductsLength = recentlyAddedProducts.length;
  
      // Return the calculated data
      return res.status(200).json({
        success: true,
        data: {
          totalCategories,
          totalProducts,
          expiredProductsLength,
          expireSoonProductsLength,
          totalValue,
          expectedValue,
          overallQuantity,
          recentlyAddedProductsLength,
        },
      });
    } catch (error) {
      console.error("Error in updating dashboard:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  
  exports.getSoonExpiry = async (req, res) => {
    try {
      const storeID = req.store._id;
      
      if (!storeID) {
        return res.status(400).json({
          success: false,
          message: "Store information is missing.",
        });
      }
  
      const store = await Store.findById(storeID);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store does not exist.",
        });
      }
  
      const records = await Record.find({ store: storeID }).sort({createdAt:-1}).populate({path:'category',select:"category _id"});
  
      const expireSoonProducts = records.filter((record) => {
        if (!record.expiry) { // Use "expiry" instead of "expiryDate"
          console.error("Missing expiry for record:", record);
          return false;
        }
  
        const expiryDate = new Date(record.expiry); // Use "expiry" field here
        if (isNaN(expiryDate)) {
          console.error("Invalid expiry for record:", record);
          return false;
        }
  
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30); // Set future date to 30 days ahead
  
        // Compare expiryDate directly
        return expiryDate >= today && expiryDate <= futureDate;
      });
  
      return res.status(200).json({
        success: true,
        message: "Fetched all soon-to-expire items successfully.",
        expireSoonProducts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error while fetching soon-to-expire items.",
      });
    }
  };
  
  exports.getExpired = async (req, res) => {
    try {
      const storeID = req.store._id;
  
      if (!storeID) {
        return res.status(400).json({
          success: false,
          message: "Store information is missing.",
        });
      }
  
      const store = await Store.findById(storeID);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store does not exist.",
        });
      }
  
      const records = await Record.find({ store: storeID }).sort({createdAt:-1}).populate({path:'category',select:"category _id"});;
  
      const expiredProducts = records.filter(
        (record) => new Date(record.expiry) < new Date()
      );
  
      return res.status(200).json({
        success: true,
        message: "Fetched all expired items successfully.",
        expiredProducts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error while fetching expired items.",
      });
    }
  };
  
  exports.getRecentAdded = async (req, res) => {
    try {
      const storeID = req.store._id;
  
      if (!storeID) {
        return res.status(400).json({
          success: false,
          message: "Store information is missing.",
        });
      }
  
      const store = await Store.findById(storeID);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store does not exist.",
        });
      }
  
      const records = await Record.find({ store: storeID }).sort({createdAt:-1}).populate({path:'category',select:"category _id"});;
  
      const recentlyAddedProducts = records.filter((record) => {
        const addedDate = new Date(record.createdAt);
        const today = new Date();
        return addedDate >= new Date(today.setDate(today.getDate() - 7)); // Fetch records added within the last 7 days
      });
  
      return res.status(200).json({
        success: true,
        message: "Fetched all recently added items successfully.",
        recentlyAddedProducts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error while fetching recently added items.",
      });
    }
  };
  

  
  exports.updatePersonalInformation = async (req, res) => {
    try {
      const storeId = req.store._id; // Extract storeId from req.store
      const { storename, ownername, email, phone, location } = req.body;
  
      // Basic validation of required fields
      if (!storename || !ownername || !email || !phone || !location) {
        return res.status(400).json({
          success: false,
          message: "All fields (storename, ownername, email, phone, location) are required.",
        });
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format.",
        });
      }
  
      // Validate phone number format (assuming 10-digit number)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number format.",
        });
      }
  
      // Find the store by ID to ensure it exists
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store not found.",
        });
      }
  
      // Handle profile image upload if a file is included in the request
      let profilePicture;
      const imagePath = req?.file?.path;
      if (imagePath) {
        try {
          profilePicture = await uploadCloudinary(imagePath);
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: "Error uploading image to Cloudinary.",
            error: err.message,
          });
        }
      }
  
      // Update the store personal information
      const updatedStore = await Store.findByIdAndUpdate(
        storeId,
        {
          storename,
          ownername,
          email,
          phone,
          location,
          image: profilePicture || store.image, // Only update picture if a new one is provided
        },
        { new: true }
      );
  
      // Return the updated store information
      return res.status(200).json({
        success: true,
        message: "Personal information updated successfully.",
        updatedStore,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Server Error",
      });
    }
  };
  