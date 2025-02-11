import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Categories from "./components/Categories";
import Items from "./components/Items";
import UpdateItem from "./components/UpdateItem";
import UpdateCategory from "./components/UpdateCategory";
import AllItems from "./components/AllItems";
import ExpiredItems from "./components/ExpiredItems";
import SoonExpiry from "./components/SoonExpiry";
import RecentAdded from "./components/RecentAdded";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import NotFound from "./components/NotFound"; // Import NotFound component

export const App = () => {
  const appRouter = createBrowserRouter([
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },

    {
      path: "/",
      
      element: ( <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/categories",
          element: (
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/notifications",
          element: (
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          ),
        },
        {
          path: "/allitems",
          element: (
            <ProtectedRoute>
              <AllItems />
            </ProtectedRoute>
          ),
        },
        {
          path: "/expireditems",
          element: (
            <ProtectedRoute>
              <ExpiredItems />
            </ProtectedRoute>
          ),
        },
        {
          path: "/soonexpiryitems",
          element: (
            <ProtectedRoute>
              <SoonExpiry />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recentaddeditems",
          element: (
            <ProtectedRoute>
              <RecentAdded />
            </ProtectedRoute>
          ),
        },
        {
          path: "/categories/updatecategory/:id",
          element: (
            <ProtectedRoute>
              <UpdateCategory />
            </ProtectedRoute>
          ),
        },
        {
          path: "/categories/items/:id",
          element: (
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          ),
        },
        {
          path: "/categories/items/:categoryId/updateitem/:id",
          element: (
            <ProtectedRoute>
              <UpdateItem />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // Catch-all route for 404 Not Found
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={appRouter} />;
};
