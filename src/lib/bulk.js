// Bulk operations utilities
import { clientAPI, orderAPI, inventoryAPI } from './api';

export const bulkDeleteClients = async (clientIds) => {
  const results = { success: 0, failed: 0, errors: [] };

  for (const clientId of clientIds) {
    try {
      await clientAPI.delete(clientId);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ clientId, error: error.message });
    }
  }

  return results;
};

export const bulkDeleteOrders = async (orderIds) => {
  const results = { success: 0, failed: 0, errors: [] };

  for (const orderId of orderIds) {
    try {
      await orderAPI.delete(orderId);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ orderId, error: error.message });
    }
  }

  return results;
};

export const bulkUpdateOrderStatus = async (orderIds, status) => {
  const results = { success: 0, failed: 0, errors: [] };

  for (const orderId of orderIds) {
    try {
      await orderAPI.updateStatus(orderId, status);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ orderId, error: error.message });
    }
  }

  return results;
};

export const bulkRecordPayments = async (orderIds, amount, method) => {
  const results = { success: 0, failed: 0, errors: [] };

  for (const orderId of orderIds) {
    try {
      await orderAPI.recordPayment(orderId, { amount, method });
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ orderId, error: error.message });
    }
  }

  return results;
};

export const bulkAdjustInventory = async (itemIds, quantity, reason) => {
  const results = { success: 0, failed: 0, errors: [] };

  for (const itemId of itemIds) {
    try {
      await inventoryAPI.adjustInventory(itemId, { quantity, reason });
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ itemId, error: error.message });
    }
  }

  return results;
};

export const bulkDeleteInventory = async (itemIds) => {
  const results = { success: 0, failed: 0, errors: [] };

  for (const itemId of itemIds) {
    try {
      await inventoryAPI.deleteItem(itemId);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({ itemId, error: error.message });
    }
  }

  return results;
};
