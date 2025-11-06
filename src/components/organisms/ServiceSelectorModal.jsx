import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { serviceService } from "@/services/api/serviceService";

const ServiceSelectorModal = ({ isOpen, onClose, onSelect }) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [serviceActions, setServiceActions] = useState({ triggers: [], actions: [] });
  const [step, setStep] = useState("services"); // "services" | "actions"
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadServices();
      setStep("services");
      setSelectedService(null);
      setSearchQuery("");
      setSelectedCategory("All");
    }
  }, [isOpen]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        serviceService.getAll(),
        serviceService.getCategories()
      ]);
      setServices(servicesData);
      setCategories(["All", ...categoriesData]);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServiceActions = async (service) => {
    try {
      const [triggers, actions] = await Promise.all([
        serviceService.getTriggers(service.Id),
        serviceService.getActions(service.Id)
      ]);
      setServiceActions({ triggers, actions });
      setSelectedService(service);
      setStep("actions");
    } catch (error) {
      console.error("Failed to load service actions:", error);
    }
  };

  const handleServiceSelect = (service) => {
    loadServiceActions(service);
  };

  const handleActionSelect = (action, type) => {
    onSelect({
      service: selectedService.name,
      action: action.name,
      type: type
    });
  };

  const handleBack = () => {
    setStep("services");
    setSelectedService(null);
    setServiceActions({ triggers: [], actions: [] });
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {step === "actions" && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {step === "services" ? "Choose a Service" : `${selectedService?.name} Actions`}
              </h2>
              <p className="text-sm text-gray-600">
                {step === "services" 
                  ? "Select a service to connect to your workflow" 
                  : "Choose a trigger or action to add to your workflow"
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {step === "services" ? (
            <>
              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200 space-y-4">
                <SearchBar
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-full"
                />
                
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Grid */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-24"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredServices.map(service => (
                      <button
                        key={service.Id}
                        onClick={() => handleServiceSelect(service)}
                        className="p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary/10 group-hover:to-secondary/10 rounded-lg flex items-center justify-center transition-colors">
                            <ApperIcon 
                              name={serviceIconMap[service.name] || "Zap"} 
                              className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-xs text-gray-500">{service.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{service.triggers.length} triggers</span>
                          <span>{service.actions.length} actions</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!isLoading && filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No services found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or category filter</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Actions List */
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {/* Triggers */}
                {serviceActions.triggers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                        <ApperIcon name="Zap" className="w-4 h-4 text-blue-600" />
                      </div>
                      Triggers
                    </h3>
                    <div className="space-y-3">
                      {serviceActions.triggers.map(trigger => (
                        <button
                          key={trigger.name}
                          onClick={() => handleActionSelect(trigger, "trigger")}
                          className="w-full p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-left group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                              <ApperIcon name="Zap" className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{trigger.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{trigger.description}</p>
                            </div>
                            <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {serviceActions.actions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                        <ApperIcon name="Play" className="w-4 h-4 text-green-600" />
                      </div>
                      Actions
                    </h3>
                    <div className="space-y-3">
                      {serviceActions.actions.map(action => (
                        <button
                          key={action.name}
                          onClick={() => handleActionSelect(action, "action")}
                          className="w-full p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all duration-200 text-left group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                              <ApperIcon name="Play" className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{action.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            </div>
                            <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {serviceActions.triggers.length === 0 && serviceActions.actions.length === 0 && (
                  <div className="text-center py-12">
                    <ApperIcon name="AlertCircle" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No actions available</p>
                    <p className="text-sm text-gray-500">This service doesn't have any configured triggers or actions</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectorModal;