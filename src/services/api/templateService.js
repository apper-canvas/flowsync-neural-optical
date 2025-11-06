import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const templateService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("template_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "popularity_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}},
          {"field": {"Name": "workflow_c"}}
        ],
        orderBy: [{"fieldName": "popularity_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(template => ({
        ...template,
        name: template.name_c,
        description: template.description_c,
        category: template.category_c,
        popularity: template.popularity_c,
        estimatedTime: template.estimated_time_c,
        services: template.triggers_c ? JSON.parse(template.triggers_c) : [],
        triggers: template.triggers_c ? JSON.parse(template.triggers_c).length : 0,
        actions: template.actions_c ? JSON.parse(template.actions_c).length : 0,
        workflow: template.workflow_c ? JSON.parse(template.workflow_c) : null
      }));
    } catch (error) {
      console.error("Error fetching templates:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById("template_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "popularity_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}},
          {"field": {"Name": "workflow_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const template = response.data;
      if (!template) return null;

      return {
        ...template,
        name: template.name_c,
        description: template.description_c,
        category: template.category_c,
        popularity: template.popularity_c,
        estimatedTime: template.estimated_time_c,
        services: template.triggers_c ? JSON.parse(template.triggers_c) : [],
        triggers: template.triggers_c ? JSON.parse(template.triggers_c).length : 0,
        actions: template.actions_c ? JSON.parse(template.actions_c).length : 0,
        workflow: template.workflow_c ? JSON.parse(template.workflow_c) : null
      };
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByCategory: async (category) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("template_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "popularity_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}},
          {"field": {"Name": "workflow_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }],
        orderBy: [{"fieldName": "popularity_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(template => ({
        ...template,
        name: template.name_c,
        description: template.description_c,
        category: template.category_c,
        popularity: template.popularity_c,
        estimatedTime: template.estimated_time_c,
        services: template.triggers_c ? JSON.parse(template.triggers_c) : [],
        triggers: template.triggers_c ? JSON.parse(template.triggers_c).length : 0,
        actions: template.actions_c ? JSON.parse(template.actions_c).length : 0,
        workflow: template.workflow_c ? JSON.parse(template.workflow_c) : null
      }));
    } catch (error) {
      console.error("Error fetching templates by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("template_c", {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const categories = [...new Set(response.data.map(template => template.category_c))];
      return categories.sort();
    } catch (error) {
      console.error("Error fetching template categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  getPopular: async (limit = 6) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("template_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "popularity_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}},
          {"field": {"Name": "workflow_c"}}
        ],
        orderBy: [{"fieldName": "popularity_c", "sorttype": "DESC"}],
        pagingInfo: { limit: limit, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(template => ({
        ...template,
        name: template.name_c,
        description: template.description_c,
        category: template.category_c,
        popularity: template.popularity_c,
        estimatedTime: template.estimated_time_c,
        services: template.triggers_c ? JSON.parse(template.triggers_c) : [],
        triggers: template.triggers_c ? JSON.parse(template.triggers_c).length : 0,
        actions: template.actions_c ? JSON.parse(template.actions_c).length : 0,
        workflow: template.workflow_c ? JSON.parse(template.workflow_c) : null
      }));
    } catch (error) {
      console.error("Error fetching popular templates:", error?.response?.data?.message || error);
      return [];
    }
  },

  searchTemplates: async (query) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("template_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "popularity_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}},
          {"field": {"Name": "workflow_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "name_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "description_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "category_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            }
          ]
        }],
        orderBy: [{"fieldName": "popularity_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(template => ({
        ...template,
        name: template.name_c,
        description: template.description_c,
        category: template.category_c,
        popularity: template.popularity_c,
        estimatedTime: template.estimated_time_c,
        services: template.triggers_c ? JSON.parse(template.triggers_c) : [],
        triggers: template.triggers_c ? JSON.parse(template.triggers_c).length : 0,
        actions: template.actions_c ? JSON.parse(template.actions_c).length : 0,
        workflow: template.workflow_c ? JSON.parse(template.workflow_c) : null
      }));
    } catch (error) {
      console.error("Error searching templates:", error?.response?.data?.message || error);
      return [];
    }
  },

  createFromTemplate: async (templateId) => {
    try {
      const template = await this.getById(templateId);
      if (!template) return null;

      // Generate unique node IDs for the new workflow
      const nodeIdMapping = {};
      const newNodes = template.workflow.nodes.map(node => {
        const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        nodeIdMapping[node.id] = newNodeId;
        return {
          ...node,
          id: newNodeId
        };
      });

      const newConnections = template.workflow.connections.map(conn => ({
        ...conn,
        id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceNodeId: nodeIdMapping[conn.sourceNodeId],
        targetNodeId: nodeIdMapping[conn.targetNodeId]
      }));

      return {
        name: template.workflow.name,
        description: template.workflow.description,
        nodes: newNodes,
        connections: newConnections,
        enabled: false
      };
    } catch (error) {
      console.error("Error creating workflow from template:", error?.response?.data?.message || error);
      return null;
    }
}
};