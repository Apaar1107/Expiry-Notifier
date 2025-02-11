const express =require("express");
require("dotenv").config();
const cookie=require("cookie-parser");
const dbConnect= require("./config/database");
const recordRoutes=require("./routes/record");
const storeRoutes =require("./routes/store");
var cors=require("cors");
const app= express();
const  path= require("path");
// const { app, server } = require('./socket');
const cron =require('./utils/cron-job')

const PORT=process.env.PORT || 8000;

const _dirname=path.resolve();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookie());


app.use(
    cors({
      origin: "http://localhost:5173/",
      credentials: true,
      // exposedHeaders: ['Authorization'],
      
      
    })
  );

  
app.use("/api/v1/record",recordRoutes);
app.use("/api/v1/store",storeRoutes);
app.listen(PORT,()=>{
    console.log(`The server is up and running at port ${PORT}`);
})

app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(req,res)=>{
   res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
});

dbConnect();

app.get("/",(req,res)=>{
    res.send(`<h1>Backend Is Running </h1>`); 
})