import serviceData from "@/services/mockData/services.json";

let services = [...serviceData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

export const serviceService = {
  getAll: async () => {
    await delay();
    return services.map(service => ({ ...service }));
  },

  getById: async (id) => {
    await delay();
    const service = services.find(s => s.Id === parseInt(id));
    return service ? { ...service } : null;
  },

  getByCategory: async (category) => {
    await delay();
    return services
      .filter(service => service.category === category)
      .map(service => ({ ...service }));
  },

  getCategories: async () => {
    await delay();
    const categories = [...new Set(services.map(service => service.category))];
    return categories.sort();
  },

  getTriggers: async (serviceId) => {
    await delay();
    const service = services.find(s => s.Id === parseInt(serviceId));
    return service ? [...service.triggers] : [];
  },

  getActions: async (serviceId) => {
    await delay();
    const service = services.find(s => s.Id === parseInt(serviceId));
    return service ? [...service.actions] : [];
  },

  searchServices: async (query) => {
    await delay();
    const lowercaseQuery = query.toLowerCase();
    return services
      .filter(service => 
        service.name.toLowerCase().includes(lowercaseQuery) ||
        service.category.toLowerCase().includes(lowercaseQuery)
      )
      .map(service => ({ ...service }));
  }
};