import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const workflowService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("workflow_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "nodes_c"}},
          {"field": {"Name": "connections_c"}},
          {"field": {"Name": "enabled_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_run_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(workflow => ({
        ...workflow,
        name: workflow.name_c,
        description: workflow.description_c,
        nodes: workflow.nodes_c ? JSON.parse(workflow.nodes_c) : [],
        connections: workflow.connections_c ? JSON.parse(workflow.connections_c) : [],
        enabled: workflow.enabled_c,
        createdAt: workflow.created_at_c,
        lastRun: workflow.last_run_c
      }));
    } catch (error) {
      console.error("Error fetching workflows:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.getRecordById("workflow_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "nodes_c"}},
          {"field": {"Name": "connections_c"}},
          {"field": {"Name": "enabled_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_run_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const workflow = response.data;
      if (!workflow) return null;

      return {
        ...workflow,
        name: workflow.name_c,
        description: workflow.description_c,
        nodes: workflow.nodes_c ? JSON.parse(workflow.nodes_c) : [],
        connections: workflow.connections_c ? JSON.parse(workflow.connections_c) : [],
        enabled: workflow.enabled_c,
        createdAt: workflow.created_at_c,
        lastRun: workflow.last_run_c
      };
    } catch (error) {
      console.error(`Error fetching workflow ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (workflowData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          name_c: workflowData.name,
          description_c: workflowData.description,
          nodes_c: JSON.stringify(workflowData.nodes || []),
          connections_c: JSON.stringify(workflowData.connections || []),
          enabled_c: false,
          created_at_c: new Date().toISOString(),
          last_run_c: null
        }]
      };

      const response = await apperClient.createRecord("workflow_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create workflow:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const createdWorkflow = successful[0]?.data;
        if (createdWorkflow) {
          toast.success("Workflow created successfully");
          return {
            ...createdWorkflow,
            name: createdWorkflow.name_c,
            description: createdWorkflow.description_c,
            nodes: createdWorkflow.nodes_c ? JSON.parse(createdWorkflow.nodes_c) : [],
            connections: createdWorkflow.connections_c ? JSON.parse(createdWorkflow.connections_c) : [],
            enabled: createdWorkflow.enabled_c,
            createdAt: createdWorkflow.created_at_c,
            lastRun: createdWorkflow.last_run_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating workflow:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, updateData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: updateData.name,
          description_c: updateData.description,
          nodes_c: JSON.stringify(updateData.nodes || []),
          connections_c: JSON.stringify(updateData.connections || [])
        }]
      };

      const response = await apperClient.updateRecord("workflow_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update workflow:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const updatedWorkflow = successful[0]?.data;
        if (updatedWorkflow) {
          toast.success("Workflow updated successfully");
          return {
            ...updatedWorkflow,
            name: updatedWorkflow.name_c,
            description: updatedWorkflow.description_c,
            nodes: updatedWorkflow.nodes_c ? JSON.parse(updatedWorkflow.nodes_c) : [],
            connections: updatedWorkflow.connections_c ? JSON.parse(updatedWorkflow.connections_c) : [],
            enabled: updatedWorkflow.enabled_c,
            createdAt: updatedWorkflow.created_at_c,
            lastRun: updatedWorkflow.last_run_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating workflow:", error?.response?.data?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return false;
      }

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("workflow_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete workflow:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success("Workflow deleted successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting workflow:", error?.response?.data?.message || error);
      return false;
    }
  },

  toggleEnabled: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      // First get current workflow state
      const currentWorkflow = await this.getById(id);
      if (!currentWorkflow) return null;

      const params = {
        records: [{
          Id: parseInt(id),
          enabled_c: !currentWorkflow.enabled
        }]
      };

      const response = await apperClient.updateRecord("workflow_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to toggle workflow:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const updatedWorkflow = successful[0]?.data;
        if (updatedWorkflow) {
          const status = updatedWorkflow.enabled_c ? "enabled" : "disabled";
          toast.success(`Workflow ${status} successfully`);
          return {
            ...updatedWorkflow,
            name: updatedWorkflow.name_c,
            description: updatedWorkflow.description_c,
            nodes: updatedWorkflow.nodes_c ? JSON.parse(updatedWorkflow.nodes_c) : [],
            connections: updatedWorkflow.connections_c ? JSON.parse(updatedWorkflow.connections_c) : [],
            enabled: updatedWorkflow.enabled_c,
            createdAt: updatedWorkflow.created_at_c,
            lastRun: updatedWorkflow.last_run_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error toggling workflow:", error?.response?.data?.message || error);
      return null;
    }
  },

  testWorkflow: async (id) => {
    try {
      const workflow = await this.getById(id);
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
        const apperClient = getApperClient();
        if (apperClient) {
          const params = {
            records: [{
              Id: parseInt(id),
              last_run_c: testResult.timestamp
            }]
          };
          await apperClient.updateRecord("workflow_c", params);
        }
      }

      return testResult;
    } catch (error) {
      console.error("Error testing workflow:", error?.response?.data?.message || error);
      return null;
    }
  }
};