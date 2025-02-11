// import { Outlet } from "react-router-dom";
// import Navbar from "./shared/Navbar";
// import Sidebar from "./shared/Sidebar";

// const Layout = () => {
//   return (
//     <div className="flex flex-col h-screen">
//       {/* Navbar */}
//       <Navbar />

//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <div
//           className="flex-1 overflow-y-auto bg-gray-100 p-4"
//           style={{
//             marginTop: "4rem", // Adjust based on the Navbar height
//             marginLeft: "16rem", // Adjust based on the Sidebar width
//           }}
//         >
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { Outlet } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Sidebar from "./shared/Sidebar";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar (Always Visible) */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (Hidden on Mobile & Tablet) */}
        <aside className="hidden md:block w-64">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-100 to-blue-200 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
