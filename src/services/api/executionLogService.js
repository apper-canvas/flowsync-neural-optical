import executionLogData from "@/services/mockData/executionLogs.json";

let executionLogs = [...executionLogData];

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

export const executionLogService = {
  getAll: async () => {
    await delay();
    return executionLogs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(log => ({ ...log }));
  },

  getById: async (id) => {
    await delay();
    const log = executionLogs.find(l => l.Id === parseInt(id));
    return log ? { ...log } : null;
  },

  getByWorkflowId: async (workflowId) => {
    await delay();
    return executionLogs
      .filter(log => log.workflowId === workflowId.toString())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(log => ({ ...log }));
  },

  create: async (logData) => {
    await delay();
    const newId = Math.max(...executionLogs.map(l => l.Id), 0) + 1;
    const newLog = {
      ...logData,
      Id: newId,
      timestamp: new Date().toISOString()
    };
    executionLogs.push(newLog);
    return { ...newLog };
  },

  getRecentActivity: async (limit = 10) => {
    await delay();
    return executionLogs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(log => ({ ...log }));
  },

  getSuccessRate: async (workflowId) => {
    await delay();
    const workflowLogs = executionLogs.filter(log => log.workflowId === workflowId.toString());
    if (workflowLogs.length === 0) return 100;
    
    const successCount = workflowLogs.filter(log => log.status === "success").length;
    return Math.round((successCount / workflowLogs.length) * 100);
  }
};