
// Re-export from the new location to maintain backward compatibility
export { useKitchenOrderItems } from './kitchen/use-kitchen-order-items';
export type { KitchenOrder, KitchenOrderItem } from './kitchen/types';

// This file is kept for backward compatibility. 
// In the future, imports should be updated to use ./kitchen/use-kitchen-order-items directly.
