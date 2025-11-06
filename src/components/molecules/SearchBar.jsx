import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  className,
  placeholder = "Search...",
  onSearch,
  value,
  onChange,
  showIcon = true,
  size = "md"
}) => {
  const [localValue, setLocalValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    if (onChange) {
      onChange("");
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const sizeStyles = {
    sm: "h-9",
    md: "h-10", 
    lg: "h-12"
  };

  return (
    <div className={cn("relative", className)}>
      {showIcon && (
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={value !== undefined ? value : localValue}
        onChange={handleChange}
        className={cn(
          sizeStyles[size],
          showIcon && "pl-10",
          localValue && "pr-10"
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;