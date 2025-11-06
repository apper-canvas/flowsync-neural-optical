import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ field, value, onChange, error }) => {
  const handleChange = (e) => {
    const newValue = field.type === "checkbox" ? e.target.checked : e.target.value;
    onChange(field.name, newValue);
  };

  const commonProps = {
    id: field.name,
    name: field.name,
    value: field.type === "checkbox" ? undefined : (value || ""),
    onChange: handleChange,
    required: field.required,
    placeholder: field.placeholder,
    error: error,
    label: field.label
  };

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          {...commonProps}
          rows={field.rows || 4}
        />
      );

    case "select":
      return (
        <Select {...commonProps}>
          {field.options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={value || false}
            onChange={handleChange}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor={field.name} className="text-sm text-gray-700">
            {field.label}
          </label>
          {error && <p className="text-sm text-error">{error}</p>}
        </div>
      );

    case "time":
      return (
        <Input
          {...commonProps}
          type="time"
        />
      );

    case "email":
      return (
        <Input
          {...commonProps}
          type="email"
        />
      );

    case "url":
      return (
        <Input
          {...commonProps}
          type="url"
        />
      );

    case "number":
      return (
        <Input
          {...commonProps}
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );

    default:
      return (
        <Input
          {...commonProps}
          type="text"
          maxLength={field.maxLength}
        />
      );
  }
};

export default FormField;