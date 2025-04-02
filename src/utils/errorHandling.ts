
import { toast } from "@/hooks/use-toast";

// Error categories for consistent handling
type ErrorCategory = 
  | 'auth' 
  | 'network' 
  | 'database' 
  | 'validation' 
  | 'permission' 
  | 'not-found'
  | 'unknown';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  fallbackMessage?: string;
  category?: ErrorCategory;
  context?: string;
}

/**
 * Standardized error handler for consistent error management
 */
export const handleError = (
  error: unknown, 
  options: ErrorHandlerOptions = {}
): { 
  message: string; 
  category: ErrorCategory;
  originalError: unknown;
} => {
  const {
    showToast = true,
    logToConsole = true,
    fallbackMessage = "An unexpected error occurred",
    category: forcedCategory,
    context = ''
  } = options;

  // Extract error message and determine category
  let message: string;
  let category: ErrorCategory = 'unknown';
  
  if (error instanceof Error) {
    message = error.message;
    
    // Determine error category
    if (forcedCategory) {
      category = forcedCategory;
    } else {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('auth') || errorMsg.includes('login') || errorMsg.includes('password')) {
        category = 'auth';
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
        category = 'network';
      } else if (errorMsg.includes('database') || errorMsg.includes('db') || errorMsg.includes('sql') || errorMsg.includes('query')) {
        category = 'database';
      } else if (errorMsg.includes('permission') || errorMsg.includes('access') || errorMsg.includes('denied')) {
        category = 'permission';
      } else if (errorMsg.includes('not found') || errorMsg.includes('404')) {
        category = 'not-found';
      } else if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        category = 'validation';
      }
    }
    
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = fallbackMessage;
  }

  // Format the message with context if provided
  const formattedMessage = context ? `[${context}] ${message}` : message;

  // Log to console if enabled
  if (logToConsole) {
    console.error(`Error ${category}: ${formattedMessage}`, error);
  }

  // Show toast if enabled
  if (showToast) {
    toast({
      title: getCategoryTitle(category),
      description: message,
      variant: "destructive",
    });
  }

  return {
    message: formattedMessage,
    category,
    originalError: error
  };
};

/**
 * Get a user-friendly title based on error category
 */
function getCategoryTitle(category: ErrorCategory): string {
  switch (category) {
    case 'auth':
      return 'Authentication Error';
    case 'network':
      return 'Network Error';
    case 'database':
      return 'Database Error';
    case 'validation':
      return 'Validation Error';
    case 'permission':
      return 'Permission Error';
    case 'not-found':
      return 'Not Found Error';
    default:
      return 'Error';
  }
}

/**
 * Format database errors for better user feedback
 */
export const formatDatabaseError = (error: unknown): string => {
  if (!error) return "Unknown database error";
  
  const errorStr = String(error).toLowerCase();
  
  if (errorStr.includes('duplicate key')) {
    return 'This record already exists.';
  } else if (errorStr.includes('violates foreign key constraint')) {
    return 'This operation would break data relationships.';
  } else if (errorStr.includes('violates check constraint')) {
    return 'The data does not meet required conditions.';
  } else if (errorStr.includes('violates not-null constraint')) {
    return 'Please provide values for all required fields.';
  } else if (errorStr.includes('permission denied')) {
    return 'You do not have permission to perform this operation.';
  } else {
    return String(error);
  }
};
