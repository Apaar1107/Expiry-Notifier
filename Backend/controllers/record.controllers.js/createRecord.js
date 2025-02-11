const Record = require("../../models/record.model.js/Record");
const Store = require("../../models/store.model.js/Store");
const Category = require("../../models/record.model.js/category.model");
const { uploadCloudinary } = require("../../utils/cloudinary");

exports.createRecord = async (req, res) => {
  try {
    const  categoryId  = req.params.id; // Extract categoryId from request parameters
    const storeId  = req.store._id; // Extract storeId from req.store
    const { product, wholesaler, expiry, batchNumber,quantity, mrp, rate } = req.body;

    // Validate required fields
    if (!product || !wholesaler || !expiry || !rate, !quantity) {
      console.log("Missing required fields...");
      return res.status(400).json({
        status: 400,
        message: "Please fill all required fields: product, wholesaler, expiry, and rate.",
      });
    }
 console.log(categoryId)
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found.",
      });
    }

    // Check if the store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        status: 404,
        message: "Store not found.",
      });
    }
    const existingRecord = await Record.find({ product, wholesaler });

    if (existingRecord.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Do not make duplicate record",
      });
    }
    

    // Image upload
    
    let picture;
    const imagePath = req?.file?.path;
    

    if (imagePath) {
      try {
        picture = await uploadCloudinary(imagePath);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading image to Cloudinary.',
          error: err.message,
        });
      }
    }
    

    // Create a new record
    const record = await Record.create({
      product,
      wholesaler,
      expiry,
      batchNumber,
      quantity,
      image:picture || "",
      mrp,
      rate,
      store: storeId,
      category: categoryId,
    });

    // Update the store to include the new record
    store.record.push(record._id);
    await store.save();

    // Update the category to include the new record
    category.record.push(record._id);
    await category.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Record created successfully",
      record,
    });
  } catch (error) {
    console.error("Error creating record:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating record.",
      error: error.message, // Provide detailed error message
    });
  }
};
