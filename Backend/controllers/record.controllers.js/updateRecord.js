const Record = require("../../models/record.model.js/Record");
const Store = require("../../models/store.model.js/Store");
const { uploadCloudinary } = require("../../utils/cloudinary");

exports.updateRecord = async (req, res) => {
  try {
    const recordId = req.params.id; // Extract recordId from request parameters
    const storeId = req.store._id; // Extract storeId from req.store

    const { product, wholesaler, expiry, batchNumber, quantity, mrp, rate } = req.body;

    // Basic validation of required fields
    if (!product || !wholesaler || !expiry || !batchNumber || !quantity || !mrp || !rate) {
      return res.status(400).json({
        success: false,
        message: "All fields (product, wholesaler, expiry, batchNumber, quantity, mrp, rate) are required.",
      });
    }

    // Validate expiry date format
    if (isNaN(new Date(expiry).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry date format.",
      });
    }

    // Validate quantity, mrp, and rate are positive numbers
    if (quantity <= 0 || mrp <= 0 || rate <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity, MRP, and rate must be positive numbers.",
      });
    }

    // Find the store by ID to ensure it exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    // Find the record by ID
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    // Handle image upload if a file is included in the request
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
    

    // Update the record with new data
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      {
        product,
        wholesaler,
        expiry,
        batchNumber,
        quantity,
        mrp,
        rate,
        image: picture || record.picture, // Only update picture if a new one is provided
      },
      { new: true } // Returns the updated record
    );

    // Return the updated record
    return res.status(200).json({
      success: true,
      message: "Record updated successfully.",
      updatedRecord,
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
