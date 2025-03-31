
// This file is kept for backward compatibility
// Import and re-export all services from the new modular structure
import * as MenuServices from './menu';

export const {
  // Category services
  fetchMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  
  // Item services
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  
  // Transaction service
  transactionService
} = MenuServices;
