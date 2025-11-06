import { useState, useEffect } from "react";
import { format } from "date-fns";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ExecutionLogCard from "@/components/organisms/ExecutionLogCard";
import ApperIcon from "@/components/ApperIcon";
import { executionLogService } from "@/services/api/executionLogService";
import { workflowService } from "@/services/api/workflowService";

const ExecutionHistory = () => {
  const [logs, setLogs] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workflowFilter, setWorkflowFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [logsData, workflowsData] = await Promise.all([
        executionLogService.getAll(),
        workflowService.getAll()
      ]);
      setLogs(logsData);
      setWorkflows(workflowsData);
    } catch (err) {
      setError("Failed to load execution history. Please try again.");
      console.error("Error loading execution history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWorkflowName = (workflowId) => {
    const workflow = workflows.find(w => w.Id.toString() === workflowId);
    return workflow?.name || "Unknown Workflow";
  };

  const filteredLogs = logs.filter(log => {
    const workflowName = getWorkflowName(log.workflowId);
    const matchesSearch = !searchQuery || 
      workflowName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesWorkflow = workflowFilter === "all" || log.workflowId === workflowFilter;
    
    return matchesSearch && matchesStatus && matchesWorkflow;
  });

  // Statistics
  const totalRuns = logs.length;
  const successfulRuns = logs.filter(log => log.status === "success").length;
  const failedRuns = logs.filter(log => log.status === "error").length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;
  const avgDuration = totalRuns > 0 
    ? (logs.reduce((sum, log) => sum + (log.duration || 0), 0) / totalRuns).toFixed(1)
    : 0;

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Execution History
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor workflow runs and troubleshoot issues
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Runs</p>
              <p className="text-2xl font-bold text-blue-900">{totalRuns}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Play" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Successful</p>
              <p className="text-2xl font-bold text-green-900">{successfulRuns}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Failed</p>
              <p className="text-2xl font-bold text-red-900">{failedRuns}</p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Avg Duration</p>
              <p className="text-2xl font-bold text-purple-900">{avgDuration}s</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {logs.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search execution logs..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </Select>

            <Select
              value={workflowFilter}
              onChange={(e) => setWorkflowFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Workflows</option>
              {workflows.map(workflow => (
                <option key={workflow.Id} value={workflow.Id.toString()}>
                  {workflow.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* Execution Logs */}
      {logs.length === 0 ? (
        <Empty
          title="No execution history"
          description="Your workflow execution logs will appear here once you start running workflows."
          icon="History"
          showAction={false}
        />
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No logs match your filters</p>
          <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map(log => (
            <ExecutionLogCard
              key={log.Id}
              log={log}
              workflowName={getWorkflowName(log.workflowId)}
            />
          ))}
        </div>
      )}

      {/* Success Rate Chart Placeholder */}
      {logs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Trend</h3>
          <div className="h-40 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-700 mb-2">{successRate}%</div>
              <p className="text-gray-600">Overall Success Rate</p>
              <p className="text-sm text-gray-500 mt-2">
                {successfulRuns} successful out of {totalRuns} total runs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionHistory;