import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { ClipLoader } from "react-spinners";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import axios from "axios";
import { toast } from "sonner";
import { RECORD_API_END_POINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/loadingSlice";
import { setAllItems,setItemData } from "@/redux/recordSlice";

const UpdateItem = () => {
  const { categoryId,id } = useParams();
  console.log(categoryId)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allItems,itemData } = useSelector((store) => store.record);
  const { loading } = useSelector((store) => store.loading);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // const [itemData, setItemData] = useState(null);
   
  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };
 

  const formSchema = z.object({
    product: z
      .string()
      .min(2, { message: "Product name must have at least 2 characters." })
      .max(50, { message: "Product name must have no more than 50 characters." }),
    wholesaler: z
      .string()
      .min(2, { message: "Wholesaler name must have at least 2 characters." })
      .max(50, { message: "Wholesaler name must have no more than 50 characters." }),
    batchNumber: z
      .preprocess((value) => Number(value), z
        .number({ invalid_type_error: "Batch number must be a valid number." })
        .positive({ message: "Batch number must be a positive number." })
        .int({ message: "Batch number must be an integer." })),
    expiry: z
      .string()
      .nonempty({ message: "Expiry date is required." })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Expiry date must be a valid date in the format YYYY-MM-DD.",
      })
      .transform((val) => new Date(val)),
    quantity: z
      .preprocess((value) => Number(value), z
        .number({ invalid_type_error: "Quantity must be a valid number." })
        .positive({ message: "Quantity must be a positive number." })
        .int({ message: "Quantity must be an integer." })),
    mrp: z
      .preprocess((value) => Number(value), z
        .number({ invalid_type_error: "MRP must be a valid number." })
        .positive({ message: "MRP must be a positive number." })),
    rate: z
      .preprocess((value) => Number(value), z
        .number({ invalid_type_error: "Rate must be a valid number." })
        .positive({ message: "Rate must be a positive number." })),
    picture: z
      .union([z.undefined(), z.null(), z.instanceof(File)])
      .refine(
        (file) => {
          if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            return validTypes.includes(file.type);
          }
          return true; // If no file is selected, it's valid
        },
        { message: "Only JPEG, PNG, and JPG images are allowed" }
      )
      .refine(
        (file) => {
          if (file) {
            return file.size <= 5 * 1024 * 1024;
          }
          return true; // If no file is selected, it's valid
        },
        { message: "Image size must be less than 5MB" }
      )
      .optional(),
  });
  
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      wholesaler: "",
      batchNumber: "",
      expiry: "",
      quantity: 0,
      mrp: 0,
      rate: 0,
      picture: null,
    },
  });

  const { reset } = form;

  useEffect(() => {

    const fetchData=async ()=>{
      try {
        const response =await axios.get(`${RECORD_API_END_POINT}/getitembycategory/${categoryId}/item/${id}`,{withCredentials:true});
        
        const currentItem = response.data.record;
       
    if (currentItem) {
      // setItemData(currentItem);
      reset({
        product: currentItem.product || "",
        wholesaler: currentItem.wholesaler || "",
        batchNumber: currentItem.batchNumber || "",
        expiry: currentItem.expiry
        ? new Date(currentItem.expiry).toISOString().split("T")[0]
        : "",
        quantity: currentItem.quantity || 0,
        mrp: currentItem.mrp || 0,
        rate: currentItem.rate || 0,
        picture: null,
      });
      
     dispatch(setItemData(currentItem)) ;
      
     
      }
    }
    catch (error) {
      console.log(error)
    }
   
    
    }
    fetchData();
  }, [allItems, id, reset]);

  const onSubmit = async (values) => {
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append("product", values.product);
      formData.append("wholesaler", values.wholesaler);
      formData.append("batchNumber", values.batchNumber);
      formData.append("expiry", values.expiry.toISOString()); // Convert to string
      formData.append("quantity", values.quantity);
      formData.append("mrp", values.mrp);
      formData.append("rate", values.rate);
      if (values.picture) {
        formData.append("picture", values.picture); // Append the file
      }

      const response = await axios.put(`${RECORD_API_END_POINT}/updaterecord/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        // dispatch(
        //   setAllItems(
        //     allItems.map((item) =>
        //       item._id === id ? response.data.updatedRecord : item
        //     )
        //   )
        // );
        setItemData(response.data.updatedRecord )
        toast.success("Item updated successfully");
        // navigate(`/categories/items/${id}`);
      }
    } catch {
      toast.error("An error occurred while updating the item");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onDelete = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.delete(
        `${RECORD_API_END_POINT}/deleterecord/${id}`, {
          data: { categoryId }, // Passing categoryId in the request body as `data`
          withCredentials: true // This sends the cookie with the request (including token if it's stored in cookies)
        }
      );
      if (response.data.success) {
        dispatch(setAllItems(allItems.filter((item) => item._id !== id)));
        toast.success("Item deleted successfully");
        navigate(`/categories/items/${id}`);
      }
    } catch {
      toast.error("An error occurred while deleting the item");
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!itemData) return <div>Loading...</div>;

  return (
 <div className="p-6 max-w-4xl mx-auto mt-8 ">
  <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Item</h1>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
      {/* 1st Row: Image Preview and Upload */}
      <div className="flex space-x-7 items-center">
        {itemData?.image && (
          <img
            src={itemData.image}
            alt="Item"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
        )}
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem  className="w-full">
              <FormLabel className="font-bold ">Upload Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 2nd Row: Product Name & Wholesaler Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Product Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" className="font-semibold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wholesaler"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Wholesaler Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" className="font-semibold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 3rd Row: Batch Number & Expiry Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Batch Number</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="font-semibold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Expiry Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" className="font-semibold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 4th Row: Quantity & MRP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Quantity</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="font-semibold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mrp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">MRP</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="font-semibold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 5th Row: Rate */}
      <FormField
        control={form.control}
        name="rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Rate</FormLabel>
            <FormControl>
              <Input {...field} type="number" className="font-semibold" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 6th Row: Buttons */}
      <div className="flex justify-between">
        <Button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-full font-medium shadow-md hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105 font-semibold"
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Update"}
        </Button>

        <Button
          type="button"
          onClick={handleOpenDeleteDialog}
          className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-semibold"
        >
          Delete
        </Button>
      </div>
    </form>
  </Form>
  {showDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Are you sure you want to delete this item?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
               This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCloseDeleteDialog}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={onDelete}
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

export default UpdateItem;




