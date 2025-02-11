import { useState } from "react";
import { useGetAllCategoies } from "./hooks/useGetAllCategories";
import { useSelector, useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import axios from "axios";
import { RECORD_API_END_POINT } from "@/utils/constants";
import { setAllCategories } from "@/redux/recordSlice";
import { Button } from "./ui/button";

const Categories = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useGetAllCategoies();
  const { allCategories } = useSelector((store) => store.record);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formSchema = z.object({
    category: z
      .string()
      .min(2, { message: "Category name must be at least 2 characters" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "" },
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${RECORD_API_END_POINT}/createcategory`,
        values,
        { withCredentials: true }
      );

      if (response.data.success) {
        const newCategory = response.data.category;
        const updatedCategories = [newCategory, ...allCategories];
        dispatch(setAllCategories(updatedCategories));

        form.reset();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const filteredCategories = allCategories?.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          All Categories
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
          <Button
  className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105"
  onClick={() => setDialogOpen(true)}
>
  + Add Category
</Button>

          </DialogTrigger>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Category
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                Enter a name for the new category to keep things organized.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Category Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category name"
                          {...field}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <Button
  type="submit"
  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-full font-medium shadow-md hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105"
>
  Add Category
</Button>

              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-black rounded-lg px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto shadow-xl border border-gray-300 rounded-xl">
        <table className="w-full table-auto text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr className="bg-gray-700 text-white">
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3">Added Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories?.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories?.map((category, index) => (
                <tr
                  key={category._id}
                  className="hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/categories/items/${category._id}`)}
                >
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{category.category}</td>
                  <td className="px-6 py-3">{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
  <Button
    className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg shadow-md hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105"
    onClick={(e) => {
      e.stopPropagation(); // Stop row click event
      navigate(`/categories/updatecategory/${category._id}`); // Navigate to update category
    }}
  >
    Update
  </Button>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
