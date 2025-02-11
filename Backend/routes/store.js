const express =require("express");
const router=express.Router();

const {signUp,logIn, logOut,updateDashboard, getRecentAdded, getExpired, getSoonExpiry,updatePersonalInformation}=require("../controllers/store.controllers.js/auth");
const { upload } = require("../middlewares/multer.middleware");
const { isAuth } = require("../middlewares/isAuth");
const { getAllCategories } = require("../controllers/record.controllers.js/createCategory");
const {getAllItems }= require("../controllers/record.controllers.js/getRecord");
const  {getUnreadNotifications,deleteNotification}= require('../controllers/store.controllers.js/notification.controller')

router.post("/signup",upload.single('picture'),  signUp);
router.post("/login",logIn);
router.post("/logout",isAuth,logOut);
router.get("/getallcategories",isAuth,getAllCategories);
router.get("/getdashboarddetails",isAuth,updateDashboard);

router.get("/getallitems",isAuth,getAllItems);
router.get("/getsoonexpiry",isAuth,getSoonExpiry);
router.get("/getexpired",isAuth,getExpired);
router.get("/getrecentadded",isAuth,getRecentAdded);
router.get("/getUnreadNotifications",isAuth,getUnreadNotifications)
router.put("/record/:recordId/deleteNotification/:id",isAuth,deleteNotification)
router.put("/updatePersonalInformation",isAuth,upload.single('picture'),updatePersonalInformation)


module.exports=router;