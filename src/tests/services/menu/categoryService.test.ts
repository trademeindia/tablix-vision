
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSupabaseClient } from '../../mocks/supabaseMock';
import { 
  fetchMenuCategories, 
  createMenuCategory, 
  updateMenuCategory, 
  deleteMenuCategory 
} from '@/services/menu/categoryService';
import { MenuCategory } from '@/types/menu';

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMenuCategories', () => {
    it('should fetch categories without restaurant_id filter', async () => {
      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({
        data: [{ id: '1', name: 'Category 1' }, { id: '2', name: 'Category 2' }],
        error: null
      }));

      // Call the function
      const result = await fetchMenuCategories();

      // Verify the result
      expect(result).toEqual([{ id: '1', name: 'Category 1' }, { id: '2', name: 'Category 2' }]);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_categories');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('display_order', { ascending: true });
    });

    it('should fetch categories with restaurant_id filter', async () => {
      // Setup the mock response
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({
        data: [{ id: '1', name: 'Category 1', restaurant_id: 'rest-1' }],
        error: null
      }));

      // Call the function
      const result = await fetchMenuCategories('rest-1');

      // Verify the result
      expect(result).toEqual([{ id: '1', name: 'Category 1', restaurant_id: 'rest-1' }]);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_categories');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('restaurant_id', 'rest-1');
    });

    it('should handle errors when fetching categories', async () => {
      // Setup the mock response to return an error
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({
        data: null,
        error: new Error('DB error')
      }));

      // Call the function and expect it to throw
      await expect(fetchMenuCategories()).rejects.toThrow('DB error');
    });
  });

  describe('createMenuCategory', () => {
    it('should create a new category', async () => {
      // Setup the mock response
      const newCategory: Partial<MenuCategory> = { 
        name: 'New Category', 
        description: 'Description', 
        restaurant_id: 'rest-1' 
      };
      
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.insert.mockReturnThis();
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({
        data: [{ ...newCategory, id: '123' }],
        error: null
      }));

      // Call the function
      const result = await createMenuCategory(newCategory);

      // Verify the result
      expect(result).toEqual({ ...newCategory, id: '123' });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_categories');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Category',
        description: 'Description',
        restaurant_id: 'rest-1'
      }));
    });

    it('should throw error when name is missing', async () => {
      await expect(createMenuCategory({})).rejects.toThrow('Category name is required');
    });
  });

  describe('updateMenuCategory', () => {
    it('should update an existing category', async () => {
      const updates: Partial<MenuCategory> = { 
        name: 'Updated Category', 
        description: 'Updated Description' 
      };
      
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.update.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({
        data: [{ id: '123', ...updates }],
        error: null
      }));

      // Call the function
      const result = await updateMenuCategory('123', updates);

      // Verify the result
      expect(result).toEqual({ id: '123', ...updates });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_categories');
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(updates);
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
    });
  });

  describe('deleteMenuCategory', () => {
    it('should delete a category', async () => {
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({
        error: null
      }));

      // Call the function
      const result = await deleteMenuCategory('123');

      // Verify the result
      expect(result).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('menu_categories');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
    });
  });
});
