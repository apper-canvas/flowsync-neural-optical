import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TemplateCard from "@/components/organisms/TemplateCard";
import ApperIcon from "@/components/ApperIcon";
import { templateService } from "@/services/api/templateService";
import { workflowService } from "@/services/api/workflowService";
import { cn } from "@/utils/cn";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreatingFromTemplate, setIsCreatingFromTemplate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, categoriesData] = await Promise.all([
        templateService.getAll(),
        templateService.getCategories()
      ]);
      setTemplates(templatesData);
      setCategories(["All", ...categoriesData]);
    } catch (err) {
      setError("Failed to load templates. Please try again.");
      console.error("Error loading templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      setIsCreatingFromTemplate(true);
      const workflowData = await templateService.createFromTemplate(template.Id);
      const newWorkflow = await workflowService.create(workflowData);
      toast.success(`Created workflow from ${template.name} template`);
      navigate(`/edit/${newWorkflow.Id}`);
    } catch (err) {
      toast.error("Failed to create workflow from template");
      console.error("Error creating workflow from template:", err);
    } finally {
      setIsCreatingFromTemplate(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const popularTemplates = templates.slice(0, 3);

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadTemplates} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Workflow Templates
          </h1>
          <p className="text-gray-600 mt-2">
            Start with pre-built workflows and customize them to your needs
          </p>
        </div>
      </div>

      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Popular Templates</h2>
              <p className="text-sm text-gray-600">Most used automation templates</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
              Trending
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {popularTemplates.map(template => (
              <TemplateCard
                key={template.Id}
                template={template}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {templates.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search templates..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                selectedCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              )}
            >
              {category}
              {category !== "All" && (
                <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {templates.filter(t => t.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Empty
          title="No templates available"
          description="Template library is being updated. Check back soon for pre-built workflows."
          icon="Layout"
          showAction={false}
        />
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No templates match your search</p>
          <p className="text-sm text-gray-500">Try adjusting your search terms or category filter</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory === "All" ? "All Templates" : selectedCategory}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.Id}
                template={template}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories Overview */}
      {categories.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(cat => cat !== "All").map(category => {
              const categoryTemplates = templates.filter(t => t.category === category);
              const avgPopularity = categoryTemplates.length > 0 
                ? Math.round(categoryTemplates.reduce((sum, t) => sum + t.popularity, 0) / categoryTemplates.length)
                : 0;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="p-4 text-left rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {category}
                    </h4>
                    <ApperIcon name="ArrowRight" className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{categoryTemplates.length} templates</span>
                    <span>{avgPopularity}% avg popularity</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isCreatingFromTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center">
            <ApperIcon name="Loader2" className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="font-medium text-gray-900">Creating workflow from template...</p>
            <p className="text-sm text-gray-500">This will only take a moment</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;