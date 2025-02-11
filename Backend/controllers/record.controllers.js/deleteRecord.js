const Record =require("../../models/record.model.js/Record");
const Store = require("../../models/store.model.js/Store");
const Category = require("../../models/record.model.js/category.model");
exports.deleteRecord = async (req, res) => {
    try {
      const storeId = req.store._id; // Store ID from the request
  
      // Check if the store exists
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          status: 404,
          message: "Store not found.",
        });
      }
  
      // Get the categoryId from the request body
      const categoryId  = req.body.categoryId;

      
  
      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          status: 404,
          message: "Category not found.",
        });
      }
  
      const recordId = req.params.id; // Get the recordId from request params
  
      // Check if the record exists
      console.log(req.params)
      const record = await Record.findById(recordId);
      if (!record) {
        return res.status(404).json({
          status: 404,
          message: "Record not found.",
        });
      }
  
      // Delete the record from the Record model
      await Record.findByIdAndDelete(recordId);
  
      // Remove the record from the Category model (if it's referenced in the `records` field or similar)
      await Category.findByIdAndUpdate(
        categoryId,
        { $pull: { record: recordId } }, // Assuming records is an array of record references
        { new: true }
      );
      await Store.findByIdAndUpdate(
        storeId,
        { $pull: { record: recordId } }, // Assuming records is an array of record references
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "Record deleted successfully, and removed from category.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: 'Server Error',
      });
    }
  };
  