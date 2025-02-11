const mongoose =require("mongoose");

const catrgorySchema= new mongoose.Schema({
     
        category:{
            type:String,
            required:true,
            unique:true
        },
        store:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Store"
        },
        record:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Record"
        }]
     
},{
    timestamps:true
})

module.exports =mongoose.model("Category",catrgorySchema);