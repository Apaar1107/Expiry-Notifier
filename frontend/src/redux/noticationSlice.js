
import { createSlice } from "@reduxjs/toolkit";


// Fetch notifications


const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [] },
  reducers: {
    setNotification: (state, action) => {
      // if (!state.notifications) {
      //   state.notifications = [];
      // }
      state.notifications=action.payload;
    },
    deleteNotification: (state, action) => {
      const { notificationId, productId } = action.payload;
    
      state.notifications = state.notifications
        .map((notification) => {
          if (notification._id === notificationId) {
            // Filter out the product from both arrays
            notification.expiredProducts = notification.expiredProducts.filter(
              (product) => product._id !== productId
            );
            notification.soonExpiredProducts = notification.soonExpiredProducts.filter(
              (product) => product._id !== productId
            );
    
            // If all products are removed, return null (to be filtered out later)
            if (notification.expiredProducts.length === 0 && notification.soonExpiredProducts.length === 0) {
              return null;
            }
          }
          return notification;
        })
        .filter((notification) => notification !== null); // Remove empty notifications
    },
    
  },
});
export const { setNotification,deleteNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;


