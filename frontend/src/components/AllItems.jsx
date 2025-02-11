import { useGetAllItems } from "./hooks/useGetAllItems";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "./ui/input";


const AllItems = () => {
  useGetAllItems();
  const navigate = useNavigate();
  const allItems = useSelector((state) => state.record.allItemsDashboard);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on the search term (product name, wholesaler, etc.)
  const filteredItems = allItems?.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wholesaler.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toString().includes(searchTerm) ||
      item.category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(item.expiry).toLocaleDateString().includes(searchTerm) ||
      new Date(item.createdAt).toLocaleDateString().includes(searchTerm) // For added date
  );

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8">
  {/* Header Section */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
      All Items
    </h1>

    {/* Search Box */}
    <Input
      type="text"
      placeholder="Search items by name, wholesaler, batch number, category, expiry date, or added date..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-black rounded-lg px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Table of Items */}
  <div className="overflow-x-auto shadow-xl border border-gray-300 rounded-xl">
    <table className="w-full table-auto text-left text-gray-700 dark:text-gray-300">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr className="bg-gray-700 text-white">
          <th className="px-6 py-3">#</th>
          <th className="px-6 py-3">Photo</th>
          <th className="px-6 py-3">Product</th>
          <th className="px-6 py-3">Wholesaler</th>
          <th className="px-6 py-3">Quantity</th>
          <th className="px-6 py-3">Expiry</th>
          <th className="px-6 py-3">Category</th>
          <th className="px-6 py-3">Batch</th>
          <th className="px-6 py-3">Added Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredItems?.length > 0 ? (
          filteredItems.map((item, index) => (
            <tr
              key={item._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate(`/categories/items/${item.category._id}/updateitem/${item._id}`)}
            >
              <td className="px-6 py-3 text-center">{index + 1}</td>
              <td className="px-6 py-3 text-center">
                <img
                  src={item.image || "/default-item-photo.jpg"}
                  alt={item.product}
                  className="w-8 h-8 rounded-full mx-auto"
                />
              </td>
              <td className="px-6 py-3">{item.product}</td>
              <td className="px-6 py-3">{item.wholesaler}</td>
              <td className="px-6 py-3 text-center">{item.quantity}</td>
              <td className="px-6 py-3 text-center">
                {new Date(item.expiry).toLocaleDateString()}
              </td>
              <td className="px-6 py-3">
                <Link
                  to={`/categories/items/${item.category._id}`}
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.stopPropagation()} // Prevent navigating to item update page
                >
                  {item.category.category}
                </Link>
              </td>
              <td className="px-6 py-3 text-center">{item.batchNumber}</td>
              <td className="px-6 py-3 text-center">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={9}
              className="text-center py-4 text-gray-500"
            >
              No items found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AllItems;
