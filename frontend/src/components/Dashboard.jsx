import { STORE_API_END_POINT } from "@/utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    totalCategories: 0,
    expireSoon: 0,
    expired: 0,
    recentlyAdded: 0,
    storeValue: 0,
    expectedValue: 0,
    overallQuantity: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${STORE_API_END_POINT}/getdashboarddetails`, { withCredentials: true });
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const nonClickableCards = [
    { name: "Total Items", value: dashboardData.totalProducts },
    { name: "Total Categories", value: dashboardData.totalCategories },
    { name: "Overall Quantity", value: dashboardData.overallQuantity },
    { name: "Store Value", value: `${dashboardData.totalValue}` },
    { name: "Expected Value", value: `${dashboardData.expectedValue}` },
  ];

  const clickableCards = [
    { name: "Expire Soon", link: "/soonexpiryitems", value: dashboardData.expireSoonProductsLength },
    { name: "Expired", link: "/expireditems", value: dashboardData.expiredProductsLength },
    { name: "Recently Added", link: "/recentaddeditems", value: dashboardData.recentlyAddedProductsLength },
    { name: "All Items", link: "/allitems" },
    { name: "All Categories", link: "/categories" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-12 px-4">
      {/* Dashboard Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>

      {/* Non-clickable Cards */}
      <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {nonClickableCards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-600 p-5 rounded-lg shadow-lg flex flex-col justify-center items-center h-24 transition-transform hover:scale-105"
          >
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{card.name}</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Clickable Cards */}
      <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
        {clickableCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 text-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center h-28 hover:scale-105 transition-transform">
  <span className="text-lg font-semibold">{card.name}</span>
  {card.value && <span className="text-xl font-bold">{card.value}</span>}
</div>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
