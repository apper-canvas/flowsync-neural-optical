import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { workflowService } from "@/services/api/workflowService";
import { cn } from "@/utils/cn";

const WorkflowCard = ({ workflow, onUpdate, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const navigate = useNavigate();

  const handleToggleEnabled = async (e) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      const updatedWorkflow = await workflowService.toggleEnabled(workflow.Id);
      onUpdate(updatedWorkflow);
      toast.success(`Workflow ${updatedWorkflow.enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update workflow status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleTest = async (e) => {
    e.stopPropagation();
    setIsTesting(true);
    try {
      const result = await workflowService.testWorkflow(workflow.Id);
      if (result.success) {
        toast.success(`Test completed in ${result.duration.toFixed(1)}s`);
        onUpdate({ ...workflow, lastRun: result.timestamp });
      } else {
        toast.error("Test failed - check workflow configuration");
      }
    } catch (error) {
      toast.error("Failed to test workflow");
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      try {
        await workflowService.delete(workflow.Id);
        onDelete(workflow.Id);
        toast.success("Workflow deleted successfully");
      } catch (error) {
        toast.error("Failed to delete workflow");
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/edit/${workflow.Id}`);
  };

  const getServiceIcons = () => {
    const services = [];
    workflow.nodes?.forEach(node => {
      if (!services.includes(node.service)) {
        services.push(node.service);
      }
    });
    return services.slice(0, 3); // Show max 3 services
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

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-200 hover:border-primary/20"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1 truncate">
              {workflow.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {workflow.description}
            </p>
          </div>
          <div className="ml-3 flex-shrink-0">
            <StatusBadge status={workflow.enabled ? "enabled" : "disabled"} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Service Icons */}
        <div className="flex items-center space-x-2 mb-4">
          {getServiceIcons().map((service, index) => (
            <div key={index} className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors">
                <ApperIcon 
                  name={serviceIconMap[service] || "Zap"} 
                  className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" 
                />
              </div>
              {index < getServiceIcons().length - 1 && (
                <ApperIcon name="ArrowRight" className="w-3 h-3 text-gray-400 mx-1" />
              )}
            </div>
          ))}
          {getServiceIcons().length > 3 && (
            <span className="text-xs text-gray-500 ml-2">+{getServiceIcons().length - 3} more</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <ApperIcon name="Zap" className="w-4 h-4 mr-1" />
              {workflow.nodes?.filter(n => n.type === "trigger").length || 0} triggers
            </span>
            <span className="flex items-center">
              <ApperIcon name="Play" className="w-4 h-4 mr-1" />
              {workflow.nodes?.filter(n => n.type === "action").length || 0} actions
            </span>
          </div>
          {workflow.lastRun && (
            <span className="flex items-center text-xs">
              <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
              {format(new Date(workflow.lastRun), "MMM d, HH:mm")}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleEnabled}
              disabled={isToggling}
              className={cn(
                "text-xs",
                workflow.enabled 
                  ? "text-success hover:bg-success/10" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {isToggling ? (
                <ApperIcon name="Loader2" className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <ApperIcon name={workflow.enabled ? "PowerOff" : "Power"} className="w-3 h-3 mr-1" />
              )}
              {workflow.enabled ? "Disable" : "Enable"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleTest}
              disabled={isTesting}
              className="text-xs text-primary hover:bg-primary/10"
            >
              {isTesting ? (
                <ApperIcon name="Loader2" className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <ApperIcon name="Play" className="w-3 h-3 mr-1" />
              )}
              Test
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCardClick}
              className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ApperIcon name="Edit" className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-xs text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;