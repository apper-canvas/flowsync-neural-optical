import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const WorkflowNode = ({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onUpdate,
  onDelete,
  onConnect,
  connections
}) => {
  const [showConnectionDot, setShowConnectionDot] = useState(false);

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

  const handleMouseDown = (event) => {
    event.preventDefault();
    onDragStart(node.id, event);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onSelect(node);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(node.id);
  };

  return (
    <div
      className={cn(
        "absolute w-72 bg-white rounded-xl border-2 shadow-lg transition-all duration-200 cursor-move group hover:shadow-xl hover:scale-[1.02]",
        isSelected 
          ? "border-primary shadow-primary/20 ring-2 ring-primary/20" 
          : "border-gray-200 hover:border-primary/30"
      )}
      style={{
        left: node.position.x,
        top: node.position.y
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setShowConnectionDot(true)}
      onMouseLeave={() => setShowConnectionDot(false)}
    >
      {/* Header */}
      <div className={cn(
        "p-4 rounded-t-xl bg-gradient-to-r text-white",
        typeColors[node.type] || "from-gray-500 to-gray-600"
      )}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <ApperIcon 
              name={serviceIconMap[node.service] || "Zap"} 
              className="w-5 h-5 text-white" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{node.service}</h3>
            <p className="text-sm opacity-90 truncate">{node.action}</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className={cn(
              "px-2 py-1 bg-white/20 rounded-full text-xs font-medium",
              node.type === "trigger" ? "text-white" : "text-white"
            )}>
              {node.type}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {node.config && Object.keys(node.config).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(node.config).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-gray-900 font-medium truncate max-w-[150px]">
                  {String(value)}
                </span>
              </div>
            ))}
            {Object.keys(node.config).length > 3 && (
              <p className="text-xs text-gray-500">
                +{Object.keys(node.config).length - 3} more settings
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <ApperIcon name="Settings" className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Not configured</p>
            <p className="text-xs text-gray-400">Click to configure</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ApperIcon name="X" className="w-3 h-3" />
        </button>
      </div>

      {/* Connection Points */}
      {showConnectionDot && (
        <>
          {node.type === "action" && (
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            </div>
          )}
          {node.type === "trigger" && (
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg"></div>
            </div>
          )}
        </>
      )}

      {/* Status Indicator */}
      <div className="absolute bottom-2 left-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          node.config && Object.keys(node.config).length > 0
            ? "bg-green-500" 
            : "bg-yellow-500"
        )}></div>
      </div>
    </div>
  );
};

export default WorkflowNode;