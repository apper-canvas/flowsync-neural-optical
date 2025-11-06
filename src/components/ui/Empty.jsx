import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = forwardRef(({ 
  className,
  title = "No items found",
  description = "Get started by creating your first item",
  icon = "Package",
  actionLabel = "Create New",
  onAction,
  showAction = true,
  variant = "default",
  ...props 
}, ref) => {
  if (variant === "compact") {
    return (
      <div 
        ref={ref}
        className={cn("text-center py-8", className)}
        {...props}
      >
        <ApperIcon name={icon} className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{title}</p>
        {showAction && onAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="mt-3"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  if (variant === "workflows") {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center min-h-[500px] p-8 text-center",
          className
        )}
        {...props}
      >
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Workflow" className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="Plus" className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Create your first workflow</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Start automating your work by connecting your favorite apps and services. 
            It only takes a few minutes to set up your first automation.
          </p>
        </div>
        
        {showAction && onAction && (
          <div className="space-y-4">
            <Button
              onClick={onAction}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8"
            >
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Create Workflow
            </Button>
            <p className="text-xs text-gray-500">Or browse templates to get started faster</p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm mx-auto opacity-60">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">Trigger</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="ArrowRight" className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">Action</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500">Result</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">{description}</p>
      </div>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
});

Empty.displayName = "Empty";

export default Empty;