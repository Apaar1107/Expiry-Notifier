import { useState } from "react";
import { House, Package, Bell, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "../../components/ui/dialog";
import axios from "axios";
import { STORE_API_END_POINT } from "@/utils/constants";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy API call for logout
  const handleLogout = async () => {
    try {
      await axios.post(`${STORE_API_END_POINT}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("tokenExpiry");
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <House size={20} /> },
    { path: "/categories", name: "Categories", icon: <Package size={20} /> },
    { path: "/notifications", name: "Notifications", icon: <Bell size={20} /> },
    { path: "/profile", name: "Profile", icon: <User size={20} /> },
  ];

  return (
    <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white z-40 shadow-md flex flex-col">
      <ul className="flex flex-col mt-6 space-y-4 px-4">
        {menuItems.map((item, index) => (
          <li key={index} className="group">
            <Link
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-lg font-semibold hover:bg-gray-700 rounded-lg transition-all duration-300"
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}

        {/* Logout button triggers dialog */}
        <li className="group">
          <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-lg font-semibold hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </li>
      </ul>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-md mx-auto bg-white">
          <DialogHeader className="text-lg font-semibold">Confirm Logout</DialogHeader>
          <p className="text-gray-600">Are you sure you want to logout?</p>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-700 text-center text-sm">
        © 2025 ExpiryTracker
      </div>
    </aside>
  );
};

export default Sidebar;
