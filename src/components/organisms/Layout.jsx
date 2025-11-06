import { Outlet } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-6 lg:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;