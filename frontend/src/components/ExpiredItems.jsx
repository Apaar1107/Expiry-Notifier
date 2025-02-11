import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { STORE_API_END_POINT } from "@/utils/constants";

const ExpiredItems = () => {
  const [expiredItems, setExpiredItems] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpiredItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${STORE_API_END_POINT}/getexpired`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setExpiredItems(response.data.expiredProducts);
        }
      } catch {
        setError("Failed to fetch expired items.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpiredItems();
  }, []);

  // Filter expired items based on the search term
  const filteredItems = expiredItems?.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wholesaler.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toString().includes(searchTerm) ||
      item.category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(item.expiry).toLocaleDateString().includes(searchTerm) ||
      new Date(item.createdAt).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center py-10 px-4">
      {/* Header Section */}
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-800 dark:text-white mb-6">
        Expired Items
      </h1>

      {/* Search Box */}
      <div className="w-full max-w-3xl">
        <Input
          type="text"
          placeholder="Search expired items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table Container */}
      <div className="w-full max-w-7xl mt-8 overflow-x-auto shadow-xl border border-gray-300 dark:border-gray-700 rounded-xl">
        <table className="w-full text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <tr className="bg-gray-700 text-white">
              <th className="px-4 sm:px-6 py-3">#</th>
              <th className="px-4 sm:px-6 py-3">Photo</th>
              <th className="px-4 sm:px-6 py-3">Product</th>
              <th className="px-4 sm:px-6 py-3">Wholesaler</th>
              <th className="px-4 sm:px-6 py-3">Quantity</th>
              <th className="px-4 sm:px-6 py-3">Expiry</th>
              <th className="px-4 sm:px-6 py-3">Category</th>
              <th className="px-4 sm:px-6 py-3">Batch</th>
              <th className="px-4 sm:px-6 py-3">Added Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredItems?.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() =>
                    navigate(
                      `/categories/items/${item.category._id}/updateitem/${item._id}`
                    )
                  }
                >
                  <td className="px-4 sm:px-6 py-3 text-center">{index + 1}</td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <img
                      src={item.image || "/default-item-photo.jpg"}
                      alt={item.product}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-3">{item.product}</td>
                  <td className="px-4 sm:px-6 py-3">{item.wholesaler}</td>
                  <td className="px-4 sm:px-6 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    {new Date(item.expiry).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <Link
                      to={`/categories/items/${item.category._id}`}
                      className="text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent navigating to item update page
                    >
                      {item.category.category}
                    </Link>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">{item.batchNumber}</td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No expired items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiredItems;
