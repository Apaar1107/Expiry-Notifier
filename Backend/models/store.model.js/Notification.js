const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    message: { type: String, required: true },
    expiredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }],
    soonExpiredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }], // Expiring products
    isRead: { type: Boolean, default: false }, // To track if store has seen the notification
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
