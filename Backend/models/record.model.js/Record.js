const mongoose =require("mongoose");

const recordSchema=new mongoose.Schema({
    
    product:{
        type:String,
        required:true,
    },
    wholesaler:{
        type:String,
        required:true,
    },
    expiry:{
        type:Date,
        required:true,
    },
    batchNumber:{
        type:Number
    },
    mrp:{
        type:Number,
    },
    quantity:{
       type:Number
    },
    image:{
        type:String
    },
    rate:{
        type:Number,
        required:true,
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store",
     
    },category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
},{timestamps:true})

module.exports=mongoose.model("Record",recordSchema);