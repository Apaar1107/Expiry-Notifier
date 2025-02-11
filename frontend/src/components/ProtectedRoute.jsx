import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!tokenExpiry) {
      navigate("/login");
      return;
    }

    const expiryTime = Number(tokenExpiry); // Convert string to number
    const now = new Date().getTime();

    if (now > expiryTime) {
      // Token expired, clear localStorage and redirect to login
     
      localStorage.removeItem("tokenExpiry");
      navigate("/login");
    }
  }, [navigate]); // Ensure it runs on mount

  return <>{children}</>;
};

export default ProtectedRoute;
