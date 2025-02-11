import { useSelector, useDispatch } from "react-redux";
import { useGetAllNotifications } from "./hooks/useGetAllNotifications";
import { useNavigate } from "react-router-dom";
import { deleteNotification } from "@/redux/noticationSlice";
import axios from "axios";
import { STORE_API_END_POINT } from "@/utils/constants";

const Notifications = () => {
  const navigate = useNavigate();
  useGetAllNotifications();
  const dispatch = useDispatch();

  const { notifications } = useSelector((state) => state.notifications) || { notifications: [] };

  const markAsRead = async (event, notificationId, productId) => {
    event.stopPropagation(); // ✅ Prevent navigation when clicking the button

    try {
      await axios.put(`${STORE_API_END_POINT}/record/${productId}/deleteNotification/${notificationId}`, {}, {
        withCredentials: true,
      });
      dispatch(deleteNotification({ notificationId, productId }));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="p-4 mt-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Notifications</h2>

      {!notifications || notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-gray-800">
            <thead>
              <tr className="bg-gray-700 text-white text-left">
                <th className="border p-3">#</th>
                <th className="border p-3">Image</th>
                <th className="border p-3">Product</th>
                <th className="border p-3">Wholesaler</th>
                <th className="border p-3">Batch No.</th>
                <th className="border p-3">Expiry Date</th>
                <th className="border p-3">MRP</th>
                <th className="border p-3">Quantity</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.flatMap((notification) => 
                [
                  ...notification.expiredProducts.map((product) => ({
                    ...product,
                    status: "Expired",
                    color: "bg-red-100",
                    notificationId: notification._id,
                  })),
                  ...notification.soonExpiredProducts.map((product) => ({
                    ...product,
                    status: "Soon to Expire",
                    color: "bg-orange-100",
                    notificationId: notification._id,
                  })),
                ]
              ).map((product, index) => (
                <tr 
                  key={index} 
                  className={`${product.color} border-b border-gray-300 hover:bg-gray-200 transition`}
                  onClick={() => navigate(`/categories/items/${product.category}/updateitem/${product._id}`)}
                >
                  <td className="border p-3 text-center">{index + 1}</td>
                  <td className="border p-3 flex justify-center">
                    <img src={product.image} alt={product.product} className="w-12 h-12 rounded-full object-cover" />
                  </td>
                  <td className="border p-3">{product.product}</td>
                  <td className="border p-3">{product.wholesaler}</td>
                  <td className="border p-3">{product.batchNumber}</td>
                  <td className="border p-3">{new Date(product.expiry).toDateString()}</td>
                  <td className="border p-3">₹{product.mrp}</td>
                  <td className="border p-3">{product.quantity}</td>
                  <td className={`border p-3 font-semibold text-center ${product.status === "Expired" ? "text-red-600" : "text-orange-600"}`}>
                    {product.status}
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={(event) => markAsRead(event, product.notificationId, product._id)} 
                      className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-full hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105"
                    >
                      Mark as Read
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notifications;
