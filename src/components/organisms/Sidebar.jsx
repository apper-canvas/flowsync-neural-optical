import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { 
      name: "Workflows", 
      href: "/", 
      icon: "Workflow",
      description: "Manage your automations" 
    },
    { 
      name: "Create", 
      href: "/create", 
      icon: "Plus",
      description: "Build new workflows" 
    },
    { 
      name: "History", 
      href: "/history", 
      icon: "History",
      description: "View execution logs" 
    },
    { 
      name: "Templates", 
      href: "/templates", 
      icon: "Layout",
      description: "Pre-built automations" 
    }
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={() => mobile && setIsMobileOpen(false)}
      className={({ isActive }) =>
        cn(
          "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )
      }
    >
      <ApperIcon 
        name={item.icon} 
        className={cn(
          "mr-3 w-5 h-5 transition-colors",
          location.pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-gray-600"
        )} 
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium">{item.name}</div>
        {!mobile && (
          <div className={cn(
            "text-xs mt-0.5 truncate",
            location.pathname === item.href ? "text-white/80" : "text-gray-500"
          )}>
            {item.description}
          </div>
        )}
      </div>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Menu" className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out"
            style={{ transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Workflow" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  FlowSync
                </h1>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} mobile={true} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="Workflow" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FlowSync
            </h1>
            <p className="text-sm text-gray-500">Automation Builder</p>
          </div>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-3">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Pro Features</h3>
                <p className="text-xs text-gray-500">Unlock advanced automation</p>
              </div>
            </div>
            <button className="w-full px-3 py-2 text-sm font-medium text-primary hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary rounded-lg border border-primary/20 hover:border-transparent transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;