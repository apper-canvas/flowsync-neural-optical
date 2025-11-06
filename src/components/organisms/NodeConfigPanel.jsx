import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { serviceService } from "@/services/api/serviceService";

const NodeConfigPanel = ({ node, onUpdate, onClose }) => {
  const [config, setConfig] = useState(node.config || {});
  const [actionFields, setActionFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadActionFields();
  }, [node]);

  const loadActionFields = async () => {
    try {
      setIsLoading(true);
      const services = await serviceService.getAll();
      const service = services.find(s => s.name === node.service);
      
      if (service) {
        const actions = node.type === "trigger" ? service.triggers : service.actions;
        const action = actions.find(a => a.name === node.action);
        setActionFields(action?.fields || []);
      }
    } catch (error) {
      console.error("Failed to load action fields:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    const newConfig = { ...config, [fieldName]: value };
    setConfig(newConfig);
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    actionFields.forEach(field => {
      if (field.required && (!config[field.name] || config[field.name].toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      onUpdate({ config });
    }
  };

  const handleReset = () => {
    setConfig(node.config || {});
    setErrors({});
  };

  const serviceIconMap = {
    Gmail: "Mail",
    Slack: "MessageSquare",
    Typeform: "FileText",
    HubSpot: "Users",
    Schedule: "Clock",
    "Google Sheets": "Sheet",
    Instagram: "Instagram",
    Twitter: "Twitter",
    Facebook: "Facebook",
    Dropbox: "Cloud",
    "Google Drive": "HardDrive",
    Zendesk: "Headphones"
  };

  const typeColors = {
    trigger: "from-blue-500 to-blue-600",
    action: "from-green-500 to-green-600"
  };

  if (isLoading) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader2" className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className={cn(
        "p-6 bg-gradient-to-r text-white",
        typeColors[node.type] || "from-gray-500 to-gray-600"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ApperIcon 
                name={serviceIconMap[node.service] || "Zap"} 
                className="w-6 h-6 text-white" 
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{node.service}</h2>
              <p className="text-sm opacity-90">{node.action}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className={cn(
          "px-3 py-1 bg-white/20 rounded-full text-xs font-medium inline-block",
          "text-white"
        )}>
          {node.type}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Configuration</h3>
            
            {actionFields.length > 0 ? (
              <div className="space-y-4">
                {actionFields.map(field => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={config[field.name] || ""}
                    onChange={handleFieldChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Settings" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No configuration required</p>
                <p className="text-sm text-gray-400">This action works without additional setup</p>
              </div>
            )}
          </div>

          {/* Variable Help */}
          {node.type === "action" && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                <ApperIcon name="Info" className="w-4 h-4 mr-2" />
                Dynamic Variables
              </h4>
              <p className="text-xs text-blue-800 mb-2">
                Use variables from trigger data in your configuration:
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{"{{email}}"}</code>
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{"{{name}}"}</code>
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{"{{subject}}"}</code>
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{"{{date}}"}</code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 space-y-3">
        <div className="flex space-x-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            disabled={actionFields.length > 0 && Object.keys(config).length === 0}
          >
            <ApperIcon name="Check" className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={JSON.stringify(config) === JSON.stringify(node.config || {})}
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;