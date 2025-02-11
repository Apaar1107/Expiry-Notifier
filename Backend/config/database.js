const mongoose=require("mongoose");

require("dotenv");

const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=> console.log("Db Connection Success"))
    .catch((err)=>{
        console.log("Db Connection Issue");
        console.error(err.message);
        process.exit(1);
    })
};

module.exports=dbConnect;