// Error handling utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const handleApiError = (error) => {
  const message = getErrorMessage(error);
  const status = error?.response?.status;

  return {
    message,
    status,
    isNetworkError: !error?.response,
    isValidationError: status === 400,
    isAuthError: status === 401,
    isNotFoundError: status === 404,
    isServerError: status >= 500,
  };
};

// Async wrapper for API calls with error handling
export const asyncHandler = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    throw handleApiError(error);
  }
};

// Toast notification helper
export const showNotification = (message, type = 'info') => {
  const event = new CustomEvent('notification', {
    detail: { message, type, id: Date.now() },
  });
  window.dispatchEvent(event);
};

export const showSuccess = (message) => showNotification(message, 'success');
export const showError = (message) => showNotification(message, 'error');
export const showWarning = (message) => showNotification(message, 'warning');
export const showInfo = (message) => showNotification(message, 'info');
