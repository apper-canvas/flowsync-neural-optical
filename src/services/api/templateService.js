import templateData from "@/services/mockData/templates.json";

let templates = [...templateData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

export const templateService = {
  getAll: async () => {
    await delay();
    return templates
      .sort((a, b) => b.popularity - a.popularity)
      .map(template => ({ ...template }));
  },

  getById: async (id) => {
    await delay();
    const template = templates.find(t => t.Id === parseInt(id));
    return template ? { ...template } : null;
  },

  getByCategory: async (category) => {
    await delay();
    return templates
      .filter(template => template.category === category)
      .sort((a, b) => b.popularity - a.popularity)
      .map(template => ({ ...template }));
  },

  getCategories: async () => {
    await delay();
    const categories = [...new Set(templates.map(template => template.category))];
    return categories.sort();
  },

  getPopular: async (limit = 6) => {
    await delay();
    return templates
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
      .map(template => ({ ...template }));
  },

  searchTemplates: async (query) => {
    await delay();
    const lowercaseQuery = query.toLowerCase();
    return templates
      .filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.category.toLowerCase().includes(lowercaseQuery) ||
        template.services.some(service => service.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => b.popularity - a.popularity)
      .map(template => ({ ...template }));
  },

  createFromTemplate: async (templateId) => {
    await delay();
    const template = templates.find(t => t.Id === parseInt(templateId));
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
  }
};