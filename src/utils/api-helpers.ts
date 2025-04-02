
/**
 * Utility functions for API responses and error handling
 */

// Standard response format for API calls
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Create a standard success response
export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message
});

// Create a standard error response
export const createErrorResponse = (error: Error | string): ApiResponse => ({
  success: false,
  error: typeof error === 'string' ? error : error.message
});

// Helper to extract the most meaningful error message
export const getErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) {
    // Handle specific error cases
    const message = error.message;
    
    if (message.includes('duplicate key')) {
      return "An item with this name already exists. Please use a different name.";
    } else if (message.includes('not found')) {
      return "The requested item couldn't be found. It may have been deleted.";
    } else if (message.includes('violates row level security')) {
      return "You don't have permission to perform this action. Please contact an administrator.";
    } else if (message.includes('network')) {
      return "Network error. Please check your internet connection and try again.";
    } else if (message.includes('timeout')) {
      return "The request timed out. Please try again later.";
    }
    
    return message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
