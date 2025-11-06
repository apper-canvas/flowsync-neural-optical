import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, className, showIcon = true }) => {
  const statusConfig = {
    success: {
      variant: "success",
      icon: "CheckCircle",
      label: "Success"
    },
    error: {
      variant: "error", 
      icon: "AlertCircle",
      label: "Error"
    },
    warning: {
      variant: "warning",
      icon: "AlertTriangle", 
      label: "Warning"
    },
    running: {
      variant: "primary",
      icon: "Play",
      label: "Running"
    },
    enabled: {
      variant: "success",
      icon: "Power",
      label: "Enabled"
    },
    disabled: {
      variant: "default",
      icon: "PowerOff",
      label: "Disabled"
    },
    pending: {
      variant: "warning",
      icon: "Clock",
      label: "Pending"
    }
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <Badge 
      variant={config.variant}
      className={cn("gap-1", className)}
    >
      {showIcon && <ApperIcon name={config.icon} className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;