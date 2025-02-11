import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { STORE_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import { setStore } from "@/redux/authSlice";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(`${STORE_API_END_POINT}/login`, values, { withCredentials: true });

      if (response.data.success) {
        const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const expiryTime = new Date().getTime() + expiresIn;

        localStorage.setItem("tokenExpiry", expiryTime);
        dispatch(setStore(response.data.store));
        toast.success(response.data.message);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Expiry Notifier</h1>
        <div className="space-x-4">
          <Link to="/login">
            
          </Link>
          <Link to="/signup">
            <Button className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="w-full max-w-md mt-10 from-blue-100 to-blue-200 dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Log In
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition">
              Log In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
