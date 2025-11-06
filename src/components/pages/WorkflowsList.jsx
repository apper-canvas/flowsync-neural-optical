import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import WorkflowCard from "@/components/organisms/WorkflowCard";
import ApperIcon from "@/components/ApperIcon";
import { workflowService } from "@/services/api/workflowService";
import { executionLogService } from "@/services/api/executionLogService";

const WorkflowsList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflows();
    loadRecentActivity();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError("Failed to load workflows. Please try again.");
      console.error("Error loading workflows:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activity = await executionLogService.getRecentActivity(5);
      setRecentActivity(activity);
    } catch (err) {
      console.error("Error loading recent activity:", err);
    }
  };

  const handleWorkflowUpdate = (updatedWorkflow) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.Id === updatedWorkflow.Id ? updatedWorkflow : workflow
      )
    );
  };

  const handleWorkflowDelete = (workflowId) => {
    setWorkflows(prev => prev.filter(workflow => workflow.Id !== workflowId));
  };

  const filteredWorkflows = workflows.filter(workflow =>
    !searchQuery || 
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enabledWorkflows = workflows.filter(w => w.enabled).length;
  const totalRuns = recentActivity.length;
  const successRate = totalRuns > 0 
    ? Math.round((recentActivity.filter(log => log.status === "success").length / totalRuns) * 100)
    : 100;

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadWorkflows} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            My Workflows
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor your automation workflows
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/templates")}
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <ApperIcon name="Layout" className="w-4 h-4 mr-2" />
            Browse Templates
          </Button>
          <Button
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-primary to-secondary shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Workflows</p>
              <p className="text-2xl font-bold text-blue-900">{workflows.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Workflow" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Active</p>
              <p className="text-2xl font-bold text-green-900">{enabledWorkflows}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Power" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Success Rate</p>
              <p className="text-2xl font-bold text-purple-900">{successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {workflows.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Workflows Grid */}
      {workflows.length === 0 ? (
        <Empty
          variant="workflows"
          title="Create your first workflow"
          description="Start automating your work by connecting your favorite apps and services. It only takes a few minutes to set up your first automation."
          onAction={() => navigate("/create")}
          actionLabel="Create Workflow"
        />
      ) : filteredWorkflows.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No workflows match your search</p>
          <p className="text-sm text-gray-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map(workflow => (
            <WorkflowCard
              key={workflow.Id}
              workflow={workflow}
              onUpdate={handleWorkflowUpdate}
              onDelete={handleWorkflowDelete}
            />
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/history")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.slice(0, 3).map(log => {
              const workflow = workflows.find(w => w.Id.toString() === log.workflowId);
              return (
                <div key={log.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    log.status === "success" ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {workflow?.name || "Unknown Workflow"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {(log.duration || 0).toFixed(1)}s
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowsList;