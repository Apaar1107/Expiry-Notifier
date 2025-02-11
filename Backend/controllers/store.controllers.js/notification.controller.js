const Notification =require('../../models/store.model.js/Notification')

exports.getUnreadNotifications = async (req, res) => {
    try {
        const storeID = req.store._id; // Store ID from authenticated request

        const notifications = await Notification.find({
            store: storeID,
             // Fetch only unread notifications
        })
        .sort({ createdAt: -1 })
        .populate({
            path: "expiredProducts",
            model: "Record",
        })
        .populate({
            path: "soonExpiredProducts",
            model: "Record",
        });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching notifications.",
        });
    }
};



const mongoose = require("mongoose");


exports.deleteNotification = async (req, res) => {
    try {
        const { id, recordId } = req.params; // Notification ID & Product ID
        const storeID = req.store._id; // Store ID from authenticated request

        // Check if the notification exists
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        // Check if the notification belongs to the store making the request
        if (notification.store.toString() !== storeID.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this notification.",
            });
        }

        // Convert recordId to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(recordId);

        // Remove the recordId from both arrays
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            {
                $pull: {
                    expiredProducts: productObjectId,
                    soonExpiredProducts: productObjectId,
                },
            },
            { new: true }
        );

        // If both arrays are empty after update, delete the notification itself
        if (
            updatedNotification.expiredProducts.length === 0 &&
            updatedNotification.soonExpiredProducts.length === 0
        ) {
            await Notification.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: "Notification deleted as it had no products left.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from notification successfully.",
            updatedNotification,
        });

    } catch (error) {
        console.error("Error deleting product from notification:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting product from notification.",
        });
    }
};

