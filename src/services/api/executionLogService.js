import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const executionLogService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("execution_log_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "workflow_id_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "steps_c"}},
          {"field": {"Name": "trigger_data_c"}},
          {"field": {"Name": "error_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(log => ({
        ...log,
        workflowId: log.workflow_id_c,
        timestamp: log.timestamp_c,
        status: log.status_c,
        duration: log.duration_c,
        steps: log.steps_c ? JSON.parse(log.steps_c) : [],
        triggerData: log.trigger_data_c ? JSON.parse(log.trigger_data_c) : null,
        error: log.error_c
      }));
    } catch (error) {
      console.error("Error fetching execution logs:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById("execution_log_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "workflow_id_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "steps_c"}},
          {"field": {"Name": "trigger_data_c"}},
          {"field": {"Name": "error_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const log = response.data;
      if (!log) return null;

      return {
        ...log,
        workflowId: log.workflow_id_c,
        timestamp: log.timestamp_c,
        status: log.status_c,
        duration: log.duration_c,
        steps: log.steps_c ? JSON.parse(log.steps_c) : [],
        triggerData: log.trigger_data_c ? JSON.parse(log.trigger_data_c) : null,
        error: log.error_c
      };
    } catch (error) {
      console.error(`Error fetching execution log ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByWorkflowId: async (workflowId) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("execution_log_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "workflow_id_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "steps_c"}},
          {"field": {"Name": "trigger_data_c"}},
          {"field": {"Name": "error_c"}}
        ],
        where: [{
          "FieldName": "workflow_id_c",
          "Operator": "EqualTo",
          "Values": [workflowId.toString()]
        }],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(log => ({
        ...log,
        workflowId: log.workflow_id_c,
        timestamp: log.timestamp_c,
        status: log.status_c,
        duration: log.duration_c,
        steps: log.steps_c ? JSON.parse(log.steps_c) : [],
        triggerData: log.trigger_data_c ? JSON.parse(log.trigger_data_c) : null,
        error: log.error_c
      }));
    } catch (error) {
      console.error("Error fetching execution logs by workflow:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (logData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          workflow_id_c: logData.workflowId,
          timestamp_c: new Date().toISOString(),
          status_c: logData.status,
          duration_c: logData.duration,
          steps_c: JSON.stringify(logData.steps || []),
          trigger_data_c: logData.triggerData ? JSON.stringify(logData.triggerData) : null,
          error_c: logData.error || null
        }]
      };

      const response = await apperClient.createRecord("execution_log_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create execution log:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const createdLog = successful[0]?.data;
        if (createdLog) {
          return {
            ...createdLog,
            workflowId: createdLog.workflow_id_c,
            timestamp: createdLog.timestamp_c,
            status: createdLog.status_c,
            duration: createdLog.duration_c,
            steps: createdLog.steps_c ? JSON.parse(createdLog.steps_c) : [],
            triggerData: createdLog.trigger_data_c ? JSON.parse(createdLog.trigger_data_c) : null,
            error: createdLog.error_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating execution log:", error?.response?.data?.message || error);
      return null;
    }
  },

  getRecentActivity: async (limit = 10) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("execution_log_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "workflow_id_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "duration_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: { limit: limit, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(log => ({
        ...log,
        workflowId: log.workflow_id_c,
        timestamp: log.timestamp_c,
        status: log.status_c,
        duration: log.duration_c
      }));
    } catch (error) {
      console.error("Error fetching recent activity:", error?.response?.data?.message || error);
      return [];
    }
  },

  getSuccessRate: async (workflowId) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return 100;
      }

      const response = await apperClient.fetchRecords("execution_log_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "workflow_id_c",
          "Operator": "EqualTo",
          "Values": [workflowId.toString()]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return 100;
      }

      if (response.data.length === 0) return 100;
      
      const successCount = response.data.filter(log => log.status_c === "success").length;
      return Math.round((successCount / response.data.length) * 100);
    } catch (error) {
      console.error("Error calculating success rate:", error?.response?.data?.message || error);
      return 100;
    }
  }
};