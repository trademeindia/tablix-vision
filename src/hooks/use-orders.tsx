
// Re-export from the new location to maintain backward compatibility
export { useOrders } from './orders';
export type { OrderFilters, UseOrdersResult } from './orders/types';

// This file is kept for backward compatibility. 
// In the future, imports should be updated to use ./orders directly.
