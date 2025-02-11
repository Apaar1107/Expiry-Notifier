import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { STORE_API_END_POINT } from "@/utils/constants";

const RecentAdded = () => {
  const [recentAddedItems, setRecentAddedItems] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentAddedItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${STORE_API_END_POINT}/getrecentadded`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setRecentAddedItems(response.data.recentlyAddedProducts);
        }
      } catch {
        setError("Failed to fetch recently added items.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAddedItems();
  }, []);

  // Filter items based on the search term
  const filteredItems = recentAddedItems?.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wholesaler.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toString().includes(searchTerm) ||
      item.category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(item.createdAt).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-6xl mb-8">
        <h1 className="text-4xl font-bold mt-6 text-gray-800 dark:text-white mb-4">
          Recently Added Items
        </h1>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search items by name, wholesaler, batch number, category, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table Section */}
      <div className="w-full max-w-7xl overflow-x-auto shadow-xl border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
        <table className="w-full text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Wholesaler</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Batch</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-red-500">{error}</td>
              </tr>
            ) : filteredItems?.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
                  onClick={() => navigate(`/categories/items/${item.category._id}/updateitem/${item._id}`)}
                >
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <img
                      src={item.image || "/default-item-photo.jpg"}
                      alt={item.product}
                      className="w-10 h-10 rounded-full mx-auto object-cover border border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-3">{item.product}</td>
                  <td className="px-4 py-3">{item.wholesaler}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/categories/items/${item.category._id}`}
                      className="text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.category.category}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">{item.batchNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">No recently added items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAdded;
