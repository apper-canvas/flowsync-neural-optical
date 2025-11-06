import workflowData from "@/services/mockData/workflows.json";

let workflows = [...workflowData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const workflowService = {
  getAll: async () => {
    await delay();
    return workflows.map(workflow => ({ ...workflow }));
  },

  getById: async (id) => {
    await delay();
    const workflow = workflows.find(w => w.Id === parseInt(id));
    return workflow ? { ...workflow } : null;
  },

  create: async (workflowData) => {
    await delay();
    const newId = Math.max(...workflows.map(w => w.Id), 0) + 1;
    const newWorkflow = {
      ...workflowData,
      Id: newId,
      createdAt: new Date().toISOString(),
      lastRun: null,
      enabled: false
    };
    workflows.push(newWorkflow);
    return { ...newWorkflow };
  },

  update: async (id, updateData) => {
    await delay();
    const index = workflows.findIndex(w => w.Id === parseInt(id));
    if (index === -1) return null;
    
    workflows[index] = { 
      ...workflows[index], 
      ...updateData,
      Id: workflows[index].Id
    };
    return { ...workflows[index] };
  },

  delete: async (id) => {
    await delay();
    const index = workflows.findIndex(w => w.Id === parseInt(id));
    if (index === -1) return false;
    
    workflows.splice(index, 1);
    return true;
  },

  toggleEnabled: async (id) => {
    await delay();
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) return null;
    
    workflow.enabled = !workflow.enabled;
    return { ...workflow };
  },

  testWorkflow: async (id) => {
    await delay();
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) return null;
    
    // Simulate test execution
    const testResult = {
      success: Math.random() > 0.2, // 80% success rate
      duration: Math.random() * 3 + 0.5, // 0.5-3.5 seconds
      timestamp: new Date().toISOString(),
      steps: workflow.nodes.map(node => ({
        nodeId: node.id,
        status: Math.random() > 0.1 ? "success" : "error",
        message: `${node.service} ${node.action} executed`,
        duration: Math.random() * 1
      }))
    };

    // Update last run time on successful test
    if (testResult.success) {
      workflow.lastRun = testResult.timestamp;
    }

    return testResult;
  }
};