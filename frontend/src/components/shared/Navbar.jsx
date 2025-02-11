
import { Bell, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const Navbar = () => {
  const [count, setCount] = useState(0);
  const { notifications } = useSelector((state) => state.notifications);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    const totalCount = notifications.reduce(
      (acc, product) =>
        acc + product.expiredProducts.length + product.soonExpiredProducts.length,
      0
    );
    setCount(totalCount);
  }, [notifications]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Menu items (excluding notifications, which will be placed at the end)
  const menuItems = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/categories", name: "Categories" },
    { path: "/profile", name: "Profile" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center justify-between px-6 z-50 shadow-md">
      <div className="flex items-center space-x-4">
        {isTabletOrMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
        <h1 className="text-lg font-bold">Expiry Notifier</h1>
      </div>

      {/* Right Side - Inline Menu for Tablet & Notification Bell */}
      <div className="flex items-center space-x-6">
        {isTabletOrMobile && (
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path} className="text-lg font-semibold hover:underline">
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Notifications Icon (Always at the End) */}
        <div className="relative">
          <Link to="/notifications">
            <button className="text-lg focus:outline-none">
              <Bell className="w-6 h-6" />
            </button>
          </Link>
          {count > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
      </div>

      {/* Hamburger Menu Drawer for Mobile */}
      {menuOpen && isTabletOrMobile && (
        <div ref={menuRef} className="absolute top-16 left-0 w-60 bg-gray-900 shadow-lg p-4 flex flex-col space-y-4 z-50">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block text-white text-lg py-2 px-4 hover:bg-gray-700 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Notifications Icon at the End of the Hamburger Menu */}
          <Link
            to="/notifications"
            className="block text-white text-lg py-2 px-4 hover:bg-gray-700 rounded-md flex items-center space-x-2"
            onClick={() => setMenuOpen(false)}
          >
            
            <span>Notifications</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
