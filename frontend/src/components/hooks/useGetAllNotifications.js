import { setNotification } from "@/redux/noticationSlice"
import { STORE_API_END_POINT } from "@/utils/constants"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export const useGetAllNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllNotifications = async () => {
       
      try {
        const response = await axios.get(`${STORE_API_END_POINT}/getUnreadNotifications`, { withCredentials: true });

        console.log("Fetched notifications:", response);  // For debugging

        if (response.data.success) {
          // Ensure we are dispatching an array
          const notifications = Array.isArray(response.data.notifications) ? response.data.notifications : [];
          dispatch(setNotification(notifications));
        } else {
          console.error("Failed to fetch notifications", response.data.message);
        }
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    }

    fetchAllNotifications();
  }, [dispatch]); // Ensure dispatch is included as a dependency

};
