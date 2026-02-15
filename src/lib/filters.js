// Advanced filtering utilities
export const filterClients = (clients, filters) => {
  return clients.filter((client) => {
    if (filters.gender && client.gender !== filters.gender) return false;
    if (filters.minOrders && client.orderCount < filters.minOrders) return false;
    if (filters.maxOrders && client.orderCount > filters.maxOrders) return false;
    if (filters.dateFrom && new Date(client.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(client.createdAt) > new Date(filters.dateTo)) return false;
    return true;
  });
};

export const filterOrders = (orders, filters) => {
  return orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false;
    if (filters.minPrice && order.price < filters.minPrice) return false;
    if (filters.maxPrice && order.price > filters.maxPrice) return false;
    if (filters.dateFrom && new Date(order.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(order.createdAt) > new Date(filters.dateTo)) return false;
    return true;
  });
};

export const filterInventory = (items, filters) => {
  return items.filter((item) => {
    if (filters.categoryId && item.categoryId !== filters.categoryId) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.lowStockOnly && item.quantity > item.lowStockThreshold) return false;
    if (filters.minPrice && item.sellingPrice < filters.minPrice) return false;
    if (filters.maxPrice && item.sellingPrice > filters.maxPrice) return false;
    return true;
  });
};

export const sortBy = (items, field, order = 'asc') => {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (typeof aVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
};
