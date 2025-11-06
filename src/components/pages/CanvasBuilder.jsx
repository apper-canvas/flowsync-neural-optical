import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import WorkflowCanvas from "@/components/organisms/WorkflowCanvas";
import ApperIcon from "@/components/ApperIcon";
import { workflowService } from "@/services/api/workflowService";

const CanvasBuilder = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [workflowData, setWorkflowData] = useState({
    name: "",
    description: "",
    nodes: [],
    connections: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isEditing = Boolean(workflowId);

  useEffect(() => {
    if (isEditing) {
      loadWorkflow();
    } else {
      // Initialize new workflow
      setWorkflowData({
        name: "New Workflow",
        description: "Describe what this workflow does",
        nodes: [],
        connections: []
      });
    }
  }, [workflowId, isEditing]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowService.getById(workflowId);
      if (data) {
        setWorkflow(data);
        setWorkflowData({
          name: data.name,
          description: data.description,
          nodes: data.nodes || [],
          connections: data.connections || []
        });
      } else {
        setError("Workflow not found");
      }
    } catch (err) {
      setError("Failed to load workflow");
      console.error("Error loading workflow:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowUpdate = useCallback(({ nodes, connections }) => {
    setWorkflowData(prev => ({
      ...prev,
      nodes: nodes || [],
      connections: connections || []
    }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    if (!workflowData.name.trim()) {
      toast.error("Workflow name is required");
      return;
    }

    if (workflowData.nodes.length === 0) {
      toast.error("Add at least one node to save the workflow");
      return;
    }

    try {
      setIsSaving(true);
      let result;
      
      if (isEditing) {
        result = await workflowService.update(workflowId, workflowData);
        toast.success("Workflow updated successfully");
      } else {
        result = await workflowService.create(workflowData);
        toast.success("Workflow created successfully");
        navigate(`/edit/${result.Id}`, { replace: true });
      }

      setWorkflow(result);
      setHasChanges(false);
    } catch (err) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} workflow`);
      console.error("Error saving workflow:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (workflowData.nodes.length === 0) {
      toast.error("Add nodes to test the workflow");
      return;
    }

    // Save first if there are changes
    if (hasChanges) {
      await handleSave();
    }

    try {
      setIsTesting(true);
      const targetId = isEditing ? workflowId : workflow?.Id;
      if (!targetId) {
        toast.error("Save the workflow before testing");
        return;
      }

      const result = await workflowService.testWorkflow(targetId);
      if (result.success) {
        toast.success(`Test completed successfully in ${result.duration.toFixed(1)}s`);
      } else {
        toast.error("Test failed - check your workflow configuration");
      }
    } catch (err) {
      toast.error("Failed to test workflow");
      console.error("Error testing workflow:", err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleNameChange = (e) => {
    setWorkflowData(prev => ({ ...prev, name: e.target.value }));
    setHasChanges(true);
  };

  const handleDescriptionChange = (e) => {
    setWorkflowData(prev => ({ ...prev, description: e.target.value }));
    setHasChanges(true);
  };

  if (loading) {
    return <Loading variant="canvas" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadWorkflow} />;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Workflows
          </Button>
          
          <div className="flex items-center space-x-3">
            {isEditing && workflow?.enabled && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Workflow" : "Create Workflow"}
              </h1>
              {hasChanges && (
                <p className="text-sm text-orange-600 font-medium">Unsaved changes</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="border-gray-300"
          >
            <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Workflow Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Workflow Name"
              value={workflowData.name}
              onChange={handleNameChange}
              placeholder="Enter workflow name"
              required
            />
            <Textarea
              label="Description"
              value={workflowData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe what this workflow does"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 min-h-0">
        <WorkflowCanvas
          workflow={workflowData}
          onUpdateWorkflow={handleWorkflowUpdate}
          onSave={handleSave}
          onTest={handleTest}
          isSaving={isSaving}
          isTesting={isTesting}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center">
              <ApperIcon name="Layers" className="w-4 h-4 mr-1" />
              {workflowData.nodes.length} nodes
            </span>
            <span className="flex items-center">
              <ApperIcon name="Link" className="w-4 h-4 mr-1" />
              {workflowData.connections.length} connections
            </span>
            <span className="flex items-center">
              <ApperIcon name="Zap" className="w-4 h-4 mr-1" />
              {workflowData.nodes.filter(n => n.type === "trigger").length} triggers
            </span>
            <span className="flex items-center">
              <ApperIcon name="Play" className="w-4 h-4 mr-1" />
              {workflowData.nodes.filter(n => n.type === "action").length} actions
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <span className="text-sm text-orange-600 font-medium">
                Unsaved changes
              </span>
            )}
            {isEditing && workflow?.lastRun && (
              <span className="text-sm text-gray-500">
                Last run: {new Date(workflow.lastRun).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasBuilder;