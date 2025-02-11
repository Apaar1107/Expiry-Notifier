import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setStore } from "@/redux/authSlice";
import { STORE_API_END_POINT } from "@/utils/constants";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ClipLoader } from "react-spinners";

const profileSchema = z.object({
  picture: z.any(),
  storename: z.string().optional(),
  ownername: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  location: z.string().optional(),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      storename: "",
      ownername: "",
      email: "",
      phone: "",
      location: "",
      picture: null,
    },
  });

  const { reset, handleSubmit, watch } = form;

  // Prefill form data from Redux store
  useEffect(() => {
    if (store) {
      reset({
        storename: store.storename || "",
        ownername: store.ownername || "",
        email: store.email || "",
        phone: store.phone?.toString() || "",
        location: store.location || "",
      });
    }
  }, [store, reset]);

  // Form Submit Handler
  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("storename", values.storename);
      formData.append("ownername", values.ownername);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("location", values.location);

      if (values.picture && values.picture.length > 0) {
        formData.append("picture", values.picture[0]);
      }

      const response = await axios.put(`${STORE_API_END_POINT}/updatePersonalInformation`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(setStore(response.data.updatedStore));
        toast.success("Profile updated successfully");
      }
    } catch {
      toast.error("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <div className="w-full max-w-2xl bg-gradient-to-b from-gray-200 to-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Update Profile</h2>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <div className="mt-2 w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {watch("picture")?.length > 0 ? (
                      <img src={URL.createObjectURL(watch("picture")[0])} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : store.image ? (
                      <img src={store.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <FormLabel className="font-bold">Profile Picture</FormLabel>
                  <FormControl>
                    <input type="file" onChange={(e) => field.onChange(e.target.files)} className="block w-full p-2 border border-black rounded font-semibold" />
                  </FormControl>
                  <FormMessage />
                  
                </FormItem>
              )}
            />

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <FormField
                control={form.control}
                name="storename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Store Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner Name */}
              <FormField
                control={form.control}
                name="ownername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Phone</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="font-bold">Location</FormLabel>
                    <FormControl >
                      <Input {...field} className=" font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-full font-medium shadow-md hover:from-gray-900 hover:to-gray-700 transition-transform transform hover:scale-105" disabled={loading}>
                {loading ? <ClipLoader size={20} color="white" /> : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
