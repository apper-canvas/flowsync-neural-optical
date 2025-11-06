import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const serviceService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("service_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(service => ({
        ...service,
        name: service.name_c,
        category: service.category_c,
        icon: service.icon_c,
        triggers: service.triggers_c ? JSON.parse(service.triggers_c) : [],
        actions: service.actions_c ? JSON.parse(service.actions_c) : []
      }));
    } catch (error) {
      console.error("Error fetching services:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById("service_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const service = response.data;
      if (!service) return null;

      return {
        ...service,
        name: service.name_c,
        category: service.category_c,
        icon: service.icon_c,
        triggers: service.triggers_c ? JSON.parse(service.triggers_c) : [],
        actions: service.actions_c ? JSON.parse(service.actions_c) : []
      };
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.fetchRecords("service_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(service => ({
        ...service,
        name: service.name_c,
        category: service.category_c,
        icon: service.icon_c,
        triggers: service.triggers_c ? JSON.parse(service.triggers_c) : [],
        actions: service.actions_c ? JSON.parse(service.actions_c) : []
      }));
    } catch (error) {
      console.error("Error fetching services by category:", error?.response?.data?.message || error);
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

      const response = await apperClient.fetchRecords("service_c", {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const categories = [...new Set(response.data.map(service => service.category_c))];
      return categories.sort();
    } catch (error) {
      console.error("Error fetching service categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  getTriggers: async (serviceId) => {
    try {
      const service = await this.getById(serviceId);
      return service ? [...service.triggers] : [];
    } catch (error) {
      console.error("Error fetching service triggers:", error?.response?.data?.message || error);
      return [];
    }
  },

  getActions: async (serviceId) => {
    try {
      const service = await this.getById(serviceId);
      return service ? [...service.actions] : [];
    } catch (error) {
      console.error("Error fetching service actions:", error?.response?.data?.message || error);
      return [];
    }
  },

  searchServices: async (query) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords("service_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "triggers_c"}},
          {"field": {"Name": "actions_c"}}
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
                  "fieldName": "category_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(service => ({
        ...service,
        name: service.name_c,
        category: service.category_c,
        icon: service.icon_c,
        triggers: service.triggers_c ? JSON.parse(service.triggers_c) : [],
        actions: service.actions_c ? JSON.parse(service.actions_c) : []
      }));
    } catch (error) {
      console.error("Error searching services:", error?.response?.data?.message || error);
      return [];
    }
  }
};