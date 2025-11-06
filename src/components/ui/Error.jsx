import { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = forwardRef(({ 
  className, 
  error = "Something went wrong",
  onRetry,
  showRetry = true,
  variant = "default",
  ...props 
}, ref) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  if (variant === "inline") {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg",
          className
        )}
        {...props}
      >
        <ApperIcon name="AlertCircle" className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
            className="border-red-300 text-red-600 hover:bg-red-100 flex-shrink-0"
          >
            {isRetrying ? (
              <>
                <ApperIcon name="Loader2" className="w-3 h-3 mr-1 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <ApperIcon name="RefreshCw" className="w-3 h-3 mr-1" />
                Retry
              </>
            )}
          </Button>
        )}
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
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">{error}</p>
      </div>
      
      {showRetry && onRetry && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {isRetrying ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
        <p className="text-xs text-gray-500 mb-2">Need help?</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-gray-400">Try refreshing the page or</span>
          <button className="text-primary hover:text-secondary font-medium">
            contact support
          </button>
        </div>
      </div>
    </div>
  );
});

Error.displayName = "Error";

export default Error;