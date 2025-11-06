import { format } from "date-fns";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ExecutionLogCard = ({ log, workflowName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (seconds) => {
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)}ms`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  const getStepIcon = (status) => {
    switch (status) {
      case "success":
        return "CheckCircle";
      case "error":
        return "AlertCircle";
      case "warning":
        return "AlertTriangle";
      default:
        return "Clock";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              log.status === "success" 
                ? "bg-success/10 text-success" 
                : "bg-error/10 text-error"
            )}>
              <ApperIcon 
                name={log.status === "success" ? "CheckCircle" : "AlertCircle"} 
                className="w-5 h-5" 
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{workflowName}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <StatusBadge status={log.status} />
            <div className="text-right text-sm">
              <p className="text-gray-900 font-medium">{formatDuration(log.duration)}</p>
              <p className="text-gray-500 text-xs">duration</p>
            </div>
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 border-t border-gray-100">
          <div className="space-y-4">
            {/* Error Message */}
            {log.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Error Details</h4>
                    <p className="text-sm text-red-700">{log.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trigger Data */}
            {log.triggerData && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                  Trigger Data
                </h4>
                <div className="space-y-1">
                  {Object.entries(log.triggerData).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-blue-700 font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-blue-800 font-mono text-xs">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Execution Steps */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <ApperIcon name="List" className="w-4 h-4 mr-2" />
                Execution Steps
              </h4>
              <div className="space-y-3">
                {log.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                      step.status === "success"
                        ? "bg-success/10 text-success"
                        : step.status === "error"
                        ? "bg-error/10 text-error"
                        : "bg-warning/10 text-warning"
                    )}>
                      <ApperIcon name={getStepIcon(step.status)} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{step.message}</p>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDuration(step.duration)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Step {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{log.steps.length}</p>
                  <p className="text-xs text-gray-500">Total Steps</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-success">
                    {log.steps.filter(s => s.status === "success").length}
                  </p>
                  <p className="text-xs text-gray-500">Successful</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-error">
                    {log.steps.filter(s => s.status === "error").length}
                  </p>
                  <p className="text-xs text-gray-500">Failed</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExecutionLogCard;