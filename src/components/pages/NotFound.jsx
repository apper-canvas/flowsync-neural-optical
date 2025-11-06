import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            The workflow automation page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-primary to-secondary"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Back to Workflows
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate("/templates")}
              className="flex-1"
            >
              <ApperIcon name="Layout" className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/create")}
              className="flex-1"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Need help?</p>
          <div className="flex justify-center space-x-4 text-xs">
            <button className="text-primary hover:text-secondary font-medium">
              Documentation
            </button>
            <button className="text-primary hover:text-secondary font-medium">
              Support
            </button>
            <button className="text-primary hover:text-secondary font-medium">
              Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;