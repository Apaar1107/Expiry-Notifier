import {  useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { ClipLoader } from "react-spinners"; 


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import axios from "axios";
import { useGetAllCategoryItems } from "./hooks/useGetAllCategoryItems";
import { RECORD_API_END_POINT } from "@/utils/constants";
import { setAllItems } from "@/redux/recordSlice";
import { setLoading } from "@/redux/loadingSlice";
import { toast } from "sonner";

const Items = () => {
  const { id } = useParams();
 

  const dispatch = useDispatch();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useGetAllCategoryItems(id);
  const { allItems,allCategories } = useSelector((store) => store.record);
    
  const {loading}  =useSelector((store)=>store.loading)

  const formSchema = z.object({
    product: z
      .string()
      .min(2, { message: "Product name must be at least 2 characters" })
      .max(50, { message: "Product name cannot exceed 50 characters" }),
    wholesaler: z
      .string()
      .min(2, { message: "Wholesaler name must be at least 2 characters" })
      .max(50, { message: "Wholesaler name cannot exceed 50 characters" }),
    batchNumber: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: "Batch number must be a number" })
      .transform((val) => Number(val)),
    expiry: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Expiry must be a valid date" })
      .transform((val) => new Date(val)),
      quantity: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: "Quantity must be a number" })
      .transform((val) => Number(val)),
    mrp: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: "MRP must be a number" })
      .transform((val) => Number(val)),
    rate: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: "Rate must be a number" })
      .transform((val) => Number(val)),
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
      quantity:0,
      mrp: 0,
      rate: 0,
      picture: null,
    },
  });



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
      
      const response = await axios.post(`${RECORD_API_END_POINT}/createrecord/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      
      if (response.data.success) {
        const newRecord = response.data.record;
        
        const updatedRecords = [newRecord, ...allItems];
        dispatch(setAllItems(updatedRecords));
        toast.success(response.data.message)
        form.reset();
        setDialogOpen(false); // Close dialog box on success
        dispatch(setLoading(false)); 
        
      }
    } catch (error) {
    toast.error(error?.response?.data?.message)
      console.error(error?.response?.data?.message);
    }
    finally {
      dispatch(setLoading(false)); // Stop loading after the request
    }
  };
  

  const filteredItems = allItems.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wholesaler.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toString().includes(searchTerm)
  );
  const categoryName = useMemo(() => {
    return allCategories?.find((category) => category._id === id)?.category ?? "Items";
  }, [allCategories, id]);

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <div className="flex justify-between items-center mt-8 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{categoryName + " Items"}</h1>


        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-full font-medium shadow-md hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105"
            >
              + Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl mx-auto ">
  <DialogHeader>
    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
      Add New Item
    </DialogTitle>
  </DialogHeader>

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter product name" />
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
              <FormLabel>Wholesaler Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter wholesaler name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Number</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Enter batch number" />
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
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" placeholder="Enter Expiry Date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Enter the Quantity" />
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
              <FormLabel>MRP</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Enter the MRP" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Enter the Rate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
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

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-full font-medium shadow-md hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105"
      >
        {loading ? <ClipLoader size={24} color="white" /> : "Add Item"}
      </Button>
    </form>
  </Form>
</DialogContent>

        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by product, wholesaler, or batch number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
      {filteredItems.map((item) => (
        <Link
          to={`/categories/items/${id}/updateitem/${item._id}`}
          key={item._id}
          className="block"
        >
          <div
            className="border rounded-xl p-2 shadow-md bg-gradient-to-b from-gray-800 to-white 
            hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            {/* Image at the top */}
            <img
              src={item.image}
              alt={item.product}
              className="w-full h-24 object-cover rounded-lg mb-2"
            />

            {/* Details below the image */}
            <div className="px-1 text-xs text-black">
              <h2 className="text-sm font-semibold">{item.product}</h2>
              <p>Category: {item.category.category}</p>
              <p>Wholesaler: {item.wholesaler}</p>
              <p>Batch No: {item.batchNumber}</p>
              <p>Expiry: {new Date(item.expiry).toLocaleDateString()}</p>
              <p>Qty: {item.quantity}</p>
              <p>MRP: ₹{item.mrp}</p>
              <p>Rate: ₹{item.rate}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>

    </div>
  );
};

export default Items;
