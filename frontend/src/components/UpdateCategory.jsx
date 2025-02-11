import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { RECORD_API_END_POINT } from "@/utils/constants";
import { setAllCategories } from "@/redux/recordSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allCategories } = useSelector((store) => store.record);

  const [categoryData, setCategoryData] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for the delete dialog

  const formSchema = z.object({
    category: z
      .string()
      .min(2, { message: "Category name must be at least 2 characters" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
    },
  });

  useEffect(() => {
    // Fetch category data based on the ID
    const fetchCategory = async () => {
      try {

       
        const category = allCategories.find((item) => item._id === id);
        if (category) {
          setCategoryData(category);
          form.reset({ category: category.category });
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id, allCategories, form]);

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${RECORD_API_END_POINT}/updatecategory/${id}`,
        values,
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedCategory = response.data.newCategory;
        const updatedCategories = allCategories.map((item) =>
          item._id === id ? updatedCategory : item
        );
        dispatch(setAllCategories(updatedCategories));
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await axios.delete(
        `${RECORD_API_END_POINT}/deletecategory/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate("/categories");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  if (!categoryData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center mt-8">
      {/* Heading at the top */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mt-6">
        Update Category
      </h1>

      {/* Form container */}
      <div className="flex-1 w-full max-w-md p-6 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl flex flex-col justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Modify the category details below to keep your records updated.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Update Category Button */}
            <Button
  type="submit"
  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-full font-medium hover:from-gray-900 hover:to-gray-700 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
>
  Update Category
</Button>

            {/* Delete Category Button */}
            <Button
              type="button"
              onClick={handleOpenDeleteDialog} // Open the delete confirmation dialog
              className="w-full bg-red-500 text-white py-3 rounded-full font-medium hover:bg-red-600 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              Delete Category
            </Button>
          </form>
        </Form>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Are you sure you want to delete this category?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Deleting this category will also delete all associated records. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCloseDeleteDialog}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCategory}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Confirm Deletion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCategory;
