const express =require("express");
const router=express.Router();

const {createRecord} =require("../controllers/record.controllers.js/createRecord");
const { getAllItemsByCategory, getItemByCategory} =require("../controllers/record.controllers.js/getRecord");
const {updateRecord} =require("../controllers/record.controllers.js/updateRecord");
const {deleteRecord} =require("../controllers/record.controllers.js/deleteRecord");



const {isAuth}  = require("../middlewares/isAuth");
const { upload } = require("../middlewares/multer.middleware");
const { createCategory,updateCategory, deleteCategory } = require("../controllers/record.controllers.js/createCategory");

router.post("/createrecord/:id",  isAuth,upload.single('picture'), createRecord );

router.get("/getallitemsbycategory/:id",isAuth,getAllItemsByCategory );
router.get("/getitembycategory/:categoryId/item/:recordId",isAuth,getItemByCategory);

router.put("/updaterecord/:id",isAuth,upload.single("picture")  ,updateRecord);
router.delete("/deleterecord/:id",isAuth,deleteRecord);

router.post("/createcategory",isAuth,createCategory);
router.post("/updatecategory/:id",isAuth,updateCategory);
router.delete("/deletecategory/:id",isAuth,deleteCategory);



module.exports=router;