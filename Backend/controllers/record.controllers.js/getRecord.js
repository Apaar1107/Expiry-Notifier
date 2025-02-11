const Category = require("../../models/record.model.js/category.model");
const Record =require("../../models/record.model.js/Record");
const Store = require("../../models/store.model.js/Store");



exports.getAllItems = async (req, res) => {
  try {
    const storeId = req.store._id;

    // Validate storeId
    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required.",
      });
    }

    // Check if the store exists
    const existingStore = await Store.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({
        success: false,
        message: "Store doesn't exist.",
      });
    }

    // Fetch records
   

    const record = await Record.find({ store: storeId })
      .sort({ createdAt: -1 })
      .populate({ path: "category", select: "category _id" })
      

    if (record.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No records found for this store.",
      });
    }

    

    return res.status(200).json({
      success: true,
      record,
      
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving records.",
    });
  }
};


exports.getAllItemsByCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const storeId = req.store._id;
  
      // Check if the store exists
      const existingStore = await Store.findById(storeId);
      if (!existingStore) {
        return res.status(404).json({
          success: false,
          message: "Store doesn't exist.",
        });
      }
  
      // Check if the category exists
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category doesn't exist.",
        });
      }
  
      // Fetch items for the given category and store
      const allItems = await Record.find({ category: categoryId, store: storeId }).populate('category').sort({ createdAt: -1 }); // Populate category if needed
  
      return res.status(200).json({
        success: true,
        message: "Fetched all items successfully",
        allItems: allItems,
      });
    } catch (error) {
      console.error("Error fetching items by category:", error.message); // Logging the error for better debugging
      return res.status(500).json({
        success: false,
        message: "Server error while fetching items.",
      });
    }
  };

  exports.getItemByCategory =async (req,res)=>{
     try {
      const categoryId = req.params.categoryId;
      const recordId= req.params.recordId;
      const storeId = req.store._id;

        if (!categoryId || !recordId) {
              return res.status(400).json({
                success: false,
                message: "Category or record information is missing.",
              });
            }
        
            const store = await Store.findById(storeId);
            if (!store) {
              return res.status(404).json({
                success: false,
                message: "Store does not exist.",
              });
            }

            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
              return res.status(404).json({
                success: false,
                message: "Category doesn't exist.",
              });
            }

            const record = await Record.findOne({_id:recordId,category:categoryId}).sort({ createdAt: -1 });
            if (!record) {
              return res.status(404).json({
                success: false,
                message: "record doesn't exist.",
              });
            }

            res.status(200).json({
              success:true,
              message:"Record fetched successfully",
              record
            })



     } catch (error) {
      console.error("Error fetching record by category:", error.message); // Logging the error for better debugging
      return res.status(500).json({
        success: false,
        message: "Server error while fetching record.",
      });
     }
  }



  
  