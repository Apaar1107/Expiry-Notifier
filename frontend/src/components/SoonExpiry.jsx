import { STORE_API_END_POINT } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

const SoonExpiringItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API se data fetch karo
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${STORE_API_END_POINT}/getsoonexpiry`,{withCredentials:true});
       
        setFilteredItems(response?.data?.expireSoonProducts);
      } catch  {
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          Soon Expiring Items
        </h1>
        <div className="w-full sm:w-96 mt-3 sm:mt-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </div>

      <div className="w-full max-w-7xl overflow-x-auto shadow-xl border border-gray-300 dark:border-gray-700 rounded-xl">
        <table className="w-full text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Wholesaler</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-red-500">{error}</td>
              </tr>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <img src={item.image || "/default-item-photo.jpg"} alt={item.product} className="w-8 h-8 rounded-full mx-auto" />
                  </td>
                  <td className="px-4 py-3">{item.product}</td>
                  <td className="px-4 py-3">{item.wholesaler}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-center">{new Date(item.expiry).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <a href={`/categories/items/${item.category._id}`} className="text-blue-500 hover:underline">
                      {item.category.category}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">{item.batchNumber}</td>
                  <td className="px-4 py-3 text-center">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">No soon-expiring items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoonExpiringItems;
