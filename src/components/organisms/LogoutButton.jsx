import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";

const LogoutButton = () => {
  const { logout } = useAuth();
  const { isAuthenticated, user } = useSelector(state => state.user);

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      title="Sign out"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
      <span>Sign out</span>
    </button>
  );
};

export default LogoutButton;