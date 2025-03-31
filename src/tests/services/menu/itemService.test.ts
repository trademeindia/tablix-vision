
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSupabaseClient } from '../../mocks/supabaseMock';
import { 
  fetchMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '@/services/menu/itemService';
import { MenuItem } from '@/types/menu';
import { transactionService } from '@/services/menu/transactionService';

// Mock the transaction service
vi.mock('@/services/menu/transactionService', () => ({
  transactionService: {
    beginTransaction: vi.fn().mockResolvedValue({}),
    commitTransaction: vi.fn().mockResolvedValue({}),
    rollbackTransaction: vi.fn().mockResolvedValue({})
  }
}));

describe('itemService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMenuItems', () => {
    it('should fetch items without filters', async () => {
      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({
        data: [
          { id: '1', name: 'Item 1', price: 10.99, allergens: null },
          { id: '2', name: 'Item 2', price: 12.99, allergens: { isVegetarian: true, items: ['nuts'] } }
        ],
        error: null
      }));

      // Call the function
      const result = await fetchMenuItems();

      // Verify the result
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', name: 'Item 1', price: 10.99, allergens: undefined });
      expect(result[1].allergens).toEqual({ isVegetarian: true, items: ['nuts'] });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    });

    it('should fetch items with category_id filter', async () => {
      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({
        data: [{ id: '1', name: 'Item 1', price: 10.99, category_id: 'cat-1' }],
        error: null
      }));

      // Call the function
      const result = await fetchMenuItems('cat-1');

      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'Item 1', price: 10.99, category_id: 'cat-1', allergens: undefined });
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('category_id', 'cat-1');
    });

    it('should fetch items with restaurant_id filter', async () => {
      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({
        data: [{ id: '1', name: 'Item 1', price: 10.99, restaurant_id: 'rest-1' }],
        error: null
      }));

      // Call the function
      const result = await fetchMenuItems(undefined, 'rest-1');

      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: '1', name: 'Item 1', price: 10.99, restaurant_id: 'rest-1', allergens: undefined });
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('restaurant_id', 'rest-1');
    });
  });

  describe('createMenuItem', () => {
    it('should create a new menu item with transaction support', async () => {
      // Setup the mock data
      const newItem: Partial<MenuItem> = {
        name: 'New Item',
        price: 15.99,
        category_id: 'cat-1',
        restaurant_id: 'rest-1',
        allergens: { isVegetarian: true, items: ['nuts'] }
      };

      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.insert.mockReturnThis();
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({
        data: [{ 
          id: '123', 
          ...newItem, 
          allergens: { isVegetarian: true, items: ['nuts'] } 
        }],
        error: null
      }));

      // Call the function
      const result = await createMenuItem(newItem);

      // Verify the transaction flow
      expect(transactionService.beginTransaction).toHaveBeenCalled();
      expect(transactionService.commitTransaction).toHaveBeenCalled();
      expect(transactionService.rollbackTransaction).not.toHaveBeenCalled();

      // Verify the result
      expect(result).toEqual({
        id: '123',
        name: 'New Item',
        price: 15.99,
        category_id: 'cat-1',
        restaurant_id: 'rest-1',
        allergens: { isVegetarian: true, items: ['nuts'] }
      });
    });

    it('should throw error when name is missing', async () => {
      await expect(createMenuItem({ price: 10.99 })).rejects.toThrow('Item name is required');
      expect(transactionService.beginTransaction).not.toHaveBeenCalled();
    });

    it('should throw error when price is missing', async () => {
      await expect(createMenuItem({ name: 'Item' })).rejects.toThrow('Item price is required');
      expect(transactionService.beginTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      // Setup the mock response to return an error
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.insert.mockReturnThis();
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({
        data: null,
        error: new Error('Insert failed')
      }));

      // Call the function and expect it to throw
      await expect(createMenuItem({ 
        name: 'Test Item', 
        price: 10.99 
      })).rejects.toThrow('Insert failed');

      // Verify the transaction was rolled back
      expect(transactionService.beginTransaction).toHaveBeenCalled();
      expect(transactionService.commitTransaction).not.toHaveBeenCalled();
      expect(transactionService.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('updateMenuItem', () => {
    it('should update an existing menu item', async () => {
      // Setup the mock data
      const updates: Partial<MenuItem> = {
        name: 'Updated Item',
        price: 18.99,
        allergens: { isVegetarian: false, isGlutenFree: true }
      };

      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.update.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({
        data: [{ id: '123', ...updates, allergens: { isVegetarian: false, isGlutenFree: true } }],
        error: null
      }));

      // Call the function
      const result = await updateMenuItem('123', updates);

      // Verify the result
      expect(result).toEqual({
        id: '123',
        name: 'Updated Item',
        price: 18.99,
        allergens: { isVegetarian: false, isGlutenFree: true }
      });

      // Check if the allergens were properly processed
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated Item',
        price: 18.99,
        allergens: { isVegetarian: false, isGlutenFree: true }
      }));
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete a menu item', async () => {
      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({
        error: null
      }));

      // Call the function
      const result = await deleteMenuItem('123');

      // Verify the result
      expect(result).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_items');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
    });
  });
});
