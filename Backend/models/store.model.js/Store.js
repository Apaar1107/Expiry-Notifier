const mongoose =require("mongoose");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const storeSchema=new mongoose.Schema({
    storename:{
        type:String,
        required: true,
    },
    ownername:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    location:{
        type:String,
        required:true,
    },
    record:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Record",
    }],
    image:{
        type:String,
    },
    categories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }],
    password:{
       type: String,
       required:true,
    },

})

storeSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password,10);
    next();
})

// storeSchema.methods.isPasswordCorrect =async function(password){
//        return await bcrypt.compare(this.password, password);
// }

storeSchema.methods.generateAccessToken =function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}


module.exports=mongoose.model("Store",storeSchema);