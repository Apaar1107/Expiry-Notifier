const Category = require("../../models/record.model.js/category.model");
const Record = require("../../models/record.model.js/Record");
const Store = require("../../models/store.model.js/Store");

exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const storeId = req.store?._id; // Ensure req.store is defined

    // Validate input
    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "Store information is missing.",
      });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store does not exist.",
      });
    }

    // Check if category already exists for this store
    const existingCategory = await Category.findOne({ category, store: storeId });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists for this store.",
      });
    }

    // Create new category
    const newCategory = await Category.create({ category, store: storeId });

    // Associate the category with the store
    store.categories.push(newCategory._id);
    await store.save({ validateBeforeSave: false });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating category.",
    });
  }
};


exports.getAllCategories = async (req, res) => {
    try {
      const storeId = req.store._id; // Extract store ID from the request
  
      // Validate if the store exists
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store does not exist.",
        });
      }
  
      // Fetch all categories for the store and populate the record field
      const allCategories = await Category.find({ store: storeId })
        .sort({ createdAt: -1 })
        .populate({
          path: "record",
          options: { sort: { createdAt: -1 } },
        }).populate({path:"category"});
  
      // Return the fetched categories
      return res.status(200).json({
        success: true,
        allCategories,
        message: "Fetched all categories successfully.",
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching categories.",
        error: error.message, // Include detailed error message for debugging
      });
    }
  };
  
  exports.updateCategory =async(req,res)=>{
    try {
      const storeId = req.store._id; // Extract store ID from the request
      const  categoryId  = req.params.id

      const {category}=req.body;
      // Validate if the store exists
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
              status: 404,
              message: "Category not found.",
            });
          }

      if (!category) {
        console.log("Missing required fields...");
        return res.status(400).json({
          status: 400,
          message: "Please fill category field.",
        });
      }

      existingCategory.category=category;

     const newCategory= await existingCategory.save();

     return res.status(200).json({
      success:true,
      message:"Category updated succesfully.",
      newCategory
     })
    } catch (error) {
      console.error("Error updating category:", error.message);

      return res.status(500).json({
        success: false,
        message: "Server error while updating category.",
        error: error.message, // Provide detailed error message
      });
    
    }
  }


  exports.deleteCategory = async (req, res) => {
    try {
      const storeId = req.store._id; // Extract store ID from the request
      const categoryId = req.params.id; // Get category ID from the URL params
  
      // Validate if the store exists
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store does not exist.",
        });
      }
  
      // Validate if the category exists
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
  
      // Delete records associated with the category (if any)
      // You can add your logic here to find and delete all records related to the category from other collections
      // For example, if there are products or items linked to the category:
      const associatedItems = await Record.deleteMany({ category: categoryId }); // Adjust if needed
      
  
      // Now delete the category from the Category collection
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
        return res.status(500).json({
          success: false,
          message: "Error deleting category from Category model.",
        });
      }
  
      // Remove the category from the Store's categories array
      await Store.findByIdAndUpdate(
        storeId,
        { $pull: { categories: categoryId } }, // Assuming `categories` is the field storing category references
        { new: true } // Return the updated store
      );
  
      return res.status(200).json({
        success: true,
        message: "Category and associated records deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while deleting the category.",
        error: error.message, // Provide detailed error for debugging
      });
    }
  };
  