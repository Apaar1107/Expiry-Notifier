const cron = require('node-cron');
const Record = require('../models/record.model.js/Record');
const Store = require('../models/store.model.js/Store');

const Notification = require('../models/store.model.js/Notification'); // Fixed import
const mongoose =require('mongoose')
cron.schedule(  "0 0 * * *", async () => {
    console.log("Running cron job for soon-to-expire and expired products...");
    try {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30); 

        // Find stores that have expiring records
        const storesWithExpiry = await Record.aggregate([
            { 
                $match: { 
                    expiry: { $lte: futureDate } // Fetch both expired & soon-expiring products
                } 
            },
            { 
                $group: { 
                    _id: "$store", 
                    soonExpireProducts: { 
                        $push: { 
                            _id: "$_id",
                            product: "$product",
                            wholesaler: "$wholesaler",
                            expiry: "$expiry",
                            batchNumber: "$batchNumber",
                            mrp: "$mrp",
                            quantity: "$quantity",
                            image: "$image",
                            rate: "$rate",
                            category:"$category",
                            status: {
                                $cond: { if: { $lt: ["$expiry", today] }, then: "expired", else: "soon-to-expire" }
                            }
                        } 
                    }
                } 
            }
        ]);
        
        
        for (const storeData of storesWithExpiry) {
            const storeID = storeData._id;
            const soonExpireProducts = storeData.soonExpireProducts;
            

            // Separate expired and soon-to-expire products
            const expiredProducts = soonExpireProducts.filter(product => product.status === "expired");
            const soonToExpireProducts = soonExpireProducts.filter(product => product.status === "soon-to-expire");

          
           
            
            
            const notificationData = {
                _id: new mongoose.Types.ObjectId(), // Generate an ID for frontend consistency
                store: storeID,
                message: `Your store has ${expiredProducts.length} expired products and ${soonToExpireProducts.length} soon-to-expire products.`,
                 expiredProducts:expiredProducts.map((product)=>product._id), // Only ObjectIds like DB
                 soonExpiredProducts:soonToExpireProducts.map((product)=>product._id), // Only ObjectIds
                isRead: false, // WebSocket notifications are unread initially
                createdAt: new Date() // Ensure consistent sorting
            };

          
    // Store in DB if user is offline
    
        await Notification.create(notificationData);
        
    
        
    

          
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});

module.exports = cron;
